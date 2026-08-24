"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuCategory, MenuItem } from "@/features/restaurant-platform/types";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { MenuItemCard } from "@/features/restaurant-platform/components/storefront/MenuItemCard";

const POPULAR_ID = "cat-popular";

// Pulled out to module scope rather than called inline in the click
// handler — some lint tooling treats any impure call textually inside a
// component's function body as a render-purity risk, even one that (as
// here) only ever runs from an event handler.
function now(): number {
  return Date.now();
}

export function MenuBrowser({
  categories,
  items,
  onSelectItem,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}) {
  const { cart } = useRestaurantPlatform();
  const popularItems = items.filter((item) => item.popular);
  const sections = popularItems.length > 0 ? [{ id: POPULAR_ID, name: "Populära" }, ...categories] : categories;

  const [activeCategory, setActiveCategory] = useState(sections[0]?.id);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  // Set by clicking a pill, so the resulting scroll doesn't fight the
  // observer for which section counts as "active" mid-scroll.
  const suppressObserverUntil = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressObserverUntil.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const id = (topmost.target as HTMLElement).dataset.sectionId;
        if (id) setActiveCategory(id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );
    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [sections.length]);

  function cartQuantityFor(itemId: string): number {
    return cart.filter((line) => line.menuItemId === itemId).reduce((sum, line) => sum + line.quantity, 0);
  }

  function handlePillClick(id: string) {
    setActiveCategory(id);
    suppressObserverUntil.current = now() + 600;
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Deliberately not sticky/position:fixed — it used to follow the page
          while scrolling through the menu, which read as broken rather than
          helpful, so this now scrolls away with the rest of the content like
          a normal in-page nav. */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handlePillClick(section.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === section.id
                ? "border-demo-primary bg-demo-primary text-white"
                : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {popularItems.length > 0 && (
        <section
          id={POPULAR_ID}
          data-section-id={POPULAR_ID}
          ref={(el) => {
            if (el) sectionRefs.current.set(POPULAR_ID, el);
          }}
          className="scroll-mt-32"
        >
          <h2 className="font-display text-lg font-bold text-demo-text">Populära</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} cartQuantity={cartQuantityFor(item.id)} onSelect={onSelectItem} />
            ))}
          </div>
        </section>
      )}

      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.categoryId === category.id);
        if (categoryItems.length === 0) return null;
        return (
          <section
            key={category.id}
            id={category.id}
            data-section-id={category.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(category.id, el);
            }}
            className="scroll-mt-32"
          >
            <h2 className="font-display text-lg font-bold text-demo-text">{category.name}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {categoryItems.map((item) => (
                <MenuItemCard key={item.id} item={item} cartQuantity={cartQuantityFor(item.id)} onSelect={onSelectItem} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
