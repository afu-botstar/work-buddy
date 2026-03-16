import { ChevronDown, Infinity, FolderOpen, Plus, FilePlus, BookOpen, Zap, ArrowUp, ArrowUpRight, FileText, Video, Search, Presentation, BarChart3, PieChart, Landmark, Package, Palette, Mail, Code, Globe2, Bot, GitBranch, FileCode, Layers, AudioLines, Brain, Check, ClipboardList, MessageCircle, Upload, X, LayoutDashboard, Building2, PlusCircle, RefreshCw, Bug, Gauge, Monitor, Headphones, MoreHorizontal, Link2, ArrowLeftRight, Maximize2, ShieldCheck, Image, PenTool, ShoppingCart, Smartphone, Terminal } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
/** 终端提示符 ">_" 图标，用于代码开发 tab */
function TerminalPromptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8l4 4-4 4" />
      <path d="M17 17h5" />
    </svg>
  );
}

interface ChatAreaProps {
  onToggleResults: () => void;
  /** 供外部聚焦输入框，如 Ctrl+K 新建任务 */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  /** 按 Enter 或点击发送后进入 Agent 回答页 */
  onEnterAgentAnswer?: (input: string) => void;
  /** 是否显示「开始新的」+ tab（代码开发/日常办公/任务）以及底部快捷标签，默认 true。Claw 与新建任务首页均应传 true */
  showStartNewAndTags?: boolean;
}

const TAG_ICON_COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#db2777', '#059669', '#ea580c', '#4f46e5'] as const;

const mainDevTags = [
  { label: '日常开发', icon: Code, iconColor: TAG_ICON_COLORS[0] },
  { label: '网站开发', icon: Globe2, iconColor: TAG_ICON_COLORS[1] },
  { label: 'Agent 应用', icon: Bot, iconColor: TAG_ICON_COLORS[2] },
  { label: 'Skill 开发', icon: Zap, iconColor: TAG_ICON_COLORS[3] },
];
const moreDevTags = [
  { label: 'CI/CD', icon: GitBranch, iconColor: TAG_ICON_COLORS[4] },
  { label: '文档', icon: FileCode, iconColor: TAG_ICON_COLORS[5] },
];
const devTags = [...mainDevTags, ...moreDevTags];

const mainOfficeTags = [
  { label: '视频生成', icon: Video, iconColor: TAG_ICON_COLORS[6] },
  { label: '幻灯片', icon: Presentation, iconColor: TAG_ICON_COLORS[7] },
  { label: '设计', icon: Palette, iconColor: TAG_ICON_COLORS[8] },
  { label: '深度研究', icon: Search, iconColor: TAG_ICON_COLORS[9] },
];
const moreOfficeTags = [
  { label: '文档处理', icon: FileText, iconColor: TAG_ICON_COLORS[0] },
  { label: '数据分析', icon: BarChart3, iconColor: TAG_ICON_COLORS[1] },
  { label: '数据可视化', icon: PieChart, iconColor: TAG_ICON_COLORS[2] },
  { label: '金融服务', icon: Landmark, iconColor: TAG_ICON_COLORS[3] },
  { label: '产品管理', icon: Package, iconColor: TAG_ICON_COLORS[4] },
  { label: '邮件编辑', icon: Mail, iconColor: TAG_ICON_COLORS[5] },
];
const officeTags = [...mainOfficeTags, ...moreOfficeTags];

/** 文档处理下的任务列表 */
const DOC_PROCESS_SUGGESTED_LABEL = '解析并提取文档内容，生成结构化摘要。';
const documentProcessingSubTags = [
  { label: DOC_PROCESS_SUGGESTED_LABEL, icon: FileText },
  { label: '将文档转换为指定格式（如 PDF 转 Word）。', icon: RefreshCw },
  { label: '批量处理文档，提取关键信息。', icon: ClipboardList },
  { label: '根据文档内容生成摘要或报告。', icon: BookOpen },
];

const ADD_FEATURE_LABEL = '在现有项目基础上，添加并完成新功能开发';
const REFACTOR_LABEL = '给代码做个重构，优化下逻辑。';
const FIX_BUG_LABEL = '修复下 bug，定位并修复系统存在的问题。';
const OPTIMIZE_PERF_LABEL = '优化代码结构，提升代码可维护性。';
const dailyDevSubTags = [
  { label: ADD_FEATURE_LABEL, icon: PlusCircle },
  { label: REFACTOR_LABEL, icon: RefreshCw },
  { label: FIX_BUG_LABEL, icon: Bug },
  { label: OPTIMIZE_PERF_LABEL, icon: Gauge },
];

const websiteDevSubTags = [
  { label: '企业官网', icon: Building2, image: 'https://picsum.photos/seed/enterprise/400/300' },
  { label: '后台管理', icon: LayoutDashboard, image: 'https://picsum.photos/seed/dashboard/400/300' },
  { label: '个人网站', icon: Globe2, image: 'https://picsum.photos/seed/personal/400/300' },
  { label: '电商首页', icon: Package, image: 'https://picsum.photos/seed/ecommerce/400/300' },
];

const videoExampleTags = [
  { label: '数字人知识口播视频', image: 'https://picsum.photos/seed/video1/400/300', prompt: '竖屏 9:16，高清质感，画面中是一位形象自然、表情温和的 AI 数字人，在简洁明亮的书房背景下进行知识讲解，口型与语音精准同步，画面稳定不晃动，搭配清晰居中的白色字幕、舒缓治愈的背景音乐，整体风格专业干净、适合干货科普与教程类短视频。' },
  { label: '图文轮播短视频', image: 'https://picsum.photos/seed/video2/400/300', prompt: '竖屏 9:16，由多张高清图片组成的流畅轮播视频，图片带有缓慢推进、渐入渐出的动态效果，转场自然柔和，搭配醒目的字幕、舒适轻快的背景音乐，整体节奏舒缓、画面统一高级，适合好物分享、书单、影单与语录类短视频。' },
  { label: 'AI 动画小故事视频', image: 'https://picsum.photos/seed/video3/400/300', prompt: '竖屏 9:16，2D 卡通治愈风格动画视频，拥有可爱的角色形象、明亮柔和的配色、温馨简单的场景与流畅自然的动作表演，搭配生动配音、清晰字幕和轻快背景音乐，整体氛围轻松治愈，适合儿童故事、情感小故事与道理科普类内容。' },
  { label: '商品展示带货短视频', image: 'https://picsum.photos/seed/video4/400/300', prompt: '竖屏 9:16，快节奏高清带货短视频，以产品多角度展示、细节特写、旋转展示为主，背景干净简约，画面质感高级，搭配突出卖点的文字特效、流畅转场和节奏感强的背景音乐，重点突出、视觉冲击力强，适合电商种草与带货推广。' },
  { label: '智能混剪短视频', image: 'https://picsum.photos/seed/video5/400/300', prompt: '竖屏 9:16，多素材智能混剪短视频，多镜头画面流畅拼接，转场自然、节奏紧凑，搭配合适的背景音乐与同步字幕，内容丰富有层次，画面氛围感强，适合生活记录、影视解说、探店、测评与日常 vlog 类内容。' },
  { label: '纯文案一键成片视频', image: 'https://picsum.photos/seed/video6/400/300', prompt: '竖屏 9:16，仅通过文案自动生成的 AI 短视频，根据文案内容智能匹配场景、镜头、画面风格与背景音乐，运镜流畅、氛围统一、节奏与文案高度契合，自动生成配音与字幕，无需任何素材即可快速生成完整高级短视频。' },
  { label: '音频转可视化视频', image: 'https://picsum.photos/seed/video7/400/300', prompt: '竖屏 9:16，将录音、播客或语音内容转化为可视化的短视频，画面包含动态音频波形效果，搭配简约干净的背景、自动同步的字幕与柔和舒缓的背景音乐，整体清晰专业，适合播客、知识分享、电台与语音解读类内容。' },
  { label: 'AI 文生创意短片', image: 'https://picsum.photos/seed/video8/400/300', prompt: '竖屏 9:16，电影级质感 AI 创意短片，画面细腻逼真、光影自然真实、运镜流畅高级，整体风格统一且艺术感强，可呈现写实、治愈、科幻、唯美等多种氛围，搭配合适字幕与背景音乐，适合创意短片、广告宣传、氛围感内容与艺术视觉类视频。' },
];

const slideExamplePrompts = [
  { label: '年度工作总结与来年规划', prompt: '制作一份面向公司全员 / 部门的「年度工作总结与来年规划」PPT，风格为稳重商务风，配色以深蓝 + 白色为主，突出专业、严谨的汇报氛围。内容结构包含：年度核心目标回顾、关键成果数据可视化（用柱状图 / 折线图展示业绩完成率、项目交付数量）、亮点案例与经验沉淀、问题与不足复盘、来年核心目标拆解（用 OKR 框架呈现）、重点项目 roadmap、资源需求与保障措施。每页保持大标题 + 精简要点 + 图表，避免大段文字，重点体现成果、反思与清晰规划，适合年终述职、部门汇报、公司年会场景。' },
  { label: '市场活动策划与执行方案', prompt: '制作一份面向市场 / 运营团队的「市场活动策划与执行方案」PPT，风格为活泼营销风，配色以品牌主色 + 明亮辅助色为主，传递活力、创意的氛围。内容结构包含：活动背景与目标（用 SMART 原则量化）、目标用户画像与触达渠道、活动核心玩法与创意亮点、推广节奏与时间轴（用甘特图展示）、预算分配与 ROI 预期、执行分工与责任矩阵、风险预案与数据复盘指标。每页用信息图 / 示意图展示玩法，重点突出活动创意、执行路径与效果预期，适合活动立项会、跨部门协作同步、领导审批场景。' },
  { label: '员工专业技能提升培训课程', prompt: '制作一份面向新员工 / 在岗员工的「专业技能提升培训」PPT，风格为清新教育风，配色以浅绿 + 米白为主，突出友好、易懂的学习氛围。内容结构包含：培训目标与适用人群、核心知识点拆解（用思维导图 / 步骤图呈现）、案例实操演示、常见问题与避坑指南、课后练习与考核要求、学习资源推荐。每页控制文字数量，多用示意图 / 流程图辅助理解，重点帮助学员快速掌握技能、落地应用，适合新人入职培训、岗位技能提升、内部知识分享场景。' },
  { label: '校园招聘宣讲与企业介绍', prompt: '制作一份面向高校毕业生的「校园招聘宣讲与企业介绍」PPT，风格为年轻活力风，配色以明亮橙 / 蓝 + 白色为主，传递亲切、有潜力的企业形象。内容结构包含：企业发展历程与业务版图、企业文化与价值观、核心岗位需求与发展路径、薪酬福利与人才培养体系、校招流程与内推机会、员工成长故事分享。每页多用图片 / 图标替代文字，重点吸引应届生、展示企业吸引力，适合校园宣讲会、招聘会、线上直播招聘场景。' },
];

