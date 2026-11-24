import { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-medium text-fg-muted ring-1 ring-inset ring-line ${className}`}
    >
      {children}
    </span>
  );
}
