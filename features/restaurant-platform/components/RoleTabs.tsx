"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";

const tabs = [
  { key: "kund", href: mumsaRoutes.storefront(), label: "Kund" },
  { key: "restaurang", href: mumsaRoutes.restaurant(), label: "Restaurang" },
  { key: "agare", href: mumsaRoutes.owner(), label: "Ägare" },
] as const;

// The three roles are real, separate routes rather than a client-side view
// switch, so each can be linked to directly — but they're surfaced together
// as tabs (not a normal nav) because switching between them is the whole
// point of this demo: a prospect can see the same order from all three
// angles in a couple of clicks.
//
// Styled deliberately as tooling, not product: a neutral dark pill instead
// of the brand color, plus a small "Visa som" label. A real restaurant
// account would never see a Kund/Restaurang/Ägare switcher at all — this
// only exists for the demo, so it shouldn't read as part of the product
// itself.
export function RoleTabs() {
  const pathname = usePathname() ?? "";
  const isRestaurant = pathname.startsWith(mumsaRoutes.restaurant());
  const isOwner = pathname.startsWith(mumsaRoutes.owner());

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-label text-demo-text-faint sm:inline">
        Demo — visa som
      </span>
      <nav className="flex flex-1 gap-1 overflow-x-auto rounded-full border border-demo-border bg-demo-neutral-soft p-1 sm:flex-none">
        {tabs.map((tab) => {
          const active = tab.key === "restaurang" ? isRestaurant : tab.key === "agare" ? isOwner : !isRestaurant && !isOwner;
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
