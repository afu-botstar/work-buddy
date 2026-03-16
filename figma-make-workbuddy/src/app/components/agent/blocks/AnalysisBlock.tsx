import type { AnalysisBlockPayload } from '../types';
import { BarChart3 } from 'lucide-react';

interface AnalysisBlockProps {
  payload?: AnalysisBlockPayload;
}

export function AnalysisBlock({ payload }: AnalysisBlockProps) {
  const content = payload?.content;
  const sections = payload?.sections ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground font-medium" style={{ fontWeight: 600 }}>
          Analysis
        </span>
      </div>
      <div className="p-4 space-y-4">
        {content && (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{content}</p>
        )}
        {sections.length > 0 && (
          <div className="space-y-3">
            {sections.map((sec, i) => (
              <div key={i} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                <div className="text-sm font-medium text-foreground mb-1">{sec.title}</div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{sec.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
