import type { Order, Restaurant } from "@/features/restaurant-platform/types";
import { menuItems } from "@/features/restaurant-platform/data/menu";
import { distributeIntoHours, hourlyShape, type DailyStat } from "@/features/restaurant-platform/data/historicalStats";

// Owner-dashboard aggregation. Pure, framework-free — no React, no context
// reads. buildDailySeries/buildHourlySeries/buildProductBreakdown are the
// ONLY functions allowed to know "today is real, everything else is
// fabricated" (see data/historicalStats.ts) — everything downstream
// (KpiCard trends, the chart, top products) only ever sees the merged
// result and never touches `orders` or the synthetic data directly.

export type PeriodKey = "today" | "yesterday" | "7d" | "30d" | "custom";

export type PeriodRange = {
  // Date keys (local YYYY-MM-DD), ascending, aligned by index with
  // comparisonDates (day 1 of current vs. day 1 of comparison, not matched
  // by calendar weekday for multi-day windows).
  currentDates: string[];
  comparisonDates: string[];
  granularity: "hour" | "day";
};

export type DayPoint = { date: string; revenue: number; orderCount: number; cancelledCount: number };
export type HourPoint = { hour: number; revenue: number; orderCount: number };
export type ProductPoint = { itemId: string; name: string; quantity: number; revenue: number };

const DAY_MS = 24 * 60 * 60 * 1000;

// Local YYYY-MM-DD — not toISOString(), which is UTC and would misfile a
// late-evening Swedish order into "tomorrow." Every date-bucketing helper
// below routes through this.
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(now: Date, days: number): Date {
  return new Date(now.getTime() + days * DAY_MS);
}

function dateRangeKeys(now: Date, startOffset: number, endOffset: number): string[] {
  const keys: string[] = [];
  for (let offset = startOffset; offset <= endOffset; offset++) keys.push(toDateKey(addDays(now, offset)));
  return keys;
}

export function resolvePeriod(key: PeriodKey, now: Date): PeriodRange {
  switch (key) {
    case "today":
      return { currentDates: [toDateKey(now)], comparisonDates: [toDateKey(addDays(now, -7))], granularity: "hour" };
    case "yesterday":
      return { currentDates: [toDateKey(addDays(now, -1))], comparisonDates: [toDateKey(addDays(now, -8))], granularity: "hour" };
    case "7d":
      return { currentDates: dateRangeKeys(now, -6, 0), comparisonDates: dateRangeKeys(now, -13, -7), granularity: "day" };
    case "30d":
      return { currentDates: dateRangeKeys(now, -29, 0), comparisonDates: dateRangeKeys(now, -59, -30), granularity: "day" };
    case "custom":
      // The control never actually lets this resolve (rendered disabled) —
      // fall back to "today" defensively rather than throwing.
      return resolvePeriod("today", now);
  }
}

function findHistorical(historical: DailyStat[], dateKey: string): DailyStat | undefined {
  return historical.find((day) => day.date === dateKey);
}

function realOrdersOnDate(orders: Order[], dateKey: string): Order[] {
  return orders.filter((order) => toDateKey(new Date(order.createdAt)) === dateKey);
}

// The real/synthetic seam: today's date key aggregates from live `orders`,
// every other date key looks up the fabricated DailyStat.
export function buildDailySeries(orders: Order[], historical: DailyStat[], dateKeys: string[], todayKey: string): DayPoint[] {
  return dateKeys.map((dateKey) => {
    if (dateKey === todayKey) {
      const dayOrders = realOrdersOnDate(orders, dateKey);
      const counted = dayOrders.filter((order) => order.status !== "avbruten");
      return {
        date: dateKey,
        revenue: counted.reduce((sum, order) => sum + order.total, 0),
        orderCount: counted.length,
        cancelledCount: dayOrders.length - counted.length,
      };
    }
    const day = findHistorical(historical, dateKey);
    return day
      ? { date: dateKey, revenue: day.revenue, orderCount: day.orderCount, cancelledCount: day.cancelledCount }
      : { date: dateKey, revenue: 0, orderCount: 0, cancelledCount: 0 };
  });
}

