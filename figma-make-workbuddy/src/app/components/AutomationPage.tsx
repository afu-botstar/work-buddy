import { Plus, FileText, BookOpen, Moon, ClipboardList, Film, Calendar, HelpCircle } from 'lucide-react';

interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const automationTemplates: AutomationTemplate[] = [
  {
    id: 'ai-news',
    title: '每日 AI 新闻推送',
    description: '关注当天 AI 领域的重要动态，侧重技术进展与产品动态。',
    icon: <FileText className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'english-words',
    title: '每日5个英语单词',
    description: '每天推荐5个高频实用英语单词，带例句与记忆提示。',
    icon: <BookOpen className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'bedtime-story',
    title: '每日儿童睡前故事',
    description: '生成3-5分钟可读的温和睡前故事，适合亲子共读。',
    icon: <Moon className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'weekly-report',
    title: '每周工作周报',
    description: '每周五汇总仓库 PR 与 Issue 进展，生成简洁周报。',
    icon: <ClipboardList className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'movie-recommend',
    title: '经典电影推荐',
    description: '推荐一部高分经典电影，简要介绍剧情与看点。',
    icon: <Film className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'today-in-history',
    title: '历史上的今天',
    description: '从科技、电影、音乐等领域挑选一个今日历史事件。',
    icon: <Calendar className="w-5 h-5 text-muted-foreground" />,
  },
  {
    id: 'daily-why',
    title: '每日一个为什么',
    description: '每天抛出一个有趣问题，先提问再给出简明解答。',
    icon: <HelpCircle className="w-5 h-5 text-muted-foreground" />,
  },
];

export function AutomationPage() {
  const handleAdd = () => {
    // TODO: 打开新建自动化任务
  };

  const handleAddFromTemplate = () => {
    // TODO: 打开从模版添加
  };

  const handleTemplateClick = (template: AutomationTemplate) => {
    // TODO: 使用该模版创建任务
    console.log('使用模版:', template.title);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-10 pt-8 pb-5 flex items-start justify-between shrink-0">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>
              自动化
            </h1>
            <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>
              Beta
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            管理自动化任务并查看近期运行记录。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
          <button
            type="button"
            onClick={handleAddFromTemplate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity"
            style={{ fontWeight: 500 }}
          >
            从模版添加
          </button>
        </div>
      </div>

      {/* 从模版入手 */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 smooth-scroll scrollbar-hide">
        <h2 className="text-sm text-foreground mb-4" style={{ fontWeight: 600 }}>
          从模版入手
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateClick(template)}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card text-left hover:bg-muted/40 dark:hover:bg-muted/30 hover:border-foreground/15 transition-all focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/60 shrink-0">
                {template.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-foreground font-medium mb-1">
                  {template.title}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
