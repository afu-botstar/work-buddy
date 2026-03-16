import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Infinity, Zap, Plus, ArrowUp, Loader2, AlertCircle, Square, Copy, Check } from 'lucide-react';
import { AgentRenderer } from './agent/AgentRenderer';
import { buildAgentSystemPrompt } from './agent/agentPrompt';
import type { AgentBlock, SlideBlockPayload } from './agent/types';
import { SlidePreviewPage } from './SlidePreviewPage';
import { isLlmConfigured, chatCompletion, chatCompletionStream } from '../api/llm';
import { parseLlmResponseToBlocks } from '../utils/parseLlmResponseToBlocks';

function CraftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 4.5V3C1.5 2.45 1.95 2 2.5 2H5.5L7 4H13.5C14.05 4 14.5 4.45 14.5 5V5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="1.5" y="4" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M4.5 7.5L6.5 9.25L4.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AVATAR_CAT = '/avatar-cat.png';
const AVATAR_CLAWCAT = '/avatar-clawcat.png';

/** 加载中时展示的拆解计划占位（分步展示，第一步为「工作中」） */
const LOADING_PLAN_BLOCKS: AgentBlock[] = [
  {
    type: 'plan',
    id: 'loading-plan',
    payload: {
      steps: [
        { title: '分析需求', description: '理解任务目标与约束', status: 'loading' },
        { title: '拆解步骤', description: '制定执行计划', status: 'pending' },
        { title: '生成结果', description: '输出具体内容', status: 'pending' },
      ],
    },
  },
];

