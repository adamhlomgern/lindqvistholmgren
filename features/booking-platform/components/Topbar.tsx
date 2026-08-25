"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { TopbarShell } from "@/components/demo/TopbarShell";
import { Badge } from "@/components/demo/Badge";
import { bokadConfig, bokadRoutes } from "@/features/booking-platform/config/product";
import { RoleTabs } from "@/features/booking-platform/components/RoleTabs";
import { OrgSwitcher } from "@/features/booking-platform/components/OrgSwitcher";
import { ResetDemoButton } from "@/features/booking-platform/components/ResetDemoButton";
import { LeadCta } from "@/features/booking-platform/components/LeadCta";

export function Topbar() {
  const pathname = usePathname() ?? "";
  // Only Salong/Ägare care about "which seeded salong is mine" — the Kund
  // catalog browses every salon at once, so the switcher would be noise
  // there.
  const showOrgSwitcher = pathname.startsWith(bokadRoutes.calendar()) || pathname.startsWith(bokadRoutes.owner());

  return (
    <div className="flex flex-col gap-3 border-b border-demo-border bg-demo-surface/95 pb-3 pt-3 backdrop-blur-md">
      <TopbarShell
        backHref={bokadRoutes.marketing()}
        left={
          <>
            <Image src={bokadConfig.logo} alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-md" />
            <span className="font-display text-sm font-bold text-demo-text">{bokadConfig.name}</span>
            <span className="hidden md:inline-flex">
              <Badge tone="primary">Demo</Badge>
            </span>
          </>
        }
        right={
          <>
            {showOrgSwitcher && <OrgSwitcher />}
            <ResetDemoButton />
            <LeadCta />
          </>
        }
      />
      <RoleTabs />
    </div>
  );
}
