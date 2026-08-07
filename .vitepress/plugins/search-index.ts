import { Plugin, type ViteDevServer } from 'vite'
import fs from 'fs'
import path from 'path'

/* ------------------------------------------------------------------ */
/*  Post metadata extracted from raw markdown                          */
/* ------------------------------------------------------------------ */
interface PostData {
  title: string
  desc: string
  /** 去除 frontmatter 和 markdown 标记后的纯文本 */
  text: string
  link: string
}

const VIRTUAL_MODULE_ID = 'virtual:search-index'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function stripFrontmatter(src: string): string {
  return src.replace(/\r\n/g, '\n').replace(/---[\s\S]*?---/, '')
}

export function parseFrontmatter(src: string): Record<string, string> {
  const normalized = src.replace(/\r\n/g, '\n')
  const m = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^['"](.*)['"]$/, '$1')
  }
  return fm
}

function plainText(md: string): string {
  return stripFrontmatter(md)
    .replace(/[#*`~\[\]()>|\\:]/g, ' ')
    .replace(/---/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractTitle(md: string): string {
  const fm = parseFrontmatter(md)
  if (fm.title) return fm.title
  const src = stripFrontmatter(md)
  const m = src.match(/^[#*]\s+(.+)$/m)
  return m ? m[1].trim() : ''
}

function extractDesc(md: string): string {
  const src = stripFrontmatter(md)
  const lines = src.split('\n')
  for (const line of lines) {
    const t = line.replace(/[#*`\[\]]/g, '').trim()
    if (t && !t.startsWith('```') && !t.startsWith('>') && !t.startsWith('-')) {
      return t.length > 120 ? t.slice(0, 120) + '…' : t
    }
  }
  return ''
}

export function pathToUrl(absPath: string, root: string): string {
  const relative = path.relative(root, absPath).replace(/\\/g, '/')
  // encodeURI 编码中文/空格等字符，防止 href 出现未编码路径导致 404
  return '/' + encodeURI(relative.replace(/\.md$/, ''))
}

/* ------------------------------------------------------------------ */
/*  Index generation                                                   */
/* ------------------------------------------------------------------ */

export function findMdFiles(dir: string): string[] {
  const results: string[] = []
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') results.push(...findMdFiles(full))
      } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        results.push(full)
      }
    }
  } catch { /* ignore permission errors */ }
  return results
}

function generateIndex(root: string): PostData[] {
  const postsDir = path.join(root, 'posts')
  if (!fs.existsSync(postsDir)) return []

  const mdFiles = findMdFiles(postsDir)
  const posts: PostData[] = []

  for (const absPath of mdFiles) {
    let src: string
    try {
      src = fs.readFileSync(absPath, 'utf-8')
    } catch {
      continue
    }

    posts.push({
      title: extractTitle(src),
      desc: extractDesc(src),
      text: plainText(src),
      link: pathToUrl(absPath, root),
    })
  }

  return posts
}

/* ------------------------------------------------------------------ */
/*  Vite plugin                                                        */
/* ------------------------------------------------------------------ */

export function searchIndexPlugin(): Plugin {
  let root = ''
  let postsDir = ''
  let currentIndex: PostData[] = []
  let viteServer: ViteDevServer | undefined

  function rebuild() {
    if (!root) return
    try {
      currentIndex = generateIndex(root)
    } catch (e) {
      console.error('[search-index] rebuild failed:', e)
    }
  }

  /** posts/ 下的文件是否在监听范围内（兼容各平台路径分隔符） */
  function isUnderPosts(id: string): boolean {
    if (!postsDir || !id) return false
    const rel = path.relative(postsDir, id)
    return !rel.startsWith('..') && !path.isAbsolute(rel)
  }

  return {
    name: 'vitepress-search-index',

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
        return `export default ${JSON.stringify(currentIndex)}`
      }
    },

    buildStart() {
      rebuild()
    },

    // dev 下文章增删改时重建索引并全量刷新，避免虚拟模块冻结在服务启动时刻
    watchChange(id) {
      if (!isUnderPosts(id)) return
      rebuild()
      const mod = viteServer?.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
      if (mod) viteServer?.moduleGraph.invalidateModule(mod)
      viteServer?.ws.send({ type: 'full-reload' })
    },
  }
}
