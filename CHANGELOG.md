# 更新记录

版本按「攒一批再发」的节奏走：一个板块或一轮改版完成时发一版。版本号在 `package.json`、git tag 和 GitHub Release 三处保持一致，格式为 `vMAJOR.MINOR.PATCH`。

## [1.2.0] - 2026-09-16

### 新增

- design-study 栏目上线，26 篇设计研习：Material You 系列（button、color、dynamic、icon、text、divider、space-grid-layout）、card、dialog、chips、navigation、search、tab bar、top app bar、motion、figma constraints 等
- work 新增案例：嘉医有品 App、体外售后维修智能体、在制与库存系统、运营后台系统、元旦活动运营、元旦 AI 福卡活动
- essays 新增：《Spline 3D 设计指南》《UI 简史》《从大学到现在用过的几款笔记本电脑》《我的工业设计研究生叔叔于勒》
- ai-design 新增：Claude Code、Agent、提示词工程、Midjourney 关键词、Token
- 留言回复：站主可在本地回复访客留言，回复随代码一起发布
- 留言板表情反馈：访客可以对留言板表态，按 IP 去重
- 私有统计页 `/stats`：接入 Vercel Web Analytics，看访客、来源、设备，密码保护
- 404 页面

### 改进

- work 列表重构：类型 chip、职责配色标签、筛选 tab、右侧粘性目录
- 首页与导航改版
- about 页扩充
- essays 与 ai-design 列表改用共用组件，无封面时的排版与缩略图规则统一
- 全局设计 token 与 Layout 样式整理
- 图片统一转 webp
- work 版面图内嵌字体子集，保证访客端字形一致

### 调整

- Notes 不再生成公开路由，保留为私人原稿
- 新增内容导入工具 `/admin/import`
- 移除 oh-my-opencode 依赖

## [1.1] - 2026-06-12

设计 Token 体系、可视化参考、DESIGN.md、AGENTS.md、Keystatic 可编辑后台。
