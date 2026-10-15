## Why

三个独立设备模型尚不能表达整体 HomeLab。需要可查看的 MVP 验证设备入口、统一陈列和架构阅读流程。

## What Changes

- 在独立原型目录新增统一双层架子场景，保留三个模型外形。
- 实现设备摘要、架构入口、部署/入站/出站/供电视图与节点说明。
- 支持章节直达、返回、移动端和键盘操作。
- 本次不接入正式导航、不发布文章、不部署、不增加实时监控。

## Capabilities

### New Capabilities

- `homelab-tour`: 统一设备全景与架构工作区原型。

### Modified Capabilities

无。

## Impact

新增 docs/prototypes/homelab，复用现有原型源码生成隔离组件，更新待办。保持 Hugo 和主题代码不变。
