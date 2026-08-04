import { LucideIcon } from "lucide-react";

type EyebrowProps = {
  icon: LucideIcon;
  children: string;
  className?: string;
};

export function Eyebrow({ icon: Icon, children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-bone/5 py-1.5 pl-2.5 pr-3.5 text-xs font-medium uppercase tracking-label text-stone ${className}`}
    >
      <Icon className="text-emerald" size={14} strokeWidth={2.25} />
      {children}
    </span>
  );
}
