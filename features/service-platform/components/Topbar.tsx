import Image from "next/image";
import { TopbarShell } from "@/components/demo/TopbarShell";
import { Badge } from "@/components/demo/Badge";
import { servicePlatformConfig, serviceRoutes } from "@/features/service-platform/config/product";
import { IndustrySwitcher } from "@/features/service-platform/components/IndustrySwitcher";
import { ResetDemoButton } from "@/features/service-platform/components/ResetDemoButton";
import { LeadCta } from "@/features/service-platform/components/LeadCta";

export function Topbar() {
  return (
    <TopbarShell
      backHref={serviceRoutes.marketing()}
      left={
        <>
          <Image src={servicePlatformConfig.logo} alt="" width={22} height={22} className="h-[22px] w-[22px] md:hidden" />
          <span className="font-display text-sm font-bold text-demo-text">{servicePlatformConfig.name}</span>
          {/* On desktop the persona switcher lives in the sidebar instead, so the badge has room to breathe. On mobile it's dropped to keep this to one row. */}
          <span className="hidden md:inline-flex">
            <Badge tone="primary">Demo</Badge>
          </span>
        </>
      }
      right={
        <>
          {/* Desktop switches persona from the sidebar; this is the mobile-only equivalent. */}
          <span className="md:hidden">
            <IndustrySwitcher />
          </span>
          <ResetDemoButton />
          <LeadCta />
        </>
      }
    />
  );
}
