# WorkBuddy Figma Make

## 大模型测试（接大模型跑一下）

应用支持接入 **OpenAI 兼容** 的大模型 API，在「新建任务」里发送消息后会真实请求大模型并展示回复。

### 1. 配置环境变量

复制 `.env.example` 为 `.env`，并填写你的 API 地址和 Key：

```bash
cp .env.example .env
```

编辑 `.env`：

- **VITE_LLM_API_BASE_URL**：接口根地址（不要带 `/v1/chat/completions`）
- **VITE_LLM_API_KEY**：API Key
- **VITE_LLM_MODEL**（可选）：模型名，不填则用默认

示例（OpenAI）：

```env
VITE_LLM_API_BASE_URL=https://api.openai.com
VITE_LLM_API_KEY=sk-xxx
```

其他兼容接口示例：

- DeepSeek: `VITE_LLM_API_BASE_URL=https://api.deepseek.com`
- 通义 / 智谱 / 文心 等：见各厂商「OpenAI 兼容」文档中的 base URL

### 2. 启动并测试

```bash
pnpm install
pnpm run dev
```

浏览器打开后，在首页输入框输入任意问题，回车或点击发送。若配置正确，会显示「大模型正在思考…」，随后展示模型回复；若未配置或配置错误，则展示本地多模态示例数据。

### 3. 不配置时

不配置或未填写 `.env` 时，发送消息会走**本地多模态示例**（计划、代码、表格、幻灯片、文件等），不会发起任何网络请求。

---

## 分享给他人体验（点链接即用、无需配置）

部署到 **Vercel** 后，你可得到一个公开链接；别人打开链接即可使用 AI 对话，无需配置任何 Key。

### 步骤 1：部署到 Vercel

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。
2. **Import** 你的仓库（或先 push 本仓库到 GitHub 再 Import）。
3. 若仓库根目录不是 `figma-make-workbuddy`（例如整个仓库是 work-buddy），在 Vercel 的 **Root Directory** 里填 `figma-make-workbuddy`，再继续。
4. 在 Vercel 项目 **Settings → Environment Variables** 里添加（仅服务端使用，不会暴露给访客）：
   - `LLM_API_BASE_URL`：大模型接口根地址，如 `https://api.openai.com` 或 `https://open.bigmodel.cn/api/paas/v4`
   - `LLM_API_KEY`：该服务的 API Key
   - `LLM_MODEL`（可选）：模型名，如 `gpt-4o-mini`、`glm-4-flash`
5. 保存后 **Redeploy** 一次。
6. 部署完成后，Vercel 会给你一个地址，例如：`https://xxx.vercel.app`。

### 步骤 2：分享链接

把该地址发给别人即可。对方**无需安装、无需配置**，打开链接就能和你一样使用 WorkBuddy 的 AI 能力（使用你在 Vercel 里配置的 Key，注意用量与费用）。

### 本地开发 vs 线上分享

- **本地**：继续用 `.env` 里的 `VITE_LLM_*`，不设 `VITE_USE_LLM_PROXY`，直接连大模型。
- **Vercel 部署**：项目已配置为构建时启用 `VITE_USE_LLM_PROXY`，前端请求会走本站 `/api/chat`，由服务端代理并带上你在 Vercel 配置的 Key，访客端无感知。
