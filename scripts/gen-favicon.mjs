#!/usr/bin/env node
/**
 * Favicon 生成器（零依赖，仅用 Node 内置 zlib）
 * 生成：品牌蓝圆角方块 + 白色字母 f
 *   - public/favicon.png           (32x32   浏览器标签页)
 *   - public/apple-touch-icon.png  (180x180 iOS 主屏，不透明)
 *
 * 自定义：改下方常量后重新执行 `npm run gen:icon` 即可
 *   - BRAND_COLOR / GLYPH_COLOR：底色与字母颜色
 *   - GLYPH：5x7 点阵字形（'1' 为涂色格）
 *   或直接把同名图片放进 public/ 覆盖，无需改配置
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

// ---------- 可自定义常量 ----------
const BRAND_COLOR = { r: 0x25, g: 0x63, b: 0xeb } // #2563eb 品牌蓝
const GLYPH_COLOR = { r: 0xff, g: 0xff, b: 0xff } // 白色字母
const CORNER_RADIUS_RATIO = 0.22 // 圆角半径 / 边长
const GLYPH_HEIGHT_RATIO = 0.62 // 字母高度 / 边长

// 字母 f（5 列 x 7 行，'1' 为涂色格）
const GLYPH = ['01110', '10000', '10000', '11110', '10000', '10000', '01000']
const GLYPH_W = GLYPH[0].length
const GLYPH_H = GLYPH.length

const OUTPUTS = [
  { file: 'public/favicon.png', size: 32, opaque: false },
  { file: 'public/apple-touch-icon.png', size: 180, opaque: true },
]

// ---------- PNG 编码 ----------
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(size, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  // 每行前置 filter 字节 0
  const stride = 1 + size * 4
  const raw = Buffer.alloc(size * stride)
  for (let y = 0; y < size; y++) rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4)
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- 绘制 ----------
// 2x2 超采样：每像素取 4 个采样点求覆盖率，边缘更平滑
const SAMPLES = [
  [0.25, 0.25],
  [0.75, 0.25],
  [0.25, 0.75],
  [0.75, 0.75],
]

function inRoundedRect(x, y, size, r) {
  const cx = Math.min(Math.max(x, r), size - r)
  const cy = Math.min(Math.max(y, r), size - r)
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= r * r
}

function render(size, opaque) {
  const radius = size * CORNER_RADIUS_RATIO
  const scale = (size * GLYPH_HEIGHT_RATIO) / GLYPH_H
  const ox = (size - GLYPH_W * scale) / 2
  const oy = (size - GLYPH_H * scale) / 2
  const rgba = Buffer.alloc(size * size * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bg = 0 // 方块内采样数
      let fg = 0 // 字母格内采样数
      for (const [dx, dy] of SAMPLES) {
        const sx = x + dx
        const sy = y + dy
        if (!opaque && !inRoundedRect(sx, sy, size, radius)) continue
        bg++
        const gx = (sx - ox) / scale
        const gy = (sy - oy) / scale
        const cx = Math.floor(gx)
        const cy = Math.floor(gy)
        if (cx >= 0 && cx < GLYPH_W && cy >= 0 && cy < GLYPH_H && GLYPH[cy][cx] === '1') fg++
      }
      if (bg === 0) continue // 圆角外：全透明（opaque 模式永不触发）
      const f = fg / bg // 覆盖区域中字母占比
      const i = (y * size + x) * 4
      rgba[i] = Math.round(BRAND_COLOR.r * (1 - f) + GLYPH_COLOR.r * f)
      rgba[i + 1] = Math.round(BRAND_COLOR.g * (1 - f) + GLYPH_COLOR.g * f)
      rgba[i + 2] = Math.round(BRAND_COLOR.b * (1 - f) + GLYPH_COLOR.b * f)
      rgba[i + 3] = opaque ? 255 : Math.round((bg / SAMPLES.length) * 255)
    }
  }
  return rgba
}

// ---------- 主流程 ----------
for (const { file, size, opaque } of OUTPUTS) {
  const out = path.join(ROOT, file)
  mkdirSync(path.dirname(out), { recursive: true })
  writeFileSync(out, encodePNG(size, render(size, opaque)))
  console.log(`✓ ${file} (${size}x${size})`)
}
console.log('完成。浏览器对 favicon 缓存较激进，更换后建议硬刷新（Ctrl+Shift+R）查看效果。')
