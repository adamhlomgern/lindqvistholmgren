import Image from "next/image";
import { TopbarShell } from "@/components/demo/TopbarShell";
import { Badge } from "@/components/demo/Badge";
import { mumsaConfig, mumsaRoutes } from "@/features/restaurant-platform/config/product";
import { RoleTabs } from "@/features/restaurant-platform/components/RoleTabs";
import { ResetDemoButton } from "@/features/restaurant-platform/components/ResetDemoButton";
import { LeadCta } from "@/features/restaurant-platform/components/LeadCta";

export function Topbar() {
  return (
    // TopbarShell owns its own horizontal padding (matches the main content
    // padding below it) — this wrapper must not add another layer of px-*
    // around it, or the header row ends up double-indented relative to
    // RoleTabs and the page content. RoleTabs owns its own padding to match.
    <div className="flex flex-col gap-3 border-b border-demo-border bg-demo-surface/95 pb-3 pt-3 backdrop-blur-md">
      <TopbarShell
        backHref={mumsaRoutes.marketing()}
        left={
          <>
            <Image src={mumsaConfig.logo} alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-md" />
            <span className="font-display text-sm font-bold text-demo-text">{mumsaConfig.name}</span>
            <span className="hidden md:inline-flex">
              <Badge tone="primary">Demo</Badge>
            </span>
          </>
        }
        right={
          <>
            <ResetDemoButton />
            <LeadCta />
          </>
        }
      />
      <RoleTabs />
    </div>
  );
}
