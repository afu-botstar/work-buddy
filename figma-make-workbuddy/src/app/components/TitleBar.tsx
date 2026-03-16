import { Moon, Sun, User, Minus, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const menuItems = ['编辑(E)', 'Window', '帮助(H)'];

export function TitleBar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('workbuddy_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIsDark = stored === 'dark' ? true : stored === 'light' ? false : prefersDark;
    setIsDark(initialIsDark);
    document.documentElement.classList.toggle('dark', initialIsDark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('workbuddy_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <div
      className="flex items-center justify-between px-4 h-9 shrink-0 select-none border-b border-border"
      style={{ background: 'var(--color-card)' }}
    >
      {/* Left: Logo + Brand + menu */}
      <div className="flex items-center gap-2">
        <img
          src="/avatar-cat.png"
          alt=""
          className="h-5 w-auto object-contain shrink-0"
        />
        <span
          className="text-sm tracking-tight mr-2"
          style={{ color: 'var(--color-foreground)', fontWeight: 600 }}
        >
          WorkBuddy
        </span>
        <nav className="flex items-center gap-0">
          {menuItems.map((item) => (
            <button
              key={item}
              className="px-2.5 py-0.5 rounded text-xs transition-colors hover:bg-secondary/50 dark:hover:bg-secondary/60"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Title */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-xs"
        style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}
      >
        WorkBuddy
      </span>

      {/* Right: Actions + window controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md transition-colors hover:bg-secondary/50 dark:hover:bg-secondary/60"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
        <button
          className="p-1.5 rounded-md transition-colors hover:bg-secondary/50 dark:hover:bg-secondary/60"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="Account"
        >
          <User className="w-3.5 h-3.5" />
        </button>

        {/* Window controls */}
        <div className="flex items-center ml-3 gap-0">
          <button className="p-1.5 rounded hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors" style={{ color: 'var(--color-muted-foreground)' }}>
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-secondary/50 dark:hover:bg-secondary/60 transition-colors" style={{ color: 'var(--color-muted-foreground)' }}>
            <Square className="w-3 h-3" />
          </button>
          <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors" style={{ color: 'var(--color-muted-foreground)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
