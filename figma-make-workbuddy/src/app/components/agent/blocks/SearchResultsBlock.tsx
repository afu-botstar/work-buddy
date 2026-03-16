import type { SearchResultsPayload } from '../types';
import { Search, ExternalLink } from 'lucide-react';

interface SearchResultsBlockProps {
  payload?: SearchResultsPayload;
}

export function SearchResultsBlock({ payload }: SearchResultsBlockProps) {
  const query = payload?.query;
  const items = payload?.items ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground font-medium" style={{ fontWeight: 600 }}>
          Search Results
        </span>
        {query && (
          <span className="text-xs text-muted-foreground truncate ml-1" title={query}>
            「{query}」
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                {item.snippet && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.snippet}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {item.url}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
