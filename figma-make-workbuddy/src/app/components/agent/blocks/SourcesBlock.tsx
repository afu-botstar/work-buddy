import type { SourcesBlockPayload } from '../types';
import { BookOpen, ExternalLink } from 'lucide-react';

interface SourcesBlockProps {
  payload?: SourcesBlockPayload;
}

export function SourcesBlock({ payload }: SourcesBlockProps) {
  const items = payload?.items ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground font-medium" style={{ fontWeight: 600 }}>
          Sources
        </span>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm"
          >
            <span className="flex-1 min-w-0 text-foreground truncate" title={item.title}>
              {item.title}
            </span>
            {item.type && (
              <span className="text-xs text-muted-foreground shrink-0">{item.type}</span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="打开链接"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
