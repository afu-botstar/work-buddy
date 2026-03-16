import type { SummaryBlockPayload } from '../types';
import { FileText } from 'lucide-react';

interface SummaryBlockProps {
  payload?: SummaryBlockPayload;
}

export function SummaryBlock({ payload }: SummaryBlockProps) {
  const content = payload?.content;
  const bullets = payload?.bullets ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground font-medium" style={{ fontWeight: 600 }}>
          Summary
        </span>
      </div>
      <div className="p-4 space-y-3">
        {content && (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{content}</p>
        )}
        {bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
            {bullets.map((b, i) => (
              <li key={i} className="text-muted-foreground">{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
