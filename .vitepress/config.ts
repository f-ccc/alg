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
    // 禁用内置搜索，使用自定义搜索弹窗（Ctrl+K 呼出）

    // Navigation bar
    nav: [
      { text: '首页', link: '/' },
      { text: '算法', link: '/posts/algorithms/'},
      { text: '题解', link: '/posts/contest/' },
      { text: '模板', link: '/posts/templates/' },
      { text: '标签', link: '/tags/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/f-ccc/alg' },
    ],

    // 右侧文章目录（大纲）
    outline: {
      level: [2, 3],
      label: ' ',
    },

    // 左侧导航栏（侧边栏）
    sidebar: {
      '/posts/algorithms/': [
        {
          text: '算法文章',
          collapsed: true,
          items: [
            // { text: '二分查找', link: '/posts/algorithms/binary' },
            // { text: '并查集', link: '/posts/algorithms/dsu' },
          ],
        },
      ],
      '/posts/contest/': [
        {
          text: '竞赛题解',
          collapsed: true,
          items: [
            {
              text: '牛客',
              collapsed: true,
              items: [
                { text: '26牛客暑假多校2', link: '/posts/contest/牛客/26牛客暑假多校2' },
              ],
            },
          ],
        },
      ],
      '/posts/templates/': [
        {
          text: '算法模板',
          collapsed: true,
          items: [
            { text: '头文件', link: '/posts/templates/约束' },
            {
              text: '数据结构',
              collapsed: true,
              items: [
                { text: '并查集', link: '/posts/templates/并查集' },
                { text: '树状数组', link: '/posts/templates/树状数组' },
                { text: '线段树', link: '/posts/templates/线段树' },
                { text: 'st表', link: '/posts/templates/st表' },
              ],
            },
            {
              text: '树上问题',
              collapsed: true,
              items: [
                { text: '树的直径', link: '/posts/templates/树的直径' },
                { text: '最近公共祖先LCA', link: '/posts/templates/最近公共祖先LCA' },
              ],
            },
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
