import type { TextBlockPayload } from '../types';

interface TextBlockProps {
  payload?: TextBlockPayload;
}

export function TextBlock({ payload }: TextBlockProps) {
  const content = payload?.content ?? '';

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
