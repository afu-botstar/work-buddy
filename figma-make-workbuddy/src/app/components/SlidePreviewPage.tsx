import type { ReactNode } from 'react';
import type { SlideBlockPayload } from './agent/types';
import { Presentation, X } from 'lucide-react';

/** 将幻灯片 content 中的简易 Markdown（###、**、表格）渲染为可读格式 */
function SlideContentMarkdown({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let i = 0;
  const tableRowRe = /^\|(.+)\|$/;
  const tableSepRe = /^\|[\s\-:|]+\|$/;

  while (i < lines.length) {
    const line = lines[i];
    // ### 标题
    if (/^###\s*/.test(line)) {
      nodes.push(
        <h3 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1 first:mt-0">
          {line.replace(/^###\s*/, '').replace(/\*\*(.+?)\*\*/g, (_, t) => t).trim()}
        </h3>
      );
      i += 1;
      continue;
    }
    // Markdown 表格：连续 |...| 行且含分隔行
    if (tableRowRe.test(line)) {
      const tableLines: string[] = [];
      let j = i;
      while (j < lines.length && tableRowRe.test(lines[j])) {
        tableLines.push(lines[j]);
        j += 1;
      }
      const sepIdx = tableLines.findIndex((l) => tableSepRe.test(l));
      if (sepIdx >= 0 && tableLines.length >= 2) {
        const headerRow = tableLines[0].replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const dataRows = tableLines.slice(sepIdx + 1).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        nodes.push(
          <div key={i} className="overflow-x-auto my-2 rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {headerRow.map((h, k) => (
                    <th key={k} className="px-3 py-2 text-left text-foreground font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => (
                  <tr key={ri} className="border-b border-border/60 last:border-b-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j;
        continue;
      }
    }
    // 普通行：支持 **粗体**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, k) => {
      const m = seg.match(/^\*\*(.+)\*\*$/);
      return m ? <strong key={k} className="font-semibold text-foreground">{m[1]}</strong> : seg;
    });
    if (line.trim() || parts.some((p) => typeof p === 'string' && p.trim())) {
      nodes.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mt-1 first:mt-0">
          {parts}
        </p>
      );
    }
    i += 1;
  }

  return <div className="slide-content-markdown">{nodes}</div>;
}

interface SlidePreviewPageProps {
  payload: SlideBlockPayload;
  onClose: () => void;
}

export function SlidePreviewPage({ payload, onClose }: SlidePreviewPageProps) {
  const title = payload?.title ?? '演示文稿';
  const slides = payload?.slides ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* 顶部栏 */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors"
          aria-label="关闭预览"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 幻灯片列表预览 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
            >
              <div className="px-5 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  第 {i + 1} 页
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-base font-semibold text-foreground">
                  {slide.title}
                </h2>
                {slide.content && (
                  <div className="mt-2">
                    <SlideContentMarkdown content={slide.content} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
