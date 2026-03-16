import type { VideoBlockPayload } from '../types';
import { Video } from 'lucide-react';

interface VideoBlockProps {
  payload?: VideoBlockPayload;
}

export function VideoBlock({ payload }: VideoBlockProps) {
  const url = payload?.url ?? '';
  const title = payload?.title;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="aspect-video bg-muted/50 flex items-center justify-center">
        {url ? (
          <video
            src={url}
            controls
            className="max-w-full max-h-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Video className="w-10 h-10" />
            <span className="text-xs">视频占位</span>
          </div>
        )}
      </div>
      {title && (
        <p className="px-4 py-2 text-sm text-foreground/90 border-t border-border">
          {title}
        </p>
      )}
    </div>
  );
}
