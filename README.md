# 路遥知玛丽 · luyao.studio

个人网站，使用 Astro 5、Markdoc 与 Keystatic，部署于 Vercel。

## 本地开发

建议使用 Node.js 22，与 Vercel 服务端运行环境保持一致。

```sh
npm ci
npm run dev
```

开发预览地址：http://localhost:4321 。Keystatic 和文章导入工具用于本地编辑。

## 内容与样式

- `src/content/essays`：随笔与长文。
- `src/content/ai-design`：AI 实践文章。
- `src/content/design-study`：设计原理与理论思考。
- `src/content/work`：设计项目。
- `src/content/notes`：私人原稿，不提供公开路由。
- `src/layouts/Layout.astro`：全站布局与视觉变量。
- `src/layouts/EssayLayout.astro`：文章排版、目录与分享信息。
- `src/components/ArticleList.astro`：共用文章列表与响应式封面。

文章使用现有 Markdoc 格式，图片与文章放在同一目录。详细规范见 [AGENTS.md](AGENTS.md)。

## 验证

```sh
npm run build
```

涉及排版时，另检查首页、文章列表、随笔与技术长文在 390px、1280px、1440px 下的效果，包括目录跳转、表格横滑、图片和页面溢出。生产构建输出位于 `dist/`，部署产物位于 `.vercel/output/`。

不要修改 `.env` 或 `supabase/`；CMS 配置仅在明确需要时调整。
