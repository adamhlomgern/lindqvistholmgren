import type { Order } from "@/features/restaurant-platform/types";

// Deterministic per-order "fake GPS" — a real hash of the order id, not
// Math.random(), so the same order always shows the same distance/payout on
// every render with no SSR/client mismatch to worry about.
function hashOrderId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

const BASE_PAYOUT_SEK = 25;
const PAYOUT_PER_KM_SEK = 5;

export function deliveryDistanceKm(order: Order): number {
  const hash = hashOrderId(order.id);
  return 1 + (hash % 380) / 100; // 1.00–4.79 km
}

export function deliveryPayoutSek(order: Order): number {
  return BASE_PAYOUT_SEK + Math.round(deliveryDistanceKm(order) * PAYOUT_PER_KM_SEK);
}

export function isSameLocalDay(iso: string, now: Date): boolean {
  const date = new Date(iso);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

// Minutes between when an order went out for delivery and when it was
// marked delivered, read from statusHistory rather than createdAt/
// statusUpdatedAt so it isolates just the driving leg, not kitchen prep
// time. Returns null for orders that haven't completed that leg yet (still
// "levereras", or never left the kitchen).
export function deliveryDurationMinutes(order: Order): number | null {
  const outAt = order.statusHistory.find((entry) => entry.status === "levereras")?.at;
  const deliveredAt = order.statusHistory.find((entry) => entry.status === "klar")?.at;
  if (!outAt || !deliveredAt) return null;
  return Math.max(1, Math.round((new Date(deliveredAt).getTime() - new Date(outAt).getTime()) / 60000));
}
