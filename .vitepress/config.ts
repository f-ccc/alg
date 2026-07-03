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

    // markdown-it plugins — 兼容 OI-wiki / Material for MkDocs 语法
    config: (md) => {
      // !!! admonition (Python-Markdown / Material for MkDocs 风格)
      //   !!! note "标题"    !!! tip ""    !!! warning ""    !!! danger ""
      //   !!! info ""  !!! abstract ""  !!! question ""  !!! success ""
      //   !!! failure ""  !!! bug ""  !!! example ""  !!! quote ""
      md.use(require('markdown-it-admonition'))

      // ==高亮== (mark)
      md.use(require('markdown-it-mark'))
      // ~~删除线~~ (已内置) + ++下划线++ (ins)
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
      { icon: 'github', link: 'https://github.com/f-ccc/ac-algorithms' },
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
            { text: '洛谷 P1551 亲戚（并查集）', link: '/posts/algorithms/luogu-p1551-亲戚' },
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
    hostname: 'https://ac.fccc.xyz',
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { name: 'keywords', content: '算法, 数据结构, LeetCode, Codeforces, 竞赛编程, ICPC' }],
  ],
})
