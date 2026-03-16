---
name: design-optimization
description: Guides the agent to create or apply design-optimization Skills with clear trigger words and execution logic. Use when the user asks to create a "设计优化" skill, describes UI/UX optimization, design system refinement, or wants to define trigger phrases and steps for design-related workflows.
---

# 设计优化 Skill

## 触发词（Trigger Words）

当用户提到以下任一表述时应用本类 Skill 或创建对应子 Skill：

- 「设计优化」「优化设计」「UI 优化」「UX 优化」
- 「设计规范」「设计系统」「组件样式统一」
- 「帮我创建一个设计相关的 Skill」「设计类 Skill」

## 执行逻辑

1. **确认范围**：明确用户要优化的是界面布局、配色、组件一致性、可访问性，还是设计文档/规范。
2. **收集约束**：项目技术栈（如 React、Tailwind）、现有设计 token、是否已有设计稿（Figma 等）。
3. **输出物**：给出具体修改建议或代码（组件、样式、CSS 变量等），并注明可复用的触发词与步骤，便于沉淀为独立 Skill。

## 创建「设计优化」类 Skill 时的要求

- 在 SKILL.md 的 `description` 中写清**触发词**（用户说什么时会用到）。
- 在正文中写清**执行逻辑**（步骤 1、2、3…），避免模糊描述。
- 若涉及项目内文件，使用相对路径（如 `src/styles/theme.css`），勿用 Windows 反斜杠路径。

## 示例

**用户**：「帮我创建一个 Skill，功能是：根据当前项目的 theme.css 自动建议对比度合格的文字颜色。」  
**Agent**：创建 SKILL.md，description 含触发词「对比度」「可访问性」「文字颜色」，正文为「读取 theme.css → 解析前景/背景色 → 用 WCAG 公式计算对比度 → 输出建议色值」等步骤。
