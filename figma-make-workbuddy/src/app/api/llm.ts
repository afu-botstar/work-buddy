/**
 * 大模型 API（OpenAI 兼容）
 * 支持 OpenAI、Azure、DeepSeek、通义、智谱等兼容接口
 * 部署到 Vercel 并开启 VITE_USE_LLM_PROXY 时，走服务端代理，访客无需配置
 */

const useProxy = import.meta.env.VITE_USE_LLM_PROXY === 'true';

const getConfig = () => {
  const baseURL = import.meta.env.VITE_LLM_API_BASE_URL ?? '';
  const apiKey = import.meta.env.VITE_LLM_API_KEY ?? '';
  const model = import.meta.env.VITE_LLM_MODEL ?? 'gpt-4o-mini';
  return { baseURL, apiKey, model };
};

export function isLlmConfigured(): boolean {
  if (useProxy) return true; // 代理模式下由服务端提供 Key，视为已配置
  const { baseURL, apiKey } = getConfig();
  return Boolean(baseURL?.trim() && apiKey?.trim());
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  /** 传入以支持中止当前请求（如用户点击「暂停」） */
  signal?: AbortSignal;
}

export interface ChatCompletionResult {
  content: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  if (useProxy) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        max_tokens: options.max_tokens ?? 4096,
        stream: false,
      }),
      signal: options.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? `请求失败 ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const content = data.choices?.[0]?.message?.content ?? '';
    return { content: content.trim(), usage: data.usage };
  }

  const { baseURL, apiKey, model: defaultModel } = getConfig();
  if (!baseURL?.trim() || !apiKey?.trim()) {
    throw new Error('未配置大模型：请设置 VITE_LLM_API_BASE_URL 和 VITE_LLM_API_KEY');
  }
  const isAscii = /^[\x00-\xFF]*$/.test(apiKey);
  if (!isAscii) {
    throw new Error(
      'VITE_LLM_API_KEY 中含有非 ASCII 字符（如中文），请求头不支持。请只在 .env 中填写英文/数字的 API Key，不要用中文占位符。'
    );
  }

  const base = baseURL.replace(/\/$/, '');
  const hasVersionPath = /\/v\d+$/.test(base);
  const url = hasVersionPath ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
  const body = {
    model: options.model ?? defaultModel,
    messages: options.messages,
    max_tokens: options.max_tokens ?? 4096,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`大模型请求失败 ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const content = data.choices?.[0]?.message?.content ?? '';
  return {
    content: content.trim(),
    usage: data.usage,
  };
}

/** 流式对话补全：每收到一段 content 就调用 onChunk，结束时返回完整 content（OpenAI 兼容 stream） */
export async function chatCompletionStream(
  options: ChatCompletionOptions & {
    onChunk: (delta: string) => void;
  }
): Promise<ChatCompletionResult> {
  if (useProxy) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        max_tokens: options.max_tokens ?? 4096,
        stream: true,
      }),
      signal: options.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? `请求失败 ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader) throw new Error('当前环境不支持流式响应');
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\n/);
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === 'string') {
                fullContent += delta;
                options.onChunk(delta);
              }
            } catch {
              /* 忽略单行解析错误 */
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    return { content: fullContent.trim() };
  }

  const { baseURL, apiKey, model: defaultModel } = getConfig();
  if (!baseURL?.trim() || !apiKey?.trim()) {
    throw new Error('未配置大模型：请设置 VITE_LLM_API_BASE_URL 和 VITE_LLM_API_KEY');
  }
  const isAscii = /^[\x00-\xFF]*$/.test(apiKey);
  if (!isAscii) {
    throw new Error(
      'VITE_LLM_API_KEY 中含有非 ASCII 字符（如中文），请求头不支持。请只在 .env 中填写英文/数字的 API Key，不要用中文占位符。'
    );
  }
  const base = baseURL.replace(/\/$/, '');
  const hasVersionPath = /\/v\d+$/.test(base);
  const url = hasVersionPath ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
  const body = {
    model: options.model ?? defaultModel,
    messages: options.messages,
    max_tokens: options.max_tokens ?? 4096,
    stream: true,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`大模型请求失败 ${res.status}: ${text.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('当前环境不支持流式响应');
  }

  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (typeof delta === 'string') {
              fullContent += delta;
              options.onChunk(delta);
            }
          } catch {
            // 忽略单行解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { content: fullContent.trim() };
}
