@AGENTS.md

## Claude Code 专用

- Keystatic 运行在本地模式（`storage.kind: 'local'`），内容直接读写文件系统，无需外部数据库。
- 站点通过 Vercel 自动部署，push 到 main 分支即触发。
- 设计决策参考 `DESIGN.md`（204 行设计规范），排版和组件问题先查它。
- 评论区在 `/about` 底部，用自部署的 Waline（服务端 `https://comment.luyao.studio`，代码在 `WalineComments.astro`）。服务端独立部署在 Vercel + Neon，不在本仓库里。访客必须第三方登录才能评论。
- `.env` 里的 `SUPABASE_*` 是旧留言板遗留，已无代码引用。
- 社交图标在 footer：GitHub、微信公众号（悬停显示二维码）、小红书、Instagram。
- 个人偏好：不要用 emoji 装饰内容，不要写宣传文案风格。
