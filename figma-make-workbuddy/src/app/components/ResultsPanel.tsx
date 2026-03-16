import { X, FileText, Image, Code, Download } from 'lucide-react';

interface ResultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResultsPanel({ isOpen, onClose }: ResultsPanelProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-72 h-full flex flex-col border-l border-border bg-card shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm" style={{ fontWeight: 500 }}>结果预览</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary/50 dark:hover:bg-secondary/60 rounded-md transition-colors text-muted-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button className="flex-1 px-3 py-2 text-xs border-b-2 border-primary text-foreground" style={{ fontWeight: 500 }}>
          产物
        </button>
        <button className="flex-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          全部文件
        </button>
        <button className="flex-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          变更
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 smooth-scroll scrollbar-hide">
        <div className="space-y-2">
          <FileItem
            icon={<FileText className="w-4 h-4 text-primary" />}
            name="销售分析报告.docx"
            meta="2.4 MB · 刚刚更新"
            iconBg="bg-primary/10"
          />
          <FileItem
            icon={<Image className="w-4 h-4 text-chart-3" />}
            name="数据可视化图表.png"
            meta="1.2 MB · 5分钟前"
            iconBg="bg-chart-3/10"
          />
          <FileItem
            icon={<Code className="w-4 h-4 text-chart-4" />}
            name="data_analysis.py"
            meta="8 KB · 10分钟前"
            iconBg="bg-chart-4/10"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
          下载全部文件
        </button>
      </div>
    </aside>
  );
}

function FileItem({
  icon,
  name,
  meta,
  iconBg,
}: {
  icon: React.ReactNode;
  name: string;
  meta: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors group cursor-pointer">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground truncate">{name}</div>
        <div className="text-xs text-muted-foreground">{meta}</div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary/50 dark:hover:bg-secondary/60 rounded transition-all text-muted-foreground">
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
