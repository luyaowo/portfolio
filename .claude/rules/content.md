# 内容规则（src/content/ 目录）

## frontmatter 规范

- **Essays** (`src/content/essays/<slug>/index.md`)：保留 `title`, `date`, `summary`, `cover` 字段
- **Notes** (`src/content/notes/YYYY-MM-DD.md`)：保留 `title`, `date`
- **AI Design** (`src/content/ai-design/<slug>/index.md`)：同 Essays
- **Work** (`src/content/work/<slug>/index.md`)：额外需要 `metaLeft`, `metaRight`, `summary`, `cover`

## 操作规则

- 不改已有文章的正文内容，只新增或按要求修改
- 新文章命名：Essays 用有意义的 slug，Notes 用日期格式
- 图片放在对应文章文件夹内，文中用 `![alt](filename.jpg)` 引用
- Markdoc 用 `.md` 扩展名，不是 `.mdoc`
