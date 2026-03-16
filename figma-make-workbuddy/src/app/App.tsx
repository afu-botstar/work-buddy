import { useState, useRef, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ResultsPanel } from './components/ResultsPanel';
import { SkillsPage } from './components/SkillsPage';
import { PluginsPage } from './components/PluginsPage';
import { AutomationPage } from './components/AutomationPage';
import { AgentAnswerView } from './components/AgentAnswerView';
import { ClawSettingsPanel } from './components/ClawSettingsPanel';

export default function App() {
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(''); // 默认新建任务页面，不选中侧栏项
  const [showAgentAnswer, setShowAgentAnswer] = useState(false);
  const [agentAnswerUserInput, setAgentAnswerUserInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const goToNewTask = useCallback(() => {
    setActiveNav('');
    setShowAgentAnswer(false);
    setTimeout(() => chatInputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        goToNewTask();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNewTask]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeNav={activeNav}
          onNavChange={(nav) => {
            setActiveNav(nav);
            if (nav === '' || nav === 'claw') {
              setShowAgentAnswer(false);
              if (nav === '') setTimeout(() => chatInputRef.current?.focus(), 0);
            }
          }}
          onOpenSettings={() => setSettingsOpen(true)}
          onFolderSelect={(files) => {
            if (files.length) {
              console.log(`已选择文件夹，共 ${files.length} 个文件`);
              // 可在此将 files 传给 ChatArea 等组件使用
            }
          }}
        />
        {activeNav === 'skills' ? (
          <SkillsPage />
        ) : activeNav === 'plugins' ? (
          <PluginsPage />
        ) : activeNav === 'automation' ? (
          <AutomationPage />
        ) : showAgentAnswer ? (
          <>
            <AgentAnswerView
              userInput={agentAnswerUserInput}
              onBack={() => setShowAgentAnswer(false)}
              onSendFollowUp={(input) => setAgentAnswerUserInput(input)}
              activeNav={activeNav}
            />
            <ResultsPanel isOpen={isResultsOpen} onClose={() => setIsResultsOpen(false)} />
          </>
        ) : (
          <>
            <ChatArea
              key={activeNav || 'new-task'}
              onToggleResults={() => setIsResultsOpen(!isResultsOpen)}
              inputRef={chatInputRef}
              onEnterAgentAnswer={(input) => {
                setAgentAnswerUserInput(input);
                setShowAgentAnswer(true);
              }}
              showStartNewAndTags={activeNav !== 'claw'}
            />
            <ResultsPanel isOpen={isResultsOpen} onClose={() => setIsResultsOpen(false)} />
          </>
        )}
      </div>
      {settingsOpen && <ClawSettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}