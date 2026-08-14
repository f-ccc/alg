/**
 * 侧边栏构建期生成：dev 模式新增/删除文章或目录时由 sidebarDevPlugin 合成 config 变更事件，
 * 触发 VitePress 自动重启重建侧边栏（普通文章内容编辑不触发，编辑 index.md 会触发）。
 * 优先解析各目录 index.md 的 `## 分类` 结构生成逻辑分组（模板/题单/算法），
 * 无分类结构（如 contest）则退回 posts/ 物理目录树。
 */
import fs from 'fs'
import path from 'path'
import type { Plugin, ViteDevServer } from 'vite'
import type { DefaultTheme } from 'vitepress'
import { pathToUrl, extractTitle } from './search-index'
import { CATEGORIES } from './home-posts'

interface IndexGroup {
  text: string
  items: DefaultTheme.SidebarItem[]
}

/**
 * 解析目录 index.md 的 `## 分类` 结构,生成侧边栏分组（分类模式）。
 * - 兼容 `- [标题](文件.md)` 与 `1. [标题](文件.md)` 两种链接格式;
 * - 第一个 `##` 之前的链接归入隐式「基础」分组,与已存在同名分组合并;
 * - 返回 null 表示无 index.md 或没有任何 `## ` 分类（走物理目录树逻辑）。
 */
function parseIndex(
  dir: string,
  root: string,
): { groups: IndexGroup[]; covered: Set<string> } | null {
  let src = ''
  try {
    src = fs.readFileSync(path.join(dir, 'index.md'), 'utf-8')
  } catch {
    return null
  }

  const groups: IndexGroup[] = []
  const pending: IndexGroup = { text: '基础', items: [] } // 首个 `##` 之前的链接
  const covered = new Set<string>()
  let current: IndexGroup | null = null

  // `## 分类名` 开启新分组（`###` 第三个字符是 # 而非空白，不会误匹配）
  const headRe = /^##\s+(.+)$/
  // 链接条目：- [标题](文件.md) 或 1. [标题](文件.md)；
  // 链接内可含括号（如 预处理(阶乘逆元组合数素数).md），非贪婪匹配到最后一个 ) 为止
  const linkRe = /^\s*(?:[-*]|\d+[.)])\s*\[([^\]]+)\]\((.+?)\)\s*$/

  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue

    const head = line.match(headRe)
    if (head) {
      current = { text: head[1].trim(), items: [] }
      groups.push(current)
      continue
    }

    const link = line.match(linkRe)
    if (!link) continue
    const [, text, href] = link
    if (!href.endsWith('.md')) continue // 仅接受 .md 文件链接（链接到目录等不纳入侧边栏）
    const clean = href.split(/[#?]/)[0] // 去掉锚点/查询串，仅取文件名用于归类
    const target = href.startsWith('/')
      ? href.split(/[#?]/)[0]
      : pathToUrl(path.resolve(dir, clean), root)
    covered.add(path.basename(clean))
    ;(current ?? pending).items.push({ text: text.trim(), link: target })
  }

  // 没有任何 `##` 分类 → 不是分类模式
  if (!groups.length) return null

  if (pending.items.length) {
    const existing = groups.find((g) => g.text === pending.text)
    if (existing) existing.items.unshift(...pending.items)
    else groups.unshift(pending)
  }

  return { groups: groups.filter((g) => g.items.length), covered }
}

/**
 * 分类模式：按 index.md 的分类分组输出（默认展开、可折叠），顺序尊重 index.md 书写顺序；
 * index.md 未归类的 md 文件兜底追加在末尾，子目录分组追加在最后（一律折叠），保证新文件不丢失。
 */
function buildIndexedTree(
  dir: string,
  root: string,
  indexed: { groups: IndexGroup[]; covered: Set<string> },
): DefaultTheme.SidebarItem[] {
  const subGroups: DefaultTheme.SidebarItem[] = []
  const leftover: DefaultTheme.SidebarItem[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue // 隐藏文件/目录（.DS_Store 等）
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      const children = buildTree(full, root)
      if (children.length) {
        subGroups.push({ text: entry.name, collapsed: true, items: children })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      if (indexed.covered.has(entry.name)) continue // 已被 index.md 归类
      let src = ''
      try {
        src = fs.readFileSync(full, 'utf-8')
      } catch {
        continue
      }
      // 无 frontmatter 且无 H1 时，用去 .md 的原始文件名兜底（不显示 Untitled）
      const title = extractTitle(src) || entry.name.replace(/\.md$/, '')
      leftover.push({ text: title, link: pathToUrl(full, root) })
    }
  }

  leftover.sort((a, b) => a.text.localeCompare(b.text, 'zh', { numeric: true }))
  return [
    ...indexed.groups.map((g) => ({ text: g.text, collapsed: false, items: g.items })),
    ...subGroups,
    ...leftover,
  ]
}

/**
 * 递归生成侧边栏条目：目录存在 index.md 且含 `## 分类` 时走分类模式（见 parseIndex），
 * 否则退回物理目录树——目录（分组）在前、md 文件（链接）在后，各自按中文自然序排序，
 * 二级及更深分组一律折叠（collapsed: true）。
 */
function buildTree(dir: string, root: string): DefaultTheme.SidebarItem[] {
  const indexed = parseIndex(dir, root)
  if (indexed) return buildIndexedTree(dir, root, indexed)
  return buildRawTree(dir, root)
}

/**
 * 物理目录树模式（分类模式的退回路径）：目录（分组）在前、md 文件（链接）在后，
 * 各自按中文自然序排序；二级及更深分组一律折叠（collapsed: true）。
 */
function buildRawTree(dir: string, root: string): DefaultTheme.SidebarItem[] {
  const groups: DefaultTheme.SidebarItem[] = []
  const links: DefaultTheme.SidebarItem[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue // 隐藏文件/目录（.DS_Store 等）
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      const children = buildTree(full, root)
      if (children.length) {
        groups.push({ text: entry.name, collapsed: true, items: children })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      let src = ''
      try {
        src = fs.readFileSync(full, 'utf-8')
      } catch {
        continue
      }
      // 无 frontmatter 且无 H1 时，用去 .md 的原始文件名兜底（不显示 Untitled）
      const title = extractTitle(src) || entry.name.replace(/\.md$/, '')
      links.push({ text: title, link: pathToUrl(full, root) })
    }
  }

  groups.sort((a, b) => a.text.localeCompare(b.text, 'zh', { numeric: true }))
  links.sort((a, b) => a.text.localeCompare(b.text, 'zh', { numeric: true }))
  return [...groups, ...links]
}

/**
 * 按 posts/ 目录树生成 VitePress 侧边栏配置。
 * 一级目录 = 分组（slug 映射中文名，未知 slug 用目录原名），一级展开；
 * key 必须带末尾斜杠才能匹配前缀路由。
 */
export function buildSidebar(root: string): Record<string, DefaultTheme.SidebarItem[]> {
  const postsDir = path.join(root, 'posts')
  if (!fs.existsSync(postsDir)) {
    throw new Error(`[sidebar] posts 目录不存在: ${postsDir}`)
  }

  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}
  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || !entry.isDirectory()) continue
    const slug = entry.name
    const items = buildTree(path.join(postsDir, slug), root)
    if (!items.length) continue // 空目录/无内容分组不输出

    const cat = CATEGORIES.find((c) => c.slug === slug)
    sidebar[`/posts/${slug}/`] = [
      { text: cat ? cat.name : slug, collapsed: false, items },
    ]
  }
  return sidebar
}

