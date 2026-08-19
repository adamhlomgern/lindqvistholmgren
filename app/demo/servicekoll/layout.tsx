import { ServicePlatformProvider } from "@/features/service-platform/state/ServicePlatformProvider";
import { AppShell } from "@/features/service-platform/components/AppShell";

export default function ServicekollDemoLayout({ children }: LayoutProps<"/demo/servicekoll">) {
  return (
    <ServicePlatformProvider>
      <AppShell>{children}</AppShell>
    </ServicePlatformProvider>
  );
}
