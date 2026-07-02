import { defineConfig } from 'vitepress'
import { createRequire } from 'module'

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

  // Last-updated timestamp
  lastUpdated: true,

  // Markdown enhancements
  markdown: {
    // Enable LaTeX math
    math: true,
    // Show line numbers on code blocks
    lineNumbers: true,
    // Image lazy loading
    image: { lazyLoading: true },
    // Code copy button
    codeCopyButtonTitle: '复制代码',

    // markdown-it plugins
    config: (md) => {
      // !!! admonition 语法 (Python-Markdown 风格)
      // Usage:
      //   !!! note "可选标题"
      //       内容
      md.use(require('markdown-it-admonition'))

      // ???+ 可折叠详情块 (Material for MkDocs 风格)
      // Usage:
      //   ???+ info "标题"
      //       内容
      md.use(require('markdown-it-container'), 'details', {
        validate: (params) => params.trim().match(/^\?\?\?\+?\s*/),
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(4).trim() // remove '???+' prefix
          const titleMatch = info.match(/^"([^"]+)"\s*(.*)$/)
          const typeMatch = info.match(/^(\w+)\s*/)
          const title = titleMatch ? titleMatch[1] : '详细信息'
          const summary = titleMatch ? (titleMatch[2] || '') : (typeMatch ? info.slice(typeMatch[1].length).trim() : '')

          if (token.nesting === 1) {
            const cssClass = typeMatch ? `details-${typeMatch[1]}` : ''
            return `<details class="custom-details ${cssClass}" open><summary>${title}</summary>\n`
          } else {
            return '</details>\n'
          }
        },
      })
    },
  },

  themeConfig: {
    // Site identity
    siteTitle: '算法笔记',

    // Search — built-in local (full-text, no backend)
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文章',
                buttonAriaLabel: '搜索文章',
              },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清除搜索条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YOUR_USERNAME/algorithm-blog' },
    ],

    // Footer
    footer: {
      message: '以题会友，以码明志',
      copyright: 'Copyright © 2026',
    },

    // Outline (table of contents) shown on the right
    outline: {
      level: [2, 3],
      label: '目录',
    },

    // Last updated text
    lastUpdatedText: '最后更新',

    // Navigation bar
    nav: [
      { text: '首页', link: '/' },
      { text: '算法', link: '/posts/algorithms/' },
      { text: '数据结构', link: '/posts/data-structures/' },
      { text: '竞赛记录', link: '/posts/contest/' },
      { text: '代码模板', link: '/posts/templates/' },
      { text: '标签', link: '/tags/' },
    ],

    // Sidebar (category-based)
    sidebar: {
      '/posts/algorithms/': [
        {
          text: '算法',
          items: [
            { text: '概览', link: '/posts/algorithms/' },
          ],
        },
      ],
      '/posts/data-structures/': [
        {
          text: '数据结构',
          items: [
            { text: '概览', link: '/posts/data-structures/' },
          ],
        },
      ],
      '/posts/contest/': [
        {
          text: '竞赛记录',
          items: [
            { text: '概览', link: '/posts/contest/' },
          ],
        },
      ],
      '/posts/templates/': [
        {
          text: '代码模板',
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
    hostname: 'https://YOUR_DOMAIN.com',
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { name: 'keywords', content: '算法, 数据结构, LeetCode, Codeforces, 竞赛编程, ICPC' }],
  ],
})
