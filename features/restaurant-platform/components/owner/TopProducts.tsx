"use client";

import { useState } from "react";
import { Card } from "@/components/demo/Card";
import { formatSek } from "@/features/restaurant-platform/utils/format";
import type { ProductPoint } from "@/features/restaurant-platform/utils/stats";

type SortBy = "quantity" | "revenue";

// Compact top-4 list, replacing the old full-width table — the caller has
// already resolved `products` for whichever period is selected via
// buildProductBreakdown, so this component only sorts/slices/renders. No
// "Visa alla produktstatistik" link yet: that page doesn't exist, and a
// link to nowhere would be worse than no link.
export function TopProducts({ products }: { products: ProductPoint[] }) {
  const [sortBy, setSortBy] = useState<SortBy>("quantity");
  const top = [...products].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 4);

  return (
    <Card padding="compact" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-demo-text">Mest sålt</p>
        <div className="flex gap-1 rounded-full border border-demo-border bg-demo-neutral-soft p-1">
          {(
            [
              { key: "quantity", label: "Antal sålda" },
              { key: "revenue", label: "Omsättning" },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortBy(option.key)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                sortBy === option.key ? "bg-demo-text text-demo-surface" : "text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {top.length === 0 ? (
        <p className="text-sm text-demo-text-faint">Inga sålda rätter i den här perioden.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {top.map((item) => (
            <div key={item.itemId} className="flex items-center justify-between gap-3 text-sm">
              <p className="min-w-0 truncate font-medium text-demo-text">{item.name}</p>
              <p className="shrink-0 text-demo-text-muted">
                {item.quantity} st · {formatSek(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
