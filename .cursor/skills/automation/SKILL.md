---
name: automation
description: Implements automation tasks such as scheduled backup, batch deployment, CI/CD steps, cron jobs, and repetitive workflow automation. Use when the user says "自动化", "定时备份", "批量部署", "定时任务", or wants to automate a recurring or batch operation.
---

# 自动化 Skill

## 触发词（Trigger Words）

- 「自动化」「定时备份」「批量部署」「定时任务」
- 「周期执行」「CI/CD」「流水线」「脚本自动化」「批量执行」

## 执行逻辑

1. **明确任务**：备份（目标、目标路径、保留策略）、部署（构建 → 推包/上传 → 重启）、或其它周期/批量操作。
2. **环境与权限**：运行环境（本地/服务器/容器）、所需权限（文件、网络、密钥）、是否需 Agent 执行或仅生成脚本。
3. **调度方式**：若为定时任务，注明推荐方式（cron、Task Scheduler、GitHub Actions 等）及示例表达式。
4. **安全与幂等**：涉及覆盖、删除或发布时，提醒确认；脚本尽量幂等，避免重复执行产生副作用。
5. **交付物**：可执行脚本 + 简短说明（如何运行、如何改定时、如何回滚）。

## 创建「自动化」类 Skill 时的要求

- description 中写清**触发词**和**自动化类型**（如「定时备份、批量部署」）。
- 执行逻辑必须包含：任务定义、执行环境、调度方式（若适用）、安全/幂等注意点。
- 脚本若依赖外部工具（如 rsync、docker、git），在 Skill 或脚本注释中列出前置依赖。

## 示例任务

- **定时备份**：指定目录 → 打包/同步到备份位置 → 按日期或数量清理旧备份；给出 cron 或 Task Scheduler 示例。
- **批量部署**：构建 → 上传到服务器/镜像仓库 → 执行远程重启或拉取；注明需配置的密钥或环境变量。
- **周期任务**：每日/每周跑某脚本（如报表、清理缓存）；给出 cron 表达式或 CI 配置片段。
