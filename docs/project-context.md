# RoyceChase Personal Portal 项目上下文

## 项目目标

搭建个人技术门户网站，用于：

1. 个人品牌展示
2. 求职时展示技术能力
3. 沉淀技术文章
4. 展示个人架构能力
5. 展示 HomeLab / 自建基础设施
6. 建立 GitHub + Blog + Domain 的统一入口

目标域名：

roycechase.com

定位：

个人工程师门户，而不是单纯博客。

内容方向：

- Java Backend
- Software Architecture
- Industrial Software
- AI / RAG / Agent
- HomeLab / Self-hosting
- 技术思考


---

# 当前技术选型

## Static Site Generator

Hugo

版本：

Hugo v0.168.0 extended

原因：

- Markdown 驱动
- 构建速度快
- 适合技术博客
- 支持 Cloudflare Pages
- 主题生态成熟


## Theme

Blowfish

来源：

https://github.com/nunocoracao/blowfish


引入方式：

Git Submodule

目录：

themes/blowfish


.gitmodules:

[submodule "themes/blowfish"]
path = themes/blowfish
url = https://github.com/nunocoracao/blowfish.git


---

# 当前仓库

GitHub Repository:

roycechase-site


仓库状态：

Public


目录结构：

roycechase-site/

├── archetypes/
├── assets/
├── content/
│   └── posts/
│       └── hello-world.md
├── data/
├── i18n/
├── layouts/
├── static/
├── themes/
│   └── blowfish/
├── .gitmodules
├── hugo.toml
└── README.md


---

# 已完成步骤

## 1. 创建 GitHub Repository

完成。


## 2. 安装 Hugo

Windows:

Hugo extended 0.168.0

安装路径：

D:\Environment\Hugo


PATH 已配置。


验证：

hugo version

输出：

hugo v0.168.0 extended


---

## 3. 初始化 Hugo

执行：

hugo new site . --force


成功。


---

## 4. 添加 Blowfish Theme

执行：

git submodule add https://github.com/nunocoracao/blowfish.git themes/blowfish


成功。


---

## 5. 配置主题

hugo.toml:

需要包含：

theme = "blowfish"


---

## 6. 创建测试文章

执行：

hugo new posts/hello-world.md


内容：

---
title = "Hello World"
date = "2026-10-14"
draft = false
---

这是我的第一篇文章。


---

## 7. 本地运行

执行：

hugo server


访问：

http://localhost:1313


目前已经正常显示文章。


---

# 当前页面状态

文章页：

/posts/hello-world/


显示：

RoyceChase

Hello World

这是我的第一篇文章。


说明：

Hugo + Blowfish 已经正常工作。


---

# 下一阶段目标


## Phase 1：完善 Blowfish 配置

目标：

从默认博客变成个人门户。


计划：

创建：

config/
└── _default/
├── hugo.toml
├── params.toml
└── menus.toml


配置：

- 网站标题
- 作者信息
- 导航菜单
- 社交链接
- 首页布局
- 主题颜色


---

# 首页目标设计


希望效果类似：

Royce Chase

Backend Engineer

Architecture · Industrial Software · AI · HomeLab


导航：

Home
Projects
Posts
About
GitHub


首页展示：

## Featured Projects

- RTO Sandbox
- Industrial RAG
- HomeLab


## Latest Articles

技术文章列表


## About

个人介绍


---

# 内容规划


目录：

content/posts/


建议：

architecture/

- industrial-software.md
- rto-sandbox.md
- multi-tenant-design.md


java/

- springboot-architecture.md
- distributed-system.md
- mysql-optimization.md


ai/

- rag-system.md
- agent-design.md


homelab/

- proxmox.md
- cloudflare-zero-trust.md
- self-hosting.md


---

# 后续部署目标


最终架构：

GitHub Repository

        |
        |
        v

Cloudflare Pages

        |
        |
        v

Hugo Build

        |
        |
        v

roycechase.com


发布流程：

本地修改 Markdown

↓

git commit

↓

git push

↓

Cloudflare 自动构建

↓

网站更新


---

# 域名规划


已有个人基础设施：

二级域名已经用于：

- alist
- 其他服务


博客计划：

使用主域名：

roycechase.com


不采用：

xxx.xxx.roycechase.com


原因：

Cloudflare DNS/Pages 管理不方便。


---

# 国际化规划


考虑：

国内访问：

中文版本


海外：

英文版本


Hugo 支持：

i18n


后续配置：

content/

├── posts/
│
├── zh-cn/
└── en/


暂不实施。


---

# README维护规则

README 记录：

- 初始化命令
- 部署流程
- 架构说明
- 环境要求


原则：

代码块保持紧凑。

不要生成大量无意义空行。


---

# 下一步优先级

优先级：

1. 配置 Blowfish 首页
2. 配置作者信息
3. 配置菜单
4. 打通 Cloudflare Pages CI/CD
5. 绑定 roycechase.com
6. 补充内容


当前不要：

- 修改主题源码
- 大规模 CSS 定制
- 过早写大量文章


---

# 项目定位

这是一个长期维护项目。

目标不是普通博客，而是：

个人技术品牌基础设施。

展示：

工程能力
系统设计能力
架构思维
持续学习能力