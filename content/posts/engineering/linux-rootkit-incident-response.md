---
title: "Linux 应急响应实践：文件属性锁、进程复活与用户态 Rootkit"
date: 2026-10-15T00:00:00+08:00
draft: false
description: "从 Debian 主机上的异常程序出发，分析不可变文件属性、Supervisor 自动拉起和动态库预加载隐藏，并梳理可信恢复环境中的处置与验证流程。"
summary: "删不掉、杀后复活、进程不可见，可能来自不同机制。本文沿文件属性、进程托管与动态库预加载三条线索整理 Linux 应急处置过程。"
tags: [linux, security, incident-response, homelab]
categories: [engineering]
---

一台 Debian 主机上，异常程序位于 `/usr/local/sbin/update/`。常规运行环境中，root 删除文件收到 `Operation not permitted`，同时出现进程隐藏与终止后重新启动的现象。

这类问题容易被归结为“Rootkit 导致什么都做不了”，但文件删除受阻、进程复活和工具输出异常，可能分别来自不同机制。有效处置需要把这些现象拆开，找到持久化入口，再判断系统还能否被信任。

## 背景与证据边界

原始记录涉及以下线索：

| 线索 | 需要调查的方向 |
|---|---|
| `/usr/local/sbin/update/` 无法删除 | 文件属性、挂载状态、权限和安全策略 |
| 进程终止后再次出现 | Supervisor、自启动服务、定时任务 |
| 常规工具看不到预期进程 | 工具被替换、动态库预加载或其他隐藏机制 |
| `debian-update.conf` | Supervisor 托管配置 |
| `/etc/ld.so.preload.bak` 指向 `libprocesshider.so` | 预加载库线索与历史配置 |

本文根据这些记录整理处置方法，不包含完整恶意样本、哈希、内存取证或原始日志。因此，不能据此确认初始入侵途径、样本具体实现或已经彻底清除。

尤其要区分：基于动态链接库预加载的隐藏属于**用户态 Rootkit**。文件上的不可变属性由内核和文件系统执行，也不等于存在恶意内核模块。现有线索不足以将本事件定性为内核态 Rootkit。

## 分析：三种机制如何叠加

### 文件属性锁：为什么 root 也删不掉

`chattr` 管理的是文件系统属性，不应与 `getfattr` 管理的扩展属性键值混为一谈。

