import { useState, useRef, useEffect } from 'react';
import { X, User, Settings, Link2, ChevronDown } from 'lucide-react';

type SettingsTab = 'account' | 'system' | 'claw';

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'account', label: '账户管理', icon: User },
  { id: 'system', label: '系统设置', icon: Settings },
  { id: 'claw', label: 'Claw 设置', icon: Link2 },
];

type IntegrationId = 'wecom-aibot' | 'wecom-service' | 'qq' | 'feishu' | 'dingtalk';

const INTEGRATIONS: { id: IntegrationId; name: string; desc: string; hasGuide?: boolean }[] = [
  { id: 'wecom-aibot', name: '企微 AIBot 集成', desc: '注册企微 AIBot 以接收和回复消息。' },
  { id: 'wecom-service', name: '微信客服号集成', desc: '注册微信客服号以接收和回复消息。', hasGuide: true },
  { id: 'qq', name: 'QQ 机器人集成', desc: '注册 QQ 机器人以接收和回复消息。' },
  { id: 'feishu', name: '飞书集成', desc: '注册飞书应用以通过飞书接收和回复消息。' },
  { id: 'dingtalk', name: '钉钉机器人集成', desc: '注册钉钉机器人以接收和回复消息。' },
];

interface ClawSettingsPanelProps {
  onClose: () => void;
}

const DISPLAY_LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '中文(简体)' },
  { value: 'zh-TW', label: '中文(繁体)' },
  { value: 'en', label: 'English' },
];

const TAB_TITLES: Record<SettingsTab, string> = {
  account: '账户管理',
  system: '设置',
  claw: 'Claw 设置',
};

export function ClawSettingsPanel({ onClose }: ClawSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('claw');
  const [systemNotifyOn, setSystemNotifyOn] = useState(true);
  const [displayLanguage, setDisplayLanguage] = useState('zh-CN');
  const [configIntegrationId, setConfigIntegrationId] = useState<IntegrationId | null>(null);
  const [configConnectionType, setConfigConnectionType] = useState<'websocket' | 'url'>('websocket');
  const [configBotId, setConfigBotId] = useState('');
  const [configSecret, setConfigSecret] = useState('');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    }
    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [languageDropdownOpen]);

  const openConfig = (id: IntegrationId) => {
    setConfigIntegrationId(id);
    setConfigConnectionType('websocket');
    setConfigBotId('');
    setConfigSecret('');
  };
  const closeConfig = () => setConfigIntegrationId(null);

  const handleConfigRegister = () => {
    if (configIntegrationId === 'wecom-aibot' && (!configBotId.trim() || !configSecret.trim())) return;
    closeConfig();
  };

  return (
    <div className="fixed inset-0 z-[10001] flex justify-end bg-black/20" onClick={onClose}>
      <div
        className="w-full max-w-2xl h-full bg-card border-l border-border shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部：标题随当前 Tab 变化 + 关闭 */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{TAB_TITLES[activeTab]}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* 左侧导航 */}
          <nav className="w-44 shrink-0 border-r border-border py-4 px-3 flex flex-col gap-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* 右侧内容：当前仅实现 Claw 设置 */}
          <div className="flex-1 min-w-0 overflow-y-auto p-6">
            {activeTab === 'claw' && (
              <div className="space-y-8">
                {/* 通知 */}
                <section>
                  <h3 className="text-sm font-medium text-foreground mb-3">通知</h3>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      当 Agent 完成任务或需要关注时显示系统通知。
                    </p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={systemNotifyOn}
                      onClick={() => setSystemNotifyOn((v) => !v)}
                      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        systemNotifyOn ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                          systemNotifyOn ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </section>

                {/* 集成 (BETA) */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-medium text-foreground">集成 (BETA)</h3>
                    <a
                      href="#"
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      配置指南
                    </a>
                  </div>
                  <div className="space-y-3">
                    {INTEGRATIONS.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                          {item.hasGuide && (
                            <a
                              href="#"
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                              onClick={(e) => e.preventDefault()}
                            >
                              配置指南
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openConfig(item.id)}
                          className="shrink-0 px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          配置
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
            {activeTab === 'account' && (
              <p className="text-sm text-muted-foreground">账户管理内容（待实现）</p>
            )}
            {activeTab === 'system' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-medium text-foreground mb-3">语言</h3>
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">显示语言</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          设置应用程序界面的显示语言。
                        </p>
                      </div>
                      <div className="relative shrink-0 min-w-[140px]" ref={languageDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setLanguageDropdownOpen((v) => !v)}
                          className="w-full h-8 flex items-center justify-between gap-1.5 px-3 rounded-full border border-foreground/15 dark:border-foreground/30 bg-card text-sm text-foreground/80 hover:text-foreground hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          <span className="truncate">
                            {DISPLAY_LANGUAGE_OPTIONS.find((o) => o.value === displayLanguage)?.label ?? displayLanguage}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {languageDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 min-w-[140px] rounded-xl border border-foreground/15 dark:border-foreground/30 bg-card shadow-md py-1.5 z-50">
                            {DISPLAY_LANGUAGE_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setDisplayLanguage(opt.value);
                                  setLanguageDropdownOpen(false);
                                }}
                                className={`flex items-center justify-start w-full px-3.5 py-2 text-sm text-left transition-colors ${
                                  displayLanguage === opt.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-foreground/80 hover:bg-secondary/50 dark:hover:bg-secondary/60'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 配置弹窗：注册企微 AIBot 通道（点击任一集成的「配置」可打开，当前仅企微有完整表单） */}
      {configIntegrationId && (
        <div
          className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/30 p-4"
          onClick={closeConfig}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {configIntegrationId === 'wecom-aibot' ? (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-1">注册企微 AIBot 通道</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  选择连接方式并输入对应凭据，以将此工作区绑定到企微 AIBot。
                </p>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline inline-block mb-5"
                  onClick={(e) => e.preventDefault()}
                >
                  配置指南
                </a>
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-foreground">连接方式</span>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="connection"
                        checked={configConnectionType === 'websocket'}
                        onChange={() => setConfigConnectionType('websocket')}
                        className="w-4 h-4 text-primary border-border focus:ring-primary/30"
                      />
                      <span className="text-sm text-foreground">WebSocket 长连接</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="connection"
                        checked={configConnectionType === 'url'}
                        onChange={() => setConfigConnectionType('url')}
                        className="w-4 h-4 text-primary border-border focus:ring-primary/30"
                      />
                      <span className="text-sm text-foreground">使用 URL 回调</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Bot ID"
                      value={configBotId}
                      onChange={(e) => setConfigBotId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Secret"
                      value={configSecret}
                      onChange={(e) => setConfigSecret(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeConfig}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfigRegister}
                    disabled={!configBotId.trim() || !configSecret.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    注册
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  配置 {INTEGRATIONS.find((i) => i.id === configIntegrationId)?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">该集成配置界面开发中。</p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeConfig}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
