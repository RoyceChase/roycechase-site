# Proposal

## Why

当前默认浅色个人资料布局缺少用户期望的工程师门户视觉。参考 https://merox.dev/ 和用户提供的机柜页面截图，建立深灰背景、蓝色强调与清晰排版的统一样式。

## What Changes

- 默认使用深色外观，保留手动切换浅色的能力。
- 使用白色主标题、灰色正文、蓝色链接与细边框，调整圆角导航、内容宽度和留白。
- 将首页个人资料调整为左对齐的大标题与简洁简介，保留最新文章入口。
- 将配色和通用样式应用到文章与列表页，兼顾移动端、搜索和键盘操作。
- 非目标：复制 merox 品牌、引入机柜交互组件、新增项目经历、部署或改动主题子模块。

## Capabilities

### New Capabilities

- `portal-appearance`: 个人门户的配色、排版、导航和响应式视觉行为。

### Modified Capabilities

无。

## Impact

涉及 config/_default/params.toml、项目自有 assets/css 与必要的 layouts/partials 首页扩展，以及 README。继续使用 Hugo + Blowfish，不新增运行时框架或后端依赖。
