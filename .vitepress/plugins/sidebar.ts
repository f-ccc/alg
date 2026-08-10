/**
 * 侧边栏构建期生成：dev 模式新增/删除文章或目录时由 sidebarDevPlugin 合成 config 变更事件，
 * 触发 VitePress 自动重启重建侧边栏（内容编辑不触发）。
 * 完全基于 posts/ 物理目录树，不支持跨目录逻辑分组。
 */
import fs from 'fs'
import path from 'path'
import type { Plugin, ViteDevServer } from 'vite'
import type { DefaultTheme } from 'vitepress'
import { pathToUrl, extractTitle } from './search-index'
import { CATEGORIES } from './home-posts'

/**
 * 递归生成目录树侧边栏条目：目录（分组）在前、md 文件（链接）在后，各自按中文自然序排序。
 * 二级及更深分组一律折叠（collapsed: true）。
 */
function buildTree(dir: string, root: string): DefaultTheme.SidebarItem[] {
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
 * dev 模式自动更新侧边栏：posts/ 下文件新增/删除时，合成 config.ts 的 change 事件，
 * VitePress 检测到 config（或其被导入模块）变更后自动重启服务器，config 重新求值，
 * 侧边栏随之重建。内容编辑（update）不触发，避免每次保存都重启。
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
      if (change.event === 'update') return // 内容编辑不重启

      // 合成 config 变更事件（posix 归一化，兼容 Windows 反斜杠，与 VitePress 的 configDeps 匹配）
      const configPath = path.join(root, '.vitepress', 'config.ts').replace(/\\/g, '/')
      // 延迟到当前变更处理完成后触发，避免 watcher 重入
      setImmediate(() => {
        server?.watcher.emit('change', configPath)
      })
    },
  }
}
