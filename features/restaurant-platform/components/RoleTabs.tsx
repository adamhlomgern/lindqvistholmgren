"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";

const tabs = [
  { key: "kund", href: mumsaRoutes.storefront(), label: "Kund" },
  { key: "restaurang", href: mumsaRoutes.restaurant(), label: "Restaurang" },
  { key: "leverantor", href: mumsaRoutes.courier(), label: "Leverantör" },
  { key: "agare", href: mumsaRoutes.owner(), label: "Ägare" },
] as const;

// The four roles are real, separate routes rather than a client-side view
// switch, so each can be linked to directly — but they're surfaced together
// as tabs (not a normal nav) because switching between them is the whole
// point of this demo: a prospect can see the same order from every angle
// (customer, kitchen, courier, owner) in a couple of clicks.
//
// Styled deliberately as tooling, not product: a neutral dark pill instead
// of the brand color, plus a small "Visa som" label. A real restaurant
// account would never see a Kund/Restaurang/Leverantör/Ägare switcher at
// all — this only exists for the demo, so it shouldn't read as part of the
// product itself.
export function RoleTabs() {
  const pathname = usePathname() ?? "";
  const isRestaurant = pathname.startsWith(mumsaRoutes.restaurant());
  const isOwner = pathname.startsWith(mumsaRoutes.owner());
  const isCourier = pathname.startsWith(mumsaRoutes.courier());

  return (
    // Owns its own horizontal padding (matches TopbarShell above it and the
    // main content below it) rather than relying on a parent wrapper for
    // it — see the comment in Topbar.tsx about why that double-pads.
    <div className="flex w-full items-center px-4 sm:w-auto md:px-8">
      {/* The "visa som" label sits inside the same pill as the tabs (a
          divider, not a gap, separates them) so it reads as one labeled
          widget rather than a stray caption floating next to it. */}
      <nav className="flex items-center gap-1 overflow-x-auto rounded-full border border-demo-border bg-demo-neutral-soft p-1">
        <span className="hidden shrink-0 items-center gap-2 pl-2 pr-1 text-[10px] font-semibold uppercase tracking-label text-demo-text-faint sm:flex">
          Visa som
          <span className="h-3.5 w-px shrink-0 bg-demo-border" />
        </span>
        {tabs.map((tab) => {
          const active =
            tab.key === "restaurang"
              ? isRestaurant
              : tab.key === "leverantor"
                ? isCourier
                : tab.key === "agare"
                  ? isOwner
                  : !isRestaurant && !isOwner && !isCourier;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-center text-xs font-semibold transition-colors ${
                active ? "bg-demo-text text-demo-surface" : "text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
