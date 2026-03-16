import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

interface PluginItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  hasManage?: boolean;
}

const mockPlugins: PluginItem[] = [
  { id: '1', name: 'data-analysis', description: 'Data analysis plugin with Excel spreadsheet creation, editing, and analysis capabilities. Supports formulas, formatting, data analysis, and visualization search via Sogou for high-quality Chinese content retrieval.', tags: ['skills', 'rules'], hasManage: true },
  { id: '2', name: 'remotion-video-generator', description: 'Automatically generates beautiful videos using Remotion. Detects video creation requests, creates storyboards, handles environment setup, and outputs MP4 files with minimal user intervention. Supports explainer videos, product demos, social media content, and presentations.', tags: ['skills', 'rules'], hasManage: true },
  { id: '3', name: 'design-to-code', description: '将 Figma 设计转换为生产可用的代码片段，内置无障碍性支持。', tags: ['skills', 'mgps', 'rules'], hasManage: true },
  { id: '4', name: 'executing-marketing-campaigns', description: 'Plans, creates, and optimizes marketing campaigns including content strategy, social media, email, and analytics.', tags: ['skills'] },
  { id: '5', name: 'internal-comms', description: 'A set of resources to help write internal communications using company-preferred formats (status reports, 3P updates, newsletters, FAQs, incident reports, etc).', tags: ['skills'] },
  { id: '6', name: 'general-skills', description: 'A collection of general-purpose skills including document conversion, skill discovery, UI/UX design, and frontend development capabilities.', tags: ['skills'] },
  { id: '7', name: 'document-skills', description: 'Collection of document processing suite including Excel, Word, PowerPoint, and PDF capabilities.', tags: ['skills'] },
  { id: '8', name: 'ppt-implement', description: '智能 PPT 生成，一键转换为模块化演示文稿。', tags: ['skills', 'rules'] },
  { id: '9', name: 'modern-webapp', description: 'Modern web application development plugin with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and comprehensive UI/UX design system. Includes tools for project initialization, design intelligence, icon management, and browser testing.', tags: ['skills', 'rules'] },
  { id: '10', name: 'data', description: '数据分析插件，支持 SQL 查询、数据探索、可视化、仪表板构建和报表生成，包含完整的数据工作流和最佳实践。', tags: ['skills', 'rules'] },
  { id: '11', name: 'deep-research', description: 'Deep research plugin that enables comprehensive web research, information synthesis, and knowledge discovery. Supports multi-source research, fact verification, and structured report generation.', tags: ['skills', 'agents', 'rules'] },
  { id: '12', name: 'finance', description: '财务与会计插件，支持月末结账、日记账分录、账户核对、财务报表生成、差异分析和审计支持。', tags: ['skills', 'rules'] },
  { id: '13', name: 'product-management', description: '产品管理插件，支持功能规划、需求梳理、利益相关者沟通、用户研究综合、竞品分析和指标审查。', tags: ['skills', 'rules'] },
  { id: '14', name: 'codebuddy-chat-web', description: 'Initializes a web-based chat application powered by CodeBuddy Agent SDK with React + TDesign frontend and Express backend with SQLite persistence.', tags: ['skills', 'rules'] },
  { id: '15', name: 'webapp-testing', description: 'Web 应用测试插件，引导用户启动、配置和测试 Web 应用。', tags: ['skills'] },
  { id: '16', name: 'dockerfile-gen', description: 'Dockerfile Generator - Automated Dockerfile generation with best practices for containerization.', tags: ['skills'] },
];

const defaultFilters = ['codebuddy-plugins-official', 'cb_teams_marketplace'];

export function PluginsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(defaultFilters);

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const filteredPlugins = mockPlugins.filter((plugin) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      plugin.name.toLowerCase().includes(q) ||
      plugin.description.toLowerCase().includes(q) ||
      plugin.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header：参考技能页，标题/描述在左，搜索+主操作在右 */}
      <div className="px-10 pt-8 pb-5 flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>
            插件市场
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理插件以扩展 WorkBuddy 功能，从市场安装或管理插件。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="搜索插件"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-48 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity"
            style={{ fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            安装插件
          </button>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="px-10 pb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border bg-muted/50 text-foreground/80"
              style={{ fontWeight: 500 }}
            >
              {filter}
              <button
                type="button"
                onClick={() => removeFilter(filter)}
                className="p-0.5 rounded-full hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`移除筛选 ${filter}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/40 dark:hover:bg-muted/60 transition-colors"
            aria-label="添加筛选"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 smooth-scroll scrollbar-hide">
        <div className="grid grid-cols-2 gap-4">
          {filteredPlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PluginCard({ plugin }: { plugin: PluginItem }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-5 pt-5 pb-4 flex flex-col hover:border-border hover:shadow-sm transition-all min-h-[140px]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sm text-foreground shrink-0" style={{ fontWeight: 600 }}>
          {plugin.name}
        </span>
        {plugin.hasManage && (
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-foreground/90 text-xs hover:bg-muted/50 dark:hover:bg-muted/70 transition-colors"
            style={{ fontWeight: 500 }}
          >
            管理
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground/80 leading-[1.55] line-clamp-3 mb-4 flex-1">
        {plugin.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {plugin.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400"
            style={{ fontWeight: 500 }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