`i` 表示不可变，`a` 表示仅可追加。即使是 root，修改或删除受限制的文件前，也通常需要先解除相关属性；修改这些标记需要相应能力，且支持情况取决于文件系统。[chattr 手册](https://man7.org/linux/man-pages/man1/chattr.1.html)

因此，`Operation not permitted` 是排查入口，不能单凭这条错误确认 Rootkit。还需要检查只读挂载、安全策略和容器能力限制。

### 进程托管：为什么杀掉后又出现

Supervisor 的 `autostart=true` 表示随 Supervisor 启动程序，`autorestart=true` 表示程序从运行状态退出后自动重启；启动失败还涉及 `startsecs`、`startretries` 等参数。[Supervisor 配置文档](https://supervisord.org/configuration.html)

这可以解释复活现象，却不能证明程序每次启动都执行了 `chattr +i`。后者需要脚本、样本或运行轨迹支持。清理时应同时处理运行实体和已确认的托管入口。

### 动态库预加载：为什么工具输出可能不可信

动态链接程序可以受预加载库影响。`/etc/ld.so.preload` 是系统级预加载配置，而 `LD_PRELOAD` 是环境变量入口；静态链接程序不按同样方式加载这些共享库。[动态链接器手册](https://man7.org/linux/man-pages/man8/ld.so.8.html)

劫持目录遍历等函数，是用户态隐藏的一种可能实现，但仅凭 `libprocesshider.so` 文件名不能确认它具体拦截了什么。需要分析样本或使用可信工具交叉验证。

`.bak` 文件本身不是标准动态链接器自动读取的预加载入口。发现备份指向可疑库后，必须继续检查实际的 `/etc/ld.so.preload`，不能只删除备份便认定加载链已切断。

## 方案：先恢复可信观察，再移除持久化

处置顺序应是：隔离主机、保存证据、进入可信恢复环境、处理持久化、验证恢复。不要为了尽快删除文件，先丢失判断入侵范围所需的线索。

对于已经取得高权限的入侵，即使已删除已知组件，也应评估使用可信镜像重建系统，并从干净终端轮换可能暴露的凭据。就地清理更适合作为止血和分析步骤，而不是恢复可信度的唯一依据。

### 1. 隔离并保存证据

通过虚拟化平台、交换机或上游防火墙限制异常网络通信，保留必要的管理通道。记录发现时间、异常路径、服务配置、网络连接及已执行命令；条件允许时保存磁盘快照和内存证据。

重启会丢失易失性证据。需要内存取证时，应在重启前完成相应工作。样本与配置应隔离保存，分析副本而非在生产主机执行样本。

### 2. 选择恢复环境

原始处置方式是在 GRUB 菜单按 `e`，在内核启动行末添加：

```text
init=/bin/bash
```

再按 `Ctrl+X` 或 `F10` 启动。这通常能避免正常的用户态服务启动链，但具体效果取决于引导流程和 initramfs。

它**不会自动清除 `/etc/ld.so.preload`，也不能保证所运行的 Bash 和磁盘工具可信**。怀疑用户态工具被劫持时，更可靠的方式是使用可信救援介质启动，或将磁盘挂载到隔离分析主机，先以只读方式检查。

下文命令示例均假定：使用可信工具，目标系统根分区已挂载到 `/mnt/target`，并已完成必要的证据保存。写入前应确认挂载的是目标磁盘，再将对应挂载切换为读写；分离的 `/usr` 等分区也需按实际布局处理。

### 3. 检查并解除已确认恶意文件的属性

```bash
lsattr -d /mnt/target/usr/local/sbin/update
lsattr /mnt/target/usr/local/sbin/update/
```

确认路径和证据副本后，再处理属性与文件：

```bash
chattr -R -ia /mnt/target/usr/local/sbin/update
rm -rf -- /mnt/target/usr/local/sbin/update
```

这些路径来自本次记录，不应把路径名称当作通用恶意指标。递归删除前应确认目录不是符号链接或指向非预期挂载内容，并根据现场属性检查结果决定操作范围。

### 4. 切断 Supervisor 托管入口

```bash
ls -la /mnt/target/etc/supervisor/conf.d/
cat /mnt/target/etc/supervisor/conf.d/debian-update.conf
```

核对 `command`、运行用户、工作目录、自动启动与重启配置。保存证据并确认其恶意用途后，解除文件属性并移除该配置：

```bash
chattr -ia /mnt/target/etc/supervisor/conf.d/debian-update.conf
rm -f -- /mnt/target/etc/supervisor/conf.d/debian-update.conf
```

不要为了消除警告而删除其他合法服务配置。Supervisor 没有匹配到任何配置文件，也不能作为清除成功的充分证据。

### 5. 清理实际预加载入口与可疑库

```bash
cat /mnt/target/etc/ld.so.preload
cat /mnt/target/etc/ld.so.preload.bak
lsattr /mnt/target/etc/ld.so.preload
lsattr /mnt/target/usr/local/lib/libprocesshider.so
```

文件不存在时记录检查结果即可。若实际预加载文件包含可疑库，先保存副本，再解除必要的属性并编辑配置，只移除已确认恶意的条目，保留合法配置。

确认没有其他加载入口后，再移除已保存证据的可疑库：

```bash
chattr -ia /mnt/target/usr/local/lib/libprocesshider.so
rm -f -- /mnt/target/usr/local/lib/libprocesshider.so
```

备份文件可以在取证后按需处理，但删除 `.bak` 不会替代对真实加载入口的清理。还应检查服务环境中的 `LD_PRELOAD` 和启动脚本。

### 6. 审计其他持久化入口

```bash
grep -rFn -- '/usr/local/sbin/update' /mnt/target/etc/
grep -rFn -- 'libprocesshider.so' /mnt/target/etc/
```

路径引用检索只是起点，还需要检查 systemd unit 与 timer、cron、启动脚本、SSH 授权密钥、新增账户及其他可疑二进制。不要把扫描范围限制为 `/etc`，也不要认为“没有字符串匹配”就表示没有持久化。

### 7. 同步写入并正常退出恢复环境

使用救援系统时，优先按照该环境的正常流程同步、卸载目标分区并重启。

原始笔记中的 SysRq `b` 会立即重启，不执行同步或卸载；它不应作为常规收尾方式。SysRq `s` 和 `u` 分别涉及同步与只读重新挂载，也需要确认完成后才考虑后续操作。[Linux 内核 SysRq 文档](https://docs.kernel.org/admin-guide/sysrq.html)

## 验证：停止异常不等于恢复可信

系统恢复启动后，组合检查服务、进程、网络和文件状态：

```bash
systemctl status supervisor
journalctl -u supervisor --since today
ps -ef
ss -lntup
ss -antp
```

单一的 `ps | grep` 结果不能排除隐藏；没有异常 TCP 连接也不能覆盖 UDP、短时连接或离线持久化。Docker 代理等看似正常的进程同样需要结合监听端口和服务归属判断。

最终应回答：已知入口是否移除，是否还会重新创建，系统文件是否被改写，初始入侵途径是否关闭，以及还有哪些证据不足。若无法建立可信基线，应转向重建。

凭据处理也不能局限于修改 root 密码。应从干净终端核查 SSH 密钥，并按暴露范围轮换服务账户、部署令牌、数据库及云平台凭据；只移除确认未授权的访问项，避免误删合法管理通道。

## 权衡与总结

就地清理能够帮助快速止血，也能揭示文件保护、托管复活和用户态隐藏如何配合；代价是难以仅凭已知指标证明系统完全恢复可信。可信恢复环境与重新部署能够提供更清晰的信任边界，但也需要备份、重建能力和业务恢复计划。

本次记录的核心经验，是把“删不掉、杀后复活、看不到”拆成三个独立问题：从文件属性解释删除限制，从服务配置追踪复活来源，从预加载链审视工具可信度。清理已知组件后，还要用恢复验证、入侵入口修复和凭据轮换完成闭环。
