"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { PeriodKey } from "@/features/restaurant-platform/utils/stats";

const OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "Idag" },
  { key: "yesterday", label: "Igår" },
  { key: "7d", label: "7 dagar" },
  { key: "30d", label: "30 dagar" },
  { key: "custom", label: "Anpassat" },
];

// Same custom-dropdown pattern as IndustrySwitcher — styleable, and never
// falls back to the browser's own unstyled <select> listbox.
export function PeriodFilter({ value, onChange }: { value: PeriodKey; onChange: (key: PeriodKey) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
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

  function handleSelect(key: PeriodKey) {
    if (key === "custom") return;
    onChange(key);
    setOpen(false);
  }

  const activeLabel = OPTIONS.find((option) => option.key === value)?.label ?? "Idag";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Byt tidsperiod"
        className="flex items-center gap-1.5 rounded-full border border-demo-border bg-demo-surface py-1.5 pl-3 pr-2.5 text-xs font-medium text-demo-text transition-colors hover:border-demo-text-faint"
      >
        {activeLabel}
        <ChevronDown size={13} className={`shrink-0 text-demo-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl border border-demo-border bg-demo-surface py-1 shadow-lg"
        >
          {OPTIONS.map((option) => {
            const active = option.key === value;
            const disabled = option.key === "custom";
            return (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={active}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => handleSelect(option.key)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-demo-text-faint"
                    : active
                      ? "bg-demo-primary-soft text-demo-primary-soft-text"
                      : "text-demo-text hover:bg-demo-surface-hover"
                }`}
              >
                {option.label}
                {disabled ? (
                  <span className="shrink-0 rounded-full bg-demo-neutral-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-label text-demo-text-faint">
                    Snart
                  </span>
                ) : (
                  active && <Check size={14} className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
