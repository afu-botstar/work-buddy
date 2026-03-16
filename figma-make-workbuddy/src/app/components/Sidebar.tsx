import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  SlidersHorizontal, MessageCirclePlus, FolderOpen, Settings,
  LayoutGrid, Puzzle, Zap, Clock, Check, CheckCircle, MoreHorizontal, Pencil, Bookmark, Trash2,   ChevronRight, ChevronDown, AlertCircle
} from 'lucide-react';

/** Claw 图标：使用 public/icons/claw.svg 的路径，fill 用 currentColor 以适配主题 */
function ClawIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.98412 3.85491C11.5185 -0.475276 16.562 1.02861 18.3754 2.48748C19.325 3.25139 19.8525 4.36137 19.74 5.47838C19.6246 6.63619 18.8396 7.60127 17.589 8.01769C16.9376 8.23574 16.4199 8.79425 16.185 9.47233C15.9486 10.1546 16.0443 10.7976 16.3875 11.2168L16.4255 11.266C16.4619 11.273 16.4981 11.2815 16.5338 11.2914C16.9067 11.4039 17.1149 11.463 17.4019 11.3983C17.686 11.3336 18.2178 11.0958 18.9916 10.1603L19.1702 9.96894C19.3712 9.77478 19.6102 9.62431 19.8722 9.52698C20.1341 9.42966 20.4134 9.38758 20.6924 9.4034C21.2805 9.43435 21.8136 9.70587 22.2047 10.0815C22.6549 10.5176 22.8603 11.1647 22.9447 11.7275C23.0362 12.3324 23.0165 13.033 22.8645 13.7448C22.5592 15.1756 21.687 16.7582 19.9243 17.7121C19.3587 18.0174 18.3796 18.5702 16.9052 18.6448C16.744 18.892 16.5673 19.1288 16.3763 19.3538C14.9596 21.0364 13.0084 21.616 11.2723 21.5625C10.5034 21.5379 9.74335 21.3897 9.02144 21.1236C8.7703 21.4352 8.48105 21.7141 8.16047 21.9536C7.57945 22.3729 6.77475 22.6824 5.8153 22.4418C3.95971 21.9775 2.14773 20.1909 1.24455 17.9822C0.760602 16.7962 1.04759 15.7693 1.64549 15.0461C1.96625 14.6593 2.36156 14.3709 2.73859 14.1683C2.41339 13.1178 2.2567 12.0223 2.27434 10.9228C2.32639 8.57197 3.26615 5.98202 5.98412 3.85491ZM17.0516 4.13205C15.9993 3.28515 12.0433 1.79392 7.28542 5.51777C5.10345 7.22424 4.42396 9.20082 4.38597 10.9678C4.36979 12.4936 4.76071 13.9961 5.51846 15.3205C5.58922 15.4396 5.63581 15.5716 5.65558 15.7087C5.67535 15.8459 5.66791 15.9856 5.63369 16.1199C5.59946 16.2542 5.53912 16.3805 5.45611 16.4914C5.37309 16.6024 5.26904 16.6959 5.14987 16.7667C5.03071 16.8374 4.89878 16.884 4.76161 16.9038C4.62445 16.9236 4.48473 16.9161 4.35043 16.8819C4.21614 16.8477 4.0899 16.7873 3.97893 16.7043C3.86796 16.6213 3.77442 16.5173 3.70367 16.3981C3.65677 16.3137 3.60847 16.2255 3.55876 16.1336C3.45233 16.2055 3.35624 16.2917 3.27318 16.3897C3.19504 16.4773 3.14162 16.5841 3.11843 16.6992C3.09695 16.8644 3.12485 17.0323 3.19862 17.1817C3.92313 18.9543 5.29618 20.136 6.32879 20.3963C6.52293 20.4455 6.69737 20.4075 6.92669 20.2415C7.01672 20.1759 7.10488 20.0976 7.19117 20.0066C7.12468 19.9407 7.0604 19.8727 6.99843 19.8026C6.90791 19.6977 6.83894 19.5759 6.79546 19.4443C6.75198 19.3127 6.73485 19.1739 6.74504 19.0357C6.76562 18.7565 6.89624 18.497 7.10817 18.3142C7.32009 18.1314 7.59597 18.0402 7.8751 18.0608C8.15423 18.0814 8.41375 18.212 8.59658 18.4239C9.01018 18.9022 10.0512 19.4143 11.3371 19.4537C12.5708 19.4917 13.844 19.0851 14.7627 17.9948C15.6799 16.906 15.9008 15.8734 15.8121 14.9814C15.7235 14.0923 15.3141 13.2679 14.8119 12.6292C14.629 12.4843 14.252 12.2761 13.7188 12.1003C13.1589 11.9121 12.5734 11.811 11.9828 11.8006C11.703 11.8006 11.4346 11.6895 11.2367 11.4916C11.0388 11.2937 10.9277 11.0253 10.9277 10.7455C10.9277 10.4657 11.0388 10.1973 11.2367 9.99943C11.4346 9.80156 11.703 9.69039 11.9828 9.69039C12.6426 9.69039 13.3263 9.79872 13.9523 9.96894C13.9763 9.56097 14.0593 9.15862 14.1901 8.78159C14.6079 7.57735 15.5603 6.46878 16.9221 6.01578C17.4539 5.83712 17.6143 5.52621 17.6396 5.26736C17.6706 4.9677 17.5355 4.52174 17.0516 4.13205ZM20.6066 11.5179C19.657 12.6574 18.758 13.2553 17.8675 13.4564C17.7906 13.4724 17.7156 13.4851 17.6424 13.4944C17.7733 13.8982 17.8675 14.3259 17.9125 14.7746C17.9645 15.2984 17.9427 15.8269 17.8478 16.3446C18.2685 16.2068 18.6103 16.0211 18.9212 15.8537C20.0326 15.2515 20.5953 14.2583 20.8007 13.3045C20.9034 12.8248 20.909 12.3802 20.857 12.0412C20.8106 11.7289 20.7346 11.6051 20.7304 11.5924C20.702 11.5667 20.6703 11.5449 20.6361 11.5277C20.6239 11.5221 20.6141 11.5188 20.6066 11.5179Z"
      />
    </svg>
  );
}

