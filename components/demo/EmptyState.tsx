import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-demo-border px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-demo-surface-hover text-demo-text-muted">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <p className="font-display text-base font-bold text-demo-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-demo-text-muted">{description}</p>}
      {action && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
