# Personal Technical Portal Technology Selection Notes

## 1. 项目背景与目标

### 1.1 起因

随着个人技术积累增加，GitHub 中逐渐沉淀了多个项目：

-   工业软件相关项目
-   AI / RAG 实验项目
-   HomeLab 基础设施
-   Java 后端技术实践

但是单独的代码仓库无法完整表达：

-   为什么这样设计
-   架构思考过程
-   技术决策过程
-   长期技术路线

因此需要建设一个个人技术门户。

### 1.2 目的

该项目不是单纯博客，而是个人技术品牌基础设施。

目标：

-   展示个人工程能力
-   沉淀技术文章
-   展示架构设计能力
-   连接 GitHub 项目
-   支撑求职和技术交流

最终形成：

GitHub（代码资产） + Blog（思想沉淀） + Domain（个人入口）

------------------------------------------------------------------------

# 2. 当前技术选型

## 2.1 总体架构

``` text
Developer

   |
   |

GitHub Repository

   |
   |

Hugo Build

   |
   |

Cloudflare Pages

   |
   |

roycechase.com
```

## 2.2 技术栈

### 静态站点生成器

Hugo Extended

作用：

-   Markdown 转 HTML
-   静态页面生成
-   快速构建
-   适合 CDN 部署

### Theme

Blowfish

作用：

-   提供网站展示层
-   提供博客布局
-   提供首页、文章页、菜单等能力

管理方式：

Git Submodule

目录：

``` text
themes/blowfish
```

### 部署

Cloudflare Pages

作用：

-   自动构建
-   CDN 加速
-   HTTPS
-   域名绑定

------------------------------------------------------------------------

# 3. Hugo 使用模型

## 3.1 核心思想

Hugo 将内容和展示分离。

结构：

``` text
Content Layer

Markdown文章

        +

Theme Layer

页面模板

        +

Config Layer

网站配置

        |

        v

Static HTML
```

------------------------------------------------------------------------

# 4. Hugo目录说明

## archetypes

文章模板。

例如：

``` text
archetypes/default.md
```

用于生成文章默认结构。

## content

核心内容目录。

存放：

-   博客文章
-   页面内容

例如：

``` text
content/posts/java.md
```

## assets

资源处理目录。

用于：

-   CSS
-   JS
-   图片处理

## static

静态资源。

例如：

``` text
static/images/avatar.png
```

生成后直接复制。

## layouts

自定义页面模板。

用于覆盖主题。

优先级：

项目 layouts

theme layouts

## themes

主题目录。

当前：

``` text
themes/blowfish
```

不要直接修改。

原因：

主题作为外部依赖维护。

## hugo.toml

核心配置。

包含：

-   网站名称
-   域名
-   语言
-   主题

## config

推荐后期拆分配置：

``` text
config/

_default/

hugo.toml

params.toml

menus.toml
```

用于：

-   参数配置
-   菜单配置
-   多语言配置

------------------------------------------------------------------------

# 5. Hugo 日常使用

## 创建文章

方式一：

``` bash
hugo new posts/article.md
```

自动生成 Front Matter。

方式二：

直接创建 Markdown。

推荐：

复杂长期维护项目使用直接创建。

## 本地运行

``` bash
hugo server
```

访问：

``` text
http://localhost:1313
```

## 发布流程

``` text
修改 Markdown

↓

git commit

↓

git push

↓

Cloudflare Pages Build

↓

网站更新
```

------------------------------------------------------------------------

# 6. Hugo扩展方式

## 6.1 配置扩展

优先：

``` text
hugo.toml

params.toml

menus.toml
```

## 6.2 页面扩展

通过：

``` text
layouts/
```

覆盖主题模板。

## 6.3 内容扩展

通过：

``` text
content/
```

增加：

-   项目页面
-   技术文章
-   文档

## 6.4 组件扩展

使用：

Shortcodes

例如：

-   架构图
-   Mermaid
-   自定义卡片

------------------------------------------------------------------------

# 7. Astro技术选型分析

## 7.1 Astro定位

Astro也是静态网站生成方案。

但是更偏：

现代前端组件化网站。

架构：

``` text
Markdown / MDX

+

Astro Components

+

React/Vue/Svelte

|

HTML
```

------------------------------------------------------------------------

# 8. Hugo与Astro对比

  方向       Hugo   Astro
  ---------- ------ -------
  博客       强     强
  个人主页   强     更强
  组件化     一般   优秀
  前端扩展   弱     强
  学习成本   低     中
  稳定性     优秀   优秀
  交互能力   一般   优秀

------------------------------------------------------------------------

# 9. Astro适合什么场景

未来如果个人门户需要：

-   交互式架构图
-   在线工具
-   AI Chat入口
-   动态项目展示
-   React组件

Astro优势明显。

例如：

``` text
项目卡片组件

架构图组件

技术雷达图

在线Demo
```

------------------------------------------------------------------------

# 10. 当前阶段为什么继续使用Hugo

当前目标：

先建立个人技术资产。

重点：

-   上线
-   内容沉淀
-   GitHub关联
-   域名建立

目前不需要：

-   复杂交互
-   前端应用能力

因此：

Hugo成本最低，收益最高。

------------------------------------------------------------------------

# 11. 未来拓展路径

## Phase 1

Hugo个人门户：

``` text
Blog

Projects

About

HomeLab
```

目标：

建立个人品牌。

## Phase 2

增强Hugo：

增加：

-   Mermaid
-   架构图
-   项目展示
-   多语言

## Phase 3

引入前端能力：

根据需求：

-   Astro
-   React
-   Vue

## Phase 4

演进：

``` text
Astro

+

React Components

+

AI Agent

+

在线工具
```

------------------------------------------------------------------------

# 12. Hugo迁移Astro方案

迁移不是重写。

因为核心资产：

Markdown内容。

迁移：

## 保留：

``` text
content/*.md
images
documents
```

## 替换：

``` text
Hugo Theme

↓

Astro Components
```

流程：

``` text
Markdown Content

↓

Astro Content Layer

↓

Astro Components

↓

Static Build

↓

Cloudflare Pages
```

Cloudflare部署方式基本保持不变。

------------------------------------------------------------------------

# 13. 长期技术路线

当前：

Hugo负责内容和展示。

未来：

如果需求增加：

Astro负责复杂展示。

最终：

``` text
Markdown

        |

Content System

        |

Astro/Hugo

        |

Cloudflare

        |

roycechase.com
```

核心资产始终是：

内容、项目、架构思想。

技术框架只是展示层实现。
