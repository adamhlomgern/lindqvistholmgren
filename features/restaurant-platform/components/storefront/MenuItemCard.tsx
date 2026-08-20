import Image from "next/image";
import { Plus, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/features/restaurant-platform/types";
import { formatSek } from "@/features/restaurant-platform/utils/format";

export function MenuItemCard({
  item,
  cartQuantity = 0,
  onSelect,
}: {
  item: MenuItem;
  cartQuantity?: number;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex items-center gap-4 rounded-2xl border border-demo-border bg-demo-surface p-3 text-left transition-colors hover:bg-demo-surface-hover sm:p-4"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-demo-neutral-soft">
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-demo-text-faint">
            <UtensilsCrossed size={26} strokeWidth={1.5} />
          </div>
        )}
        {cartQuantity > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-demo-primary px-1 text-[11px] font-bold text-white shadow">
            {cartQuantity}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base font-bold text-demo-text">{item.name}</p>
          {item.popular && (
            <span className="shrink-0 rounded-full bg-demo-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-label text-demo-primary-soft-text">
              Populär
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-demo-text-muted">{item.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-demo-text">{formatSek(item.price)}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-demo-primary text-white">
            <Plus size={15} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </button>
  );
}
