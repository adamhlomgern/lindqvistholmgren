import type { ReactNode } from "react";
import { toneBadgeClasses, type Tone } from "@/components/demo/tokens";

type BadgeProps = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Badge({ tone = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${toneBadgeClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
