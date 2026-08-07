import { Plugin, type ViteDevServer } from 'vite'
import fs from 'fs'
import path from 'path'
import { findMdFiles, parseFrontmatter, extractTitle, pathToUrl } from './search-index'

/* ------------------------------------------------------------------ */
/*  首页文章元数据（构建期从 posts/ 自动生成，替代手工维护的数组）      */
/* ------------------------------------------------------------------ */

interface HomePost {
  title: string
  link: string
  /** 仅取 md 顶部 frontmatter 的 date 声明，未声明为空字符串 */
  date: string
  cat: string
  color: string
}

interface HomeCategory {
  slug: string
  name: string
  link: string
  count: number
  color: string
  icon: string
}

interface HomeData {
  categories: HomeCategory[]
  posts: HomePost[]
}

const VIRTUAL_MODULE_ID = 'virtual:home-posts'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/* 分类静态配置（icon 为内联 SVG），侧边栏复用同一映射 */
export const CATEGORIES: Omit<HomeCategory, 'count'>[] = [
  {
    slug: 'algorithms',
    name: '算法',
    link: '/posts/algorithms/',
    color: '#8b5cf6',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  },
  {
    slug: 'contest',
    name: '题解',
    link: '/posts/contest/',
    color: '#2563eb',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    slug: 'templates',
    name: '模板',
    link: '/posts/templates/',
    color: '#22c55e',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  },
]

/* 每篇文章卡片色板（按标题哈希取色，保持每篇不同色） */
const PALETTE = [
  '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#ef4444',
]

function hashTitle(title: string): number {
  let h = 0
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0
  }
  return h
}

/** 统一为 YYYY-MM-DD；非法输入返回 '' */
function normalizeDate(raw: string): string {
  const m = String(raw).trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (!m) return ''
  const [, y, mo, d] = m
  if (+mo < 1 || +mo > 12 || +d < 1 || +d > 31) return ''
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
}

/** posts/ 下第一级目录 slug → 分类名 */
function catFor(absPath: string, root: string): string {
  const rel = path.relative(path.join(root, 'posts'), absPath).replace(/\\/g, '/')
  const slug = rel.split('/')[0] ?? ''
  const c = CATEGORIES.find((c) => c.slug === slug)
  return c ? c.name : '其他'
}

function generateHomeData(root: string): HomeData {
  const postsDir = path.join(root, 'posts')
  if (!fs.existsSync(postsDir)) {
    return { categories: CATEGORIES.map((c) => ({ ...c, count: 0 })), posts: [] }
  }

  const posts: HomePost[] = []

  for (const absPath of findMdFiles(postsDir)) {
    let src: string
    try {
      src = fs.readFileSync(absPath, 'utf-8')
    } catch {
      continue
    }

    const title = extractTitle(src)
    if (!title) continue

    const fm = parseFrontmatter(src)
    posts.push({
      title,
      link: pathToUrl(absPath, root),
      date: normalizeDate(fm.date ?? ''),
      cat: catFor(absPath, root),
      color: PALETTE[hashTitle(title) % PALETTE.length],
    })
  }

  // 日期倒序；无日期排最后，其次按标题
  posts.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title, 'zh')
  })

  const categories = CATEGORIES.map((c) => ({
    ...c,
    count: posts.filter((p) => p.cat === c.name).length,
  }))

  return { categories, posts }
}

/* ------------------------------------------------------------------ */
/*  Vite plugin                                                        */
/* ------------------------------------------------------------------ */

export function homePostsPlugin(): Plugin {
  let root = ''
  let postsDir = ''
  let currentData: HomeData = { categories: [], posts: [] }
  let viteServer: ViteDevServer | undefined

  function rebuild() {
    if (!root) return
    try {
      currentData = generateHomeData(root)
    } catch (e) {
      console.error('[home-posts] rebuild failed:', e)
    }
  }

  /** posts/ 下的文件是否在监听范围内（兼容各平台路径分隔符） */
  function isUnderPosts(id: string): boolean {
    if (!postsDir || !id) return false
    const rel = path.relative(postsDir, id)
    return !rel.startsWith('..') && !path.isAbsolute(rel)
  }

  return {
    name: 'vitepress-home-posts',

    configResolved(config) {
      root = config.root
      postsDir = path.join(root, 'posts')
    },

    configureServer(server) {
      viteServer = server
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(currentData)}`
      }
    },

    buildStart() {
      rebuild()
    },

    // dev 下文章增删改时重建数据并全量刷新，避免虚拟模块冻结在服务启动时刻
    watchChange(id) {
      if (!isUnderPosts(id)) return
      rebuild()
      const mod = viteServer?.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
      if (mod) viteServer?.moduleGraph.invalidateModule(mod)
      viteServer?.ws.send({ type: 'full-reload' })
    },
  }
}
