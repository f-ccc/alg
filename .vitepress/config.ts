import { defineConfig } from 'vitepress'
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { searchIndexPlugin } from './plugins/search-index'
import { homePostsPlugin } from './plugins/home-posts'
import { buildSidebar, sidebarDevPlugin } from './plugins/sidebar'

const require = createRequire(import.meta.url)

/**
 * 从当前文件位置向上查找项目根目录（含 posts/ 文件夹）。
 * 上限 10 层，找不到直接抛错终止 dev/build，避免生成损坏侧边栏。
 */
function findRoot(): string {
  const start = path.dirname(fileURLToPath(import.meta.url))
  let dir = start
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'posts'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(`[sidebar] 向上查找 10 层未找到包含 posts/ 的项目根目录（起始于: ${start}）`)
}

const root = findRoot()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'fccc',
  description: '算法小站',
  lang: 'zh-CN',

  // Clean URLs (no .html suffix)
  cleanUrls: true,

  // Ignore dead links — many point to future content pages
  ignoreDeadLinks: true,

  // Base URL
  base: '/',

  // Markdown enhancements
  markdown: {
    // Enable LaTeX math
    math: true,
    // Show line numbers on code blocks
    lineNumbers: true,
    // Image lazy loading
    image: {
      lazyLoading: true,
    },
    // Markdown-it plugins — 兼容 OI-wiki / Material for MkDocs 语法
    config(md) {
      // !!! admonition (Python-Markdown / Material for MkDocs 风格)
      md.use(require('markdown-it-admonition'))

      // ??? / ???+ → <details><summary> (用 markdown-it-container marker:? API)
      //   对应 Python pymdownx.details 扩展
      //   用法:
      //     ??? note "标题"        折叠
      //     ???+ warning "标题"    默认展开
      //     ???                   关闭块
      md.use(require('markdown-it-container'), 'details', {
        marker: '?',
        validate: (params) => params.trim().length > 0,
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            let info = tokens[idx].info.trim()
            let expanded = false
            if (info.startsWith('+')) {
              expanded = true
              info = info.slice(1).trim()
            }
            let title = info
            const typeMatch = info.match(/^(\w+)\s+/)
            const type = typeMatch ? typeMatch[1].toLowerCase() : ''
            if (typeMatch) title = info.slice(typeMatch[0].length)
            const qm = title.match(/^"([^"]*)"\s*(.*)$/)
            if (qm) title = qm[1]
            const cls = type ? ` details-${type}` : ''
            return `<details class="custom-details${cls}"${expanded ? ' open' : ''}><summary>${md.utils.escapeHtml(title || '详细信息')}</summary>\n`
          }
          return '</details>\n'
        },
      })

      // ==高亮== (mark)
      md.use(require('markdown-it-mark'))
      // ++下划线++ (ins)
      md.use(require('markdown-it-ins'))
      // H~2~O 下标
      md.use(require('markdown-it-sub'))
      // X^2^ 上标
      md.use(require('markdown-it-sup'))
      // 定义列表
      md.use(require('markdown-it-deflist'))
      // 缩写 abbr
      md.use(require('markdown-it-abbr'))
      // :emoji: 表情
      md.use(require('markdown-it-emoji').full)
      // - [x] 任务列表
      md.use(require('markdown-it-task-lists'))

      // === 标签页 (vitepress-plugin-tabs)
      md.use(tabsMarkdownPlugin)
    },
  },

  // Vite-SSR config (no front-end runtime dependencies to externalize)
  vite: {
    plugins: [searchIndexPlugin(), homePostsPlugin(), sidebarDevPlugin()],
    ssr: {
      noExternal: ['vitepress-plugin-tabs'],
    },
    server: {
      // 禁用 HMR 错误覆盖层 — Vite 5.x glob HMR 已知问题
      hmr: {
        overlay: false,
      },
      // 避免 PDF 等非源码文件触发 HMR 更新导致 propagateUpdate 崩溃
      watch: {
        ignored: [
          '**/*.pdf',
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg',
          '**/*.gif',
          '**/*.svg',
          '**/*.ico',
        ],
      },
    },
  },

  // Theme configuration
  themeConfig: {
    // 禁用内置搜索，使用自定义搜索弹窗（Ctrl+K 呼出）

    // Navigation bar
    nav: [
      { text: '首页', link: '/' },
      { text: '算法', link: '/posts/algorithms/'},
      { text: '题解', link: '/posts/contest/' },
      { text: '模板', link: '/posts/templates/' },
      // { text: '标签', link: '/tags/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/f-ccc/alg' },
    ],

    // 右侧文章目录（大纲）
    outline: {
      level: [2, 3],
      label: ' ',
    },

    // 左侧导航栏（侧边栏）— 按 posts/ 目录树自动生成，见 plugins/sidebar.ts
    sidebar: buildSidebar(root),

    footer: {
      copyright: '@ 2026 fccc | <a href="https://github.com/f-ccc/alg" target="_blank">GitHub</a>'
    }
  },

  // Build output directory
  outDir: 'dist',

  // Sitemap generation
  sitemap: {
    hostname: 'https://ac.fccc.xyz',
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { name: 'keywords', content: '算法, 数据结构, LeetCode, Codeforces, 竞赛编程, ICPC' }],
  ],
})
