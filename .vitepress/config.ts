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
      md.use(require('markdown-it-admonition'))

      // ??? / ???+ → 预处理器转换为 ::: details 语法
      // 然后用 markdown-it-container 渲染
      const containerDetails = require('markdown-it-container')
      md.use(containerDetails, 'details', {
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const raw = tokens[idx].info.trim()
            const expanded = raw.startsWith('+')
            const rest = expanded ? raw.slice(1).trim() : raw
            const typeMatch = rest.match(/^(\w+)\s*/)
            const type = typeMatch ? typeMatch[1].toLowerCase() : ''
            const afterType = typeMatch ? rest.slice(typeMatch[0].length).trim() : rest
            const titleMatch = afterType.match(/^"([^"]*)"\s*(.*)$/)
            const title = titleMatch ? titleMatch[1] : (afterType || type || '详细信息')
            const typeClass = type ? ` details-${type}` : ''
            return `<details class="custom-details${typeClass}"${expanded ? ' open' : ''}><summary>${md.utils.escapeHtml(title)}</summary>\n`
          }
          return '</details>\n'
        },
      })

      // 预处理器：??? / ???+  →  ::: details (在 block tokenize 之前运行)
      md.core.ruler.before('block', 'details_transform', (state) => {
        const lines = state.src.split('\n')
        const result = []
        let i = 0
        while (i < lines.length) {
          const line = lines[i]
          const match = line.match(/^(\s*)(\?\?\??\+?)(\s*.*)$/)
          if (match && match[1].length === 0 && match[2].length >= 3) {
            const marker = match[2]  // ??? or ???+
            const rest = match[3].trim()
            const isExpanded = marker === '???+'

            // Find close: next ???/???+, ?!!, or end
            let closeIdx = -1
            for (let j = i + 1; j < lines.length; j++) {
              const nextLine = lines[j].trim()
              if (nextLine === '?!!') {
                closeIdx = j
                lines[j] = ':::'  // Replace ?!! with close marker
                break
              }
              if (nextLine.match(/^\?\?\??\+?\s/) || nextLine === '???' || nextLine === '???+') {
                closeIdx = j  // Let the next iteration handle it
                break
              }
              // Also check for non-indented content that's not continuation
              if (nextLine.length > 0 && !nextLine.startsWith(' ') && !nextLine.startsWith('\t') && nextLine !== '') {
                // Non-indented text that isn't a continuation of indented content
                // Only close if the content before was indented
                // This is tricky, so we just rely on ???/?!! markers
              }
            }
            if (closeIdx === -1) closeIdx = lines.length

            // Convert opening
            let params = rest
            if (isExpanded) params = '+ ' + params
            result.push('::: details ' + params)
            i++
            // Copy content lines
            while (i < closeIdx) {
              result.push(lines[i])
              i++
            }
            // Add close marker
            result.push(':::')
          } else {
            result.push(line)
            i++
          }
        }
        state.src = result.join('\n')
      })

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
