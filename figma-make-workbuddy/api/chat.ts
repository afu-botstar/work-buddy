/**
 * Vercel Serverless：大模型请求代理
 * 将 Key 和 Base URL 放在服务端，访客无需配置即可体验
 */

const baseURL = process.env.LLM_API_BASE_URL ?? '';
const apiKey = process.env.LLM_API_KEY ?? '';
const defaultModel = process.env.LLM_MODEL ?? 'gpt-4o-mini';

function notConfigured(res: { status: (n: number) => { json: (o: object) => void } }) {
  res.status(503).json({ error: '未在服务端配置 LLM_API_BASE_URL / LLM_API_KEY' });
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (o: object) => void; write: (chunk: Uint8Array) => void; end: () => void }; write: (chunk: Uint8Array) => void; end: () => void }
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!baseURL?.trim() || !apiKey?.trim()) {
    return notConfigured(res);
  }

  const body = req.body as { model?: string; messages?: unknown[]; max_tokens?: number; stream?: boolean };
  const stream = Boolean(body?.stream);

  const base = baseURL.replace(/\/$/, '');
  const hasVersionPath = /\/v\d+$/.test(base);
  const url = hasVersionPath ? `${base}/chat/completions` : `${base}/v1/chat/completions`;

  const payload = {
    model: body?.model ?? defaultModel,
    messages: body?.messages ?? [],
    max_tokens: body?.max_tokens ?? 4096,
    stream,
  };

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      // @ts-expect-error Node 18+ supports signal
      signal: req.socket ? AbortSignal.timeout(60000) : undefined,
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({ error: text.slice(0, 500) });
      return;
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (upstream.body) {
        await pipeStream(upstream.body, res);
      } else {
        res.end();
      }
      return;
    }

    const data = await upstream.json();
    res.status(200).json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: msg });
  }
}

async function pipeStream(
  readStream: ReadableStream<Uint8Array>,
  res: { write: (chunk: Uint8Array) => void; end: () => void }
): Promise<void> {
  const reader = readStream.getReader();
  const encoder = new TextEncoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    reader.releaseLock();
  }
  res.end();
}
