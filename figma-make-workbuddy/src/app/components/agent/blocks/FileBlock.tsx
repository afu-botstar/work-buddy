import type { FileBlockPayload } from '../types';
import { FileText, Download } from 'lucide-react';

interface FileBlockProps {
  payload?: FileBlockPayload;
}

export function FileBlock({ payload }: FileBlockProps) {
  const name = payload?.name ?? '';
  const size = payload?.size;
  const type = payload?.type;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3 hover:bg-muted/30 dark:hover:bg-muted/50 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground font-medium truncate">{name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {type && <span>{type}</span>}
          {size && <span>{size}</span>}
        </div>
      </div>
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
        aria-label="下载"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
