#!/usr/bin/env node
/**
 * New Post Generator
 * Usage: node scripts/new-post.mjs <category> <title>
 * Example: node scripts/new-post.mjs algorithms two-sum
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/new-post.mjs <category> <title>')
  console.error('Categories: algorithms, data-structures, contest, templates')
  process.exit(1)
}

const category = args[0]
const title = args.slice(1).join(' ')
const date = new Date().toISOString().split('T')[0]
const slug = title.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/(^-|-$)/g, '')

const template = `---
title: '${title}'
date: ${date}
tags:
  - TODO
difficulty: Medium
langs: [cpp, python]
readingTime: 10
description: 'TODO'
---

# ${title}

## 题目描述

[题目链接]()

## 思路



## 代码

::: code-group

\`\`\`cpp [C++]
// C++ solution
\`\`\`

\`\`\`python [Python]
# Python solution
\`\`\`

:::

## 复杂度分析

- **时间复杂度：** O()
- **空间复杂度：** O()
`

// Ensure we're in project root
const postsDir = path.resolve(__dirname, '..', 'posts', category)
if (!fs.existsSync(postsDir)) {
  console.error(`Category directory not found: ${postsDir}`)
  console.error('Available categories:', fs.readdirSync(path.resolve(__dirname, '..', 'posts')).join(', '))
  process.exit(1)
}

const filePath = path.join(postsDir, `${slug}.md`)
if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`)
  process.exit(1)
}

fs.writeFileSync(filePath, template, 'utf-8')
console.log(`Created: ${filePath}`)