const cicdExamplePrompts = [
  { label: '流水线配置与部署脚本', prompt: '帮我搭建一套 CI/CD 流水线，用于【请描述项目类型与部署环境，如 Node 前端、Docker 容器、K8s】。要求：包含代码检出、依赖安装、构建、测试、打包/镜像构建、部署步骤；支持分支策略（如 main 自动发布、PR 仅跑测试）；提供 YAML 或脚本示例，可在 GitHub Actions / GitLab CI / Jenkins 中直接使用。' },
  { label: '定时备份与批量部署', prompt: '帮我实现定时备份与批量部署方案：【请描述备份对象（数据库/文件/配置）与部署目标（多台服务器/多环境）】。要求：支持 cron 定时执行；备份结果可压缩、带时间戳、保留最近 N 份；部署支持一键或分批、回滚能力；考虑权限与密钥管理，给出脚本或流水线配置示例。' },
  { label: '自动化测试与质量门禁', prompt: '帮我在 CI 中接入自动化测试与质量门禁：【请描述技术栈与测试类型，如单元测试、E2E、Lint、安全扫描】。要求：每次 PR/推送触发测试；失败时阻断合并；可配置覆盖率阈值、超时与重试；输出测试报告与趋势，给出对应流水线配置或脚本。' },
  { label: '多环境发布与回滚', prompt: '帮我设计多环境发布与回滚流程：【请描述环境与发布方式，如 开发→测试→预发→生产，蓝绿/金丝雀】。要求：环境间可一键发布、审批节点可配置；支持一键回滚到上一版本；发布记录与变更可追溯；给出流水线或脚本示例。' },
];

const docExamplePrompts = [
  { label: '解析并提取文档内容，生成结构化摘要', prompt: '解析并提取文档内容，生成结构化摘要。请根据我上传的文档进行处理，支持 PDF、Word、Excel、PPT、TXT、Markdown 等格式；提取正文、标题、段落、表格与关键信息，输出结构化摘要或 JSON，便于后续检索与引用。' },
  { label: '将文档转换为指定格式', prompt: '将文档转换为指定格式（如 PDF 转 Word、Word 转 PDF、Excel 转 CSV 等）。请根据我提供的源文件与目标格式进行转换，保留版式与关键内容，并说明所用工具或脚本示例。' },
  { label: '批量处理文档，提取关键信息', prompt: '批量处理文档，提取关键信息。我有一批【请描述文档类型与数量】需要统一处理：提取指定字段、生成清单或报表、去重与合并等。请给出处理思路、脚本或流水线示例，支持本地或命令行批量执行。' },
  { label: '根据文档内容生成摘要或报告', prompt: '根据文档内容生成摘要或报告。请针对我上传的文档（如合同、论文、会议纪要、长文章）生成简明摘要、要点列表或结构化报告，可选不同长度与风格，便于快速把握核心内容。' },
];

const dataAnalysisExamplePrompts = [
  { label: '数据探查与描述统计', prompt: '帮我做数据探查与描述统计：【请描述数据来源与格式，如 CSV/Excel 路径或表格说明】。要求：识别字段类型、缺失值/异常值统计、均值/中位数/方差/分布；输出简明报告与建议处理方式。' },
  { label: '多维度对比与趋势分析', prompt: '帮我做多维度对比与趋势分析：【请描述分析目标、维度与时间范围】。要求：按维度聚合、同比环比、趋势线或关键拐点；给出结论与可视化建议（如折线图、柱状图）。' },
  { label: '相关性分析与归因', prompt: '帮我做相关性分析与归因：【请描述指标与可能影响因素】。要求：计算相关系数、简单归因或回归思路；指出主要驱动因素与可优化方向。' },
  { label: '报表与看板指标设计', prompt: '帮我设计报表与看板指标：【请描述业务场景与关注点】。要求：给出核心指标定义、计算口径、更新频率与展示建议（表格/图表类型）。' },
];

const financialServiceExamplePrompts = [
  { label: '财报解读与关键指标提炼', prompt: '帮我解读财报并提炼关键指标：【请提供或描述财报/公司名称】。要求：收入与利润结构、现金流、主要比率（如 ROE、负债率）；总结亮点与风险点。' },
  { label: '行业与竞品财务对比', prompt: '帮我做行业与竞品财务对比：【请描述行业与对比公司/时间范围】。要求：营收/利润/增速等可比指标、市占与排名；给出简要结论。' },
  { label: '投资逻辑与估值要点', prompt: '帮我整理投资逻辑与估值要点：【请描述标的与投资类型，如股票/债券/项目】。要求：核心逻辑、估值方法（PE/PB/DCF 等）、关键假设与风险提示。' },
  { label: '合规与风控说明文档', prompt: '帮我起草合规与风控说明文档：【请描述产品/业务与适用监管要求】。要求：合规要点、风险分类、控制措施与披露建议，结构清晰可直接用于内外部汇报。' },
];

const emailEditExamplePrompts = [
  { label: '商务邮件撰写与润色', prompt: '帮我撰写或润色一封商务邮件：【请说明场景、对象、目的与要点】。要求：称呼与结尾得体、逻辑清晰、语气专业，可直接发送或微调使用。' },
  { label: '批量邮件模板与个性化', prompt: '帮我设计批量邮件模板并支持个性化：【请描述受众与变量，如姓名、公司、产品】。要求：通用正文模板、变量占位与示例，便于群发时替换。' },
  { label: '跟进与催办邮件', prompt: '帮我写一封跟进/催办邮件：【请说明跟进事项、对方身份与期望动作】。要求：礼貌不施压、信息完整、明确下一步与截止时间。' },
  { label: '感谢与反馈邮件', prompt: '帮我写感谢或反馈邮件：【请说明场景，如面试后、合作后、收到帮助后】。要求：真诚简洁、突出具体感谢点，可选附后续合作或保持联系。' },
];

const productManagementExamplePrompts = [
  { label: '需求文档与用户故事', prompt: '帮我写需求文档与用户故事：【请描述功能或产品模块、目标用户与场景】。要求：背景、目标、用户故事（As a... I want... So that...）、验收标准与优先级建议。' },
  { label: 'PRD 与功能清单', prompt: '帮我起草 PRD 与功能清单：【请描述产品/版本与核心功能】。要求：产品目标、用户画像、功能列表与优先级、非功能需求（性能/安全等）、里程碑建议。' },
  { label: '竞品分析与差异点', prompt: '帮我做竞品分析与差异点总结：【请列出竞品与关注维度】。要求：功能/体验/定价等对比、优劣势、差异化建议与可借鉴点。' },
  { label: '版本发布说明与公告', prompt: '帮我写版本发布说明与公告：【请描述版本号、主要更新与受众】。要求：更新亮点、使用指引、已知问题与反馈渠道，适合对外发布或内部同步。' },
];

const deepResearchExamplePrompts = [
  { label: '2026年全球Top10 AI模型对比研究', prompt: '请研究2026年全球表现最优的10个AI模型，对比分析它们在编码、多模态等关键能力上的表现，并总结各自的技术特点和优势场景。' },
  { label: '国际咨询公司AI战略服务与竞争策略', prompt: '请深度研究国际咨询公司的AI战略服务与竞争策略，分析其服务内容、市场格局与主要玩家的差异化策略。' },
  { label: 'AI Coding 行业商业模式演变分析', prompt: '分析 AI Coding 行业的商业模式演变，从 2023 年到现在，找出关键转折点和驱动因素。' },
  { label: '近十年国际金价走势与影响因素', prompt: '研究近十年国际金价的走势变化、关键影响因素及未来趋势，分析地缘政治、货币政策、通胀等因素对金价的影响。' },
];

const SLIDE_TEMPLATE_TABS = ['全部', '政务', '商务', '学术', '校园'] as const;
type SlideTemplateTab = (typeof SLIDE_TEMPLATE_TABS)[number];

const slideTemplates: { label: string; image: string; category: Exclude<SlideTemplateTab, '全部'> }[] = [
  { label: '政务庄重', image: 'https://picsum.photos/seed/slide-gov1/400/225', category: '政务' },
  { label: '民生亲和', image: 'https://picsum.photos/seed/slide-gov2/400/225', category: '政务' },
  { label: '法治规范', image: 'https://picsum.photos/seed/slide-gov3/400/225', category: '政务' },
  { label: '政务简报', image: 'https://picsum.photos/seed/slide-gov4/400/225', category: '政务' },
  { label: '极简高效', image: 'https://picsum.photos/seed/slide-biz1/400/225', category: '商务' },
  { label: '路演质感', image: 'https://picsum.photos/seed/slide-biz2/400/225', category: '商务' },
  { label: '科技数字', image: 'https://picsum.photos/seed/slide-biz3/400/225', category: '商务' },
  { label: '通用扁平', image: 'https://picsum.photos/seed/slide-biz4/400/225', category: '商务' },
  { label: '学术严谨', image: 'https://picsum.photos/seed/slide-edu1/400/225', category: '学术' },
  { label: '教研清晰', image: 'https://picsum.photos/seed/slide-edu2/400/225', category: '学术' },
  { label: '数据洞察', image: 'https://picsum.photos/seed/slide-edu3/400/225', category: '学术' },
  { label: '当代学术', image: 'https://picsum.photos/seed/slide-edu4/400/225', category: '学术' },
  { label: '青春治愈', image: 'https://picsum.photos/seed/slide-campus1/400/225', category: '校园' },
  { label: '创意活力', image: 'https://picsum.photos/seed/slide-campus2/400/225', category: '校园' },
  { label: '毕业纪念', image: 'https://picsum.photos/seed/slide-campus3/400/225', category: '校园' },
  { label: '公益清新', image: 'https://picsum.photos/seed/slide-campus4/400/225', category: '校园' },
];

