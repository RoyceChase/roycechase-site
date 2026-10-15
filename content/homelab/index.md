---
title: "HomeLab：从设备到架构"
date: 2026-10-15
draft: true
description: "设备全景、Proxmox VE 虚拟化架构与 UPS 停机保障，交互页面仍在整理中。"
---

此页为草稿，尚未正式发布。

## 设备与架构

机械革命 iMini 以 Proxmox VE 为底层，分别承载主服务器、Clash 旁路由和 Cloudflare Tunnel 虚拟机。GL.iNet 路由器负责物理网络连接，具体网络配置与服务清单将在后续补充。

APC UPS 通过 USB 连接宿主机，由底层 Debian 上的 NUT 负责监控。UPS 状态读取和断电自动关机已完成实测。

## 展示进度

交互 MVP 已完成设备全景、四格柜、架构路径示意及节点说明，源码暂存于仓库 `docs/prototypes/homelab/`，尚未接入本页。正式发布前继续完善服务清单、网络关系和 UPS 实践文章。
