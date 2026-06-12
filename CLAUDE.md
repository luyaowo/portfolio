@AGENTS.md

## Claude Code 专用

- Keystatic 运行在本地模式（`storage.kind: 'local'`），内容直接读写文件系统，无需外部数据库。
- 站点通过 Vercel 自动部署，push 到 main 分支即触发。
- 设计决策参考 `DESIGN.md`（204 行设计规范），排版和组件问题先查它。
- Guestbook 依赖 Supabase，环境变量在 `.env`（`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`）。
- 社交图标在 footer：GitHub、微信公众号（悬停显示二维码）、小红书、Instagram。
- 个人偏好：不要用 emoji 装饰内容，不要写宣传文案风格。
