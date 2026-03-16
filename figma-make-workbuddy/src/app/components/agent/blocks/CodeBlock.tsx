import type { CodeBlockPayload } from '../types';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  payload?: CodeBlockPayload;
}

export function CodeBlock({ payload }: CodeBlockProps) {
  const code = payload?.code ?? '';
  const language = payload?.language ?? 'text';
  const filename = payload?.filename;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
        {filename && (
          <span className="text-xs text-muted-foreground font-medium">{filename}</span>
        )}
        <span className="text-xs text-muted-foreground ml-auto mr-2">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-secondary/50 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="复制"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-chart-2" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-foreground/90 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
