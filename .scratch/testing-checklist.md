---
title: "本地测试清单"
status: open
created: 2026-07-02
labels: [ready-for-human]
---

# 本地测试清单

> 在 `npm run build` 部署前逐项检查。

## Dev Server Tests
- [ ] `npm run dev` 启动无错误
- [ ] 首页加载正常（http://localhost:5173）
- [ ] Hero 区域正确渲染
- [ ] 四个 Feature 卡片显示正常
- [ ] 导航栏 6 个菜单项存在

## Content Tests
- [ ] 各分类页加载正常（算法/数据结构/竞赛记录/代码模板）
- [ ] 标签页加载正常
- [ ] 示例文章（Two Sum）渲染正确
- [ ] 多语言代码组切换正常（C++/Python/Java 标签）
- [ ] 代码复制按钮工作（检查剪贴板）
- [ ] 代码高亮正确（C++/Python/Java 关键词着色）
- [ ] LaTeX 数学公式正确渲染（若使用）
- [ ] 内部链接正确（无断链）

## Navigation Tests
- [ ] 侧边栏按分类显示正确
- [ ] 大纲（目录）显示文章标题层级
- [ ] 搜索能搜到中文内容
- [ ] 搜索能搜到英文内容

## Theme Tests
- [ ] 浅色模式：所有文字可读，对比度适当
- [ ] 深色模式切换正常
- [ ] 深色模式：所有文字可读，对比度适当
- [ ] 内联代码样式正确
- [ ] 代码块在两种模式下样式正确

## Mobile Tests (Chrome DevTools)
- [ ] 导航栏在 <768px 折叠为汉堡菜单
- [ ] 侧边栏可从汉堡菜单访问
- [ ] 代码块横向滚动正常（无溢出裁剪）
- [ ] 表格横向滚动正常
- [ ] 字体大小缩放适当
- [ ] 触摸目标 >= 44px

## Build Tests
- [ ] `npm run build` 完成无错误
- [ ] `dist/` 目录包含所有预期文件
- [ ] `npm run preview` 正常服务构建产物
- [ ] 直接访问深层 URL 正常（无 SPA 404）
