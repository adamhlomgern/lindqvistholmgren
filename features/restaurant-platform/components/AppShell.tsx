"use client";

import type { CSSProperties, ReactNode } from "react";
import { Topbar } from "@/features/restaurant-platform/components/Topbar";
import { MumsaOnboarding } from "@/features/restaurant-platform/components/MumsaOnboarding";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";

// theme-mumsa (see globals.css) swaps every --color-demo-* token this shell
// and its children resolve, so the same components/demo/* building blocks
// Servicekoll uses read as a warm food-ordering app instead of a B2B SaaS.
// The restaurant's chosen brand color (set in onboarding) then overrides
// just the primary shades on top of that, so "your own color" is a real,
// live effect instead of a cosmetic-only onboarding step.
export function AppShell({ children }: { children: ReactNode }) {
  const { restaurant } = useRestaurantPlatform();

  const brandStyle: CSSProperties = {
    "--color-demo-primary": restaurant.brandColor,
    "--color-demo-primary-hover": `color-mix(in srgb, ${restaurant.brandColor} 85%, black)`,
    "--color-demo-primary-soft": `color-mix(in srgb, ${restaurant.brandColor} 16%, white)`,
    "--color-demo-primary-soft-text": `color-mix(in srgb, ${restaurant.brandColor} 70%, black)`,
  } as CSSProperties;

  return (
    <div className="theme-mumsa min-h-screen bg-demo-bg text-demo-text" style={brandStyle}>
      <Topbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-8 md:pb-12">{children}</main>
      <MumsaOnboarding />
    </div>
  );
}
