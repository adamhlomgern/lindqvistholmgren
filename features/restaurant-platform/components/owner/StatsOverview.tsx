"use client";

import { Bike, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { KpiCard } from "@/components/demo/KpiCard";
import { HorizontalScroller } from "@/components/demo/HorizontalScroller";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { formatSek } from "@/features/restaurant-platform/utils/format";

export function StatsOverview() {
  const { orders } = useRestaurantPlatform();
  const counted = orders.filter((order) => order.status !== "avbruten");

  const revenue = counted.reduce((sum, order) => sum + order.total, 0);
  const orderCount = counted.length;
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;
  const deliveryCount = counted.filter((order) => order.fulfillment === "delivery").length;
  const pickupCount = orderCount - deliveryCount;

  const itemTotals = new Map<string, { quantity: number; revenue: number }>();
  for (const order of counted) {
    for (const line of order.lines) {
      const current = itemTotals.get(line.name) ?? { quantity: 0, revenue: 0 };
      current.quantity += line.quantity;
      current.revenue += line.unitPrice * line.quantity;
      itemTotals.set(line.name, current);
    }
  }
  const topItems = [...itemTotals.entries()].sort((a, b) => b[1].quantity - a[1].quantity).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard icon={Receipt} label="Dagens omsättning" value={formatSek(revenue)} tone="primary" />
        <KpiCard icon={ShoppingBag} label="Antal ordrar" value={orderCount} tone="info" />
        <KpiCard icon={TrendingUp} label="Snitt ordervärde" value={formatSek(avgOrderValue)} tone="warning" />
        <KpiCard icon={Bike} label="Leverans / avhämtning" value={`${deliveryCount} / ${pickupCount}`} tone="neutral" />
      </div>

      <div>
        <p className="text-sm font-semibold text-demo-text">Mest sålda rätter idag</p>
        <Card padding="none" className="mt-3">
          <HorizontalScroller>
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-demo-border text-left text-xs uppercase tracking-label text-demo-text-muted">
                  <th className="px-4 py-3 font-medium">Rätt</th>
                  <th className="px-4 py-3 font-medium">Antal sålda</th>
                  <th className="px-4 py-3 font-medium">Omsättning</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map(([name, stats]) => (
                  <tr key={name} className="border-b border-demo-border last:border-0">
                    <td className="px-4 py-3 font-medium text-demo-text">{name}</td>
                    <td className="px-4 py-3 text-demo-text-muted">{stats.quantity} st</td>
                    <td className="px-4 py-3 text-demo-text-muted">{formatSek(stats.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </HorizontalScroller>
        </Card>
      </div>
    </div>
  );
}
