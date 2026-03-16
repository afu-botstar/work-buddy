import type { SlideBlockPayload } from '../types';
import { Presentation } from 'lucide-react';

interface SlideBlockProps {
  payload?: SlideBlockPayload;
  onSlideClick?: (payload: SlideBlockPayload) => void;
}

export function SlideBlock({ payload, onSlideClick }: SlideBlockProps) {
  const title = payload?.title;
  const slides = payload?.slides ?? [];
  const canPreview = payload && (payload.slides?.length ?? 0) > 0;

  const handleClick = () => {
    if (canPreview && onSlideClick && payload) onSlideClick(payload);
  };

  return (
    <div
      role={canPreview && onSlideClick ? 'button' : undefined}
      tabIndex={canPreview && onSlideClick ? 0 : undefined}
      onClick={canPreview && onSlideClick ? handleClick : undefined}
      onKeyDown={
        canPreview && onSlideClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      className={`rounded-xl border border-border bg-card overflow-hidden ${
        canPreview && onSlideClick
          ? 'cursor-pointer hover:border-primary/50 hover:shadow-md transition-all'
          : ''
      }`}
    >
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <Presentation className="w-4 h-4 text-muted-foreground" />
        {title && (
          <span className="text-sm text-foreground font-medium">{title}</span>
        )}
        {canPreview && onSlideClick && (
          <span className="ml-auto text-xs text-muted-foreground">点击预览</span>
        )}
      </div>
      <div className="p-4 space-y-3">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
          >
            <div className="text-sm font-medium text-foreground">{slide.title}</div>
            {slide.content && (
              <p className="text-xs text-muted-foreground mt-1">{slide.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