interface Task {
  id: string;
  title: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'interrupted';
  progress?: number; // 0-100，仅 in-progress 时有效
}

interface WorkspaceTask {
  id: string;
  title: string;
  timestamp: string;
  status: 'completed' | 'interrupted';
}

interface Workspace {
  id: string;
  /** 文件夹显示名称，新建时用任务标题 */
  name?: string;
  tasks: WorkspaceTask[];
}

/** 更多菜单/重命名/删除 统一目标：任务列表项、工作空间文件夹、工作空间内任务 */
type MoreMenuTarget =
  | { type: 'task'; id: string }
  | { type: 'workspace'; workspaceId: string }
  | { type: 'workspace-task'; workspaceId: string; taskId: string };

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  /** 点击设置图标时打开设置面板 */
  onOpenSettings?: () => void;
  /** 点击文件夹图标时在本地选择文件夹，选中后回调传入该文件夹内文件列表 */
  onFolderSelect?: (files: FileList) => void;
}

export function Sidebar({ collapsed, onToggleCollapse, activeNav = '', onNavChange, onOpenSettings, onFolderSelect }: SidebarProps) {
  const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'in-progress' | 'interrupted'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreMenuTarget, setMoreMenuTarget] = useState<MoreMenuTarget | null>(null);
  /** 下拉关闭后未选择时，保持该行「更多」图标可见，直到鼠标离开该行 */
  const [moreIconPinnedFor, setMoreIconPinnedFor] = useState<MoreMenuTarget | null>(null);
  const [moreMenuPos, setMoreMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [renameTarget, setRenameTarget] = useState<MoreMenuTarget | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MoreMenuTarget | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const renameDialogRef = useRef<HTMLDivElement>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);
  const workspaceSectionRef = useRef<HTMLDivElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '请分析【上传你的 Excel ...', timestamp: '刚刚', status: 'completed' },
    { id: '2', title: '你可以给我把workbudd...', timestamp: '2小时前', status: 'completed' },
    { id: '3', title: '根据该 Figma 组件生成...', timestamp: '3小时前', status: 'completed' },
    { id: '4', title: '你可以把你自己这个产品...', timestamp: '4小时前', status: 'completed' },
    { id: '5', title: '面试Demo架构设计', timestamp: '5小时前', status: 'completed' },
    { id: '6', title: '获取OpenAI API Key', timestamp: '昨天', status: 'completed' },
    { id: '7', title: '视频分镜生成', timestamp: '昨天', status: 'in-progress', progress: 35 },
    { id: '8', title: '任务：异常中断', timestamp: '3天前', status: 'interrupted' },
  ]);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '20260314143323',
      tasks: [
        { id: 'ws1', title: '做一条 20 秒的全球 Top 10 大...', timestamp: '20小时前', status: 'interrupted' },
        { id: 'ws2', title: '请分析【上传你的Excel 文件】,...', timestamp: '1天前', status: 'completed' },
      ],
    },
  ]);
  const [expandedWorkspaceIds, setExpandedWorkspaceIds] = useState<Set<string>>(() => new Set(workspaces.map((w) => w.id)));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      try {
        if (filterRef.current && !filterRef.current.contains(target)) setFilterOpen(false);
        if (moreMenuRef.current && !moreMenuRef.current.contains(target)) setMoreMenuTarget(null);
        if (renameTarget && renameDialogRef.current && !renameDialogRef.current.contains(target)) setRenameTarget(null);
        if (deleteTarget && deleteConfirmRef.current && !deleteConfirmRef.current.contains(target)) setDeleteTarget(null);
      } catch (_) { /* 防止 ref 未挂载等导致白屏 */ }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [renameTarget, deleteTarget]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setFilterOpen(false);
      setMoreMenuTarget(null);
      setRenameTarget(null);
      setDeleteTarget(null);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const el = folderInputRef.current;
    if (el) {
      el.setAttribute('webkitdirectory', '');
    }
  }, []);

  const sameMoreRow = (a: MoreMenuTarget | null, b: MoreMenuTarget | null): boolean => {
    if (!a || !b) return false;
    if (a.type !== b.type) return false;
    if (a.type === 'task') return a.id === b.id;
    if (a.type === 'workspace') return a.workspaceId === b.workspaceId;
    return a.workspaceId === b.workspaceId && a.taskId === b.taskId;
  };

  const handleOpenRename = () => {
    if (!moreMenuTarget) return;
    if (moreMenuTarget.type === 'task') {
      const task = tasks.find((t) => t.id === moreMenuTarget.id);
      if (task) setRenameInputValue(task.title);
    } else if (moreMenuTarget.type === 'workspace') {
      const ws = workspaces.find((w) => w.id === moreMenuTarget.workspaceId);
      if (ws) setRenameInputValue(ws.name ?? ws.id);
    } else {
      const ws = workspaces.find((w) => w.id === moreMenuTarget.workspaceId);
      const wt = ws?.tasks.find((t) => t.id === moreMenuTarget.taskId);
      if (wt) setRenameInputValue(wt.title);
    }
    setRenameTarget(moreMenuTarget);
    setMoreMenuTarget(null);
    setMoreIconPinnedFor(null);
  };

  const handleConfirmRename = () => {
    if (!renameTarget || !renameInputValue.trim()) return;
    const name = renameInputValue.trim();
    if (renameTarget.type === 'task') {
      setTasks((prev) =>
        prev.map((t) => (t.id === renameTarget.id ? { ...t, title: name } : t))
      );
    } else if (renameTarget.type === 'workspace') {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === renameTarget.workspaceId ? { ...w, name } : w))
      );
    } else {
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === renameTarget.workspaceId
            ? {
                ...w,
                tasks: w.tasks.map((t) =>
                  t.id === renameTarget.taskId ? { ...t, title: name } : t
                ),
              }
            : w
        )
      );
    }
    setRenameTarget(null);
    setRenameInputValue('');
  };

  const handleOpenDeleteConfirm = () => {
    if (moreMenuTarget) setDeleteTarget(moreMenuTarget);
    setMoreMenuTarget(null);
    setMoreIconPinnedFor(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'task') {
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'workspace') {
      setWorkspaces((prev) => prev.filter((w) => w.id !== deleteTarget.workspaceId));
      setExpandedWorkspaceIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.workspaceId);
        return next;
      });
    } else {
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === deleteTarget.workspaceId
            ? { ...w, tasks: w.tasks.filter((t) => t.id !== deleteTarget.taskId) }
            : w
        )
      );
    }
    setDeleteTarget(null);
  };

  /** 保留到工作空间：新建一个工作空间文件夹，并把当前任务放入其中（仅任务列表项） */
  const handleSaveToWorkspace = () => {
    if (!moreMenuTarget || moreMenuTarget.type !== 'task') {
      setMoreMenuTarget(null);
      return;
    }
    const task = tasks.find((t) => t.id === moreMenuTarget.id);
    if (!task) {
      setMoreMenuTarget(null);
      return;
    }
    const workspaceId = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const wsTask: WorkspaceTask = {
      id: task.id,
      title: task.title,
      timestamp: task.timestamp,
      status: task.status === 'in-progress' ? 'completed' : task.status,
    };
    const folderName = task.title.length > 20 ? task.title.slice(0, 20) + '...' : task.title;
    setWorkspaces((prev) => [...prev, { id: workspaceId, name: folderName, tasks: [wsTask] }]);
    setExpandedWorkspaceIds((prev) => new Set(prev).add(workspaceId));
    setMoreMenuTarget(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = taskFilter === 'all' || task.status === taskFilter;
    const q = taskSearchQuery.trim().toLowerCase();
    const matchesSearch = !q || task.title.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filterLabels: Record<string, string> = {
    all: '全部',
    'in-progress': '进行中',
    completed: '已完成',
    interrupted: '异常中断',
  };

  if (collapsed) {
    return (
      <aside className="w-14 h-full flex flex-col border-r border-foreground/15 dark:border-foreground/15 bg-background shrink-0">
        <div className="pt-3.5 px-2">
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors flex items-center justify-center text-muted-foreground"
            aria-label="展开侧边栏"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-2 py-2 space-y-1">
          <IconNavButton
            icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><ClawIcon className="w-5 h-5" /></span>}
            active={activeNav === 'claw'}
            label="Claw"
            onClick={() => onNavChange?.('claw')}
          />
          <IconNavButton
            icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><LayoutGrid className="w-5 h-5" /></span>}
            active={activeNav === 'skills'}
            label="技能"
            onClick={() => onNavChange?.('skills')}
          />
          <IconNavButton
            icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><Puzzle className="w-5 h-5" /></span>}
            active={activeNav === 'plugins'}
            label="插件"
            onClick={() => onNavChange?.('plugins')}
          />
          <IconNavButton
            icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><Clock className="w-5 h-5" /></span>}
            active={activeNav === 'automation'}
            label="自动化"
            onClick={() => onNavChange?.('automation')}
          />
        </div>
        <div className="flex-1" />
      </aside>
    );
  }

  return (
    <aside className="w-60 h-full flex flex-col border-r border-foreground/15 dark:border-foreground/15 bg-background shrink-0">
      {/* New Task Button - 白底+描边，圆润图标 */}
      <div className="pt-3.5 px-3 pb-0">
        <NavItem
          icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><MessageCirclePlus className="w-5 h-5" /></span>}
          label="新建任务"
          shortcut="Ctrl K"
          variant="card"
          onClick={() => onNavChange?.('')}
        />
      </div>

      {/* Navigation */}
      <div className="px-3 py-1 space-y-0.5">
        <NavItem icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><ClawIcon className="w-5 h-5" /></span>} label="Claw" active={activeNav === 'claw'} onClick={() => onNavChange?.('claw')}>
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavChange?.('claw');
                folderInputRef.current?.click();
              }}
              className="p-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/60 hover:text-foreground/80 transition-colors duration-150 text-muted-foreground/60"
              aria-label="打开文件夹"
              title="从本地选择文件夹"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <input
              ref={folderInputRef}
              type="file"
              tabIndex={-1}
              className="sr-only"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length && onFolderSelect) {
                  onFolderSelect(files);
                }
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSettings?.();
              }}
              className="p-1 rounded-md hover:bg-muted/50 dark:hover:bg-muted/60 hover:text-foreground/80 transition-colors duration-150 text-muted-foreground/60"
              aria-label="打开设置"
              title="设置"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </NavItem>
        <NavItem icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><Zap className="w-5 h-5" /></span>} label="技能" active={activeNav === 'skills'} onClick={() => onNavChange?.('skills')} />
        <NavItem icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><Puzzle className="w-5 h-5" /></span>} label="插件" active={activeNav === 'plugins'} onClick={() => onNavChange?.('plugins')} />
        <NavItem icon={<span className="flex items-center justify-center w-6 h-6 shrink-0"><Clock className="w-5 h-5" /></span>} label="自动化" active={activeNav === 'automation'} onClick={() => onNavChange?.('automation')} />
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 border-t border-border/60" />

      {/* Task List + 工作空间（整体可滚动，工作空间紧接在任务下方） */}
      <div className="px-3 flex-1 min-h-0 overflow-y-auto flex flex-col smooth-scroll scrollbar-hide">
        {/* 任务 */}
        <div className="shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-2" ref={filterRef}>
            <span className="text-xs text-muted-foreground/85" style={{ fontWeight: 500 }}>任务</span>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors duration-150"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{filterLabels[taskFilter]}</span>
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 rounded-xl border border-border bg-card shadow-md py-1 z-50">
                  {(['all', 'in-progress', 'completed', 'interrupted'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setTaskFilter(key); setFilterOpen(false); }}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs transition-colors ${
                        taskFilter === key
                          ? key === 'interrupted' ? 'text-red-500 bg-red-500/10' : 'text-primary bg-primary/5'
                          : 'text-foreground/80 hover:bg-secondary/40 dark:hover:bg-secondary/55 dark:hover:bg-secondary/50 dark:hover:bg-secondary/60'
                      }`}
                    >
                      {key === 'all' && <LayoutGrid className="w-3 h-3" />}
                      {key === 'in-progress' && <Clock className="w-3 h-3" />}
                      {key === 'completed' && <Check className="w-3 h-3" />}
                      {key === 'interrupted' && <AlertCircle className="w-3 h-3 shrink-0" />}
                      <span>{filterLabels[key]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-0.5 mt-1">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="relative group"
                onMouseLeave={() => {
                  if (sameMoreRow(moreIconPinnedFor, { type: 'task', id: task.id })) setMoreIconPinnedFor(null);
                }}
              >
                <button
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors duration-150 text-left"
                >
                  {/* 状态放在文字前：已完成 / 任务中(loading) / 任务中断 */}
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden>
                    {task.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-muted-foreground/60" title="已完成" />
                    )}
                    {task.status === 'in-progress' && (
                      <CircularProgress value={task.progress ?? 0} size={16} strokeWidth={1.5} />
                    )}
                    {task.status === 'interrupted' && (
                      <AlertCircle className="w-4 h-4 text-red-500" title="任务中断" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0 pr-14">
                    <span className="text-xs text-foreground/80 truncate block">{task.title}</span>
                  </div>
                </button>
                {/* 右侧：时间与更多同位置；只要「更多」显示（下拉打开或钉住）就隐藏时间，避免重叠 */}
                <span
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/50 pointer-events-none transition-opacity duration-150 ${
                    sameMoreRow(moreMenuTarget, { type: 'task', id: task.id }) || sameMoreRow(moreIconPinnedFor, { type: 'task', id: task.id }) ? 'opacity-0' : 'group-hover:opacity-0'
                  }`}
                >
                  {task.timestamp}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const current = moreMenuTarget?.type === 'task' && moreMenuTarget.id === task.id;
                    if (current) {
                      setMoreMenuTarget(null);
                    } else {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
                      const t = { type: 'task' as const, id: task.id };
                      setMoreIconPinnedFor(t);
                      setMoreMenuTarget(t);
                    }
                  }}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-150 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/60 z-10 ${
                    sameMoreRow(moreMenuTarget, { type: 'task', id: task.id }) || sameMoreRow(moreIconPinnedFor, { type: 'task', id: task.id }) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 工作空间（紧接在任务列表下方） */}
        <div ref={workspaceSectionRef} className="shrink-0 flex flex-col mt-2 pt-2 border-t border-border/60">
          <span className="text-xs text-muted-foreground/85 px-2 mb-1.5" style={{ fontWeight: 500 }}>工作空间</span>
          <div className="space-y-0.5">
            {workspaces.map((ws) => {
              const isExpanded = expandedWorkspaceIds.has(ws.id);
              return (
              <div key={ws.id} className="space-y-0.5 group/ws">
                {/* 文件夹行：用 relative 包裹，使「更多」仅相对本行定位，避免展开后 top-1/2 落在任务列表中间出现两个更多 icon */}
                <div
                  className="relative"
                  onMouseLeave={() => {
                    if (sameMoreRow(moreIconPinnedFor, { type: 'workspace', workspaceId: ws.id })) setMoreIconPinnedFor(null);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedWorkspaceIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(ws.id)) next.delete(ws.id);
                      else next.add(ws.id);
                      return next;
                    })}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors duration-150 text-left"
                  >
                    <FolderOpen className="w-4 h-4 shrink-0 text-muted-foreground/70" />
                    <span className="text-sm text-foreground/80 truncate flex-1 min-w-0 pr-8">{ws.name ?? ws.id}</span>
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground/70">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = moreMenuTarget?.type === 'workspace' && moreMenuTarget.workspaceId === ws.id;
                      if (current) {
                        setMoreMenuTarget(null);
                      } else {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
                        const t = { type: 'workspace' as const, workspaceId: ws.id };
                        setMoreIconPinnedFor(t);
                        setMoreMenuTarget(t);
                      }
                    }}
                    className={`absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-150 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/60 z-10 ${
                      sameMoreRow(moreMenuTarget, { type: 'workspace', workspaceId: ws.id }) || sameMoreRow(moreIconPinnedFor, { type: 'workspace', workspaceId: ws.id }) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/ws:opacity-100 group-hover/ws:pointer-events-auto'
                    }`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                {isExpanded && (
                  <div className="pl-6 space-y-0.5">
                    {ws.tasks.map((wt) => (
                  <div
                    key={wt.id}
                    className="relative group"
                    onMouseLeave={() => {
                      if (sameMoreRow(moreIconPinnedFor, { type: 'workspace-task', workspaceId: ws.id, taskId: wt.id })) setMoreIconPinnedFor(null);
                    }}
                  >
                    <button
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/60 transition-colors duration-150 text-left"
                    >
                      {/* 状态放在文字前：已完成 / 任务中断 */}
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden>
                        {wt.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-muted-foreground/60" title="已完成" />
                        )}
                        {wt.status === 'interrupted' && (
                          <AlertCircle className="w-4 h-4 text-red-500" title="任务中断" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0 pr-14">
                        <span className="text-xs text-foreground/80 truncate block">{wt.title}</span>
                      </div>
                    </button>
                    <span
                      className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/50 pointer-events-none transition-opacity duration-150 ${
                        sameMoreRow(moreMenuTarget, { type: 'workspace-task', workspaceId: ws.id, taskId: wt.id }) || sameMoreRow(moreIconPinnedFor, { type: 'workspace-task', workspaceId: ws.id, taskId: wt.id }) ? 'opacity-0' : 'group-hover:opacity-0'
                      }`}
                    >
                      {wt.timestamp}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const current = moreMenuTarget?.type === 'workspace-task' && moreMenuTarget.workspaceId === ws.id && moreMenuTarget.taskId === wt.id;
                        if (current) {
                          setMoreMenuTarget(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
                          const t = { type: 'workspace-task' as const, workspaceId: ws.id, taskId: wt.id };
                          setMoreIconPinnedFor(t);
                          setMoreMenuTarget(t);
                        }
                      }}
                      className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-150 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/60 z-10 ${
                        sameMoreRow(moreMenuTarget, { type: 'workspace-task', workspaceId: ws.id, taskId: wt.id }) || sameMoreRow(moreIconPinnedFor, { type: 'workspace-task', workspaceId: ws.id, taskId: wt.id }) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                      }`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                    ))}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* More menu dropdown - 任务列表：重命名+保留到工作空间+删除；工作空间文件夹/任务：重命名+删除 */}
      {moreMenuTarget && createPortal(
        <div
          ref={moreMenuRef}
          className="fixed w-48 rounded-xl border border-border bg-card shadow-md py-1.5 z-[9999]"
          style={{ top: moreMenuPos.top, left: moreMenuPos.left }}
        >
          <button
            onClick={handleOpenRename}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-secondary/40 dark:hover:bg-secondary/55 transition-colors"
          >
            <span className="text-muted-foreground"><Pencil className="w-4 h-4" /></span>
            <span className="flex-1 text-left">重命名</span>
          </button>
          {moreMenuTarget.type === 'task' && (
            <button
              onClick={handleSaveToWorkspace}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-foreground/80 hover:bg-secondary/40 dark:hover:bg-secondary/55 transition-colors"
            >
              <span className="text-muted-foreground"><Bookmark className="w-4 h-4" /></span>
              <span className="flex-1 text-left">保留到工作空间</span>
            </button>
          )}
          <div className="mx-3 my-1 border-t border-border/60" />
          <button
            onClick={handleOpenDeleteConfirm}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>删除</span>
          </button>
        </div>,
        document.body
      )}

      {/* 重命名弹窗（任务/工作空间文件夹/工作空间任务共用） */}
      {renameTarget && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20">
          <div
            ref={renameDialogRef}
            className="w-full max-w-md rounded-2xl border border-border bg-card shadow-md p-6 mx-4"
          >
            <h3 className="text-base font-semibold text-foreground mb-4">重命名</h3>
            <input
              type="text"
              value={renameInputValue}
              onChange={(e) => setRenameInputValue(e.target.value)}
              placeholder="输入新名字"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 mb-5"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRenameTarget(null); setRenameInputValue(''); }}
                className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRename}
                className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontWeight: 500 }}
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 删除确认浮层（任务/工作空间文件夹/工作空间任务共用） */}
      {deleteTarget && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20">
          <div
            ref={deleteConfirmRef}
            className="w-full max-w-md rounded-2xl border border-border bg-card shadow-md p-6 mx-4"
          >
            <h3 className="text-base font-semibold text-foreground mb-2">
              {deleteTarget.type === 'task' && '删除此任务？'}
              {deleteTarget.type === 'workspace' && '删除此工作空间？'}
              {deleteTarget.type === 'workspace-task' && '删除此任务？'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {deleteTarget.type === 'task' && '这条会话将被永久删除，不可恢复及撤销。'}
              {deleteTarget.type === 'workspace' && '该工作空间及其内所有任务将被永久删除，不可恢复及撤销。'}
              {deleteTarget.type === 'workspace-task' && '该任务将被永久删除，不可恢复及撤销。'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                style={{ fontWeight: 500 }}
              >
                确认
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Bottom spacing */}
      <div className="h-3 shrink-0" />
    </aside>
  );
}

