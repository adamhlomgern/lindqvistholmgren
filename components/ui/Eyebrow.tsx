import { LucideIcon } from "lucide-react";

type EyebrowProps = {
  icon: LucideIcon;
  children: string;
  className?: string;
};

export function Eyebrow({ icon: Icon, children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-surface py-1 pl-2 pr-3 text-[13px] font-medium text-fg-muted shadow-card ring-1 ring-line ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={12} strokeWidth={2.5} />
      </span>
      {children}
    </span>
  );
}
