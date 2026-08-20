"use client";

import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";

export function DeliveryToggle() {
  const { restaurant, setDeliveryEnabled } = useRestaurantPlatform();

  return (
    <button
      type="button"
      onClick={() => setDeliveryEnabled(!restaurant.deliveryEnabled)}
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-demo-border bg-demo-surface px-3.5 py-2 text-xs font-medium text-demo-text sm:text-sm"
      aria-pressed={restaurant.deliveryEnabled}
      title="Styr om restaurangen tar emot nya leveransbeställningar"
    >
      Tar emot leveransordrar
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          restaurant.deliveryEnabled ? "bg-demo-primary" : "bg-demo-neutral-soft"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            restaurant.deliveryEnabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
      <span className={restaurant.deliveryEnabled ? "text-demo-primary" : "text-demo-text-muted"}>
        {restaurant.deliveryEnabled ? "På" : "Av"}
      </span>
    </button>
  );
}
