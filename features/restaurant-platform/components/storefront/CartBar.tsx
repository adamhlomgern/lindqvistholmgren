"use client";

import { ShoppingBag } from "lucide-react";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { formatSek } from "@/features/restaurant-platform/utils/format";

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const { cartCount, cartSubtotal } = useRestaurantPlatform();

  if (cartCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-demo-primary px-5 py-3.5 text-white shadow-xl shadow-demo-primary/30 transition-colors hover:bg-demo-primary-hover"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBag size={17} />
          {cartCount} {cartCount === 1 ? "vara" : "varor"}
        </span>
        <span className="text-sm font-bold">Visa varukorg — {formatSek(cartSubtotal)}</span>
      </button>
    </div>
  );
}
