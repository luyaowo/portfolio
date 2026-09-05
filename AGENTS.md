# luyao.studio Agent Guide

## Project

个人网站 [luyao.studio](https://luyao.studio)，基于 Astro 5 + Keystatic CMS，部署在 Vercel。

## Repository Map

```
src/
├── pages/           # 路由页面（Astro 文件即路由）
│   ├── index.astro  # 首页
│   ├── essays/      # /essays 列表 + [...slug] 文章详情
│   ├── ai-design/   # /ai-design AI 实践
│   ├── design-study/ # /design-study 设计研习
│   ├── ai/          # /ai AI 图像画廊
│   ├── work/        # /work 设计项目
│   ├── photography/ # /photography 摄影
│   ├── play/        # /play 代码实验
│   ├── about/       # /about 关于页
│   ├── guestbook/   # /guestbook 留言板
│   └── api/         # API 端点（guestbook）
├── layouts/
│   ├── Layout.astro      # 全局布局（导航、footer、设计 tokens）
│   └── EssayLayout.astro # 文章页布局（标题、正文排版、TOC）
├── components/      # 可复用组件
├── content/         # Markdoc 内容（Keystatic 管理）
│   ├── essays/      # 长文，每篇一个文件夹
│   ├── notes/       # 私人原稿，单文件，不生成公开路由
│   ├── ai-design/   # AI 实践文章
│   ├── design-study/ # 设计原理、界面组件与研究笔记
│   └── work/        # 设计项目
├── assets/          # 图片资源（photography/, ai/）
├── lib/server/      # 服务端逻辑（guestbook Supabase）
└── public/          # 静态文件（头像、OG 图、微信二维码）
```

## Commands

```bash
npm run dev      # 启动开发服务器 → http://localhost:4321
npm run build    # 生产构建 → dist/
npm run preview  # 预览构建结果
```

## Content Rules

### Markdoc 文章格式

所有文章用 Markdoc（`.md` 扩展名），通过 Keystatic 本地模式管理。

**Essays（长文）**：`src/content/essays/<slug>/index.md`
```yaml
---
title: 文章标题
date: 2026-01-01
summary: 摘要（可选）
cover: 01.jpg  # 封面图，放在同目录下
---
正文内容...
```

**Notes（短笔记）**：`src/content/notes/YYYY-MM-DD.md`
```yaml
---
title: 笔记标题
date: 2026-01-01
---
正文内容...
```

**AI Design**：`src/content/ai-design/<slug>/index.md`，格式同 Essays。

**Design Study**：`src/content/design-study/<slug>/index.md`，格式同 Essays；用于设计原理、界面组件与研究笔记。首页与主导航位于 Work 之后。

**Work**：`src/content/work/<slug>/index.md`，额外需要 `metaLeft`、`metaRight`、`summary`、`cover`。

### 规则

- 保留已有 frontmatter 字段，不要删
- 新文章按现有命名规范：Essays 用有意义的 slug，Notes 用日期
- 图片放在对应文章文件夹内，文中用 `![alt](filename.jpg)` 引用

## Design Tokens

所有视觉 token 定义在 `src/layouts/Layout.astro` 的 `:root` 中：

- **字重**：`--weight-normal`(400) `--weight-medium`(500) `--weight-semibold`(600) `--weight-bold`(700)
- **颜色**：`--color-bg` `--color-text` `--color-text-secondary` 等
- **间距**：`--space-16` `--space-24` `--space-48` 等
- **宽度**：`--width-article`(860px) `--width-article-text`(712px) `--width-content`(980px)

调样式优先改 token，不要在各页面硬编码数值。

## Verification

- 内容修改：`npm run build` 确认无报错
- 排版修改：`npm run dev` 在浏览器检查 `/essays/<slug>` 和 `/ai-design/agent` 页面（390px、1280px、1440px）
- 布局修改：检查首页 + 至少一篇长文 + 移动端（720px 以下）
- 仅文档/README 修改：检查链接

## Shared Components

- `ArticleList.astro`：Essays、Ai-practice、Design Study 共用列表，处理无封面、浏览数和响应式缩略图。
- `EssayLayout.astro`：正文排版、文章元信息和响应式目录；详情页传入标题、摘要、封面、发布日期。
- `RelatedArticles.astro`：文末同栏目阅读入口，仅查询公开栏目。
- 普通编号列表使用轻量排版；手机表格在自身范围内横向滚动。
- Notes 仅保留私人原稿，不恢复公开路由、导航或推荐入口。

## Safety

- 不要改 `.env` 文件
- 不要动 `supabase/` 目录
- 不要修改 `keystatic.config.ts` 除非明确要求
- 不改已有文章的内容，只新增或按要求修改