/** 示例 blocks，用于演示各类型展示（内容较多便于预览效果） */
const MOCK_BLOCKS: AgentBlock[] = [
  {
    type: 'plan',
    id: 'plan-1',
    payload: {
      steps: [
        { title: '分析需求', description: '理解任务目标与约束', status: 'done' },
        { title: '拆解步骤', description: '生成执行计划', status: 'done' },
        { title: '搭建项目骨架', description: '初始化路由、状态与通用组件', status: 'done' },
        { title: '实现登录与鉴权', description: '登录页、Token 管理、路由守卫', status: 'done' },
        { title: '实现数据看板', description: '图表与核心指标展示', status: 'done' },
        { title: '输出结果', description: '呈现回答与产物', status: 'loading' },
        { title: '收尾与交付', description: '文档与交付物', status: 'pending' },
      ],
    },
  },
  {
    type: 'text',
    id: 'text-1',
    payload: {
      content: '根据你的需求，已为「后台管理系统」拆解出完整实现方案。系统包含登录页、数据看板、列表管理、表单编辑，并支持响应式布局。\n\n下面先给出整体技术选型与目录结构，再按模块给出关键代码与说明。',
    },
  },
  {
    type: 'text',
    id: 'text-2',
    payload: {
      content: '技术栈建议：\n• 前端：React 18 + TypeScript + Vite + React Router\n• UI：Tailwind CSS + 现有 design token（与当前项目一致）\n• 状态：React Context 或 Zustand（按复杂度选择）\n• 请求：fetch 或 axios，统一封装鉴权与错误处理',
    },
  },
  {
    type: 'code',
    id: 'code-1',
    payload: {
      language: 'typescript',
      filename: 'src/router.tsx',
      code: `import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'list', element: <ListPage /> },
      { path: 'form', element: <FormPage /> },
    ],
  },
]);`,
    },
  },
  {
    type: 'text',
    id: 'text-3',
    payload: {
      content: '路由中 /login 为登录页，/ 下挂载数据看板、列表、表单等子路由，由 DashboardLayout 提供侧栏与顶栏。未登录访问 / 时在路由守卫中重定向到 /login。',
    },
  },
  {
    type: 'code',
    id: 'code-2',
    payload: {
      language: 'typescript',
      filename: 'src/hooks/useAuth.ts',
      code: `export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    setUser(res.data.user);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return { user, login, logout };
}`,
    },
  },
  {
    type: 'table',
    id: 'table-1',
    payload: {
      headers: ['模块', '说明', '主要文件'],
      rows: [
        ['登录', '账号密码登录、Token 存储', 'LoginPage.tsx, useAuth.ts'],
        ['数据看板', '统计卡片与图表', 'Dashboard.tsx'],
        ['列表管理', '分页、筛选、操作列', 'ListPage.tsx'],
        ['表单编辑', '新增/编辑、校验', 'FormPage.tsx'],
        ['布局', '侧栏 + 顶栏 + 内容区', 'DashboardLayout.tsx'],
      ],
    },
  },
  {
    type: 'text',
    id: 'text-4',
    payload: {
      content: '响应式方面：侧栏在小屏可收起为抽屉，表格与表单使用 Tailwind 的断点（sm/md/lg）做列宽与排版适配。列表页建议使用现有 design token 中的 border、spacing、radius 保持与整站一致。',
    },
  },
  {
    type: 'slide',
    id: 'slide-1',
    payload: {
      title: '实现步骤概览',
      slides: [
        { title: '第一步：登录与鉴权', content: '完成登录页与 useAuth，路由守卫校验 token。' },
        { title: '第二步：布局与导航', content: 'DashboardLayout 提供侧栏与顶栏，子路由挂载到内容区。' },
        { title: '第三步：看板与列表', content: 'Dashboard 展示统计与图表，ListPage 实现分页与筛选。' },
        { title: '第四步：表单编辑', content: 'FormPage 支持新增/编辑，校验与提交对接后端接口。' },
      ],
    },
  },
  {
    type: 'file',
    id: 'file-1',
    payload: {
      name: 'README.md',
      size: '3.2 KB',
      type: 'Markdown',
    },
  },
  {
    type: 'file',
    id: 'file-2',
    payload: {
      name: 'package.json',
      size: '1.1 KB',
      type: 'JSON',
    },
  },
  {
    type: 'file',
    id: 'file-3',
    payload: {
      name: 'src/App.tsx',
      size: '0.8 KB',
      type: 'TypeScript',
    },
  },
  // ---------- 多模态补充：文档处理、视频、深度研究、幻灯片、数据分析、设计等 ----------
  {
    type: 'text',
    id: 'text-doc',
    payload: {
      content: '【文档处理】已根据上传的 Excel 解析出以下字段与样例数据，并生成了结构化摘要，可直接用于后续分析或导入系统。',
    },
  },
  {
    type: 'file',
    id: 'file-4',
    payload: { name: '销售数据 Q1.xlsx', size: '2.4 MB', type: 'Excel' },
  },
  {
    type: 'file',
    id: 'file-5',
    payload: { name: '需求说明.docx', size: '156 KB', type: 'Word' },
  },
  {
    type: 'file',
    id: 'file-6',
    payload: { name: '产品手册.pdf', size: '4.1 MB', type: 'PDF' },
  },
  {
    type: 'video',
    id: 'video-1',
    payload: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: '视频生成示例：产品介绍短片',
    },
  },
  {
    type: 'text',
    id: 'text-research',
    payload: {
      content: '【深度研究】针对「2026 年全球 Top10 AI 模型」的调研结论：编码与多模态能力上 Claude、GPT、Gemini 等处于第一梯队；技术特点与优势场景已整理如下表。',
    },
  },
  {
    type: 'table',
    id: 'table-research',
    payload: {
      headers: ['模型', '编码能力', '多模态', '优势场景'],
      rows: [
        ['Claude 4', '优秀', '支持', '长文档与代码'],
        ['GPT-5', '优秀', '支持', '通用对话与创作'],
        ['Gemini 2', '优秀', '强', '搜索与多模态'],
        ['DeepSeek R1', '强', '部分', '推理与代码'],
      ],
    },
  },
  {
    type: 'slide',
    id: 'slide-2',
    payload: {
      title: '年度总结与规划',
      slides: [
        { title: '核心目标回顾', content: '年度 KPI 达成率 92%，重点项目全部交付。' },
        { title: '关键成果', content: '产品迭代 3 个大版本，用户规模增长 40%。' },
        { title: '来年规划', content: 'AI 能力集成、国际化与体验升级。' },
      ],
    },
  },
  {
    type: 'text',
    id: 'text-data',
    payload: {
      content: '【数据分析与可视化】对销售数据做了基础统计与分布分析，核心指标与趋势如下表；同时生成了可视化图表供汇报使用。',
    },
  },
  {
    type: 'table',
    id: 'table-data',
    payload: {
      headers: ['指标', 'Q1', 'Q2', '同比'],
      rows: [
        ['营收（万元）', '1,240', '1,580', '+27%'],
        ['订单量', '3,200', '4,100', '+28%'],
        ['客单价（元）', '387', '385', '-0.5%'],
      ],
    },
  },
  {
    type: 'image',
    id: 'image-chart',
    payload: {
      url: 'https://picsum.photos/seed/chart/800/400',
      alt: '数据可视化图表',
      caption: '营收与订单趋势图',
    },
  },
  {
    type: 'image',
    id: 'image-design',
    payload: {
      url: 'https://picsum.photos/seed/design/800/450',
      alt: '设计稿预览',
      caption: '【设计】活动海报初稿，可按品牌规范微调。',
    },
  },
  {
    type: 'text',
    id: 'text-mail',
    payload: {
      content: '【邮件编辑】已根据要点生成邮件正文与可选附件说明，可直接复制到邮件客户端发送。',
    },
  },
  {
    type: 'code',
    id: 'code-skill',
    payload: {
      language: 'typescript',
      filename: 'Skill 示例：联网搜索',
      code: `// 技能触发词：联网搜索、搜索、查一下
async function searchWeb(query: string, limit = 10) {
  const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}&n=\${limit}\`);
  const data = await res.json();
  return data.results; // 标题、链接、摘要
}`,
    },
  },
];

