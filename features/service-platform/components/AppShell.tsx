import type { ReactNode } from "react";
import { AppShell as DemoAppShell } from "@/components/demo/AppShell";
import { Sidebar } from "@/features/service-platform/components/Sidebar";
import { MobileNav } from "@/features/service-platform/components/MobileNav";
import { Topbar } from "@/features/service-platform/components/Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DemoAppShell sidebar={<Sidebar />} topbar={<Topbar />} mobileNav={<MobileNav />}>
      {children}
    </DemoAppShell>
  );
}
