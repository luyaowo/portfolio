# 发布规则（版本号 / CHANGELOG / Release）

个人站点的版本管理，按「攒一批再发」的节奏走。规则从 2026-09 建立 v1.2.0 时沉淀出来。

## 1. 什么时候发版

一个板块或一轮改版完成时发一版。不按次发（推送即发会让版本号虚涨），也不强制按月。

标志性事件举例：新栏目上线、一批作品案例补齐、首页/导航大改。

## 2. 版本号规则

- **单一来源**：`package.json` 的 `version` = git tag = GitHub Release，三处必须一致
- **格式**：`vMAJOR.MINOR.PATCH`（tag 带 `v` 前缀，`package.json` 不带）
- **bump 级别**：
  | 级别 | 触发 |
  |---|---|
  | minor | 新增栏目、成批新增内容、大改版 |
  | patch | 修 bug、文案与小样式调整 |
  | major | 架构级重做（换框架、换 CMS 等） |
- 历史遗留：`v1.1` 是两段式写法，**原样保留不动**；从 v1.2.0 起统一三段式

## 3. 发版步骤

```bash
# 1. 确认改动都已提交，工作区干净
git status

# 2. 改 package.json 的 version
# 3. 在 CHANGELOG.md 顶部加一段（格式见下）
# 4. 提交
git add package.json CHANGELOG.md
git commit -m "release: v1.2.0"

# 5. 打 annotated tag，message 用 CHANGELOG 里这一版的内容
git tag -a v1.2.0 -F <说明文件>

# 6. 推送 —— 由用户用 GitHub Desktop 完成，不代劳
# 7. 推送后建 GitHub Release
gh release create v1.2.0 --title "v1.2.0" --notes-file <说明文件>
```

**CHANGELOG 段落格式**（只保留有内容的小节）：

```markdown
## [1.2.0] - 2026-09-16

### 新增
### 改进
### 调整
```

条目**人工归纳**，不要用脚本按提交信息自动分类——提交信息是自由中文，没有 conventional 前缀，分类会错。写的时候对照 `git log <上个tag>..HEAD --format='%ad %s' --date=short` 和 `git diff <上个tag>..HEAD --shortstat`。

## 4. 边界

- **推送由用户自己来**（GitHub Desktop），Vercel 自动部署
- 若 GitHub Desktop 没把 tag 推上去（`gh api repos/luyaowo/portfolio/tags` 查不到），用 `gh release create v1.2.0 --target <sha>` 让 gh 在远端补建；注意这会和本地 tag 不一致，补建后需对齐
- 不补造没有依据的历史 tag
- 不在 tag/Release 里写未发生的计划

## 5. 环境备忘

命令行 git 依赖 `/Library/Developer/CommandLineTools`。若 Xcode 升级后 `git` 报
"You have not agreed to the Xcode license agreements"，说明 `xcode-select` 指向了未同意协议的 Xcode：

```bash
sudo xcode-select -s /Library/Developer/CommandLineTools   # 切到 CLT，立即恢复
```

CLT 自带 git（2.50.1）和 clang，不受 Xcode 许可影响。切回 Xcode 用
`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`。

## 6. 已发布版本

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.2.0 | 2026-09-16 | design-study 新栏目、work 板块重构、首页与导航改版、留言板回复与表情反馈、私有统计页 |
| v1.1 | 2026-06-12 | 设计 Token 体系、DESIGN.md、AGENTS.md、Keystatic 后台 |