/* ------------------------------------------------------------------ */
/*  Dev 侧边栏自动更新                                                  */
/* ------------------------------------------------------------------ */

/**
 * dev 模式自动更新侧边栏：posts/ 下文件新增/删除，或编辑 index.md（分类/归类变化）时，
 * 合成 config.ts 的 change 事件，VitePress 检测到 config（或其被导入模块）变更后自动重启服务器，
 * config 重新求值，侧边栏随之重建。普通文章内容编辑（update）不触发，避免每次保存都重启。
 */
export function sidebarDevPlugin(): Plugin {
  let root = ''
  let postsDir = ''
  let server: ViteDevServer | undefined

  /** posts/ 下的文件是否在监听范围内（兼容各平台路径分隔符） */
  function isUnderPosts(id: string): boolean {
    if (!postsDir || !id) return false
    const rel = path.relative(postsDir, id)
    return !rel.startsWith('..') && !path.isAbsolute(rel)
  }

  return {
    name: 'vitepress-sidebar-dev',

    configResolved(config) {
      root = config.root
      postsDir = path.join(root, 'posts')
    },

    configureServer(s) {
      server = s
    },

    watchChange(id, change) {
      if (!server || !isUnderPosts(id)) return
      // 普通文章内容编辑不重启；index.md 的分类/链接决定侧边栏结构，编辑同样触发
      if (change.event === 'update' && path.basename(id) !== 'index.md') return

      // 合成 config 变更事件（posix 归一化，兼容 Windows 反斜杠，与 VitePress 的 configDeps 匹配）
      const configPath = path.join(root, '.vitepress', 'config.ts').replace(/\\/g, '/')
      // 延迟到当前变更处理完成后触发，避免 watcher 重入
      setImmediate(() => {
        server?.watcher.emit('change', configPath)
      })
    },
  }
}
