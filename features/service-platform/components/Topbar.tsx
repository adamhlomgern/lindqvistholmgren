import { TopbarShell } from "@/components/demo/TopbarShell";
import { Badge } from "@/components/demo/Badge";
import { servicePlatformConfig } from "@/features/service-platform/config/product";
import { IndustrySwitcher } from "@/features/service-platform/components/IndustrySwitcher";
import { ResetDemoButton } from "@/features/service-platform/components/ResetDemoButton";
import { LeadCta } from "@/features/service-platform/components/LeadCta";

export function Topbar() {
  return (
    <TopbarShell
      left={
        <>
          <span className="font-display text-sm font-bold text-demo-text">{servicePlatformConfig.name}</span>
          <Badge tone="primary">Demo</Badge>
        </>
      }
      right={
        <>
          <IndustrySwitcher />
          <ResetDemoButton />
          <LeadCta />
        </>
      }
    />
  );
}
