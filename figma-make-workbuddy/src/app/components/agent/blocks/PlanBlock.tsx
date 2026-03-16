import type { PlanBlockPayload } from '../types';
import { Check, Circle, Loader2 } from 'lucide-react';

const STEP_STATUS_MAP = {
  done: { label: '完整', icon: Check, iconClass: 'text-green-600 dark:text-green-400', labelClass: 'text-green-600 dark:text-green-400' },
  loading: { label: '工作中', icon: Loader2, iconClass: 'text-primary animate-spin', labelClass: 'text-primary' },
  pending: { label: '未开始', icon: Circle, iconClass: 'text-muted-foreground', labelClass: 'text-muted-foreground' },
} as const;

interface PlanBlockProps {
  payload?: PlanBlockPayload;
}

export function PlanBlock({ payload }: PlanBlockProps) {
  const steps = payload?.steps ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm text-foreground font-medium mb-3" style={{ fontWeight: 600 }}>
        执行计划
      </div>
      <ul className="space-y-2">
        {steps.map((step, i) => {
          const status = step.status ?? 'pending';
          const { label, icon: Icon, iconClass, labelClass } = STEP_STATUS_MAP[status];
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconClass}`} strokeWidth={status === 'pending' ? 2 : undefined} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{step.title}</span>
                  <span className={`text-xs shrink-0 ${labelClass}`}>{label}</span>
                </div>
                {step.description && (
                  <p className="text-muted-foreground text-xs mt-0.5">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
