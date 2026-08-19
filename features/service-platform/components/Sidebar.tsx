"use client";

import { useMemo } from "react";
import { LayoutDashboard, Package, Users } from "lucide-react";
import { SidebarShell } from "@/components/demo/SidebarShell";
import { servicePlatformConfig, serviceRoutes } from "@/features/service-platform/config/product";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { industryPresets } from "@/features/service-platform/config/industries";
import { IndustrySwitcher } from "@/features/service-platform/components/IndustrySwitcher";
import type { DemoNavItem } from "@/components/demo/nav";

export function Sidebar() {
  const { industry } = useServicePlatform();
  const preset = industryPresets[industry];

  // "Kunder" only makes sense when the objects belong to external customers
  // — in the internal/eget-underhåll persona there are none to show.
  const navItems = useMemo<DemoNavItem[]>(() => {
    const items: DemoNavItem[] = [
      { href: serviceRoutes.dashboard(), label: "Dashboard", icon: LayoutDashboard, exactMatch: true },
    ];
    if (preset.ownership === "customer") {
      items.push({ href: serviceRoutes.customers(), label: "Kunder", icon: Users });
    }
    items.push({ href: serviceRoutes.assets(), label: "Objekt", icon: Package });
    return items;
  }, [preset.ownership]);

  return (
    <SidebarShell
      productName={servicePlatformConfig.name}
      subtitle={<IndustrySwitcher />}
      logo={servicePlatformConfig.logo}
      navItems={navItems}
    />
  );
}
