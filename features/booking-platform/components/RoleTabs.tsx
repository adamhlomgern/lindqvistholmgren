"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bokadRoutes } from "@/features/booking-platform/config/product";

const tabs = [
  { key: "kund", href: bokadRoutes.directory(), label: "Kund" },
  { key: "salong", href: bokadRoutes.calendar(), label: "Salong" },
  { key: "agare", href: bokadRoutes.owner(), label: "Ägare" },
] as const;

// Three real, separate routes rather than a client-side view switch — see
// the equivalent comment in restaurant-platform/components/RoleTabs.tsx.
// Bokad is a catalog (many salons), so "Kund" covers every /demo/bokad/**
// route that isn't kalender or agare (directory, a salon profile, a
// booking confirmation), while Salong/Ägare are always about whichever
// salon the OrgSwitcher currently has selected.
//
// Styled as tooling, not product, for the same reason as Mumsa's: a real
// salong account would never see a Kund/Salong/Ägare switcher.
export function RoleTabs() {
  const pathname = usePathname() ?? "";
  const isSalong = pathname.startsWith(bokadRoutes.calendar());
  const isAgare = pathname.startsWith(bokadRoutes.owner());

  return (
    <div className="flex w-full items-center px-4 sm:w-auto md:px-8">
      <nav className="flex items-center gap-1 overflow-x-auto rounded-full border border-demo-border bg-demo-neutral-soft p-1">
        <span className="hidden shrink-0 items-center gap-2 pl-2 pr-1 text-[10px] font-semibold uppercase tracking-label text-demo-text-faint sm:flex">
          Visa som
          <span className="h-3.5 w-px shrink-0 bg-demo-border" />
        </span>
        {tabs.map((tab) => {
          const active = tab.key === "salong" ? isSalong : tab.key === "agare" ? isAgare : !isSalong && !isAgare;
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
