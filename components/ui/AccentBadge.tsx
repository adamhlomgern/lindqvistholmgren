import type { LucideIcon } from "lucide-react";
import { badgeClasses, type Accent } from "@/lib/design/accents";

type AccentBadgeProps = {
  icon: LucideIcon;
  accent?: Accent;
  size?: number;
  className?: string;
};

export function AccentBadge({ icon: Icon, accent = "emerald", size = 18, className = "" }: AccentBadgeProps) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badgeClasses[accent]} ${className}`}
    >
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
