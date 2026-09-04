---
name: sync-wechat-blog
description: 把微信公众号文章同步到个人博客 luyao.studio（Astro + Keystatic）。当用户给出公众号文章链接或用「同步《文章名》到博客」发起时使用。必须以公众号实发版为准，本地 md/HTML 可能是旧稿。
---

# 公众号文章同步到博客

用户先发公众号，再同步博客。**公众号实发版是唯一权威**——本地 md（即使是无 `_副本` 的主 md）可能在公众号编辑器里被改过，排版 HTML 比 md 更旧。

## 输入

- 公众号文章链接（`https://mp.weixin.qq.com/s/...`），或用户只给文章标题时，先在 `~/微信公众号/` 下找对应文件夹里的 md 提取正文，并向用户要链接。
- 文章目标分类（默认 `ai-design`，`essays` 备选）和 slug（语义化英文，参考已有 token/、agent/、prompt-engineering/）。

## 流程

### 1. 抓公众号实发版

WebFetch 抓不到（反爬），用 firecrawl：

```bash
firecrawl scrape "<链接>" --only-main-content -o /tmp/wx-<slug>.md
```

### 2. 找本地素材

`~/微信公众号/` 下对应文章的文件夹里通常有：正文 md（多个版本时选最后修改的主 md，`_副本` 基本都是旧稿）、排版 HTML、`images/` 或 `i/` 插图目录、封面图（`微信公众号封面-*.png`，多版本选最新 vN）。博客已有同文章时先读旧版，图片能对上就复用。

### 3. 句子级归一化 diff（关键）

公众号抓取正文 vs 本地 md，行级 diff 噪音极多（PART 卡片、加粗拆行、图注行）。用句子级：两边的行都清掉图片行/链接/装饰行，归一化（去 `*#>\`|[]()【】` 和空白标点）后互查包含关系，剩下的差异才是实质差异。**以公众号为准**逐条处理（增删改句子、整节删除、表格行数变化都要跟），但标题的「第X章：」前缀是博客格式，保留。

### 4. 生成博客文章

`src/content/<分类>/<slug>/index.md`：

```yaml
---
title: <标题>
date: <公众号发文日期 YYYY-MM-DD>
summary: <一句话摘要，参考 token/agent 篇风格>
cover: cover.webp
---
```

- 正文从 `##` 开始，不用 `#` 一级标题（frontmatter title 承担）
- 图片插入位置以公众号实发版为准（`imgIndex` 序号顺序 + 前后文定位）；图片 alt 用公众号图注（`— xxx` 行）或语义描述
- 图片全部转 webp（用户明确要求）：本地原图优先（大图清晰），本地没有的用公众号下载图（1080px 对 860px 文章宽度够用）；封面同样转 webp

```python
from PIL import Image
im = Image.open(src); im.save(out, 'WEBP', quality=85, method=6)
```

- 参考资料：分组结构用公众号版（微信排版会把链接 URL 吞掉），链接 URL 从本地 md 版补回
- 图片命名：语义化 kebab-case（如 `midjourney-prompt.webp`），文件名尽量不用 exec-xxx 或 1.png 这类无意义名字

### 5. 旧文章替换

博客已有旧版时：内容更新放原地（claude-code/ 这种语义化目录）或用户同意后新建语义化 slug 并 `git rm` 旧目录（删除前必须让用户确认，CLAUDE.md 边界）。

### 6. 验证

```bash
cd /Users/fanluyao/portfolio && npm run build
```

无报错后告诉用户：跑到 `npm run dev` 看 `/ai-design/<slug>` 效果，确认后自行 push（Vercel 自动部署）。

## 注意

- 不要动 `.env`、`supabase/`、`keystatic.config.ts`
- 不改无关文章；frontmatter 字段不删
- 公众号正文里的加粗（**）保留，正文里作者对第三方厂商的评论原样保留
