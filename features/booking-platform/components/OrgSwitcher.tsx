"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Store } from "lucide-react";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";

// Bokad is a catalog of many salons, so — unlike Servicekoll/Mumsa, which
// are single-tenant — Salong/Ägare need to know *which* seeded salon is
// "yours". Modeled directly on IndustrySwitcher's custom-dropdown approach
// (a native <select> can't be restyled to match the rest of the app).
export function OrgSwitcher() {
  const { organizations, currentOrgSlug, setCurrentOrgSlug } = useBookingPlatform();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = organizations.find((org) => org.slug === currentOrgSlug) ?? organizations[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(slug: string) {
    setCurrentOrgSlug(slug);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative min-w-0 shrink">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Byt salong"
        className="flex max-w-full items-center gap-1.5 rounded-full border border-demo-border bg-demo-surface py-1.5 pl-3 pr-2.5 text-xs font-medium text-demo-text transition-colors hover:border-demo-text-faint"
      >
        <Store size={13} className="shrink-0 text-demo-text-muted" />
        <span className="truncate">{current?.name ?? "Välj salong"}</span>
        <ChevronDown size={13} className={`shrink-0 text-demo-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-40 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-demo-border bg-demo-surface py-1 shadow-lg"
        >
          {organizations.map((org) => {
            const active = org.slug === currentOrgSlug;
            return (
              <button
                key={org.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(org.slug)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  active ? "bg-demo-primary-soft text-demo-primary-soft-text" : "text-demo-text hover:bg-demo-surface-hover"
                }`}
              >
                <span className="truncate">
                  {org.name}
                  <span className="ml-1.5 text-xs text-demo-text-faint">· {org.city}</span>
                </span>
                {active && <Check size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
