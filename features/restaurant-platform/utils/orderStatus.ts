import type { FulfillmentType, Order, OrderStatus } from "@/features/restaurant-platform/types";
import type { Tone } from "@/components/demo/tokens";

const STATUS_ORDER: OrderStatus[] = ["ny", "tillagas", "redo", "levereras", "klar"];

// Pickup orders skip the "levereras" (out for delivery) step entirely —
// there's no driver leg, so "redo" goes straight to "klar" (avhämtad).
export function statusSequence(fulfillment: FulfillmentType): OrderStatus[] {
  return fulfillment === "delivery" ? STATUS_ORDER : STATUS_ORDER.filter((status) => status !== "levereras");
}

export function nextStatus(order: Order): OrderStatus | null {
  const sequence = statusSequence(order.fulfillment);
  const index = sequence.indexOf(order.status);
  if (index === -1 || index === sequence.length - 1) return null;
  return sequence[index + 1];
}

export function orderStatusLabel(status: OrderStatus, fulfillment: FulfillmentType): string {
  switch (status) {
    case "ny":
      return "Ny";
    case "tillagas":
      return "Tillagas";
    case "redo":
      return fulfillment === "delivery" ? "Redo för leverans" : "Redo för avhämtning";
    case "levereras":
      return "Ute på leverans";
    case "klar":
      return fulfillment === "delivery" ? "Levererad" : "Avhämtad";
    case "avbruten":
      return "Avbruten";
  }
}

// Short, verb-first labels — a kitchen under pressure reads "Klar" faster
// than "Markera som redo", and doesn't need "bekräfta" spelled out since
// starting to cook already implies the order is accepted.
export function nextStatusActionLabel(status: OrderStatus, fulfillment: FulfillmentType): string | null {
  const next = { ny: "tillagas", tillagas: "redo", redo: fulfillment === "delivery" ? "levereras" : "klar", levereras: "klar" }[
    status as "ny" | "tillagas" | "redo" | "levereras"
  ];
  if (!next) return null;
  switch (next) {
    case "tillagas":
      return "Börja tillaga";
    case "redo":
      return "Klar";
    case "levereras":
      return "Skicka";
    case "klar":
      return fulfillment === "delivery" ? "Levererad" : "Utlämnad";
    default:
      return null;
  }
}

export const orderStatusTone: Record<OrderStatus, Tone> = {
  ny: "info",
  tillagas: "warning",
  redo: "primary",
  levereras: "primary",
  klar: "neutral",
  avbruten: "danger",
};

// How urgently a wait time should read, independent of which column it's
// in — used to escalate a card's time chip from quiet to "SEN" instead of
// making staff scan a wall of identical-looking timestamps to find what's
// overdue.
export type Urgency = "neutral" | "attention" | "warning" | "late";

export function urgencyLevel(minutes: number, lateAfterMinutes: number): Urgency {
  if (minutes >= lateAfterMinutes) return "late";
  if (minutes >= 10) return "warning";
  if (minutes >= 5) return "attention";
  return "neutral";
}

export const urgencyTone: Record<Urgency, Tone> = {
  neutral: "neutral",
  attention: "info",
  warning: "warning",
  late: "danger",
};
