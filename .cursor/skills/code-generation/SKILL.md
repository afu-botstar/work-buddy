---
name: code-generation
description: Generates code from structured inputs such as database table schemas, API definitions, OpenAPI specs, or data models. Use when the user says "代码生成", "根据表结构生成", "根据 API 生成", "数据库生成代码", or provides schema/API spec and wants corresponding code (CRUD, types, clients, migrations).
---

# 代码生成 Skill

## 触发词（Trigger Words）

- 「代码生成」「根据表结构生成」「根据 API 生成」「自动生成代码」
- 「数据库表结构」「API 定义」「OpenAPI」「Swagger」「生成 CRUD」「生成类型」

## 执行逻辑

1. **识别输入类型**：数据库表结构（SQL DDL / ORM 模型）、API 定义（OpenAPI/Swagger JSON/YAML）、接口文档、或简单数据结构描述。
2. **确认目标产物**：类型定义（TypeScript/等）、API 客户端、服务端 CRUD、迁移脚本、Mock 数据等。
3. **对齐技术栈**：项目使用的语言、框架、ORM、请求库（axios/fetch 等），生成代码需可直接放入当前项目。
4. **生成与放置**：生成代码后注明建议文件名与路径，遵循项目现有目录和命名约定。

## 创建「代码生成」类 Skill 时的要求

- description 中写清**输入**（如「数据库表结构、API 定义」）和**输出**（如「TypeScript 类型 + 请求函数」）。
- 执行逻辑包含：如何解析输入 → 如何映射到目标语言/框架 → 输出格式与目录约定。
- 若输入格式多样（如多种 SQL 方言、不同 OpenAPI 版本），在 Skill 中注明支持的格式或给出转换建议。

## 示例

- **输入**：若干张表的 CREATE TABLE。**输出**：TypeScript 类型 + 某 ORM 的 model/entity 代码。
- **输入**：OpenAPI 3.0 YAML。**输出**：API 客户端函数、请求/响应类型、可选 Mock。
- **输入**：接口文档表格（URL、方法、参数）。**输出**：类型 + fetch/axios 封装代码。
