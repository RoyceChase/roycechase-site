# 项目待办

## 近期

- [x] 调整门户配色与首页样式，参考 merox 的深灰、蓝色强调和圆角导航；已验证深浅色切换、桌面 / 手机布局、搜索与键盘焦点。变更：[merox-inspired-portal-style](../openspec/changes/merox-inspired-portal-style/proposal.md)，实现完成，待归档。
- [ ] 完善个人门户首页，补充真实的 Featured Projects 和个人介绍。
- [ ] 建立 Projects / About 页面，再添加对应导航。
- [x] 接入 Cloudflare Pages Git 自动部署并绑定 roycechase.com；2026-10-15 推送文章提交 c0249cf 后，主域名与 pages.dev 新文章均返回 200，canonical 指向主域名。Hugo Extended 与子模块拉取已验证；曾发生一次子模块拉取失败，后续同提交部署成功。
- [ ] 用非 main 分支验证 Preview 部署及其 CF_PAGES_URL 构建地址；目前已验证生产分支，尚未验证预览分支条件。
- [ ] 处理 Blowfish 声明最高支持 Hugo 0.167.0、本机为 0.168.0 的兼容提示；当前基础构建已通过。
- [ ] 将 Node.js 从 20.18.0 升级到满足 OpenSpec 1.14.1 要求的版本（>=20.19.0）；目前初始化成功，但有 engine 警告。

## HomeLab：后续可选增强

- [ ] 编写 HomeLab 页面时，评估加入交互式机柜展示与动态架构图（2026-10-14 记录，暂不实施）。

参考：[merox HomeLab Tour](https://merox.dev/tour/)。借鉴展示形式，设备、配置和职责以自己的真实环境为准。

实现参考：该页面机柜主体使用 HTML + CSS 3D + JavaScript，JSON 描述设备尺寸和位置，局部细节使用 SVG。可考虑旋转视角、选中设备高亮、显示职责说明、链接相关文章及切换实物照片。

实施前整理设备清单、摆放方式、网络关系及部署服务。按需求选择 Mermaid（文章架构图）、SVG + JavaScript（交互拓扑）或 CSS 3D（立体机柜），不预先锁定技术方案。

采用项目自有 shortcode、`assets/` 和 `data/` 接入 Hugo，不修改主题子模块。优先静态托管，兼顾移动端、键盘操作与无 JavaScript 时的说明；实时监控数据接入另行评估。

## 维护方式

新想法先记入本列表；进入实施阶段的正式功能再建立 OpenSpec change，并从待办链接到该变更。完成后勾选并记录必要验证结论。
