import { ReactNode } from "react";

type Padding = "default" | "compact" | "none";

const paddingClasses: Record<Padding, string> = {
  default: "p-6",
  compact: "p-4 sm:p-5",
  none: "",
};

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: Padding;
};

export function Card({ children, className = "", padding = "default" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-demo-border bg-demo-surface ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
