import type { AgentBlock, SlideBlockPayload } from './types';
import { BlockRenderer } from './BlockRenderer';

interface AgentRendererProps {
  blocks: AgentBlock[];
  onSlideClick?: (payload: SlideBlockPayload) => void;
}

export function AgentRenderer({ blocks, onSlideClick }: AgentRendererProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockRenderer
          key={block.id ?? `${block.type}-${index}`}
          block={block}
          onSlideClick={onSlideClick}
        />
      ))}
    </div>
  );
}
