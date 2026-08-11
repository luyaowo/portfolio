# 样式规则（*.astro, *.css 文件）

## 设计 Token

所有视觉 token 定义在 `src/layouts/Layout.astro` 的 `:root` 中，包括：
- 字重：`--weight-body`, `--weight-heading`, `--weight-strong`
- 颜色：`--color-page-bg`, `--color-text-primary`, `--color-text-secondary`
- 间距：`--space-stack-sm`, `--space-stack-md`, `--space-stack-lg`
- 宽度：`--article-width`(860px), `--content-width`(980px)

## 规则

- 调样式优先改 token，不要在各页面硬编码数值
- 新组件用已有的 token 变量，保持一致性
- 设计决策有疑问时查 `DESIGN.md`
- 不要引入新的颜色值或间距值，除非 DESIGN.md 里有依据
