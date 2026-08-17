import type { LucideIcon } from "lucide-react";
import { badgeClasses, type Accent } from "@/lib/design/accents";

type AccentBadgeProps = {
  icon: LucideIcon;
  accent?: Accent;
  size?: number;
  boxSize?: "default" | "compact";
  className?: string;
};

const boxSizeClasses = {
  default: "h-10 w-10",
  compact: "h-8 w-8 sm:h-10 sm:w-10",
};

export function AccentBadge({
  icon: Icon,
  accent = "emerald",
  size = 18,
  boxSize = "default",
  className = "",
}: AccentBadgeProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${boxSizeClasses[boxSize]} ${badgeClasses[accent]} ${className}`}
    >
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
