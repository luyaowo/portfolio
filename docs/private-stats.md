# 私人网站统计

入口：部署后访问 https://luyao.studio/stats ，可收藏到浏览器。浏览器登录框用户名是 `luyao`。

在 Vercel → portfolio → Settings → Environment Variables 中添加以下变量（Production；如需验证预览环境也添加 Preview），保存后重新部署。不要在聊天里发送 Token 或密码，不要使用 PUBLIC_ 前缀。

| 变量 | 值 |
| --- | --- |
| STATS_PASSWORD | 密码管理器生成的至少 24 位随机密码 |
| STATS_VERCEL_TOKEN | 在 https://vercel.com/account/tokens 创建，可访问该项目所属团队的 Token |
| STATS_VERCEL_PROJECT_ID | prj_6tq1prTKgEVuzJXboQ6aZBw1YRCV |
| STATS_VERCEL_TEAM_ID | team_VU0LDnkT737OnZ7kuEbQWVzu |

先确认项目 Web Analytics 已启用并已有数据。连接器授权不等于上述服务器运行时 Token。没有密码时页面与 API 均返回 503；未登录返回 401；未接通不会展示模拟数字或把错误记作 0。

使用官方 GET /v1/query/web-analytics/visits/aggregate，按 environment、day、requestPath、referrerHostname、deviceType 分组。时间范围为 UTC 今天、含今天的近 7 天、近 30 天；北京时间 08:00 换日。统计的是整个项目的 production 环境（包括同项目的其他正式域名），当前官方接口维度不提供 hostname 过滤。页面明确标记 UTC，不能与北京时间自然日直接比较。

访客总数独立查询，不累加各天或各页面的 UV。每组最多 50 项，其余由 Vercel 合并为 Others。只在成功响应后短暂缓存 5 分钟；缓存为函数实例内存，不保证跨实例共享，不作为长期归档。浏览器与 CDN 禁止缓存。历史范围受套餐限制，30 天查询可能受限；不会自动升级或付费。

访问保护使用 HTTP Basic，线上必须 HTTPS。浏览器通常会在会话中记住凭据；共享电脑请用私密窗口并在用后关闭。若需要撤销访问，在 Vercel 轮换 STATS_PASSWORD 并重新部署。Token 到期后同样更新并部署。

页面不进入导航，不加载 Analytics，SSR 页面不生成静态 HTML，并发送 noindex/no-store。`/api/stats` 采用相同服务端鉴权。不要把匿名 API、关闭鉴权或测试凭据部署到线上。

验证：`node --test scripts/stats.test.mjs`、`npm run build`。真实联调需配置上述变量后，登录 /stats，对照 Vercel 相同 UTC 时间范围的生产数据，检查切换范围、热门页面、刷新和无权限状态。

官方文档：https://vercel.com/docs/analytics/web-analytics-api
