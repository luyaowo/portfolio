# Luyao Portfolio Design System

## 1. Purpose

This file is the canonical design spec for this site.

The site is a personal content publication, not a SaaS dashboard, not an AI landing page, and not a component showcase. The primary job of the interface is to help readers browse, enter, and finish long-form writing with low friction.

When implementation details are unclear, follow this precedence:

1. This `DESIGN.md`
2. Existing site structure and content model
3. Minimal changes that improve consistency

## 2. Source References

This system is a deliberate hybrid:

- **Article reading feel:** Quaily
- **Overall neutral surface and interface order:** Notion
- **TOC / document structure:** Mintlify

These references are used for direction, not for literal cloning.

## 3. Brand Intent

### Keywords

- calm
- editorial
- low-contrast
- readable
- light
- restrained
- document-first

### Avoid

- heavy product-marketing tone
- dark blue / tech-brand color cast
- oversized cards
- noisy gradients
- decorative shadows by default
- oversized hero sections
- overly sharp contrast between navigation and page background

## 4. Visual Theme

The site should feel like a quiet writing workspace with a soft paper-like background. Surfaces should be close in value, with separation coming from spacing, typography, and subtle borders instead of strong fills or shadows.

This is not a glossy product site. It should feel closer to a modern publishing tool or personal notebook.

## 5. Color System

### Core Surfaces

- **Page background:** `#f7f6f2`
- **Raised reading surface:** `#fbfaf7`
- **Pure white reserve:** `#ffffff` only for image surfaces, code blocks, or specific contained media

### Text

- **Primary text:** `rgba(29, 31, 42, 0.88)`
- **Secondary text:** `rgba(29, 31, 42, 0.62)`
- **Tertiary / meta text:** `rgba(29, 31, 42, 0.42)`

### Lines and Dividers

- **Default border:** `rgba(29, 31, 42, 0.10)`
- **Stronger border:** `rgba(29, 31, 42, 0.14)`

### Interaction

- **Link / active text:** `rgba(29, 31, 42, 0.92)`
- **Hover fill:** `rgba(29, 31, 42, 0.04)`
- **Pressed fill:** `rgba(29, 31, 42, 0.07)`

### Rules

- Do not use deep navy as the main text impression.
- Do not use bright accent colors as a recurring theme.
- Let contrast come from type hierarchy, not from dark blocks.

## 6. Typography

### Font Roles

- **Body / UI / metadata:** `Noto Sans SC`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `system-ui`, sans-serif
- **Headings / selective editorial emphasis:** `Noto Serif SC`, `Songti SC`, `STSong`, serif

### Typographic Principle

Body must stay sans-serif. Headings may use serif, but serif should be applied selectively and consistently. Do not let serif spread into normal paragraphs, lists, captions, or metadata.

### Body Text

- Default size: `18px`
- Default line-height: `1.8`
- Default weight: `380-400`
- Paragraph spacing should feel relaxed, not loose

### Strong Text

- Weight: `650-700`
- Use for semantic emphasis only
- Strong text should create readable hierarchy, not turn paragraphs into heavy black blocks

### Heading Scale

- `h1`: prominent, editorial, can use serif
- `h2`: strong section anchor, can use serif
- `h3`: mostly functional, may stay sans if needed for clarity

### Metadata

- Date, category, captions, and side navigation should stay sans-serif
- Metadata should use tertiary or secondary text, never primary-heavy

## 7. Layout Principles

### Global

- Content should sit in a centered column
- Left and right whitespace should feel balanced
- Do not fake hierarchy with giant empty hero bands

### Article Width

- Target long-form reading width: approximately `760px-860px`
- Width should prioritize continuous reading, not maximum content density

### Rhythm

- Use consistent vertical spacing between title, intro, sections, paragraphs, images, and notes
- Spacing should do most of the visual organization work

## 8. Navigation

The top navigation should visually merge with the page.

### Rules

- Background should stay in the same family as the page background
- Default state should be quiet, with no obvious shadow
- Separation appears only during scroll interaction
- Use blur / frosted treatment only when the nav becomes active or floating
- Downward scroll may hide the nav
- Upward scroll should reveal it

### Avoid

- permanent heavy shadow
- white nav bar on top of a warm page background
- strong border line in resting state

## 9. Homepage and List Pages

### Overall Direction

Homepage and list pages should follow **Notion-like restraint**:

- light
- even
- modest
- content-first

### List Item Rules

- No oversized card feeling
- Covers should be modest and secondary
- Text hierarchy matters more than imagery
- Lists should feel like a publication index, not a gallery wall

### Essays Index

- Use a centered content column
- Keep item density light and readable
- Title should lead
- Summary should be readable but not dominant
- Meta line should stay quiet

### Avoid

- giant thumbnails
- thick borders
- strong hover elevation
- card-heavy SaaS grid layouts

## 10. Article Pages

### Primary Reference

Single article pages should follow **Quaily-like reading feel**:

- comfortable long-form width
- low-contrast text color
- restrained background
- clear heading hierarchy
- soft, document-like reading rhythm

### Article Header

- Title is the main focus
- Metadata should be present but visually quiet
- Avoid decorative framing around the article title block

### Paragraphs

- Paragraph text should be quiet and stable
- Avoid visually heavy text color
- Avoid over-bold paragraphs

### Headings

- `h1` and `h2` should provide strong section anchors
- Serif can be used here to create editorial tone
- Do not add ornamental separators unless they improve structure

### Images

- Images may sit on white or near-white surfaces
- Use subtle borders and moderate radius
- Spacing above and below images must be deliberate
- Multiple images should not feel randomly separated

### Blockquotes

- Minimal treatment
- No heavy left rule
- Separation should come from spacing, text color, and possibly background tint only if needed

