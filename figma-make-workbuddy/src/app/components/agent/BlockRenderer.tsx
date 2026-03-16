import type { ReactNode } from 'react';
import type { AgentBlock, SlideBlockPayload } from './types';
import {
  PlanBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,
  CodeBlock,
  TableBlock,
  SlideBlock,
  FileBlock,
  ResearchPlanBlock,
  SearchResultsBlock,
  AnalysisBlock,
  SummaryBlock,
  SourcesBlock,
} from './blocks';

/** 块类型到组件的映射，扩展新类型时在此注册 */
const BLOCK_COMPONENTS: Record<
  AgentBlock['type'],
  (props: { payload?: unknown; onSlideClick?: (payload: SlideBlockPayload) => void }) => ReactNode
> = {
  plan: PlanBlock,
  text: TextBlock,
  image: ImageBlock,
  video: VideoBlock,
  code: CodeBlock,
  table: TableBlock,
  slide: SlideBlock,
  file: FileBlock,
  research_plan: ResearchPlanBlock,
  search_results: SearchResultsBlock,
  analysis: AnalysisBlock,
  summary: SummaryBlock,
  sources: SourcesBlock,
};

interface BlockRendererProps {
  block: AgentBlock;
  onSlideClick?: (payload: SlideBlockPayload) => void;
}

export function BlockRenderer({ block, onSlideClick }: BlockRendererProps) {
  const Component = BLOCK_COMPONENTS[block.type];
  if (!Component) return null;

  const payload = 'payload' in block ? block.payload : undefined;
  const slideClick = block.type === 'slide' ? onSlideClick : undefined;

  return (
    <Component
      key={block.id ?? block.type}
      payload={payload}
      onSlideClick={slideClick}
    />
  );
}
