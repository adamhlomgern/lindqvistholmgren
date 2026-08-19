import type { ReactNode } from "react";

type TopbarShellProps = {
  left: ReactNode;
  right: ReactNode;
};

export function TopbarShell({ left, right }: TopbarShellProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-demo-border bg-demo-surface/95 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">{right}</div>
    </header>
  );
}
