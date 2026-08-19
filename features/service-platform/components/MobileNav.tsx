"use client";

import { useMemo } from "react";
import { LayoutDashboard, Package, Users } from "lucide-react";
import { MobileNavShell } from "@/components/demo/MobileNavShell";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { industryPresets } from "@/features/service-platform/config/industries";
import type { DemoNavItem } from "@/components/demo/nav";

export function MobileNav() {
  const { industry } = useServicePlatform();
  const preset = industryPresets[industry];

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

  return <MobileNavShell navItems={navItems} />;
}
