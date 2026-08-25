import type { ReactNode } from "react";
import { Topbar } from "@/features/booking-platform/components/Topbar";

// theme-bokad (see globals.css) swaps every --color-demo-* token this shell
// and its children resolve, giving Bokad its own calm blue identity — same
// mechanism as Mumsa's theme-mumsa, distinct from Servicekoll's default
// (green) palette. Wider max-width than Mumsa's single-restaurant shell:
// the directory grid and salon profile need the extra room a multi-salon
// catalog implies.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="theme-bokad min-h-screen bg-demo-bg text-demo-text">
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-8 md:pb-12">{children}</main>
    </div>
  );
}