interface AgentAnswerViewProps {
  userInput: string;
  blocks?: AgentBlock[];
  onBack: () => void;
  /** 底部输入框发送追问（可选） */
  onSendFollowUp?: (input: string) => void;
  /** 当前导航：claw 时使用 avatar-clawcat，否则使用 avatar-cat */
  activeNav?: string;
}

/** 单轮展示：用户消息或助手回复 */
type ConversationItem =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; blocks: AgentBlock[] };

/** 使用统一的 Agent 回答结构（回答结构 / 回答过程 / 回答结果 / 任务拆解），确保 GLM 等模型输出可被正确解析 */
const SYSTEM_PROMPT = buildAgentSystemPrompt();

const TEXTAREA_MAX_HEIGHT = 400;

/** 将 blocks 转为可复制的纯文本（用于演示模式等无 content 的场景） */
function blocksToCopyText(blocks: AgentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'text' && 'content' in b.payload) return (b.payload as { content?: string }).content ?? '';
      if (b.type === 'code' && 'code' in b.payload) return (b.payload as { code?: string }).code ?? '';
      if (b.type === 'table' && 'headers' in b.payload) {
        const p = b.payload as { headers?: string[]; rows?: string[][] };
        const headers = (p.headers ?? []).join('\t');
        const rows = (p.rows ?? []).map((r) => r.join('\t')).join('\n');
        return [headers, rows].filter(Boolean).join('\n');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

export function AgentAnswerView({
  userInput,
  blocks = MOCK_BLOCKS,
  onBack,
  onSendFollowUp,
  activeNav,
}: AgentAnswerViewProps) {
  const avatarSrc = activeNav === 'claw' ? AVATAR_CLAWCAT : AVATAR_CAT;
  const [followUpInput, setFollowUpInput] = useState('');
  const followUpRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [slidePreviewPayload, setSlidePreviewPayload] = useState<SlideBlockPayload | null>(null);
  /** 多轮对话展示列表（用户 + 助手交替） */
  const [conversationDisplay, setConversationDisplay] = useState<ConversationItem[]>([]);
  /** 当前复制的是哪一条助手回答（用于显示“已复制”反馈） */
  const [copiedAnswerIndex, setCopiedAnswerIndex] = useState<number | null>(null);
  /** 当前复制的是哪一条用户消息 */
  const [copiedUserIndex, setCopiedUserIndex] = useState<number | null>(null);
  /** 发给 API 的完整消息列表（system + user + assistant + ...） */
  const apiMessagesRef = useRef<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([
    { role: 'system', content: SYSTEM_PROMPT },
  ]);
  /** 避免同一 userInput 被处理两次（如 React 严格模式） */
  const lastProcessedInputRef = useRef<string>('');

  const useLlm = isLlmConfigured();

  const abortLlm = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    if (!useLlm || !userInput?.trim()) {
      if (!userInput?.trim()) {
        setConversationDisplay([]);
        apiMessagesRef.current = [{ role: 'system', content: SYSTEM_PROMPT }];
        lastProcessedInputRef.current = '';
      }
      setLlmError(null);
      return;
    }
    const trimmed = userInput.trim();
    if (lastProcessedInputRef.current === trimmed) return;
    lastProcessedInputRef.current = trimmed;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;
    let cancelled = false;

    setConversationDisplay((prev) => [...prev, { role: 'user', content: trimmed }]);
    apiMessagesRef.current = [...apiMessagesRef.current, { role: 'user', content: trimmed }];
    const requestMessages = apiMessagesRef.current;

    setLlmLoading(true);
    setLlmError(null);
    setStreamingContent('');

    const useStream = import.meta.env.VITE_LLM_STREAM === 'true';

    const onFulfilled = (res: { content: string }) => {
      if (cancelled) return;
      const content = res.content || '（无回复内容）';
      const parsed = parseLlmResponseToBlocks(content);
      apiMessagesRef.current = [...apiMessagesRef.current, { role: 'assistant', content }];
      setConversationDisplay((prev) => [...prev, { role: 'assistant', content, blocks: parsed }]);
    };

    const onRejected = (err: unknown) => {
      if (cancelled) return;
      if (err instanceof Error && err.name === 'AbortError') return;
      setLlmError(err instanceof Error ? err.message : String(err));
      setConversationDisplay((prev) => prev.slice(0, -1));
      apiMessagesRef.current = apiMessagesRef.current.slice(0, -1);
      lastProcessedInputRef.current = '';
    };

    const onFinally = () => {
      if (!cancelled) {
        setLlmLoading(false);
        setStreamingContent('');
      }
      abortControllerRef.current = null;
    };

    if (useStream) {
      chatCompletionStream({
        messages: requestMessages,
        signal,
        onChunk: (delta) => {
          if (!cancelled) setStreamingContent((prev) => prev + delta);
        },
      })
        .then(onFulfilled)
        .catch(onRejected)
        .finally(onFinally);
    } else {
      chatCompletion({ messages: requestMessages, signal })
        .then(onFulfilled)
        .catch(onRejected)
        .finally(onFinally);
    }
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userInput, useLlm]);

  const showLlmLoading = useLlm && llmLoading;

  const adjustTextareaHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
  };

  useEffect(() => {
    adjustTextareaHeight(followUpRef.current ?? null);
  }, [followUpInput]);

  const handleSendFollowUp = () => {
    const value = followUpInput.trim();
    if (!value) return;
    onSendFollowUp?.(value);
    setFollowUpInput('');
  };

  const handleFollowUpKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendFollowUp();
    }
  };

  const handleCopyAnswer = (text: string, index: number | 'demo') => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopiedAnswerIndex(index === 'demo' ? -1 : index);
    setTimeout(() => setCopiedAnswerIndex(null), 2000);
  };

  const handleCopyUserMessage = (text: string, index: number) => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopiedUserIndex(index);
    setTimeout(() => setCopiedUserIndex(null), 2000);
  };

  return (
    <>
      {slidePreviewPayload && (
        <SlidePreviewPage
          payload={slidePreviewPayload}
          onClose={() => setSlidePreviewPayload(null)}
        />
      )}
      <div className="relative flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-card">
      <div className="flex-1 min-h-0 overflow-y-auto smooth-scroll scrollbar-hide">
        <div className="max-w-[820px] mx-auto px-6 pt-6 pb-[20vh]">
          {/* 未配置 API 时提示 */}
          {!useLlm && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-200">
              <strong>当前为演示模式。</strong> 要启用大模型回复：在项目根目录 <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-xs">figma-make-workbuddy</code> 下创建 <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-xs">.env</code>，填写 <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-xs">VITE_LLM_API_BASE_URL</code> 和 <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-xs">VITE_LLM_API_KEY</code>，保存后<strong>重启</strong> <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-xs">npm run dev</code>。
            </div>
          )}

          {useLlm ? (
            /* 多轮对话：按顺序展示每轮用户消息 + 助手回复 */
            <>
              {conversationDisplay.map((item, index) =>
                item.role === 'user' ? (
                  <div key={`u-${index}`} className="flex justify-end mb-8">
                    <div className="max-w-[85%] min-w-0 group relative">
                      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>
                      </div>
                      <div className="absolute left-0 right-0 top-full pt-1.5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopyUserMessage(item.content, index)}
                          className="p-1.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="复制"
                          title="复制"
                        >
                          {copiedUserIndex === index ? (
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={`a-${index}`} className="flex gap-3 max-w-[85%] mb-8">
                    <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-primary/10">
                      <img src={avatarSrc} alt="Agent" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 group relative">
                      <AgentRenderer
                        blocks={
                          item.blocks?.length
                            ? item.blocks
                            : parseLlmResponseToBlocks(item.content || '（无回复内容）')
                        }
                        onSlideClick={(payload) => setSlidePreviewPayload(payload)}
                      />
                      <div className="absolute left-0 right-0 top-full pt-1.5 flex justify-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopyAnswer(item.content ?? '', index)}
                          className="p-1.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="复制回答"
                          title="复制"
                        >
                          {copiedAnswerIndex === index ? (
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
              {showLlmLoading && (
                <div className="flex gap-3 max-w-[85%] mb-8">
                  <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-primary/10">
                    <img src={avatarSrc} alt="Agent" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <AgentRenderer
                      blocks={LOADING_PLAN_BLOCKS}
                      onSlideClick={() => {}}
                    />
                    <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span>大模型正在思考…</span>
                      </div>
                      <p className="text-xs text-muted-foreground/80">生成完整回答通常需要 10～30 秒，请耐心等待</p>
                    </div>
                    {streamingContent && (
                      <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="px-3 py-2 border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
                          正在生成…
                        </div>
                        <pre className="p-4 text-sm text-foreground/90 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                          {streamingContent}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {llmError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">请求失败</p>
                      <p className="mt-1 text-muted-foreground break-words">{llmError}</p>
                      <p className="mt-2 text-xs text-muted-foreground">请检查 .env 中的 VITE_LLM_API_BASE_URL 和 VITE_LLM_API_KEY，或返回重新发送。</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 演示模式：单轮用户 + 示例 blocks */
            <>
              <div className="flex justify-end mb-8">
                <div className="max-w-[85%] min-w-0 group relative">
                  <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{userInput || '（无内容）'}</p>
                  </div>
                  <div className="absolute left-0 right-0 top-full pt-1.5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyUserMessage(userInput || '', -1)}
                      className="p-1.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="复制"
                      title="复制"
                    >
                      {copiedUserIndex === -1 ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-primary/10">
                  <img src={avatarSrc} alt="Agent" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 group relative">
                  <AgentRenderer
                    blocks={blocks}
                    onSlideClick={(payload) => setSlidePreviewPayload(payload)}
                  />
                  <div className="absolute left-0 right-0 top-full pt-1.5 flex justify-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyAnswer(blocksToCopyText(blocks), 'demo')}
                      className="p-1.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="复制回答"
                      title="复制"
                    >
                      {copiedAnswerIndex === -1 ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 底部渐变遮罩：仅覆盖内容区宽度，从透明过渡到背景色，遮挡滚动内容避免底部漏出 */}
      <div
        className="absolute inset-x-0 bottom-0 z-[5] flex justify-center pointer-events-none"
        aria-hidden
      >
        <div className="w-full max-w-[820px] h-[120px] bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* 底部输入框：绝对定位在相对容器底部，透明层 + 卡片透出 */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-4 pt-2 bg-transparent pointer-events-none">
        <div className="max-w-[820px] mx-auto w-full pointer-events-auto">
          <div
            className="rounded-2xl border border-foreground/15 focus-within:border-foreground/30 bg-card transition-colors"
            style={{ boxShadow: '0 8px 32px -4px rgb(0 0 0 / 0.06)' }}
          >
            <div className="px-5 pt-5 pb-3">
              <textarea
                ref={followUpRef}
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                onKeyDown={handleFollowUpKeyDown}
                placeholder="Ask me anything, I'm ready"
                className="w-full px-0 py-0 bg-transparent outline-none resize-none text-sm placeholder:text-muted-foreground min-h-[56px]"
                rows={2}
                onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                >
                  <CraftIcon className="w-4 h-4" />
                  <span className="text-xs" style={{ fontWeight: 500 }}>Craft</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors min-w-0"
                >
                  <Infinity className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate" style={{ fontWeight: 500 }}>Auto</span>
                  <ChevronDown className="w-3 h-3 shrink-0" />
                </button>
                <button
                  type="button"
                  className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-xs" style={{ fontWeight: 500 }}>Skills</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {useLlm && llmLoading ? (
                  <button
                    type="button"
                    onClick={abortLlm}
                    title="点击暂停大模型思考"
                    aria-label="点击暂停大模型思考"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
                  >
                    <Square className="w-4 h-4" fill="currentColor" strokeWidth={0} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!followUpInput.trim()}
                    onClick={handleSendFollowUp}
                    title={followUpInput.trim() ? '发送' : '请先输入内容'}
                    aria-label={followUpInput.trim() ? '发送' : '请先输入内容'}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-opacity ${
                      followUpInput.trim()
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
