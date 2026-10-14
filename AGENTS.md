# AGENTS.md

## 项目概述

本仓库是 Royce Chase 的个人技术门户网站。

该项目不是单纯博客，而是长期维护的个人技术品牌基础设施，用于：

-   技术文章沉淀
-   架构设计展示
-   项目经验展示
-   HomeLab 与自建基础设施记录
-   求职与职业发展展示

网站定位：

> 展示一个能够设计并构建完整系统的工程师形象。

主要内容方向：

-   Java 后端工程
-   软件架构
-   工业软件
-   AI / RAG / Agent
-   HomeLab / Self-hosting

## 技术栈

### 静态站点生成器

Hugo Extended

当前版本：

Windows: Hugo 0.168.0 extended

### 主题

Blowfish

主题仓库：

https://github.com/nunocoracao/blowfish

主题目录：

themes/blowfish

主题管理方式：

Git Submodule

禁止：

-   直接复制主题源码作为项目代码
-   无必要修改 themes/blowfish 内部文件

如需调整主题，应优先通过 Hugo 配置完成。

## 仓库结构

``` text
roycechase-site/

├── archetypes/
├── assets/
├── content/
│   └── posts/
├── data/
├── i18n/
├── layouts/
├── static/
├── themes/
│   └── blowfish/
├── .gitmodules
├── hugo.toml
└── README.md
```

## 内容管理规范

文章统一存放：

``` text
content/posts/
```

推荐分类：

``` text
architecture/
java/
ai/
homelab/
engineering/
```

避免：

-   随意创建目录
-   平铺大量无分类文章
-   低价值碎片文章

## 文章编写规范

文章重点：

-   工程实践
-   架构设计
-   技术选型
-   问题分析
-   经验总结

避免：

-   简单 API 罗列
-   纯复制教程
-   无背景的代码片段

推荐结构：

``` text
背景

问题

分析

方案

实现

权衡

总结
```

## Hugo 规范

Markdown 必须包含 Front Matter。

示例：

``` yaml
---
title: "文章标题"
date: 2026-01-01
draft: false
tags:
  - architecture
---
```

草稿：

``` yaml
draft: true
```

正式发布：

``` yaml
draft: false
```

## 主题修改规范

优先级：

1.  Hugo 配置
2.  Blowfish 参数配置
3.  自定义布局
4.  自定义 CSS

禁止优先修改：

``` text
themes/blowfish/
```

原因：

该目录由 Git Submodule 管理，直接修改会增加维护成本。

## 国际化规划

未来支持：

-   中文
-   英文

暂不提前引入复杂国际化结构。

需要时再使用 Hugo i18n。

## 部署架构

目标架构：

``` text
GitHub Repository

        |

Cloudflare Pages

        |

Hugo Build

        |

roycechase.com
```

要求：

-   静态部署
-   自动构建
-   可重复发布

## CI/CD规范

未来 CI/CD 流程：

1.  拉取 GitHub 仓库
2.  初始化 Git Submodule
3.  安装 Hugo Extended
4.  执行 Hugo Build
5.  部署 Cloudflare Pages

禁止：

-   引入无必要后端服务
-   增加复杂部署链路

## 域名规划

主站：

``` text
roycechase.com
```

其他个人基础设施可继续使用子域名。

不要随意调整整体 DNS 架构。

## 开发流程

修改前：

1.  理解现有结构
2.  遵循 Hugo 规范
3.  避免引入无必要文件

修改后：

执行：

``` bash
hugo server
```

确认：

-   页面正常生成
-   无构建错误

提交规范：

``` text
feat: 新增功能

fix: 修复问题

docs: 更新文档
```

## AI Agent 工作规则

### 持久维护入口

- 开始任务时阅读 `docs/TODO.md`，了解未完成事项和后续可选方向。
- `AGENTS.md` 是统一规则入口；`.agents/skills/` 保存 OpenSpec 工作流，不另建重复的 `.agent` 规则目录。
- 正式功能或架构变更使用 OpenSpec，先读取 `openspec/config.yaml` 及相关 specs / changes，再形成提案、设计和任务。简单文案、文档或小配置修正可直接处理。
- `docs/TODO.md` 记录待办；`openspec/specs/` 记录已落地需求；`openspec/changes/` 记录进行中的变更及归档。未实施设想不得写成已完成需求。
- 完成工作后更新对应待办和变更记录，保留必要验证结果，不复制聊天流水账。不因待办存在就自动实施。
- `docs/project-context.md` 是初始规划快照；当前实现以代码、有效规格及最新验证结果为准。

Agent 修改项目时必须：

### 1. 先理解再修改

涉及以下内容时，需要先分析影响：

-   Hugo 配置
-   主题配置
-   部署流程
-   目录结构

### 2. 优先配置化

优先：

``` text
hugo.toml
config/_default/
params.toml
menus.toml
```

避免：

``` text
直接修改主题源码
```

### 3. 保持项目长期可维护

禁止：

-   临时方案
-   无意义代码
-   大量重复配置
-   生成垃圾文件

## 代码与文档生成规则

生成内容时：

-   保持格式紧凑
-   禁止无意义空格
-   禁止无效折行
-   避免过度注释
-   优先保证可维护性

Markdown：

-   标题层级清晰
-   控制空白区域
-   代码块保持简洁

## 当前状态

已完成：

-   GitHub 仓库创建
-   Hugo 初始化
-   Blowfish 集成
-   本地开发运行

当前任务：

-   配置个人门户首页
-   配置作者信息
-   配置导航菜单
-   接入 Cloudflare Pages
-   绑定自定义域名
-   发布技术内容

## 长期目标

该网站最终用于体现：

一个能够独立设计和构建复杂系统的工程师能力。

重点展示：

-   后端工程能力
-   架构设计能力
-   工业软件经验
-   基础设施能力
-   AI 工程探索
