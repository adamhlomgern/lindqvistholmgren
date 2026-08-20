import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";
import { isOpenNow, todaysHours } from "@/features/restaurant-platform/utils/hours";

// A live temperature check, deliberately NOT period-filtered — this is
// "what's happening right now," independent of whichever historical period
// the rest of the dashboard is showing. Reads context directly rather than
// taking props, same as the rest of this page's data flow. Only surfaces
// counts, not actions — the owner isn't meant to run the kitchen from here,
// just glance and (if needed) jump to the real kitchen board.
export function JustNuPanel() {
  const { orders, restaurant } = useRestaurantPlatform();
  const active = orders.filter((order) => order.status !== "avbruten" && order.status !== "klar");

  const counts = [
    { label: "nya", value: active.filter((order) => order.status === "ny").length },
    { label: "tillagas", value: active.filter((order) => order.status === "tillagas").length },
    { label: "redo", value: active.filter((order) => order.status === "redo").length },
    { label: "ute", value: active.filter((order) => order.status === "levereras").length },
  ];

  const open = isOpenNow(restaurant);
  const hours = todaysHours(restaurant);

  return (
    <Card padding="compact" className="flex h-full flex-col gap-4">
      <p className="text-sm font-semibold text-demo-text">Just nu</p>

      <div className="grid grid-cols-2 gap-3">
        {counts.map((count) => (
          <div key={count.label}>
            <p className="font-display text-2xl font-bold tracking-tight text-demo-text">{count.value}</p>
            <p className="text-xs text-demo-text-muted">{count.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-demo-border pt-3 text-xs text-demo-text-muted">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
          {open && hours ? `Öppet till ${hours.close}` : "Stängt"}
        </span>
        {restaurant.deliveryEnabled && <span>Leveransordrar: På</span>}
      </div>

      <Link
        href={mumsaRoutes.restaurant()}
        className="flex items-center gap-1 text-xs font-semibold text-demo-primary hover:underline"
      >
        Öppna köksvy
        <ArrowRight size={12} />
      </Link>
    </Card>
  );
}
