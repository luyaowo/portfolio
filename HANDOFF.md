# HANDOFF · luyao.studio

> 最后更新：2026-06-13
> 版本：V1.1

---

## 做了什么

### 设计 Token 体系（核心工作）

从零建立了完整的设计 token 系统，定义在 `src/layouts/Layout.astro` 的 `:root` 中。

**排版（24 个）**

| 类别 | Token | 说明 |
|------|-------|------|
| 字号 | `--text-caption` (12px) ~ `--text-title-article` (clamp) | 11 级语义化字号 |
| 行高 | `--leading-title` (1.28) ~ `--leading-body` (1.82) | 6 级行高 |
| 字重 | `--weight-normal` (400) / `medium` (500) / `semibold` (600) / `bold` (700) | 4 级字重 |
| 字体 | `--font-body` / `--font-heading` / `--font-mono` / `--font-brand` | 4 个字体栈 |

**颜色（20 个）**：`--color-bg`、`--color-surface`、`--color-text`、`--color-border` 等，统一 `--color-` 前缀。

**间距（14 个）**：`--space-4` ~ `--space-120`，严格 4px 网格，命名即数值。

**装饰（~20 个）**：`--radius-*`、`--shadow-*`、`--width-*`、`--divider-*`、`--size-*`。

### 全站 token 化

- 全站硬编码 spacing 从 200+ 处降到 ~10 处合理例外
- 字重、颜色 100% token 化
- 字号/行高 ~95% token 化（移动端断点覆写保留硬编码）

### 可视化参考页

`http://localhost:4321/design` — 色块预览、字号渲染、间距比例尺、字重对比。

### AGENTS.md / CLAUDE.md

- `AGENTS.md`：项目结构、命令、内容格式规范、token 速查、安全红线
- `CLAUDE.md`：`@AGENTS.md` + Claude Code 专用（Keystatic 本地模式、Supabase 依赖等）

### 排版调整

- 字体栈：系统拉丁字体优先（英文走 San Francisco），中文走 PingFang SC（比 Noto Sans SC 精致）
- 正文 `--weight-normal` (400)，标题 `--weight-medium` (500)
- 导航与页面标题统一英文首字母大写（Home, Essays, Notes...）
- 页面顶部间距统一为 `--space-56`

### 其他

- 底部社交图标：GitHub、微信公众号（悬停弹二维码）、小红书、Instagram
- 删除 `/links` 页面，社交入口移到 footer
- 文章图片去掉线框
- 段落行高 1.6→1.82，段落间距 20→30px

---

## 试过什么没成功

### 1. 全局 sed 替换翻车

用 `s/: 12px;/: var(--space-12);/g` 批量替换时，`:root` 里 token 定义本身也被替换了。导致 `--text-body` 变成了 `var(--space-16)`、`--space-4` 循环引用自己。教训：**批量替换前必须先排除 `:root` 定义块**。

### 2. 间距舍入导致布局偏移

将 `18px` 舍入到 `--space-16`、`96px` 舍入到 `--space-120`，虽然对齐了 4px 网格，但视觉上产生了明显偏移。教训：**不是所有值都必须上网格，关键视觉位置保留原值**。

### 3. AI Design 列表页直接复制 Essays

没先检查 AI Design 有没封面图就照搬了带封面的双栏布局（结果确实有封面，但介绍文复制错了）。教训：**复制布局前先确认数据结构是否一致**。

---

## 下一步

### 需要做的

- [ ] Notes 列表页改成和 Essays 一样的卡片布局（目前还是简约列表）
- [ ] Work 列表页同理
- [ ] `/design` 页面目前需要手动启动 dev server 才能看，要不要部署时也保留
- [ ] 检查移动端 720px 以下各页面的间距一致性
- [ ] Photography 页面目前只有 placeholder，需要真实内容

### 可以优化的

- [ ] 间距 token 只保留了实际用到的 14 个，将来如果用到 `--space-36` 可以随时加
- [ ] 颜色 token `--color-link-underline`、`--color-pressed` 只用了一次，可以考虑删掉 token 直接用值

### 想换字体时

当前字体栈：英文 SF → 中文 PingFang SC → Noto Sans SC 兜底。想换风格可以：

- **TW93 同款楷体**：`'TsangerJinKai02', 'STKaiti', 'PingFang SC', sans-serif`（需引入仓耳今楷字体文件）
- **更现代**：保持现状（PingFang SC 已经是最干净的屏显中文黑体）
- **更书卷气**：`'Noto Serif SC', 'STSong', 'PingFang SC', serif`（换回衬线，但屏显可读性下降）

---

## 常用命令

```bash
npm run dev        # http://localhost:4321 开发
npm run build      # 生产构建
/keystatic         # 在线编辑文章（需先 npm run dev）
/design            # 可视化 token 参考页
```

## 关键文件

| 文件 | 内容 |
|------|------|
| `src/layouts/Layout.astro` | 全局布局 + 所有 token 定义 + 导航 + footer |
| `src/layouts/EssayLayout.astro` | 文章详情页布局（标题、正文排版、TOC） |
| `src/pages/design.astro` | token 可视化参考页 |
| `DESIGN.md` | 设计规范 + 第 16 节 token 速查表 |
| `AGENTS.md` | AI 工具通用项目规范 |
| `CLAUDE.md` | Claude Code 专用补充 |
| `keystatic.config.ts` | CMS 配置（collections 定义） |

## 编辑文章

`npm run dev` → 访问 `http://localhost:4321/keystatic` → 左侧导航选内容类型 → 点击编辑或新建。