function CircularProgress({ value, size = 20, strokeWidth = 2 }: { value: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-foreground/20"
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-muted-foreground/60"
      />
    </svg>
  );
}

function IconNavButton({
  icon,
  active,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  active?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
        active ? 'bg-secondary/60 text-foreground' : 'text-foreground/75 hover:bg-secondary/40'
      }`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function NavItem({
  icon,
  label,
  active,
  shortcut,
  variant = 'default',
  children,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  /** 快捷键，如 "Ctrl K"，会显示为按键样式 */
  shortcut?: string;
  /** card = 白底+描边（新建任务样式）；default = 普通列表项 */
  variant?: 'default' | 'card';
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const keys = shortcut ? shortcut.trim().split(/\s+/) : [];
  const isCard = variant === 'card';
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2.5 rounded-lg transition-colors cursor-pointer duration-150 ${
        isCard
          ? 'bg-white dark:bg-card border border-foreground/10 dark:border-foreground/15 px-3 py-3'
          : `px-3 py-2.5 ${active ? 'bg-muted' : 'hover:bg-muted/50 dark:hover:bg-muted/60 hover:text-foreground'}`
      }`}
    >
      <span className={`shrink-0 transition-colors ${isCard ? 'text-foreground/85' : 'text-foreground/75 group-hover:text-foreground/90'}`}>{icon}</span>
      <span className={`text-sm flex-1 min-w-0 truncate transition-colors ${isCard ? 'text-foreground/90' : 'text-foreground/90 group-hover:text-foreground'}`}>{label}</span>
      {keys.length > 0 && (
        <div className="flex items-center gap-0.5 shrink-0 ml-1">
          {keys.map((k) => (
            <kbd
              key={k}
              className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded border border-border/80 bg-muted/70 text-[10px] text-foreground/75 font-normal"
            >
              {k}
            </kbd>
          ))}
        </div>
      )}
      {children && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}