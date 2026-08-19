import type { ReactNode } from "react";

type AppShellProps = {
  sidebar: ReactNode;
  topbar: ReactNode;
  mobileNav: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, topbar, mobileNav, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-demo-bg text-demo-text">
      {sidebar}
      {/* min-w-0 overrides the flex-item default of min-width:auto, which
          would otherwise let a wide descendant (e.g. a table's min-w-[640px]
          inside overflow-x-auto) push this column wider than the viewport
          instead of scrolling within its own container. */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {topbar}
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}
