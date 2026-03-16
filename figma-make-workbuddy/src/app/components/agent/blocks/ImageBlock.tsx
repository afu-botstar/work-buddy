import type { ImageBlockPayload } from '../types';

interface ImageBlockProps {
  payload?: ImageBlockPayload;
}

export function ImageBlock({ payload }: ImageBlockProps) {
  const url = payload?.url ?? '';
  const alt = payload?.alt ?? '';
  const caption = payload?.caption;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="aspect-video bg-muted/50 flex items-center justify-center overflow-hidden">
        {url ? (
          <img
            src={url}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-muted-foreground text-xs">图片占位</span>
        )}
      </div>
      {caption && (
        <p className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
          {caption}
        </p>
      )}
    </div>
  );
}
