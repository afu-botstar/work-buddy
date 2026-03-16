import { useState } from 'react';
import { Search, Plus, Zap, Link } from 'lucide-react';

interface InstalledSkill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  featured?: boolean;
  author: string;
  updatedAt: string;
}

interface RecommendedSkill {
  id: string;
  name: string;
  description: string;
}

const installedSkills: InstalledSkill[] = [
  { id: 'i1', name: 'video-generator', description: '专业的 AI 视频制作工作流。在创建视频、短片、广告或任何使用 AI 生成工具的视频内容时使用。', enabled: false, author: '官方', updatedAt: '2026年3月13日' },
  { id: 'i2', name: 'skill-creator', description: '创建或更新技能的指南，通过专业知识、工作流或工具集成来扩展 Manus。对于任何修改或改…', enabled: true, author: '官方', updatedAt: '2026年2月16日' },
  { id: 'i3', name: 'stock-analysis', description: '使用金融市场数据分析股票和公司。获取公司概况、技术见解、价格图表、内部持股和 SEC 申报…', enabled: false, featured: true, author: '官方', updatedAt: '2026年1月23日' },
  { id: 'i4', name: 'similarweb-analytics', description: '使用 SimilarWeb 流量数据分析网站和域名。获取流量指标、参与度统计、全球排名、流量来源和…', enabled: false, featured: true, author: '官方', updatedAt: '2026年1月23日' },
];

const recommendedSkills: RecommendedSkill[] = [
  { id: '1', name: 'find-skills', description: '帮助用户发现和安装智能体技能。当用户提出「我需要一个能...」类型的请求时自动触发。' },
  { id: '2', name: 'workbuddy-channel-setup', description: '使用 playwright-cli 自动配置 WorkBuddy 架构中的频道和集成设置。' },
  { id: '3', name: 'xiaohongshu', description: '小红书（RedNote）内容工具。使用场景：搜索笔记、分析热门趋势、生成内容草稿。' },
  { id: '4', name: 'agentmail', description: 'AI 智能体邮箱。收发邮件、通过专属 @agentmail 地址管理邮件通信。' },
  { id: '5', name: 'apple-notes', description: '通过 macOS 上的 \'memo\' CLI 管理 Apple 备忘录，支持创建、搜索和编辑笔记。' },
  { id: '6', name: 'apple-reminders', description: '通过 macOS 的 \'remindctl\' CLI 管理 Apple 提醒事项，支持添加、完成和查询任务。' },
  { id: '7', name: 'blogwatcher', description: '使用 blogwatcher CLI 监控博客和 RSS/Atom 订阅源，追踪内容更新和变化。' },
  { id: '8', name: 'gifgrep', description: '通过 CLI/TUI 搜索 GIF 提供商、下载结果并提取关键帧用于内容创作。' },
  { id: '9', name: 'github', description: '使用 \'gh\' CLI 与 GitHub 交互。管理 Issues、PR、仓库和 Actions 工作流。' },
  { id: '10', name: 'gog', description: 'Google Workspace 命令行工具，支持 Gmail、Calendar、Drive 等服务的操作。' },
];

export function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState(installedSkills);

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const filteredRecommended = recommendedSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-10 pt-8 pb-5 flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>技能</h1>
          <p className="text-sm text-muted-foreground mt-1">赋予 WorkBuddy 更强大的能力</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="搜索技能"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-48 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:opacity-90 transition-opacity" style={{ fontWeight: 500 }}>
            <Plus className="w-4 h-4" />
            导入技能
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 smooth-scroll scrollbar-hide">
        {/* Installed Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>已安装</span>
            <span className="px-1.5 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground" style={{ fontWeight: 500 }}>{skills.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill) => (
              <InstalledSkillCard
                key={skill.id}
                skill={skill}
                onToggle={() => toggleSkill(skill.id)}
              />
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>推荐</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredRecommended.map((skill) => (
              <RecommendedSkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstalledSkillCard({
  skill,
  onToggle,
}: {
  skill: InstalledSkill;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-5 pt-5 pb-4 flex flex-col hover:border-border hover:shadow-sm transition-all">
      {/* Header: name + toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>{skill.name}</span>
        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            skill.enabled ? 'bg-primary' : 'bg-muted-foreground/25'
          }`}
        >
          <span
            className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
              skill.enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/80 leading-[1.6] line-clamp-3 mb-4">
        {skill.description}
      </p>

      {/* Footer: author + date */}
      <div className="flex items-center mt-auto pt-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
          <Link className="w-3.5 h-3.5" />
          <span>{skill.author}</span>
          <span className="mx-0.5">·</span>
          <span>更新于 {skill.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

function RecommendedSkillCard({
  skill,
}: {
  skill: RecommendedSkill;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-5 pt-5 pb-4 flex flex-col hover:border-border hover:shadow-sm transition-all">
      {/* Header: name + add button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>{skill.name}</span>
        <button className="w-8 h-8 rounded-full border border-border/80 bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/80 dark:hover:bg-secondary/90 hover:shadow-sm transition-all shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/80 leading-[1.6] line-clamp-3 mb-4">
        {skill.description}
      </p>

      {/* Footer: community */}
      <div className="flex items-center mt-auto pt-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
          <Zap className="w-3.5 h-3.5" />
          <span>社区</span>
        </div>
      </div>
    </div>
  );
}