const agentAppSubTags = [
  { label: '设计优化', icon: Palette },
  { label: '文件处理', icon: FileText },
  { label: '代码生成', icon: Code },
  { label: '自动化', icon: Zap },
];

const AGENT_DESIGN_OPTIMIZATION_PROMPT = '帮我创建一个 Skill，功能是【请描述 Skill 功能】。要求：定义清晰的触发词和执行逻辑。';
const AGENT_FILE_PROCESSING_PROMPT = '帮我开发一个文件处理 Skill，能够【请描述文件处理能力，如批量重命名、格式转换等】。';
const AGENT_CODE_GENERATION_PROMPT = '帮我开发一个代码生成 Skill，根据【请描述输入，如数据库表结构、API 定义等】自动生成代码。';
const AGENT_AUTOMATION_PROMPT = '帮我开发一个自动化 Skill，实现【请描述自动化任务，如定时备份、批量部署等】。';

const agentExamplePrompts = [
  { label: 'Agent Web 应用', prompt: '帮我创建一个 Agent Web 应用，实现【请描述功能与交互】。要求：Web 端可访问、支持多轮对话与任务执行。', icon: Globe2 },
  { label: '聊天 Agent 应用', prompt: '帮我创建一个聊天 Agent 应用，实现【请描述对话场景与能力】。要求：支持自然语言对话、上下文理解与回复生成。', icon: MessageCircle },
  { label: '客户端 Agent Web 应用', prompt: '帮我创建一个客户端 Agent Web 应用，实现【请描述客户端能力】。要求：可在浏览器或桌面客户端内使用，支持与后端 Agent 协作。', icon: Monitor },
  { label: '智能客服应用', prompt: '帮我创建一个智能客服应用，实现【请描述客服场景】。要求：支持常见问题解答、工单处理与转人工，可接入现有客服流程。', icon: Headphones },
];

const designExamplePrompts = [
  { label: '海报宣传', prompt: '帮我设计海报宣传物料，主题是【请描述活动/产品主题与用途】。要求：视觉突出、信息层级清晰、适合线上线下传播。', icon: Image },
  { label: '品牌设计', prompt: '帮我进行品牌设计，【请描述品牌名称、行业与需求】。要求：包含 logo 方向、主视觉、色彩与应用规范。', icon: Palette },
  { label: '风格插画', prompt: '帮我创作风格插画，【请描述风格与场景】。要求：风格统一、适合用于封面、海报或内容配图。', icon: PenTool },
  { label: '电商营销', prompt: '帮我设计电商营销素材，【请描述产品与促销活动】。要求：突出卖点、适合主图、详情页或活动页使用。', icon: ShoppingCart },
  { label: '包装设计', prompt: '帮我做包装设计，【请描述产品类型与规格】。要求：兼顾美观与工艺可行性，适合量产落地。', icon: Package },
  { label: 'APP应用设计', prompt: '帮我设计 APP 应用界面与交互，【请描述应用类型、核心功能与目标用户】。要求：符合 iOS/Android 设计规范、信息架构清晰、体验流畅易用。', icon: Smartphone },
];

const SKILL_PROMPT_1 = '开发一个联网搜索 Skill，支持用户输入查询关键词、返回条数、时间范围、指定站点等参数，通过调用第三方搜索引擎 API（如 Bing Web Search、Tavily 或通用搜索接口）获取实时网页结果；对搜索到的网页进行正文抽取，自动去除广告、导航、侧边栏等无关内容，只保留正文文本；对结果按相关性、时效性、权威度进行排序，最终返回结构化数据，包括标题、链接、正文摘要、发布时间、来源域名，支持分页与结果去重，同时处理网络异常、API 调用失败、超时等异常情况。';
const SKILL_PROMPT_2 = '开发一个多格式文档处理 Skill，支持上传或读取本地 / 网络 PDF、Word（docx）、Excel（xlsx）、PPT（pptx）、TXT、Markdown 文件，自动识别文件类型并调用对应解析库；支持提取文本、表格、页码、段落、元数据（作者、创建时间、页数）；Excel 可读取所有 sheet、单元格值、公式结果与简单图表数据；PPT 可提取大纲与每页文本内容；对大文件支持流式解析、分块读取避免内存溢出；最终统一输出标准化 JSON 结构，包含文件信息、分页内容、表格数据、纯文本全文，并提供错误码与失败原因。';
const SKILL_PROMPT_3 = '开发一个长文本智能总结 Skill，支持输入超长文本、对话记录、文章、视频字幕、会议记录；支持生成短摘要、中摘要、长摘要三种长度，可提取关键词、关键句、核心要点；对超长文本自动分段、递归总结避免超限；可选择使用 LLM 生成式摘要或传统算法（TextRank/TF-IDF）实现抽取式摘要；支持中英文自动识别与适配；输出结构化结果：摘要文本、分点要点、关键词列表、原文浓缩比例、置信度，并保留原文引用位置。';
const SKILL_PROMPT_4 = '开发一个自动化数据分析 Skill，支持读取 CSV、Excel、JSON 格式数据，自动进行数据探查：字段类型识别、缺失值统计、异常值检测、重复值处理；提供基础统计分析：均值、中位数、方差、最值、分布、相关性分析；支持折线图、柱状图、饼图、散点图、直方图等可视化图表生成，以 Base64 图片格式或图表数据返回；自动生成自然语言分析报告，给出数据结论；支持用户指定分析维度与目标；处理空数据、格式错误、超大表格等边界情况，保证结果稳定可读。';
const SKILL_PROMPT_5 = '开发一个任务流程编排 Skill，基于 DAG 有向无环图实现多步骤任务自动化执行，支持顺序执行、条件分支、循环、子流程调用；可串联调用其他 Skill，支持参数传递、变量存储、上下文持久化；提供异步执行、任务状态查询、中断与重试机制；记录完整执行日志、每步耗时、返回结果与错误信息；支持流程模板保存与加载；处理节点依赖、循环死锁、节点执行失败、超时等异常，具备降级与容错能力，最终返回整体流程执行结果与日志链路。';
const SKILL_PROMPT_6 = '开发一个无头浏览器自动化 Skill，基于 Playwright 或 Selenium 实现，支持打开 URL、等待页面加载、元素定位（XPath/CSS 选择器）、点击、输入文本、滚动、截图、获取页面 HTML / 文本；支持处理登录、验证码提示、弹窗、下拉框、iframe 等复杂页面场景；可保持 Cookie 与登录状态；支持自定义请求头、代理、UA 伪装；返回页面内容、截图 Base64、页面标题、当前 URL、执行状态；限制访问时长与资源占用，防止页面卡死与内存泄漏。';
const SKILL_PROMPT_7 = '开发一个代码生成与沙箱执行 Skill，支持 Python、JavaScript、Shell、SQL 等常见语言；提供隔离沙箱环境，严格限制文件读写、网络请求、系统命令、硬件访问；支持设置 CPU、内存、运行超时限制；接收用户代码或 AI 生成代码，编译运行后捕获标准输出、标准错误、返回值、运行耗时；自动检测高危代码并拦截；对运行异常、语法错误、超时、资源超限给出明确错误信息；不保存用户代码，保证安全与隐私。';
const SKILL_PROMPT_8 = '开发一个多场景内容生成 Skill，内置短视频脚本、公众号文章、小红书文案、邮件、周报、公告、广告语、简历、演讲稿等模板；支持指定风格（正式、口语、活泼、专业、严肃）、字数、语气、目标受众、结构格式；通过 LLM 结合提示词工程生成高质量内容；支持续写、润色、扩写、缩写、修改优化；可生成标题、大纲、正文、标签、话题；返回结构化结果：标题、正文、要点、建议标签、使用说明，支持一键导出。';
const SKILL_PROMPT_9 = '开发一个私有知识库检索问答 Skill，支持文档导入、文本切片、向量化编码、存入向量数据库（Chroma/FAISS/Pinecone）；根据用户问题进行语义检索，召回最相关片段，经过重排后送入 LLM 生成带依据的回答；支持设置召回数量、相似度阈值；回答中自动标注来源片段、文档名称、页码；支持增量更新知识库、删除文档、清空库；处理语义模糊、无匹配结果、超长问题等情况，保证回答准确、不编造、可追溯。';
const SKILL_PROMPT_10 = '开发一个全局 Skill 调用安全审计 Skill，作为所有 Skill 的统一调用网关，对每一次调用进行权限校验、参数合法性检查、风险行为识别、敏感内容过滤、调用频率限流；拦截高危操作：文件删除、系统命令、网络外发、隐私读取；记录完整调用日志：用户 ID、Skill 名称、参数、时间、IP、结果、风险等级；支持白名单、黑名单、权限策略配置；输出允许 / 拒绝结果、风险描述、建议处理方式，确保整个 Skill 体系安全可控。';

const skillExamplePrompts = [
  { label: '联网搜索 Skill', prompt: SKILL_PROMPT_1, icon: Search },
  { label: '文档处理 Skill', prompt: SKILL_PROMPT_2, icon: FileText },
  { label: '总结提炼 Skill', prompt: SKILL_PROMPT_3, icon: ClipboardList },
  { label: '数据分析 Skill', prompt: SKILL_PROMPT_4, icon: BarChart3 },
  { label: '流程自动化 Skill', prompt: SKILL_PROMPT_5, icon: GitBranch },
  { label: '浏览器自动化 Skill', prompt: SKILL_PROMPT_6, icon: Monitor },
  { label: '代码生成 & 执行 Skill', prompt: SKILL_PROMPT_7, icon: Code },
  { label: '内容创作 Skill', prompt: SKILL_PROMPT_8, icon: Palette },
  { label: '知识库 Skill', prompt: SKILL_PROMPT_9, icon: BookOpen },
  { label: '安全审计 Skill', prompt: SKILL_PROMPT_10, icon: ShieldCheck },
];

