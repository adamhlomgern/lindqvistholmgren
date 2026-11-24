import { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

// Neutral tagg. Skickas en egen bakgrund in (t.ex. en statusfärg som
// "bg-red-100 text-red-800") används den i stället för den neutrala stilen,
// så att klasserna inte krockar.
export function Tag({ children, className = "" }: TagProps) {
  const tinted = /(^|\s)bg-/.test(className);
  const base = tinted ? "" : "bg-surface-sunken text-fg-muted ring-1 ring-inset ring-line";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${base} ${className}`}>
      {children}
    </span>
  );
}
