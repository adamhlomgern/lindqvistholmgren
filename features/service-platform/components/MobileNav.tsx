"use client";

import { LayoutDashboard, Package, Users } from "lucide-react";
import { MobileNavShell } from "@/components/demo/MobileNavShell";
import { serviceRoutes } from "@/features/service-platform/config/product";
import type { DemoNavItem } from "@/components/demo/nav";

const navItems: DemoNavItem[] = [
  { href: serviceRoutes.dashboard(), label: "Dashboard", icon: LayoutDashboard, exactMatch: true },
  { href: serviceRoutes.customers(), label: "Kunder", icon: Users },
  { href: serviceRoutes.assets(), label: "Objekt", icon: Package },
];

export function MobileNav() {
  return <MobileNavShell navItems={navItems} />;
}
