"use client";

import { HorizontalScroller } from "@/components/demo/HorizontalScroller";
import { categoryOptions } from "@/features/booking-platform/config/categories";
import type { BusinessCategory } from "@/features/booking-platform/types";

export function CategoryChips({
  value,
  onChange,
}: {
  value: BusinessCategory | null;
  onChange: (value: BusinessCategory | null) => void;
}) {
  return (
    <HorizontalScroller className="scrollbar-hide flex gap-2 pb-1" fadeFrom="from-demo-bg" rounding="full">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          value === null
            ? "border-demo-primary bg-demo-primary text-white"
            : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
        }`}
      >
        Alla
      </button>
      {categoryOptions.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(active ? null : option.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-demo-primary bg-demo-primary text-white"
                : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
            }`}
          >
            <Icon size={14} />
            {option.label}
          </button>
        );
      })}
    </HorizontalScroller>
  );
}
