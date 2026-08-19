"use client";

import { LayoutDashboard, Package, Users } from "lucide-react";
import { SidebarShell } from "@/components/demo/SidebarShell";
import { servicePlatformConfig, serviceRoutes } from "@/features/service-platform/config/product";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { industryPresets } from "@/features/service-platform/config/industries";
import type { DemoNavItem } from "@/components/demo/nav";

const navItems: DemoNavItem[] = [
  { href: serviceRoutes.dashboard(), label: "Dashboard", icon: LayoutDashboard, exactMatch: true },
  { href: serviceRoutes.customers(), label: "Kunder", icon: Users },
  { href: serviceRoutes.assets(), label: "Objekt", icon: Package },
];

export function Sidebar() {
  const { industry } = useServicePlatform();
  const preset = industryPresets[industry];

  return <SidebarShell productName={servicePlatformConfig.name} subtitle={preset.label} navItems={navItems} />;
}