const ENTERPRISE_WEBSITE_PROMPT = '帮我开发一个企业官网，公司名称是【公司名称】，主营业务是【业务描述】。要求：包含首页、关于我们、产品服务、联系我们页面，风格简约大气。';
const ADMIN_SYSTEM_PROMPT = '帮我开发一个后台管理系统，用于管理【管理内容】。要求：包含登录页、数据看板、列表管理、表单编辑功能，支持响应式布局。';
const PERSONAL_WEBSITE_PROMPT = '帮我开发一个个人网站，网站题是【网站题】。要求：包含文章列表、文章详情、标签分类、关于页面，支持 Markdown 渲染。';
const ECOMMERCE_HOMEPAGE_PROMPT = '帮我开发一个电商网站首页，售卖【商品类型】。要求：包含轮播图、商品分类、热门商品展示、促销活动区域。';
const ADD_FEATURE_PROMPT = '在现有项目基础上，添加并完成新功能开发：【功能描述】。';
const REFACTOR_CODE_PROMPT = '给代码做个重构，优化下逻辑。';
const FIX_BUG_PROMPT = '修复下 bug，定位并修复系统存在的问题。';
const OPTIMIZE_PERFORMANCE_PROMPT = '优化代码结构，提升代码可维护性。';

const DOC_PROCESS_SUGGESTED_PROMPT = '解析并提取文档内容，生成结构化摘要。请根据我上传的文档进行处理。';
const DOC_PROCESS_CONVERT_PROMPT = '将文档转换为指定格式（如 PDF 转 Word）。';
const DOC_PROCESS_BATCH_PROMPT = '批量处理文档，提取关键信息。';
const DOC_PROCESS_SUMMARY_PROMPT = '根据文档内容生成摘要或报告。';

const skillsForDropdown = [
  { id: '1', name: 'find-skills', description: '帮助用户发现和安装智能体技能。当用户提出「我需要一个能...」类型的请求时自动触发。' },
  { id: '2', name: 'workbuddy-channel-setup', description: '使用 playwright-cli 自动配置 WorkBuddy 架构中的频道和集成设置。' },
  { id: '3', name: 'agentmail', description: 'AI 智能体邮箱。收发邮件、通过专属 @agentmail 地址管理邮件通信。' },
  { id: '4', name: 'gifgrep', description: '通过 CLI/TUI 搜索 GIF 提供商、下载结果并提取关键帧用于内容创作。' },
  { id: '5', name: 'xiaohongshu', description: '小红书（RedNote）内容工具。使用场景：搜索笔记、分析热门趋势、生成内容草稿。' },
  { id: '6', name: 'github', description: '使用 \'gh\' CLI 与 GitHub 交互。管理 Issues、PR、仓库和 Actions 工作流。' },
];

