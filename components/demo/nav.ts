import type { LucideIcon } from "lucide-react";

export type DemoNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  // Match the pathname exactly rather than by prefix — needed for a root
  // route like the dashboard, which would otherwise "stay active" under
  // every other nested route.
  exactMatch?: boolean;
};
