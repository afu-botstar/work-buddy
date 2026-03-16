---
name: file-processing
description: Handles file operations such as batch rename, format conversion, encoding detection, and bulk file edits. Use when the user mentions "文件处理", "批量重命名", "格式转换", "批量处理文件", or needs to transform, rename, or convert multiple files.
---

# 文件处理 Skill

## 触发词（Trigger Words）

- 「文件处理」「批量重命名」「格式转换」「批量处理」
- 「重命名文件」「改扩展名」「编码转换」「合并/拆分文件」
- 「帮我开发一个文件处理 Skill」「文件批量操作」

## 执行逻辑

1. **确认操作类型**：重命名（规则：前缀/后缀/正则）、格式转换（如 md→html、csv→json）、编码（如 UTF-8/GBK）、或批量查找替换。
2. **确认范围**：目标目录、文件通配符（如 `**/*.md`）、是否递归、是否排除某些目录。
3. **安全优先**：涉及覆盖或删除时，先列出将受影响文件，再执行；必要时提供「预览」或 `--dry-run`。
4. **实现方式**：优先用项目已有脚本或系统命令（如 Node 脚本、PowerShell）；跨平台时注明 Windows/macOS/Linux 差异。

## 创建「文件处理」类 Skill 时的要求

- 在 description 中写清**触发词**和**支持的能力**（如「批量重命名、格式转换」）。
- 执行逻辑中必须包含：操作类型、目标路径/通配符、是否可预览、是否可回滚或备份建议。
- 涉及正则或命名规则时，给出 1～2 个具体示例。

## 示例能力

- 批量重命名：按序号、日期、正则替换命名。
- 格式转换：Markdown → HTML、CSV → JSON、图片格式转换（若环境允许）。
- 编码：检测并转换为指定编码。
- 批量内容替换：在多文件中查找替换文本（注明备份建议）。
