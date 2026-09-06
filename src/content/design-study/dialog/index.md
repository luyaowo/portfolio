---
title: Material You-Dialog
date: 2023-05-11
summary: 弹窗体系的完整整理——弹窗构成、模态/非模态分类、Dialog/Sheet/Popover/Toast 各类型与设计规范。
cover: cover.webp
---

![Material You Dialog 封面](cover.webp)

我们日常说的弹窗是一个很笼统的概念,所有对话框、浮层、弹框等都在广义上都可以统称为弹窗,又称弹出层,由于弹窗种类较多,并且在不同设计规范中给予了不同称号和交互方式,在实际使用过程中容易造成混乱,故在此分析和总结不同弹窗使用场景和设计规范

## 1. 弹窗总览

### 1.1 弹窗构成

弹窗的定义是什么?

弹窗是给予用户反馈、提示和引导的一种设计组件。当触发某项操作时,在页面上方展示的弹出层容器,容器内可展示文本、按钮、列表、标签、表单项等内容,英文对其统称 Popup。

### 1.2 弹窗分类

弹窗可以从两个维度分类

- 用户是否可以与页面的其余部分进行交互——模态/非模态
  - 模态:当模态框可见时,无法单击任何位置或滚动页面,必须进行操作
  - 非模态:在弹窗覆盖的情况下,用户仍然可以与背景内容进行交互
  - 模态覆盖禁用所有背景内容,非模态覆盖保留用户与背景内容交互的能力
- 背景是否变暗/有遮罩
  - 背景变暗,有遮罩
  - 背景不变

![弹窗分类维度](popup-dimension.gif)

> 图源自 NNGROUP

#### 模态

#### 非模态

![非模态弹窗](popup-nonmodal-1.gif)

![非模态弹窗示例](popup-nonmodal-2.gif)

![非模态弹窗示例二](popup-nonmodal-3.webp)

### 1.3 弹窗样式

弹出层从位置上,可以从屏幕上、下、左、右以及中间或者任意位置出现

这种样式又被规范平台用作各种形式的弹出层,"Alert、Dialog、Sheet、Popover…"等等。

在 iOS Human Interface 和 Material design 中,将弹出层分别分为如图所示部分,同时的,相同的功能和样式在不同平台具有不同称谓。

![iOS 15 与 Material design 2 对比](dialog-spec-ios-md.webp)

> iOS 15 和 Material design 2

将上述设计系统的内容整合并与实践经验结合后,根据 Material design 3 文档整合了上述名称

## 2. Dialog 对话框(狭义上弹窗)

对话框可以要求执行操作、传达信息或帮助用户完成任务。分为 Basic dialog 和 Full screen dialog

### 2.1 Basic dialog 基础对话框-模态

#### 2.1.1 规范中的样式

(合并了 iOS 的 Alerts 和 Android 的 Alert dialog / Simple dialog / Confirmation dialog 的概念)

![基础对话框规范之一](basic-dialog-1.webp)

![基础对话框规范之二](basic-dialog-2.webp)

![基础对话框规范之三](basic-dialog-3.webp)

#### 2.1.2 基础对话框结构

![基础对话框结构](basic-dialog-structure.webp)

#### 2.1.3 基础对话框使用场景

- 通知用户设备相关问题如:电池、网络等
- APP 相关问题如:更新、权限、运营活动、引导等(被动)

![被动场景](basic-dialog-app.webp)

- 用户操作反馈如:破坏性操作、强调、操作反馈等(主动)

![主动场景](basic-dialog-feedback.webp)

#### 2.1.4 基础对话框注意事项-设计规范

- 位于屏幕中心,告知用户特定任务和重要信息,并进行操作反馈
- 优点:警示性最高,沉浸感强,任务或信息聚焦
- 缺点:中断性操作影响用户体验,尽量慎重使用

![注意事项](basic-dialog-notes.webp)

### 2.2 Full-screen dialog 全屏对话框-模态

(合并了 iOS 的 Fullscreen view 和 Android 的 Fullscreen dialog)

全屏对话框将一系列任务组合在一起,例如创建一个事件(包含标题、日期、时间、地点、人物等),因为它占据了整个屏幕,所以是唯一可以显示其他对话框的对话框。

![全屏对话框](fullscreen-dialog.webp)

## 3. Sheet

