/**
 * 将大模型返回的 Markdown 文本解析为 Agent 展示块（plan / text / code / table / slide 等），
 * 使回复能使用 AgentAnswerView 中已设计的各种展示形式。
 */
import type { AgentBlock } from '../components/agent/types';

/** 从字符串中提取并解析 JSON（兼容代码块带 slides 前缀或尾逗号） */
function parseSlidesJson(raw: string): unknown {
  let str = raw.trim();
  // 去掉开头的 "slides" 或 "slide" 行（部分模型会多写一行）
  if (/^(slides?)\s*$/im.test(str.split('\n')[0] ?? '')) {
    str = str.slice(str.indexOf('\n') + 1).trim();
  }
  // 尝试直接解析
  try {
    return JSON.parse(str);
  } catch {
    // 尝试只取第一个完整 {...} 对象（兼容前后有多余文字）
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(str.slice(start, end + 1));
      } catch {
        // 尾逗号等：简单修复后再试
        const fixed = str
          .slice(start, end + 1)
          .replace(/,(\s*})/g, '$1')
          .replace(/,(\s*])/g, '$1');
        try {
          return JSON.parse(fixed);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/** 尝试将代码块内容解析为幻灯片数据，用于 PPT/幻灯片 展示 */
function tryParseSlidesFromCode(lang: string, body: string): AgentBlock | null {
  const trimmed = body.trim();
  if (!trimmed) return null;
  const data = parseSlidesJson(trimmed);
  if (!data || typeof data !== 'object' || !Array.isArray((data as { slides?: unknown }).slides))
    return null;
  const slides = (data as { slides: unknown[] }).slides
    .map((s) => {
      if (!s || typeof s !== 'object') return null;
      const t = (s as { title?: unknown }).title;
      const c = (s as { content?: unknown }).content;
      const title = typeof t === 'string' ? t : String(t ?? '').trim() || undefined;
      const content = typeof c === 'string' ? c : c != null ? String(c) : undefined;
      if (!title) return null;
      return { title, content };
    })
    .filter((s): s is { title: string; content?: string } => s !== null);
  if (slides.length === 0) return null;
  return {
    type: 'slide',
    payload: { slides },
  };
}

const CODE_BLOCK_RE = /```(\w*)\n([\s\S]*?)```/g;
const TABLE_ROW_RE = /^\|(.+)\|$/;
const TABLE_SEP_RE = /^\|[\s\-:|]+\|$/;

function parseMarkdownTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split('\n').map((s) => s.trim());
  if (lines.length < 2) return null;
  const first = lines[0];
  const second = lines[1];
  if (!TABLE_ROW_RE.test(first) || !TABLE_SEP_RE.test(second)) return null;
  const headers = first
    .slice(1, -1)
    .split('|')
    .map((c) => c.trim());
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    if (!TABLE_ROW_RE.test(lines[i])) break;
    const cells = lines[i]
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());
    if (cells.length === headers.length) rows.push(cells);
  }
  return rows.length > 0 ? { headers, rows } : null;
}

function extractTablesFromText(segment: string): { before: string; table: { headers: string[]; rows: string[][] } | null; after: string } {
  const lines = segment.split('\n');
  for (let i = 0; i < lines.length - 2; i++) {
    const slice = lines.slice(i).join('\n');
    const table = parseMarkdownTable(slice);
    if (table) {
      const tableLineCount = 2 + table.rows.length;
      const before = lines.slice(0, i).join('\n').trim();
      const after = lines.slice(i + tableLineCount).join('\n').trim();
      return { before, table, after };
    }
  }
  return { before: segment, table: null, after: '' };
}

/** 尝试从一段文本中解析出「步骤」类列表，转为 plan 块 */
function tryParsePlanSteps(segment: string): AgentBlock | null {
  const lines = segment.trim().split('\n').filter(Boolean);
  const steps: { title: string; description?: string; status: 'pending' | 'done' }[] = [];
  const stepPatterns = [
    /^(\d+)[.、．]\s*(.+)$/,
    /^[第]?([一二三四五六七八九十\d]+)[步、.]\s*(.+)$/,
    /^[-*]\s*(.+)$/,
  ];
  for (const line of lines) {
    for (const re of stepPatterns) {
      const m = line.match(re);
      if (m) {
        const title = m[2]?.trim() ?? m[1]?.trim() ?? line;
        steps.push({ title, status: 'pending' });
        break;
      }
    }
  }
  if (steps.length >= 2) {
    return {
      type: 'plan',
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      payload: { steps },
    };
  }
  return null;
}

/**
 * 将大模型返回的 content 解析为 AgentBlock 数组。
 * - Markdown 代码块 ```lang\ncode\n``` → code 块
 * - Markdown 表格 → table 块
 * - 带步骤/列表的段落可识别为 plan 块（可选）
 * - 其余为 text 块
 */
export function parseLlmResponseToBlocks(content: string): AgentBlock[] {
  if (!content?.trim()) {
    return [{ type: 'text', id: 'empty', payload: { content: '（无回复内容）' } }];
  }

  const blocks: AgentBlock[] = [];
  let remaining = content.trim();
  let index = 0;
  const genId = () => `llm-${Date.now()}-${index++}`;

  // 1) 按代码块拆分
  const parts: { type: 'code' | 'text'; lang: string; body: string }[] = [];
  let lastEnd = 0;
  let match: RegExpExecArray | null;
  CODE_BLOCK_RE.lastIndex = 0;
  while ((match = CODE_BLOCK_RE.exec(remaining)) !== null) {
    if (match.index > lastEnd) {
      parts.push({ type: 'text', lang: '', body: remaining.slice(lastEnd, match.index) });
    }
    parts.push({ type: 'code', lang: match[1] || 'text', body: match[2].trim() });
    lastEnd = match.index + match[0].length;
  }
  if (lastEnd < remaining.length) {
    parts.push({ type: 'text', lang: '', body: remaining.slice(lastEnd) });
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', lang: '', body: remaining });
  }

  for (const part of parts) {
    if (part.type === 'code') {
      const slideBlock = tryParseSlidesFromCode(part.lang, part.body);
      if (slideBlock) {
        blocks.push({ ...slideBlock, id: genId() } as AgentBlock);
      } else {
        blocks.push({
          type: 'code',
          id: genId(),
          payload: { language: part.lang || undefined, code: part.body },
        });
      }
      continue;
    }

    // 2) 文本段：先尝试拆表格，再尝试 plan，否则整段为 text
    let textSegment = part.body.trim();
    while (textSegment) {
      const { before, table, after } = extractTablesFromText(textSegment);
      if (before) {
        const plan = tryParsePlanSteps(before);
        if (plan) {
          blocks.push(plan);
        } else {
          blocks.push({ type: 'text', id: genId(), payload: { content: before } });
        }
      }
      if (table) {
        blocks.push({
          type: 'table',
          id: genId(),
          payload: { headers: table.headers, rows: table.rows },
        });
        textSegment = after;
      } else {
        break;
      }
    }
  }

  if (blocks.length === 0) {
    blocks.push({ type: 'text', id: genId(), payload: { content: remaining } });
  }

  return blocks;
}
