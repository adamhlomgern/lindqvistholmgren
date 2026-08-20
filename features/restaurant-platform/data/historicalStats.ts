import type { Restaurant } from "@/features/restaurant-platform/types";
import { menuItems } from "@/features/restaurant-platform/data/menu";
import { hoursForDay } from "@/features/restaurant-platform/utils/hours";

// Entirely fabricated data — this file must NEVER be consulted for today's
// numbers. It only ever represents "yesterday and earlier," used to make
// the time-filter/comparison/graph features possible in a demo that has no
// real backend or history. The one place allowed to know "today is real" is
// buildDailySeries/buildHourlySeries/buildProductBreakdown in
// features/restaurant-platform/utils/stats.ts — everything here is upstream
// of, and blind to, that seam.

export type ProductBreakdownEntry = { itemId: string; quantity: number; revenue: number };

export type DailyStat = {
  date: string; // local YYYY-MM-DD, see utils/stats.ts#toDateKey
  revenue: number;
  orderCount: number;
  cancelledCount: number;
  productBreakdown: ProductBreakdownEntry[];
};

// Base order count per weekday (0=Sunday..6=Saturday, matches Date#getDay())
// — quiet early week, busy Fri/Sat, matches the brief's own "10 ordrar on a
// Thursday" example.
const BASE_ORDER_COUNT: Record<number, number> = {
  0: 11,
  1: 7,
  2: 8,
  3: 9,
  4: 10,
  5: 15,
  6: 16,
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Largest-remainder distribution: splits `total` across `weights` so the
// result sums exactly to `total` (no rounding drift), proportional to each
// weight. Used for both hourly distribution and per-product distribution —
// same shape of problem (spread an integer total across weighted buckets).
function distributeProportionally(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  if (weightSum <= 0 || total <= 0) return weights.map(() => 0);
  const raw = weights.map((weight) => (weight / weightSum) * total);
  const floored = raw.map(Math.floor);
  let remainder = total - floored.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floored];
  for (let i = 0; i < order.length && remainder > 0; i++, remainder--) {
    result[order[i].index] += 1;
  }
  return result;
}

// 24 weights summing to 1, lunch (11-13) + dinner (17-20) double peak, zero
// outside the given weekday's opening hours. Deterministic (no randomness)
// so comparison lines read as a stable shape rather than jittering hour to
// hour — the noise lives in the daily totals, not the intraday curve.
export function hourlyShape(restaurant: Restaurant, day: number): number[] {
  const hours = hoursForDay(restaurant, day);
  const weights = Array.from({ length: 24 }, (_, hour) => {
    if (!hours?.open || !hours.close) return 0;
    const openHour = Number(hours.open.split(":")[0]);
    const closeHour = Number(hours.close.split(":")[0]);
    if (hour < openHour || hour >= closeHour) return 0;
    const lunch = Math.exp(-((hour - 12) ** 2) / 2.2);
    const dinner = Math.exp(-((hour - 18.5) ** 2) / 4);
    return 0.15 + lunch + dinner;
  });
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return sum > 0 ? weights.map((weight) => weight / sum) : weights;
}

// Distributes `total` across the 24 hourly weights from hourlyShape, summing
// exactly to `total`. Also reused to prorate a comparison day up to a given
// elapsed-hour-fraction: sum a prefix of the returned array.
export function distributeIntoHours(total: number, shape: number[]): number[] {
  return distributeProportionally(total, shape);
}

function generateProductBreakdown(orderCount: number): ProductBreakdownEntry[] {
  const totalLineItems = Math.round(orderCount * randomBetween(1.4, 1.8));
  const weights = menuItems.map((item) => (item.popular ? 3 : 1) * randomBetween(0.6, 1.4));
  const quantities = distributeProportionally(totalLineItems, weights);
  return menuItems
    .map((item, index) => ({ itemId: item.id, quantity: quantities[index], revenue: quantities[index] * item.price }))
    .filter((entry) => entry.quantity > 0);
}

function toDateKeyLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// today-days .. today-1 — 63 comfortably covers the deepest comparison need
// (the 30-day view's today-59).
export function createHistoricalDailyStats(now: Date, days = 63): DailyStat[] {
  const stats: DailyStat[] = [];
  for (let offset = days; offset >= 1; offset--) {
    const date = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
    const weekday = date.getDay();
    const baseOrders = BASE_ORDER_COUNT[weekday];
    const orderCount = Math.max(0, Math.round(baseOrders * randomBetween(0.75, 1.3)));
    const avgOrderValue = randomBetween(225, 285);
    const revenue = Math.round(orderCount * avgOrderValue);
    const cancelledRoll = Math.random();
    const cancelledCount = cancelledRoll > 0.97 ? 2 : cancelledRoll > 0.85 ? 1 : 0;

    stats.push({
      date: toDateKeyLocal(date),
      revenue,
      orderCount,
      cancelledCount,
      productBreakdown: generateProductBreakdown(orderCount),
    });
  }
  return stats;
}
