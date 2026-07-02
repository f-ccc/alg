# 算法笔记 — 个人算法技术博客

以题会友，以码明志。题解 / 数据结构 / 竞赛记录 / 代码模板。

## 技术栈

- **框架：** VitePress 1.x（静态站点生成器）
- **构建：** Vite + Vue SSR + Rollup
- **代码高亮：** Shiki（VS Code 级别，200+ 语言）
- **搜索：** MiniSearch 内置全文搜索
- **部署：** Nginx + Let's Encrypt SSL

## 开发

```bash
npm run dev       # 热重载开发服务器 (http://localhost:5173)
npm run build     # 生产构建，输出到 dist/
npm run preview   # 预览构建产物
node scripts/new-post.mjs <category> <title>   # 创建新文章
```

## 目录结构

```
D:\ac\
├── .vitepress/              # VitePress 配置
│   ├── config.ts            # 站点配置（导航、搜索、主题）
│   └── theme/
│       ├── index.ts         # 主题入口
│       └── custom.css       # "单调有水平" 主题样式
├── posts/
│   ├── algorithms/          # 算法题解
│   ├── data-structures/     # 数据结构笔记
│   ├── contest/             # 竞赛记录
│   └── templates/           # 代码模板
├── tags/                    # 标签分类
├── public/                  # 静态资源
├── scripts/                 # 工具和部署脚本
├── docs/agents/             # Agent 配置
├── .scratch/                # 本地 Issue 追踪
└── package.json
```

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/` in this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
