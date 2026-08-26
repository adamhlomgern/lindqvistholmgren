import type { ReactNode } from "react";
import { Topbar } from "@/features/booking-platform/components/Topbar";

// theme-bokad (see globals.css) swaps every --color-demo-* token this shell
// and its children resolve, giving Bokad its own calm blue identity — same
// mechanism as Mumsa's theme-mumsa, distinct from Servicekoll's default
// (green) palette. No max-width on <main>, unlike Mumsa's single-restaurant
// shell — the directory grid, calendar, and multi-column layouts should
// stretch to fill wide screens instead of floating in a centered column;
// Topbar/TopbarShell already span full width with the same px-4/md:px-8
// gutters, so this keeps both edges aligned.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="theme-bokad min-h-screen bg-demo-bg text-demo-text">
      <Topbar />
      <main className="px-4 pb-16 pt-6 md:px-8 md:pb-12">{children}</main>
    </div>
  );
}
