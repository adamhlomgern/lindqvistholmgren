"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function CollapsibleSection({
  label,
  count,
  defaultOpen = false,
  children,
}: {
  label: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-label text-stone/50 transition-colors hover:text-stone"
      >
        <ChevronRight size={12} strokeWidth={2.5} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        {label} {count}
      </button>
      {open && <div className="mt-3 flex flex-col gap-3">{children}</div>}
    </div>
  );
}
