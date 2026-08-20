import Image from "next/image";
import { Bike, Clock, MapPin, Phone, ShoppingBag } from "lucide-react";
import type { Restaurant } from "@/features/restaurant-platform/types";
import { isOpenNow, todaysHours, formatHoursRange } from "@/features/restaurant-platform/utils/hours";
import { formatSek } from "@/features/restaurant-platform/utils/format";

export function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  const open = isOpenNow(restaurant);
  const today = todaysHours(restaurant);

  return (
    <div className="overflow-hidden rounded-3xl border border-demo-border bg-demo-surface">
      <div className="relative h-40 w-full sm:h-56">
        <Image src={restaurant.heroImage} alt="" fill sizes="(min-width: 768px) 800px, 100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
              open ? "text-demo-primary-soft-text" : "text-demo-text-muted"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
            {open ? "Öppet nu" : "Stängt just nu"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-demo-text sm:text-3xl">{restaurant.name}</h1>
          <p className="mt-1 text-sm text-demo-text-muted">{restaurant.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-demo-text">
            <span className="flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-demo-primary" />
              {restaurant.estimatedPrepMinutes}–{restaurant.estimatedPrepMinutes + 10} min avhämtning
            </span>
            {restaurant.deliveryEnabled && (
              <span className="flex items-center gap-1.5">
                <Bike size={14} className="text-demo-primary" />
                {restaurant.estimatedPrepMinutes + 10}–{restaurant.estimatedPrepMinutes + 25} min · {formatSek(restaurant.deliveryFee)} leverans
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-demo-text-muted">
          <a href={`tel:${restaurant.phone.replace(/\s|-/g, "")}`} className="flex items-center gap-2 hover:text-demo-text">
            <Phone size={14} className="shrink-0 text-demo-primary" />
            {restaurant.phone}
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-demo-primary" />
            {restaurant.address}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="shrink-0 text-demo-primary" />
            {today ? `Idag ${formatHoursRange(today)}` : "Stängt idag"}
          </div>
        </div>
      </div>
    </div>
  );
}