export function ChatArea({ onToggleResults, inputRef, onEnterAgentAnswer, showStartNewAndTags = true }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const isEyesLookingDown = inputFocused || input.trim().length > 0;
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [autoMenuOpen, setAutoMenuOpen] = useState(false);
  const [craftMenuOpen, setCraftMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [selectedCraft, setSelectedCraft] = useState('Craft');
  const [activeCard, setActiveCard] = useState(0);
  const [skillsMenuOpen, setSkillsMenuOpen] = useState(false);
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');
  const [selectedQuickTag, setSelectedQuickTag] = useState<typeof devTags[0] | null>(null);
  const [selectedWebsiteSubTag, setSelectedWebsiteSubTag] = useState<typeof websiteDevSubTags[0] | null>(null);
  const [selectedDailySubTag, setSelectedDailySubTag] = useState<typeof dailyDevSubTags[0] | null>(null);
  const [selectedAgentSubTag, setSelectedAgentSubTag] = useState<typeof agentAppSubTags[0] | null>(null);
  const [selectedAgentExamplePrompt, setSelectedAgentExamplePrompt] = useState<typeof agentExamplePrompts[0] | null>(null);
  const [selectedSkillExamplePrompt, setSelectedSkillExamplePrompt] = useState<typeof skillExamplePrompts[0] | null>(null);
  const [selectedVideoExample, setSelectedVideoExample] = useState<typeof videoExampleTags[0] | null>(null);
  const [selectedSlideExamplePrompt, setSelectedSlideExamplePrompt] = useState<typeof slideExamplePrompts[0] | null>(null);
  const [selectedSlideTemplate, setSelectedSlideTemplate] = useState<typeof slideTemplates[0] | null>(null);
  const [selectedSlideTemplateTab, setSelectedSlideTemplateTab] = useState<SlideTemplateTab>('全部');
  const [selectedCicdExamplePrompt, setSelectedCicdExamplePrompt] = useState<typeof cicdExamplePrompts[0] | null>(null);
  const [selectedDocExamplePrompt, setSelectedDocExamplePrompt] = useState<typeof docExamplePrompts[0] | null>(null);
  const [selectedDataAnalysisExamplePrompt, setSelectedDataAnalysisExamplePrompt] = useState<typeof dataAnalysisExamplePrompts[0] | null>(null);
  const [selectedFinancialServiceExamplePrompt, setSelectedFinancialServiceExamplePrompt] = useState<typeof financialServiceExamplePrompts[0] | null>(null);
  const [selectedEmailEditExamplePrompt, setSelectedEmailEditExamplePrompt] = useState<typeof emailEditExamplePrompts[0] | null>(null);
  const [selectedProductManagementExamplePrompt, setSelectedProductManagementExamplePrompt] = useState<typeof productManagementExamplePrompts[0] | null>(null);
  const [selectedDesignExamplePrompt, setSelectedDesignExamplePrompt] = useState<typeof designExamplePrompts[0] | null>(null);
  const [selectedDeepResearchExamplePrompt, setSelectedDeepResearchExamplePrompt] = useState<typeof deepResearchExamplePrompts[0] | null>(null);
  const [selectedDocProcessSubTag, setSelectedDocProcessSubTag] = useState<typeof documentProcessingSubTags[0] | null>(null);
  const [skillChipHover, setSkillChipHover] = useState(false);
  const [moreTagsMenuOpen, setMoreTagsMenuOpen] = useState(false);
  const [moreOfficeTagsMenuOpen, setMoreOfficeTagsMenuOpen] = useState(false);
  const [refWebsiteModalOpen, setRefWebsiteModalOpen] = useState(false);
  const [refWebsiteUrl, setRefWebsiteUrl] = useState('');
  const [refVideoModalOpen, setRefVideoModalOpen] = useState(false);
  const [refVideoUrl, setRefVideoUrl] = useState('');
  const [videoRatio, setVideoRatio] = useState('16:9');
  const [videoRatioMenuOpen, setVideoRatioMenuOpen] = useState(false);
  const [firstFrame, setFirstFrame] = useState<{ file: File; preview: string } | null>(null);
  const [lastFrame, setLastFrame] = useState<{ file: File; preview: string } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [contextModalOpen, setContextModalOpen] = useState(false);
  const [contextText, setContextText] = useState('');
  const firstFrameInputRef = useRef<HTMLInputElement>(null);
  const lastFrameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const contextModalRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const autoMenuRef = useRef<HTMLDivElement>(null);
  const craftMenuRef = useRef<HTMLDivElement>(null);
  const skillsMenuRef = useRef<HTMLDivElement>(null);
  const moreTagsMenuRef = useRef<HTMLDivElement>(null);
  const moreOfficeTagsMenuRef = useRef<HTMLDivElement>(null);
  const refWebsiteModalRef = useRef<HTMLDivElement>(null);
  const refVideoModalRef = useRef<HTMLDivElement>(null);
  const videoRatioMenuRef = useRef<HTMLDivElement>(null);

  const videoRatioOptions = ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9'] as const;

  const filteredSkillsForDropdown = skillsForDropdown.filter(
    (s) =>
      s.name.toLowerCase().includes(skillsSearchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(skillsSearchQuery.toLowerCase())
  );

  // 从输入中解析已选技能（/ 技能名 形式，斜杠后带空格防误删），用于按钮显示数量
  const selectedSkillNamesFromInput = useMemo(() => {
    const names = skillsForDropdown.map((s) => s.name);
    const regex = /\/\s*([a-z0-9-]+)/g;
    const found: string[] = [];
    let m;
    while ((m = regex.exec(input)) !== null) {
      if (names.includes(m[1])) found.push(m[1]);
    }
    return found;
  }, [input]);

  const skillsButtonLabel =
    selectedSkillNamesFromInput.length > 0
      ? String(selectedSkillNamesFromInput.length)
      : 'Skills';

  const handleSelectSkill = (skillName: string) => {
    const token = `/ ${skillName} `;
    const textarea = inputRef?.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = input.slice(0, start);
      const after = input.slice(end);
      setInput(before + token + after);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + token.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      setInput((prev) => prev + token);
    }
    setSkillsMenuOpen(false);
  };

  const skillNamesEscaped = skillsForDropdown.map((s) =>
    s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|');
  // 匹配 “/ 技能名 ” 中“技能名 ”部分，删除时只删技能名+末尾空格，保留斜杠后中间空格防误删
  const skillTokenRegex = new RegExp(`/\\s+((?:${skillNamesEscaped})\\s*)$`);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if ((input.trim() || attachedFiles.length) && onEnterAgentAnswer) {
        e.preventDefault();
        handleSubmitToAgent();
        return;
      }
    }
    if (e.key !== 'Backspace') return;
    const textarea = e.currentTarget;
    const pos = textarea.selectionStart;
    if (pos === 0) return;
    const before = input.slice(0, pos);
    const m = before.match(skillTokenRegex);
    if (m) {
      e.preventDefault();
      const toRemove = m[1];
      const start = pos - toRemove.length;
      setInput(input.slice(0, start) + input.slice(pos));
      setTimeout(() => textarea.setSelectionRange(start, start), 0);
    }
  };

  const handleSubmitToAgent = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    let message = input.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => f.name).join('、');
      message = message ? `${message}\n\n已附加文件：${fileNames}` : `已附加文件：${fileNames}`;
    }
    if (message) onEnterAgentAnswer?.(message);
    setInput('');
    setAttachedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const applyContext = () => {
    if (contextText.trim()) {
      setInput((prev) => (prev ? `${prev}\n\n--- 附加上下文 ---\n${contextText.trim()}` : `--- 附加上下文 ---\n${contextText.trim()}`));
    }
    setContextText('');
    setContextModalOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
      if (autoMenuRef.current && !autoMenuRef.current.contains(e.target as Node)) {
        setAutoMenuOpen(false);
      }
      if (craftMenuRef.current && !craftMenuRef.current.contains(e.target as Node)) {
        setCraftMenuOpen(false);
      }
      if (skillsMenuRef.current && !skillsMenuRef.current.contains(e.target as Node)) {
        setSkillsMenuOpen(false);
      }
      if (moreTagsMenuRef.current && !moreTagsMenuRef.current.contains(e.target as Node)) {
        setMoreTagsMenuOpen(false);
      }
      if (moreOfficeTagsMenuRef.current && !moreOfficeTagsMenuRef.current.contains(e.target as Node)) {
        setMoreOfficeTagsMenuOpen(false);
      }
      if (refWebsiteModalRef.current && !refWebsiteModalRef.current.contains(e.target as Node)) {
        setRefWebsiteModalOpen(false);
      }
      if (refVideoModalRef.current && !refVideoModalRef.current.contains(e.target as Node)) {
        setRefVideoModalOpen(false);
      }
      if (contextModalRef.current && !contextModalRef.current.contains(e.target as Node)) {
        setContextModalOpen(false);
      }
      if (videoRatioMenuRef.current && !videoRatioMenuRef.current.contains(e.target as Node)) {
        setVideoRatioMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setAddMenuOpen(false);
      setAutoMenuOpen(false);
      setCraftMenuOpen(false);
      setSkillsMenuOpen(false);
      setMoreTagsMenuOpen(false);
      setMoreOfficeTagsMenuOpen(false);
      setRefWebsiteModalOpen(false);
      setRefVideoModalOpen(false);
      setContextModalOpen(false);
      setVideoRatioMenuOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const TEXTAREA_MAX_HEIGHT = 400;
  const adjustTextareaHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
  };
  useEffect(() => {
    adjustTextareaHeight(inputRef?.current ?? null);
  }, [input]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-card">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="*/*"
        onChange={handleFileSelect}
      />
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        multiple
        className="hidden"
        onChange={handleFolderSelect}
      />
      {/* Scrollable content area - pb-32 so last message can scroll behind input bar */}
      <div className="flex-1 overflow-y-auto smooth-scroll scrollbar-hide pb-32">
        <div className="max-w-[820px] mx-auto px-6 pt-64 pb-6">
          {/* Logo 区域：标题上方固定占位，可替换为品牌 logo */}
          <div
            className="flex justify-center mb-8 min-h-[80px]"
            aria-label="Logo 区域"
          >
            <div className="w-[80px] h-[80px] flex items-center justify-center rounded-2xl overflow-hidden shrink-0 relative">
              {showStartNewAndTags ? (
                <>
                  <img
                    src="/logo.png"
                    alt="WorkBuddy"
                    className="absolute inset-0 w-full h-full object-contain object-center dark:hidden"
                    style={{ objectPosition: '50% 50%' }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.closest('div')?.querySelector('.logo-fallback') as HTMLElement | null;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <img
                    src="/logo_dark.png"
                    alt="WorkBuddy"
                    className="absolute inset-0 w-full h-full object-contain object-center hidden dark:!block"
                    style={{ objectPosition: '50% 50%' }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.setProperty('display', 'none', 'important');
                      const fallback = target.closest('div')?.querySelector('.logo-fallback') as HTMLElement | null;
                      if (fallback) {
                        fallback.style.setProperty('display', 'flex', 'important');
                        fallback.classList.add('relative', 'z-10');
                      }
                    }}
                  />
                </>
              ) : (
                <img
                  src="/claw_logo.png"
                  alt="WorkBuddy"
                  className="absolute inset-0 w-full h-full object-contain object-center"
                  style={{ objectPosition: '50% 50%' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.closest('div')?.querySelector('.logo-fallback') as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              )}
              {/* eyes 叠加：可眨眼；输入框聚焦或有内容时眼睛下移 */}
              {showStartNewAndTags ? (
                <>
                  <img
                    src="/eyes.svg"
                    alt=""
                    className={`absolute left-1/2 w-[36px] h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none dark:hidden transition-[top] duration-200 ${isEyesLookingDown ? 'top-[72%]' : 'top-[66%]'}`}
                    style={{ animation: 'eyes-blink 3.5s ease-in-out infinite' }}
                    aria-hidden
                  />
                  <img
                    src="/eyes%20dark.svg"
                    alt=""
                    className={`absolute left-1/2 w-[36px] h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none hidden dark:!block transition-[top] duration-200 ${isEyesLookingDown ? 'top-[72%]' : 'top-[66%]'}`}
                    style={{ animation: 'eyes-blink 3.5s ease-in-out infinite' }}
                    aria-hidden
                  />
                </>
              ) : (
                <img
                  src="/eyes.svg"
                  alt=""
                  className={`absolute left-1/2 w-[36px] h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none transition-[top] duration-200 ${isEyesLookingDown ? 'top-[72%]' : 'top-[66%]'}`}
                  style={{ animation: 'eyes-blink 3.5s ease-in-out infinite' }}
                  aria-hidden
                />
              )}
              <span
                className="logo-fallback hidden absolute inset-0 w-full h-full items-center justify-center text-2xl font-semibold text-foreground/70"
                style={{ fontFamily: "'Alice', serif" }}
              >
                WB
              </span>
            </div>
          </div>
          {!showStartNewAndTags ? (
            <div className="text-center mb-10">
              <h1 className="text-4xl tracking-tight text-foreground mb-3" style={{ fontFamily: "'Alice', serif" }}>Claw Your Ideas Into Reality</h1>
            </div>
          ) : (
          <div className="hidden text-center mb-10">
            <h1 className="text-4xl tracking-tight text-foreground mb-3" style={{ fontWeight: 700, fontFamily: "'Alice', serif" }}>Claw Your Ideas into reality</h1>
          </div>
          )}

          {showStartNewAndTags && (
          <>
          {/* 开始新的 [代码开发/日常办公] 任务 */}
          <div className="mb-8 flex justify-center items-center gap-2 flex-wrap">
            <span className="text-lg text-foreground font-semibold" style={{ fontWeight: 600 }}>开始新的</span>
            <div className="inline-flex items-center">
              <div className="inline-flex items-center rounded-full border border-foreground/15 bg-card py-0 pl-0 pr-0 gap-1">
                <button
                  onClick={() => setActiveCard(0)}
                  className={`inline-flex items-center justify-center h-11 min-h-11 px-6 rounded-full text-base transition-all ${
                    activeCard === 0
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                  style={{ fontWeight: activeCard === 0 ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)' }}
                >
                  <TerminalPromptIcon className="w-5 h-5 shrink-0 mr-2" />
                  代码开发
                </button>
                <button
                  onClick={() => setActiveCard(1)}
                  className={`inline-flex items-center justify-center h-11 min-h-11 px-6 rounded-full text-base transition-all ${
                    activeCard === 1
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                  style={{ fontWeight: activeCard === 1 ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)' }}
                >
                  <ClipboardList className="w-5 h-5 shrink-0 mr-1.5" strokeWidth={1.75} />
                  日常办公
                </button>
              </div>
              <span className="text-lg text-foreground font-semibold ml-2" style={{ fontWeight: 600 }}>任务</span>
            </div>
          </div>
          </>
          )}

          {/* Input Area：代码开发下描边与确认按钮为蓝色 */}
          <div className={`rounded-2xl border bg-card transition-colors ${activeCard === 0 ? 'border-primary-strong focus-within:border-primary-strong dark:border-primary-bright dark:focus-within:border-primary-bright' : activeCard === 1 ? 'border-green-500 focus-within:border-green-500 dark:border-green-400 dark:focus-within:border-green-400' : 'border-foreground/15 focus-within:border-foreground/30'}`} style={{ boxShadow: '0 8px 32px -4px rgb(0 0 0 / 0.06)' }}>
            {selectedQuickTag?.label === '视频生成' && (
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`group relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-muted/30 pl-1 py-1 min-h-8 ${firstFrame ? 'pr-8' : 'pr-3'}`}>
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input
                        ref={firstFrameInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            firstFrame?.preview && URL.revokeObjectURL(firstFrame.preview);
                            setFirstFrame({ file: f, preview: URL.createObjectURL(f) });
                          }
                        }}
                      />
                      {firstFrame ? (
                        <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-foreground/15">
                          <img src={firstFrame.preview} alt="首帧" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 shrink-0 rounded-full border border-dashed border-foreground/15 flex items-center justify-center bg-muted/40">
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-foreground/90" style={{ fontWeight: 500 }}>首帧</span>
                    </label>
                    {firstFrame && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          firstFrame.preview && URL.revokeObjectURL(firstFrame.preview);
                          setFirstFrame(null);
                          firstFrameInputRef.current && (firstFrameInputRef.current.value = '');
                        }}
                        className="absolute top-1/2 right-1.5 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="删除首帧"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFirstFrame(lastFrame);
                      setLastFrame(firstFrame);
                      firstFrameInputRef.current && (firstFrameInputRef.current.value = '');
                      lastFrameInputRef.current && (lastFrameInputRef.current.value = '');
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors shrink-0"
                    title="切换首尾帧"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <div className={`group relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-muted/30 pl-1 py-1 min-h-8 ${lastFrame ? 'pr-8' : 'pr-3'}`}>
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input
                        ref={lastFrameInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            lastFrame?.preview && URL.revokeObjectURL(lastFrame.preview);
                            setLastFrame({ file: f, preview: URL.createObjectURL(f) });
                          }
                        }}
                      />
                      {lastFrame ? (
                        <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-foreground/15">
                          <img src={lastFrame.preview} alt="尾帧" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 shrink-0 rounded-full border border-dashed border-foreground/15 flex items-center justify-center bg-muted/40">
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-foreground/90" style={{ fontWeight: 500 }}>尾帧</span>
                    </label>
                    {lastFrame && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          lastFrame.preview && URL.revokeObjectURL(lastFrame.preview);
                          setLastFrame(null);
                          lastFrameInputRef.current && (lastFrameInputRef.current.value = '');
                        }}
                        className="absolute top-1/2 right-1.5 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="删除尾帧"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {selectedQuickTag?.label === '幻灯片' && selectedSlideTemplate && (
              <div className="px-5 pt-5 pb-2">
                <div className="group relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-muted/30 pl-1 pr-8 py-1 min-h-8">
                  <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-foreground/15">
                    <img
                      src={selectedSlideTemplate.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-foreground/90 truncate max-w-[140px]" style={{ fontWeight: 500 }}>
                    {selectedSlideTemplate.label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedSlideTemplate(null); setSelectedSlideTemplateTab('全部'); }}
                    className="absolute top-1/2 right-1.5 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="取消选择模板"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            {/* 已附加文件 / 上下文 */}
            {attachedFiles.length > 0 && (
              <div className="px-5 pt-3 pb-1 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-1.5 max-w-full px-2.5 py-1 rounded-lg bg-muted/80 text-foreground/90 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[120px]" title={file.name}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(index)}
                      className="shrink-0 p-0.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="移除"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Textarea */}
            <div className={`px-5 pb-3 ${
              selectedQuickTag?.label === '视频生成' ||
              (selectedQuickTag?.label === '幻灯片' && selectedSlideTemplate)
                ? 'pt-0'
                : attachedFiles.length > 0 ? 'pt-0' : 'pt-5'
            }`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask me anything, I'm ready"
                className="w-full px-0 py-0 bg-transparent outline-none resize-none text-sm placeholder:text-muted-foreground min-h-[56px]"
                rows={2}
                onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative" ref={craftMenuRef}>
                  <button
                    onClick={() => setCraftMenuOpen(!craftMenuOpen)}
                    className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <CraftIcon className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>{selectedCraft}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {craftMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-1.5 z-50">
                      {[
                        { name: 'Craft', icon: <CraftIcon className="w-4 h-4" /> },
                        { name: 'Plan', icon: <ClipboardList className="w-4 h-4" /> },
                        { name: 'Ask', icon: <MessageCircle className="w-4 h-4" /> },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => { setSelectedCraft(item.name); setCraftMenuOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                        >
                          <span className="text-muted-foreground">{item.icon}</span>
                          <span className="flex-1 text-left">{item.name}</span>
                          {selectedCraft === item.name && <Check className="w-3.5 h-3.5 text-foreground" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative max-w-[180px]" ref={autoMenuRef}>
                  <button
                    onClick={() => setAutoMenuOpen(!autoMenuOpen)}
                    className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors min-w-0 w-full"
                  >
                    <Infinity className="w-4 h-4 shrink-0" />
                    <span className="text-xs min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontWeight: 500 }}>{selectedModel}</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                  {autoMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-56 rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-2 z-50">
                      <div className="px-3.5 py-1.5 text-[10px] text-muted-foreground tracking-wide" style={{ fontWeight: 600 }}>内置模型</div>
                      {[
                        { name: 'Auto', icon: <Infinity className="w-4 h-4" /> },
                        { name: 'MiniMax-M2.5', icon: <AudioLines className="w-4 h-4" /> },
                        { name: 'GLM-5.0', icon: <span className="w-4 h-4 flex items-center justify-center text-[11px] rounded" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white' }}>Z</span> },
                        { name: 'GLM-4.7', icon: <span className="w-4 h-4 flex items-center justify-center text-[11px] rounded" style={{ fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white' }}>Z</span> },
                        { name: 'Kimi-K2.5', icon: <span className="w-4 h-4 flex items-center justify-center text-[11px] rounded" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>K</span> },
                        { name: 'Kimi-K2-Thinking', icon: <span className="w-4 h-4 flex items-center justify-center text-[11px] rounded" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>K</span> },
                        { name: 'DeepSeek-V3.2', icon: <Brain className="w-4 h-4 text-muted-foreground" /> },
                      ].map((model) => (
                        <button
                          key={model.name}
                          onClick={() => { setSelectedModel(model.name); setAutoMenuOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                        >
                          <span className="text-muted-foreground">{model.icon}</span>
                          <span className="flex-1 text-left">{model.name}</span>
                          <Brain className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                          {selectedModel === model.name && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative" ref={skillsMenuRef}>
                  <button
                    onClick={() => setSkillsMenuOpen(!skillsMenuOpen)}
                    className="h-8 flex items-center gap-1.5 px-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>{skillsButtonLabel}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {skillsMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-80 rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md overflow-hidden z-50 flex flex-col max-h-[360px]">
                      <div className="p-2 border-b border-border shrink-0">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                          <input
                            type="text"
                            placeholder="搜索技能"
                            value={skillsSearchQuery}
                            onChange={(e) => setSkillsSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto min-h-0 py-1">
                        {filteredSkillsForDropdown.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleSelectSkill(skill.name)}
                            className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-secondary/40 dark:hover:bg-secondary/55 transition-colors"
                          >
                            <span className="text-muted-foreground mt-0.5 shrink-0">
                              <Zap className="w-4 h-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-foreground">{skill.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{skill.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-t border-border shrink-0">
                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground text-sm transition-colors" style={{ fontWeight: 500 }}>
                          <Upload className="w-4 h-4" />
                          导入技能
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {selectedQuickTag && (() => {
                  const TagIcon = selectedQuickTag.icon;
                  return (
                    <button
                      type="button"
                      onMouseEnter={() => setSkillChipHover(true)}
                      onMouseLeave={() => setSkillChipHover(false)}
                      onClick={() => { setSelectedQuickTag(null); setSelectedWebsiteSubTag(null); setSelectedDailySubTag(null); setSelectedAgentSubTag(null); setSelectedAgentExamplePrompt(null); setSelectedSkillExamplePrompt(null); setSelectedVideoExample(null); setSelectedSlideExamplePrompt(null); setSelectedSlideTemplate(null); setSelectedSlideTemplateTab('全部'); setSelectedDesignExamplePrompt(null); setSelectedDeepResearchExamplePrompt(null); setSelectedDocProcessSubTag(null); }}
                      className="inline-flex items-center justify-center h-8 gap-1.5 px-3 rounded-full text-xs bg-muted/60 text-foreground/90 transition-colors hover:bg-muted/70 dark:hover:bg-muted/80"
                      style={{ fontWeight: 500 }}
                    >
                      {skillChipHover ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        <TagIcon className="w-3.5 h-3.5 text-foreground/90" />
                      )}
                      {selectedQuickTag.label}
                    </button>
                  );
                })()}
                {selectedQuickTag?.label === '视频生成' && (
                  <div className="relative hidden" ref={videoRatioMenuRef}>
                    <button
                      type="button"
                      onClick={() => setVideoRatioMenuOpen(!videoRatioMenuOpen)}
                      className="h-8 flex items-center gap-1.5 px-3 rounded-full border border-foreground/20 text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors text-xs"
                      style={{ fontWeight: 500 }}
                    >
                      <Maximize2 className="w-4 h-4" />
                      比例
                      <ChevronDown className={`w-3 h-3 transition-transform ${videoRatioMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {videoRatioMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 min-w-[88px] rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-2 z-50 text-left">
                        <div className="px-3 py-1.5 text-[10px] text-muted-foreground" style={{ fontWeight: 600 }}>比例</div>
                        {videoRatioOptions.map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => { setVideoRatio(ratio); setVideoRatioMenuOpen(false); }}
                            className={`flex items-center justify-start w-full px-3 py-2 text-sm text-left transition-colors ${videoRatio === ratio ? 'text-primary bg-primary/5' : 'text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60'}`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative" ref={addMenuRef}>
                  <button
                    onClick={() => setAddMenuOpen(!addMenuOpen)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-foreground/15 dark:border-foreground/30 text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {addMenuOpen && (
                    <div className="absolute top-full right-0 mt-1.5 w-44 rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-1.5 z-50">
                      <button
                        type="button"
                        onClick={() => { setAddMenuOpen(false); fileInputRef.current?.click(); }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                      >
                        <FilePlus className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>添加文件</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAddMenuOpen(false); setContextModalOpen(true); }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>添加上下文</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAddMenuOpen(false); folderInputRef.current?.click(); }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>选择文件夹</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!input.trim() && attachedFiles.length === 0}
                  onClick={() => (input.trim() || attachedFiles.length) && handleSubmitToAgent()}
                  title={input.trim() || attachedFiles.length ? '发送' : '请先输入内容或添加文件'}
                  aria-label={input.trim() || attachedFiles.length ? '发送' : '请先输入内容或添加文件'}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-opacity ${
                    input.trim() || attachedFiles.length
                      ? activeCard === 0
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : activeCard === 1
                          ? 'bg-green-500 text-white hover:opacity-90 dark:bg-green-600'
                          : 'bg-foreground text-background hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

                    {!showStartNewAndTags && (
            <div className="mt-8 text-center px-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                通过 Claw，让 Agent 随时随地接手并推进你的工作。
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                前往 Claw 设置，连接企业微信、飞书、钉钉或 QQ，把任务带到每一个消息入口。
              </p>
            </div>
          )}

          {showStartNewAndTags && (
          <>
          {/* Quick Tags */}
          <div className="mt-5 flex justify-center min-h-[3rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedQuickTag?.label ?? `default-${activeCard}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-wrap gap-2.5 w-full ${selectedQuickTag?.label === '日常开发' ? 'justify-start' : 'justify-center'}`}
              >
            {selectedQuickTag?.label === '日常开发' ? (
              <div className="w-full flex justify-start">
                <div className="flex flex-col gap-1 max-w-md">
                  {dailyDevSubTags.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSelectedDailySubTag(tag);
                      if (tag.label === ADD_FEATURE_LABEL) setInput(ADD_FEATURE_PROMPT);
                      if (tag.label === REFACTOR_LABEL) setInput(REFACTOR_CODE_PROMPT);
                      if (tag.label === FIX_BUG_LABEL) setInput(FIX_BUG_PROMPT);
                      if (tag.label === OPTIMIZE_PERF_LABEL) setInput(OPTIMIZE_PERFORMANCE_PROMPT);
                    }}
                    className={`inline-flex items-center gap-2.5 w-fit max-w-full px-4 py-2 rounded-xl text-sm text-left text-foreground transition-colors ${
                      selectedDailySubTag?.label === tag.label
                        ? 'bg-muted'
                        : 'hover:bg-muted/50 dark:hover:bg-muted/60'
                    }`}
                  >
                    {tag.label}
                  </button>
                  ))}
                </div>
              </div>
            ) : selectedQuickTag?.label === 'Agent 应用' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例 Agent 应用</h3>
                <div className="grid grid-cols-2 gap-4">
                  {agentExamplePrompts.map((item) => {
                    const isSelected = selectedAgentExamplePrompt?.label === item.label;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setSelectedAgentExamplePrompt(item);
                          setInput(item.prompt);
                        }}
                        className={`relative flex items-center gap-3 rounded-xl border transition-colors text-left min-h-[72px] p-4 ${
                          isSelected
                            ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50'
                            : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                        <span className={`text-sm flex-1 ${isSelected ? 'text-foreground font-medium' : 'text-foreground/90'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '网站开发' ? (
              <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">你想构建什么</h3>
                  <button
                    type="button"
                    onClick={() => setRefWebsiteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    添加参考网站
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {websiteDevSubTags.map((tag) => {
                    const isSelected = selectedWebsiteSubTag?.label === tag.label;
                    const Icon = tag.icon;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setSelectedWebsiteSubTag(tag);
                          if (tag.label === '企业官网') setInput(ENTERPRISE_WEBSITE_PROMPT);
                          if (tag.label === '后台管理') setInput(ADMIN_SYSTEM_PROMPT);
                          if (tag.label === '个人网站') setInput(PERSONAL_WEBSITE_PROMPT);
                          if (tag.label === '电商首页') setInput(ECOMMERCE_HOMEPAGE_PROMPT);
                        }}
                        className={`relative flex items-center gap-3 rounded-xl border transition-colors text-left min-h-[72px] p-4 ${
                          isSelected
                            ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50'
                            : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                        <span className={`text-sm flex-1 whitespace-nowrap overflow-hidden text-ellipsis ${isSelected ? 'text-foreground font-medium' : 'text-foreground/90'}`}>
                          {tag.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '视频生成' ? (
              <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">热门示例</h3>
                  <button
                    type="button"
                    onClick={() => setRefVideoModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    添加参考视频
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {videoExampleTags.map((tag) => {
                    const isSelected = selectedVideoExample?.label === tag.label;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => { setSelectedVideoExample(tag); setInput('prompt' in tag ? tag.prompt : ''); }}
                        className={`flex flex-col rounded-xl overflow-hidden border transition-colors ${
                          isSelected
                            ? 'border border-foreground/25'
                            : 'border border-foreground/15 dark:border-foreground/30 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <div className="aspect-video w-full bg-muted/80 dark:bg-muted/60 overflow-hidden">
                          <img
                            src={tag.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`px-3 py-2.5 text-sm font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis ${isSelected ? 'text-foreground bg-muted/50 dark:bg-muted/50' : 'text-foreground bg-card'}`}>
                          {tag.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '幻灯片' ? (
              <div className="w-full max-w-3xl space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {slideExamplePrompts.map((item) => {
                      const isSelected = selectedSlideExamplePrompt?.label === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => { setSelectedSlideExamplePrompt(item); setInput(item.prompt); }}
                          className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                            isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                          }`}
                        >
                          <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">选择模板</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {SLIDE_TEMPLATE_TABS.map((tab) => {
                      const isActive = selectedSlideTemplateTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setSelectedSlideTemplateTab(tab)}
                          className={`inline-flex items-center justify-center h-8 min-h-8 px-3 rounded-full text-sm border transition-colors whitespace-nowrap ${
                            isActive
                              ? 'border border-foreground/25 bg-muted/50 text-foreground font-medium dark:bg-muted/50'
                              : 'border border-foreground/15 dark:border-foreground/30 bg-card text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {slideTemplates
                      .filter((t) => selectedSlideTemplateTab === '全部' || t.category === selectedSlideTemplateTab)
                      .map((tag) => {
                        const isSelected = selectedSlideTemplate?.label === tag.label;
                        return (
                          <button
                            key={tag.label}
                            type="button"
                            onClick={() => setSelectedSlideTemplate(tag)}
                            className={`flex flex-col rounded-xl overflow-hidden border transition-colors ${
                              isSelected ? 'border border-foreground/25' : 'border border-foreground/15 dark:border-foreground/30 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                            }`}
                          >
                            <div className="aspect-video w-full bg-muted/80 dark:bg-muted/60 overflow-hidden">
                              <img
                                src={tag.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`px-3 py-2.5 text-sm font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis ${isSelected ? 'text-foreground bg-muted/50 dark:bg-muted/50' : 'text-foreground bg-card'}`}>
                              {tag.label}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : selectedQuickTag?.label === '设计' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">开始设计</h3>
                <div className="grid grid-cols-2 gap-4">
                  {designExamplePrompts.map((item) => {
                    const isSelected = selectedDesignExamplePrompt?.label === item.label;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setSelectedDesignExamplePrompt(item);
                          setInput(item.prompt);
                        }}
                        className={`relative flex items-center gap-3 rounded-xl border transition-colors text-left min-h-[72px] p-4 ${
                          isSelected
                            ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50'
                            : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                        <span className={`text-sm flex-1 whitespace-nowrap ${isSelected ? 'text-foreground font-medium' : 'text-foreground/90'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '深度研究' ? (
              <div className="w-full max-w-3xl space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">深度研究示例</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {deepResearchExamplePrompts.map((item) => {
                      const isSelected = selectedDeepResearchExamplePrompt?.label === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => { setSelectedDeepResearchExamplePrompt(item); setInput(item.prompt); }}
                          className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                            isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                          }`}
                        >
                          <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedQuickTag?.label === '文档处理' ? (
              <div className="w-full flex flex-col gap-6">
                {/* 任务列表：仅用户点击后高亮选中项，无默认选中 */}
                <div className="w-full flex justify-start">
                  <div className="flex flex-col gap-1 max-w-md">
                    {documentProcessingSubTags.map((tag) => {
                      const isSelected = selectedDocProcessSubTag?.label === tag.label;
                      return (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => {
                            setSelectedDocProcessSubTag(tag);
                            if (tag.label === DOC_PROCESS_SUGGESTED_LABEL) setInput(DOC_PROCESS_SUGGESTED_PROMPT);
                            if (tag.label === '将文档转换为指定格式（如 PDF 转 Word）。') setInput(DOC_PROCESS_CONVERT_PROMPT);
                            if (tag.label === '批量处理文档，提取关键信息。') setInput(DOC_PROCESS_BATCH_PROMPT);
                            if (tag.label === '根据文档内容生成摘要或报告。') setInput(DOC_PROCESS_SUMMARY_PROMPT);
                          }}
                          className={`inline-flex items-center gap-2.5 w-fit max-w-full px-4 py-2 rounded-xl text-sm text-left text-foreground transition-colors ${
                            isSelected ? 'bg-muted' : 'hover:bg-muted/50 dark:hover:bg-muted/60'
                          }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedQuickTag?.label === 'Skill 开发' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例 skill</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skillExamplePrompts.map((item) => {
                    const isSelected = selectedSkillExamplePrompt?.label === item.label;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setSelectedSkillExamplePrompt(item);
                          setInput(item.prompt);
                        }}
                        className={`relative flex items-center gap-3 rounded-xl border transition-colors text-left min-h-[72px] p-4 ${
                          isSelected
                            ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50'
                            : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                        <span className={`text-sm flex-1 ${isSelected ? 'text-foreground font-medium' : 'text-foreground/90'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === 'CI/CD' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {cicdExamplePrompts.map((item) => {
                    const isSelected = selectedCicdExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedCicdExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '文档' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {docExamplePrompts.map((item) => {
                    const isSelected = selectedDocExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedDocExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                      <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
            ) : selectedQuickTag?.label === '数据分析' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {dataAnalysisExamplePrompts.map((item) => {
                    const isSelected = selectedDataAnalysisExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedDataAnalysisExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '金融服务' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {financialServiceExamplePrompts.map((item) => {
                    const isSelected = selectedFinancialServiceExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedFinancialServiceExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '邮件编辑' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {emailEditExamplePrompts.map((item) => {
                    const isSelected = selectedEmailEditExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedEmailEditExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedQuickTag?.label === '产品管理' ? (
              <div className="w-full max-w-3xl">
                <h3 className="text-sm font-medium text-foreground mb-4">示例提示词</h3>
                <div className="grid grid-cols-4 gap-4">
                  {productManagementExamplePrompts.map((item) => {
                    const isSelected = selectedProductManagementExamplePrompt?.label === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => { setSelectedProductManagementExamplePrompt(item); setInput(item.prompt); }}
                        className={`relative flex flex-col rounded-xl border transition-colors text-left p-4 min-h-[88px] ${
                          isSelected ? 'border border-foreground/25 bg-muted/50 dark:bg-muted/50' : 'border border-foreground/15 dark:border-foreground/30 bg-card hover:bg-muted/15 dark:hover:bg-muted/40 hover:border-muted-foreground/30 dark:hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-sm text-foreground/90 flex-1">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 self-end mt-1" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {(activeCard === 0 ? mainDevTags : mainOfficeTags).map((tag) => {
                  const isSelected = selectedQuickTag?.label === tag.label;
                  const isOffice = activeCard === 1;
                  const selectedStyles = isOffice
                    ? 'border border-green-500 bg-green-500/10 text-green-600 dark:border-green-400 dark:text-green-400'
                    : 'border border-primary bg-primary/10 text-primary';
                  const iconColorWhenUnselected = { color: (tag as { iconColor?: string }).iconColor } as React.CSSProperties;
                  const iconClassWhenSelected = isOffice ? 'text-green-600 dark:text-green-400' : 'text-primary';
                  const iconClassWhenUnselected = '';
                  return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSelectedQuickTag(tag);
                      if (tag.label !== '网站开发') setSelectedWebsiteSubTag(null);
                      if (tag.label !== '日常开发') setSelectedDailySubTag(null);
                      if (tag.label !== 'Agent 应用') { setSelectedAgentSubTag(null); setSelectedAgentExamplePrompt(null); }
                      if (tag.label !== 'Skill 开发') setSelectedSkillExamplePrompt(null);
                      if (tag.label !== '视频生成') setSelectedVideoExample(null);
                      if (tag.label !== '幻灯片') { setSelectedSlideExamplePrompt(null); setSelectedSlideTemplate(null); setSelectedSlideTemplateTab('全部'); }
                      if (tag.label !== 'CI/CD') setSelectedCicdExamplePrompt(null);
                      if (tag.label !== '文档') setSelectedDocExamplePrompt(null);
                      if (tag.label !== '数据分析') setSelectedDataAnalysisExamplePrompt(null);
                      if (tag.label !== '金融服务') setSelectedFinancialServiceExamplePrompt(null);
                      if (tag.label !== '邮件编辑') setSelectedEmailEditExamplePrompt(null);
                      if (tag.label !== '产品管理') setSelectedProductManagementExamplePrompt(null);
                      if (tag.label !== '设计') setSelectedDesignExamplePrompt(null);
                      if (tag.label !== '深度研究') setSelectedDeepResearchExamplePrompt(null);
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 h-10 min-h-10 px-4 rounded-full text-sm border transition-colors whitespace-nowrap ${
                      isSelected ? selectedStyles : 'border border-foreground/15 dark:border-foreground/15 bg-card hover:bg-secondary/50 dark:hover:bg-secondary/60 text-foreground/80'
                    }`}
                  >
                    <tag.icon
                      className={`w-3.5 h-3.5 shrink-0 ${isSelected ? iconClassWhenSelected : iconClassWhenUnselected}`}
                      style={isSelected ? undefined : iconColorWhenUnselected}
                    />
                    <span className="min-w-0 truncate">{tag.label}</span>
                  </button>
                  );
                })}
                {activeCard === 0 && (
                  <div className="relative" ref={moreTagsMenuRef}>
                    <button
                      type="button"
                      onClick={() => setMoreTagsMenuOpen(!moreTagsMenuOpen)}
                      className={`inline-flex items-center justify-center gap-1.5 h-10 min-h-10 px-4 rounded-full text-sm border transition-colors ${
                        moreTagsMenuOpen || moreDevTags.some((t) => selectedQuickTag?.label === t.label)
                          ? 'border border-foreground/20 dark:border-foreground/10 bg-muted/60 text-foreground'
                          : 'border border-foreground/15 dark:border-foreground/15 bg-card hover:bg-secondary/50 dark:hover:bg-secondary/60 text-foreground/80'
                      }`}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      更多
                    </button>
                    {moreTagsMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 min-w-[140px] rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-1.5 z-50">
                        {moreDevTags.map((tag) => (
                          <button
                            key={tag.label}
                            type="button"
                            onClick={() => {
                              setSelectedQuickTag(tag);
                              setMoreTagsMenuOpen(false);
                              setSelectedWebsiteSubTag(null);
                              setSelectedDailySubTag(null);
                              setSelectedAgentSubTag(null);
                              setSelectedAgentExamplePrompt(null);
                              setSelectedSkillExamplePrompt(null);
                              setSelectedVideoExample(null);
                              setSelectedSlideExamplePrompt(null);
                              setSelectedSlideTemplate(null);
                              setSelectedCicdExamplePrompt(null);
                              setSelectedDocExamplePrompt(null);
                              setSelectedDesignExamplePrompt(null);
                              setSelectedDeepResearchExamplePrompt(null);
                            }}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors whitespace-nowrap"
                          >
                            <tag.icon className="w-3.5 h-3.5 shrink-0" style={{ color: tag.iconColor }} />
                            <span>{tag.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeCard === 1 && (
                  <div className="relative" ref={moreOfficeTagsMenuRef}>
                    <button
                      type="button"
                      onClick={() => setMoreOfficeTagsMenuOpen(!moreOfficeTagsMenuOpen)}
                      className={`inline-flex items-center justify-center gap-1.5 h-10 min-h-10 px-4 rounded-full text-sm border transition-colors ${
                        moreOfficeTagsMenuOpen || moreOfficeTags.some((t) => selectedQuickTag?.label === t.label)
                          ? 'border border-foreground/20 dark:border-foreground/10 bg-muted/60 text-foreground'
                          : 'border border-foreground/15 dark:border-foreground/15 bg-card hover:bg-secondary/50 dark:hover:bg-secondary/60 text-foreground/80'
                      }`}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      更多
                    </button>
                    {moreOfficeTagsMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 min-w-[140px] rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-1.5 z-50">
                        {moreOfficeTags.map((tag) => (
                          <button
                            key={tag.label}
                            type="button"
                            onClick={() => {
                              setSelectedQuickTag(tag);
                              setMoreOfficeTagsMenuOpen(false);
                              setSelectedWebsiteSubTag(null);
                              setSelectedDailySubTag(null);
                              setSelectedAgentSubTag(null);
                              setSelectedAgentExamplePrompt(null);
                              setSelectedSkillExamplePrompt(null);
                              setSelectedVideoExample(null);
                              setSelectedSlideExamplePrompt(null);
                              setSelectedSlideTemplate(null);
                              setSelectedDataAnalysisExamplePrompt(null);
                              setSelectedFinancialServiceExamplePrompt(null);
                              setSelectedEmailEditExamplePrompt(null);
                              setSelectedProductManagementExamplePrompt(null);
                              setSelectedDesignExamplePrompt(null);
                              setSelectedDeepResearchExamplePrompt(null);
                              setSelectedDocProcessSubTag(null);
                            }}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors whitespace-nowrap"
                          >
                            <tag.icon className="w-3.5 h-3.5 shrink-0" style={{ color: tag.iconColor }} />
                            <span>{tag.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
              </motion.div>
            </AnimatePresence>
          </div>
          </>
          )}
        </div>
      </div>



      {refWebsiteModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20" onClick={() => setRefWebsiteModalOpen(false)}>
          <div
            ref={refWebsiteModalRef}
            className="w-full max-w-md rounded-2xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground mb-2">添加网站参考</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              输入任意网址，我们将为您重新创建其设计。是获取灵感或快速开始的完美选择。
            </p>
            <input
              type="url"
              value={refWebsiteUrl}
              onChange={(e) => setRefWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRefWebsiteModalOpen(false); setRefWebsiteUrl(''); }}
                className="px-4 py-2 rounded-lg border border-foreground/15 dark:border-foreground/30 text-foreground text-sm font-medium hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (refWebsiteUrl.trim()) {
                    setInput(`根据以下网站重新创建其设计：${refWebsiteUrl.trim()}`);
                    setRefWebsiteUrl('');
                  }
                  setRefWebsiteModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {refVideoModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20" onClick={() => setRefVideoModalOpen(false)}>
          <div
            ref={refVideoModalRef}
            className="w-full max-w-md rounded-2xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground mb-2">添加参考视频</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              输入参考视频链接，将作为视频生成的风格或内容参考。
            </p>
            <input
              type="url"
              value={refVideoUrl}
              onChange={(e) => setRefVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRefVideoModalOpen(false); setRefVideoUrl(''); }}
                className="px-4 py-2 rounded-lg border border-foreground/15 dark:border-foreground/30 text-foreground text-sm font-medium hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (refVideoUrl.trim()) {
                    setInput(`以参考视频链接 ${refVideoUrl.trim()} 为风格基准，完全对齐其色调、运镜、转场、配乐节奏与视觉氛围，生成同类型高质量视频。`);
                    setRefVideoUrl('');
                  }
                  setRefVideoModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {contextModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20" onClick={() => setContextModalOpen(false)}>
          <div
            ref={contextModalRef}
            className="w-full max-w-md rounded-2xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground mb-2">添加上下文</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              粘贴或输入希望 AI 参考的上下文内容，将随当前输入一并发送。
            </p>
            <textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="在此粘贴或输入上下文…"
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 mb-4 resize-y min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setContextModalOpen(false); setContextText(''); }}
                className="px-4 py-2 rounded-lg border border-foreground/15 dark:border-foreground/30 text-foreground text-sm font-medium hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={applyContext}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function CraftIcon(props: { className?: string }) {
  const { className } = props;
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Folder tab */}
      <path d="M1.5 4.5V3C1.5 2.45 1.95 2 2.5 2H5.5L7 4H13.5C14.05 4 14.5 4.45 14.5 5V5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Folder body */}
      <rect x="1.5" y="4" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      {/* Terminal prompt ">_" */}
      <path d="M4.5 7.5L6.5 9.25L4.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7.5" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FeatureCard({
  tagLabel,
  tagColor,
  title,
  description,
}: {
  tagLabel: string;
  tagColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="flex justify-center mb-3">
        <span className={`${tagColor} text-white text-xs px-3 py-1 rounded-md`} style={{ fontWeight: 500 }}>
          {tagLabel}
        </span>
      </div>
      <div className="text-center">
        <div className="text-primary text-sm mb-2" style={{ fontWeight: 500 }}>{title}</div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  hasDropdown,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
        active
          ? 'bg-secondary text-foreground'
          : 'text-muted-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 hover:text-foreground'
      }`}
      style={{ fontWeight: 500 }}
    >
      {icon}
      <span>{label}</span>
      {hasDropdown && <ChevronDown className="w-3 h-3 ml-0.5" />}
    </button>
  );
}