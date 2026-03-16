/** Agent 响应块类型，便于扩展新类型 */
export type AgentBlockType =
  | 'plan'
  | 'text'
  | 'image'
  | 'table'
  | 'video'
  | 'code'
  | 'slide'
  | 'file'
  /** 深度研究模态 */
  | 'research_plan'
  | 'search_results'
  | 'analysis'
  | 'summary'
  | 'sources';

export interface AgentBlockBase {
  id?: string;
  type: AgentBlockType;
}

export interface PlanBlockPayload {
  steps?: { title: string; description?: string; status?: 'pending' | 'done' | 'loading' }[];
}

export interface TextBlockPayload {
  content: string;
}

export interface ImageBlockPayload {
  url: string;
  alt?: string;
  caption?: string;
}

export interface VideoBlockPayload {
  url: string;
  title?: string;
}

export interface CodeBlockPayload {
  language?: string;
  code: string;
  filename?: string;
}

export interface TableBlockPayload {
  headers: string[];
  rows: string[][];
}

export interface SlideBlockPayload {
  title?: string;
  slides?: { title: string; content?: string }[];
}

export interface FileBlockPayload {
  name: string;
  size?: string;
  type?: string;
  url?: string;
}

/** 深度研究模态：Plan */
export interface ResearchPlanPayload {
  steps?: { title: string; description?: string; status?: 'pending' | 'done' | 'loading' }[];
}

/** 深度研究模态：Search Results */
export interface SearchResultsPayload {
  query?: string;
  items?: { title: string; url?: string; snippet?: string }[];
}

/** 深度研究模态：Analysis */
export interface AnalysisBlockPayload {
  content?: string;
  sections?: { title: string; content: string }[];
}

/** 深度研究模态：Summary */
export interface SummaryBlockPayload {
  content?: string;
  bullets?: string[];
}

/** 深度研究模态：Sources */
export interface SourcesBlockPayload {
  items?: { title: string; url?: string; type?: string }[];
}

export type AgentBlock =
  | (AgentBlockBase & { type: 'plan'; payload?: PlanBlockPayload })
  | (AgentBlockBase & { type: 'text'; payload?: TextBlockPayload })
  | (AgentBlockBase & { type: 'image'; payload?: ImageBlockPayload })
  | (AgentBlockBase & { type: 'video'; payload?: VideoBlockPayload })
  | (AgentBlockBase & { type: 'code'; payload?: CodeBlockPayload })
  | (AgentBlockBase & { type: 'table'; payload?: TableBlockPayload })
  | (AgentBlockBase & { type: 'slide'; payload?: SlideBlockPayload })
  | (AgentBlockBase & { type: 'file'; payload?: FileBlockPayload })
  | (AgentBlockBase & { type: 'research_plan'; payload?: ResearchPlanPayload })
  | (AgentBlockBase & { type: 'search_results'; payload?: SearchResultsPayload })
  | (AgentBlockBase & { type: 'analysis'; payload?: AnalysisBlockPayload })
  | (AgentBlockBase & { type: 'summary'; payload?: SummaryBlockPayload })
  | (AgentBlockBase & { type: 'sources'; payload?: SourcesBlockPayload });

export interface AgentResponse {
  blocks: AgentBlock[];
}