### Code and Notes

- Must remain readable and contained
- Visual style should be calm and document-like, not terminal-themed unless content requires it

## 11. TOC and Document Structure

### Source Direction

TOC and heading navigation should borrow from **Mintlify**:

- clear heading hierarchy
- stable placement
- helpful active-state feedback
- unobtrusive styling

### Rules

- TOC should prioritize `h1` and `h2`
- Active item should be noticeable but not loud
- TOC text should remain smaller and lighter than article text
- TOC should support long documents without looking dense

### Avoid

- decorative side rails
- large boxed sidebar treatment
- overly dark active states

## 12. Components

### Borders

- Prefer thin, low-contrast borders
- Default radius should stay modest: around `8px-10px`

### Shadows

- No default visible shadow on resting surfaces
- Use shadow only to support floating interaction states

### Buttons and Tabs

- Use quiet fills or text-first treatment
- Strong fills only for clear primary actions

### Cards

- Cards are allowed only where a true contained module is needed
- Page sections themselves should not be designed as giant floating cards

## 13. Content Voice in UI

UI copy should feel:

- concise
- understated
- helpful
- not promotional

Do not use startup-marketing language in headings, empty states, or helper text.

## 14. Anti-Patterns

Do not introduce any of the following without a strong reason:

- deep blue-black body text
- serif body paragraphs
- large hero cards on content pages
- permanent nav shadows
- bright accent color as a recurring theme
- image-first list layouts
- thick dividers
- decorative left rules for quotes
- multiple visual systems on different sections of the same page

## 15. Implementation Priorities

When iterating the site, apply design work in this order:

1. typography consistency
2. text color hierarchy
3. page width and spacing rhythm
4. navigation/background integration
5. list page density
6. TOC clarity
7. component cleanup

## 16. Design Token Reference

> 可视化参考页：`http://localhost:4321/design`
> Token 定义文件：`src/layouts/Layout.astro` → `:root`

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--text-caption` | 12px | 最小标注 |
| `--text-meta` | 13px | 日期、元信息 |
| `--text-intro` | 14px | 引导文字、图片说明 |
| `--text-summary` | 16px | 摘要 |
| `--text-body` | 18px | 正文 |
| `--text-heading-3` | 19.2px | h4 |
| `--text-heading-2` | 25.6px | h3 |
| `--text-heading-1` | 30px | h1, h2 |
| `--text-title-card` | clamp(18px, 1.7vw, 22px) | 列表卡片标题 |
| `--text-title-page` | clamp(28px, 4vw, 42px) | 页面标题 |
| `--text-title-article` | clamp(34px, 4.8vw, 42px) | 文章大标题 |

| Token | Value |
|-------|-------|
| `--weight-normal` | 500 |
| `--weight-semibold` | 600 |

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-title` | 1.28 | 文章大标题 |
| `--leading-meta` | 1.4 | 元信息 |
| `--leading-heading` | 1.45 | 标题 |
| `--leading-summary` | 1.62 | 摘要 |
| `--leading-text` | 1.7 | 引导/说明 |
| `--leading-body` | 1.82 | 正文 |

### Colors

| Token | Value |
|-------|-------|
| `--color-bg` | #f7f6f2 |
| `--color-surface` | #fbfaf7 |
| `--color-surface-white` | #ffffff |
| `--color-text` | rgba(48,48,46,0.94) |
| `--color-text-heading` | rgba(20,20,19,0.99) |
| `--color-text-secondary` | rgba(94,93,89,0.82) |
| `--color-text-tertiary` | rgba(94,93,89,0.58) |
| `--color-text-inverse` | rgba(248,245,237,0.96) |
| `--color-border` | rgba(94,93,89,0.14) |
| `--color-border-strong` | rgba(94,93,89,0.22) |
| `--color-interactive` | rgba(20,20,19,0.98) |
| `--color-hover` | rgba(94,93,89,0.055) |
| `--color-pressed` | rgba(94,93,89,0.09) |
| `--color-code` | rgba(94,93,89,0.08) |
| `--color-code-block` | #181922 |
| `--color-code-block-text` | #f6f3ea |
| `--color-link` | #8f4a38 |
| `--color-link-hover` | #6f3528 |
| `--color-link-underline` | rgba(143,74,56,0.28) |
| `--color-link-underline-hover` | rgba(111,53,40,0.56) |

### Spacing (4px grid)

| Token | px |
|-------|----|
| `--space-4` | 4 |
| `--space-8` | 8 |
| `--space-12` | 12 |
| `--space-16` | 16 |
| `--space-20` | 20 |
| `--space-24` | 24 |
| `--space-28` | 28 |
| `--space-32` | 32 |
| `--space-40` | 40 |
| `--space-48` | 48 |
| `--space-56` | 56 |
| `--space-64` | 64 |
| `--space-72` | 72 |
| `--space-120` | 120 |

### Layout

| Token | Value |
|-------|-------|
| `--width-content` | 980px |
| `--width-content-narrow` | 760px |
| `--width-article` | 860px |
| `--width-toc` | 260px |
| `--size-cover-square` | 144px |
| `--size-cover-square-md` | 128px |

### Misc

| Token | Value |
|-------|-------|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 10px |
| `--radius-xl` | 12px |
| `--shadow-float` | 0 8px 24px rgba(29,31,42,0.06) |
| `--shadow-float-soft` | 0 6px 18px rgba(29,31,42,0.045) |

## 17. Definition of Done

A page is visually correct when:

- body text, headings, and metadata clearly belong to one system
- the page feels light and calm at first glance
- navigation does not visually fight the page background
- long-form reading feels stable for several screenfuls
- list pages feel like indexes, not marketing grids
- TOC helps orientation without pulling attention away from content
