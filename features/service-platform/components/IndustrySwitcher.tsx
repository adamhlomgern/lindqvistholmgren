"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { industryOrder, industryPresets, type IndustryKey } from "@/features/service-platform/config/industries";

// A custom dropdown rather than a native <select> or a row of pills: it
// never wraps regardless of how many personas exist, and — unlike a native
// select — the open panel can actually be styled to match the rest of the
// app instead of falling back to the browser's own unstyled listbox.
export function IndustrySwitcher() {
  const { industry, setIndustry } = useServicePlatform();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  function handleSelect(key: IndustryKey) {
    setIndustry(key);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Byt bransch"
        className="flex items-center gap-1.5 rounded-full border border-demo-border bg-demo-surface py-1.5 pl-3 pr-2.5 text-xs font-medium text-demo-text transition-colors hover:border-demo-text-faint"
      >
        {industryPresets[industry].label}
        <ChevronDown size={13} className={`shrink-0 text-demo-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-demo-border bg-demo-surface py-1 shadow-lg"
        >
          {industryOrder.map((key) => {
            const active = key === industry;
            return (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(key)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  active ? "bg-demo-primary-soft text-demo-primary-soft-text" : "text-demo-text hover:bg-demo-surface-hover"
                }`}
              >
                {industryPresets[key].label}
                {active && <Check size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
