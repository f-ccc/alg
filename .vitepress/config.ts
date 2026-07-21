import { defineConfig } from 'vitepress'
import { createRequire } from 'module'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

const require = createRequire(import.meta.url)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '算法笔记',
  description: '个人算法技术博客 — 题解, 数据结构, 竞赛记录与代码模板',
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
    ssr: {
      noExternal: ['vitepress-plugin-tabs'],
    },
  },

  // Theme configuration
  themeConfig: {
    // Search (MiniSearch full-text)
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文章', buttonAriaLabel: '搜索' },
              modal: { noResultsText: '没有找到相关结果', resetButtonTitle: '清除搜索条件' },
            },
          },
        },
      },
    },

    // Navigation bar
    nav: [
      { text: '首页', link: '/' },
      { text: '题解', link: '/posts/contest/' },
      { text: '模板', link: '/posts/templates/' },
      { text: '标签', link: '/tags/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/f-ccc/alg' },
    ],

    // Sidebar
    sidebar: {
      '/posts/contest/': [
        {
          text: '题解',
          items: [
            { text: '概览', link: '/posts/contest/' },
          ],
        },
      ],
      '/posts/templates/': [
        {
          text: '模板',
          items: [
            { text: '概览', link: '/posts/templates/' },
          ],
        },
      ],
    },
  },

  // Build output directory
  outDir: 'dist',

  // Sitemap generation
  sitemap: {
    hostname: 'https://ac.fccc.xyz',
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { name: 'keywords', content: '算法, 数据结构, LeetCode, Codeforces, 竞赛编程, ICPC' }],
  ],
})