必须经用户操作后触发的一种特定的模态弹框,非狭义上的弹窗

与 dialog 的区别

- 共同点:均为模态,并且可承载表单、列表等组件
- 不同点:Dialog 可以不经过用户操作而触发,Sheet 必须经过用户操作后才可触发显示,Dialog 比 Sheet 层级高

(合并了 iOS 的 Action sheet / Activity sheet 和 Android 的 Bottom sheet / Side sheet 的概念)

所有 sheet 布局有【列表式布局】和【网格式布局】两种样式

![Sheet 布局](sheet-layout.webp)

### 3.1 Action sheet 和 Activity sheet (iOS)-模态

用于当前对象的多个操作或者完成任务的多个选择或者操作二次确认

#### 3.1.1 Action sheet 和 Activity sheet 样式

![Action sheet 样式](action-sheet-style.webp)

#### 3.1.2 Action sheet 和 Activity sheet -设计规范

![Action sheet 设计规范](action-sheet-spec.webp)

### 3.2 Bottom sheet (Android)-模态/非模态

#### 3.2.1 Bottom sheet 类别

在 MD 3 规范中,Bottom sheet 分为两种,Standard bottom sheet 和 Modal bottom sheet,其实就是模态底板和非模态底板

> 图源自 Material design 3

#### 3.2.2 Bottom sheet 结构

![Bottom sheet 结构之一](bottom-sheet-structure-1.webp)

![Bottom sheet 结构之二](bottom-sheet-structure-2.webp)

![Bottom sheet 结构之三](bottom-sheet-structure-3.gif)

> 图源自 Material design 3

#### 3.2.3 Standard bottom sheet 基础底部面板(非模态)

基础底部面板与屏幕的主 UI 区域共存,并允许同时查看两个区域并与之交互。当主 UI 区域中的内容滚动或平移时,它们通常用于在屏幕上保持功能或辅助内容可见。

![基础底部面板](bottom-sheet-standard-1.webp)

![基础底部面板示例](bottom-sheet-standard-2.gif)

在 iOS 新的设计规范中,增加了非模态 sheet 概念,其定义为执行与其当前内容相关的任务。可以在非模态的 sheet 中编辑父视图内容,或者编辑父视图内容而 sheet 不受影响。

![iOS 非模态 sheet](bottom-sheet-ios.gif)

#### 3.2.4 Standard bottom sheet 设计注意事项

暂无,在特殊情况下使用

![注意事项](bottom-sheet-notes.webp)

#### 3.2.5 Modal bottom sheet

模态底部面板,有列表式和网格式结构,与 Action sheet 和 Activity sheet 无较大差异。

参考 3.1.2

#### 3.2.6 Modal bottom sheet 注意事项

![模态底部面板注意事项](modal-bottom-notes-1.webp)

![模态底部面板注意事项示例](modal-bottom-notes-2.gif)

### 3.3 Side sheet-模态/非模态

补充更多信息或者提供更多信息(模态/非模态,类似 Bottom sheet 分类)

![Side sheet 分类](side-sheet-kinds.webp)

#### 3.3.1 Standard side sheet 基础侧边面板(非模态)

用于 PC 端,不多赘述

![基础侧边面板](side-sheet-standard.webp)

#### 3.3.2 Modal side sheet 模态侧边面板

![模态侧边面板](side-sheet-modal.webp)

## 4. Popover 气泡弹窗

Popover 是用户进行交互后,常见的下拉菜单和下拉弹窗样式。

![Popover](popover.webp)

## 5. Toast/HUD 轻提示-非模态

常用于反馈结果,具有实效性

![Toast 轻提示](toast.webp)

### 关于弹窗

- [弹层组件设计(优设网)](https://www.uisdc.com/pop-up-layer-component)
- [APP 弹窗归纳(优设网)](https://www.uisdc.com/app-ummary-of-the-popup)
- [Sheet 设计(优设网)](https://www.uisdc.com/sheet-design)
- [模态与非模态设计(知乎)](https://zhuanlan.zhihu.com/p/48967877)

### 关于模态和非模态

- [Popups(NNGROUP)](https://www.nngroup.com/articles/popups/)
- 非模态并不以时限性为唯一要点
- 复杂任务的表单信息填写、内容筛选、搜索和内容展示
- 如新建邮件、文章博客动态发表、登录注册等
