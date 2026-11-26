"use client";

import { useState } from "react";
import { ChevronDown, UtensilsCrossed } from "lucide-react";
import { menuCategories, menuItems } from "@/features/restaurant-platform/data/menu";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";

// "Meny idag": köket slår av en rätt när ingrediensen tar slut, och den blir
// direkt omöjlig att beställa i kundvyn.
export function MenuAvailability() {
  const { soldOut, toggleSoldOut } = useRestaurantPlatform();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-demo-border bg-demo-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-demo-text">
          <UtensilsCrossed size={16} className="text-demo-text-muted" />
          Meny idag
          {soldOut.length > 0 && (
            <span className="rounded-full bg-demo-warning-soft px-2 py-0.5 text-xs font-semibold text-demo-warning">
              {soldOut.length} slut
            </span>
          )}
        </span>
        <ChevronDown size={16} className={`text-demo-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid gap-x-6 border-t border-demo-border px-4 py-3 sm:grid-cols-2 lg:grid-cols-3">
          {menuCategories.map((category) => (
            <div key={category.id} className="py-2">
              <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">{category.name}</p>
              <ul className="mt-1.5 space-y-1">
                {menuItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => {
                    const available = !soldOut.includes(item.id);
                    return (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-demo-surface-hover">
                          <span className={available ? "text-demo-text" : "text-demo-text-faint line-through"}>{item.name}</span>
                          <span className="relative inline-flex">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={available}
                              onChange={() => toggleSoldOut(item.id)}
                              aria-label={`${item.name} ${available ? "finns" : "slut"}`}
                            />
                            <span className="h-5 w-9 rounded-full bg-demo-border transition-colors peer-checked:bg-demo-primary" />
                            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
