# 算法笔记 📝

已部署到[ac.fccc.xyz](ac.fccc.xyz) 网站 记录算法学习笔记 题解 和 代码模板 

基于 [VitePress](https://vitepress.dev) 构建

## 技术栈

| 技术 | 用途 |
|------|------|
| VitePress 1.x | 静态站点生成器（Vue 3 + SSR） |
| TypeScript / Vue 3 | 主题与组件 |
| Shiki | 代码语法高亮 |
| MiniSearch | 本地全文搜索 |
| LaTeX (markdown-it-mathjax3) | 数学公式渲染 |
| GitHub Actions | CI/CD 自动部署 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
├── .vitepress/
│   ├── config.ts              # 站点配置
│   └── theme/
│       ├── index.ts           # 主题入口
│       ├── custom.css         # 自定义样式
│       └── components/        # Vue 组件
├── posts/
│   ├── algorithms/            # 算法文章
│   ├── contest/               # 竞赛题解
│   ├── data-structures/       # 数据结构
│   └── templates/             # 代码模板
├── public/                    # 静态资源
│   ├── code/                  # 示例代码
│   └── img/                   # 图片
├── tags/                      # 标签页
├── scripts/                   # 工具脚本
└── index.md                   # 首页
```

## 许可

MIT