// Same seam, hourly. Always returns all 24 hours — callers slice for
// proration (see "today"'s comparison handling in OwnerDashboard).
export function buildHourlySeries(orders: Order[], historical: DailyStat[], dateKey: string, todayKey: string, restaurant: Restaurant): HourPoint[] {
  if (dateKey === todayKey) {
    const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, revenue: 0, orderCount: 0 }));
    for (const order of realOrdersOnDate(orders, dateKey)) {
      if (order.status === "avbruten") continue;
      const hour = new Date(order.createdAt).getHours();
      buckets[hour].revenue += order.total;
      buckets[hour].orderCount += 1;
    }
    return buckets;
  }
  const day = findHistorical(historical, dateKey);
  if (!day) return Array.from({ length: 24 }, (_, hour) => ({ hour, revenue: 0, orderCount: 0 }));
  const weekday = new Date(`${dateKey}T12:00:00`).getDay();
  const shape = hourlyShape(restaurant, weekday);
  const revenueByHour = distributeIntoHours(day.revenue, shape);
  const ordersByHour = distributeIntoHours(day.orderCount, shape);
  return Array.from({ length: 24 }, (_, hour) => ({ hour, revenue: revenueByHour[hour], orderCount: ordersByHour[hour] }));
}

// Same seam, per product: sums real order lines for today's slice of the
// range, sums fabricated productBreakdown entries for the rest, merged by
// itemId. Unsorted — the caller sorts by whichever metric is toggled.
export function buildProductBreakdown(orders: Order[], historical: DailyStat[], dateKeys: string[], todayKey: string): ProductPoint[] {
  const totals = new Map<string, { quantity: number; revenue: number }>();
  const add = (itemId: string, quantity: number, revenue: number) => {
    const current = totals.get(itemId) ?? { quantity: 0, revenue: 0 };
    current.quantity += quantity;
    current.revenue += revenue;
    totals.set(itemId, current);
  };

  for (const dateKey of dateKeys) {
    if (dateKey === todayKey) {
      for (const order of realOrdersOnDate(orders, dateKey)) {
        if (order.status === "avbruten") continue;
        for (const line of order.lines) add(line.menuItemId, line.quantity, line.unitPrice * line.quantity);
      }
    } else {
      const day = findHistorical(historical, dateKey);
      if (!day) continue;
      for (const entry of day.productBreakdown) add(entry.itemId, entry.quantity, entry.revenue);
    }
  }

  return [...totals.entries()]
    .map(([itemId, stats]) => ({ itemId, name: menuItems.find((item) => item.id === itemId)?.name ?? itemId, ...stats }))
    .filter((entry) => entry.quantity > 0);
}

export function aggregate(points: { revenue: number; orderCount: number; cancelledCount?: number }[]): {
  revenue: number;
  orderCount: number;
  avgOrderValue: number;
  cancelledCount: number;
  completedPct: number;
} {
  const revenue = points.reduce((sum, point) => sum + point.revenue, 0);
  const orderCount = points.reduce((sum, point) => sum + point.orderCount, 0);
  const cancelledCount = points.reduce((sum, point) => sum + (point.cancelledCount ?? 0), 0);
  const totalAttempted = orderCount + cancelledCount;
  return {
    revenue,
    orderCount,
    avgOrderValue: orderCount > 0 ? revenue / orderCount : 0,
    cancelledCount,
    completedPct: totalAttempted > 0 ? orderCount / totalAttempted : 1,
  };
}

export function computeTrend(current: number, previous: number, unit: "percent" | "count" = "percent"): { direction: "up" | "down" | "flat"; label: string } {
  if (previous === 0) {
    if (current === 0) return { direction: "flat", label: "Inga ordrar än" };
    return { direction: "up", label: unit === "count" ? `+${current}` : "Ny idag" };
  }
  const delta = current - previous;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  if (unit === "count") {
    const sign = delta > 0 ? "+" : "";
    return { direction, label: `${sign}${delta} mot föregående period` };
  }
  const pct = Math.round((delta / previous) * 100);
  const arrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  return { direction, label: `${arrow} ${Math.abs(pct)}%` };
}
