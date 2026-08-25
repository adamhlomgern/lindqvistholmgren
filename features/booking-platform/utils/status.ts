import type { Tone } from "@/components/demo/tokens";
import type { Booking, BookingStatus } from "@/features/booking-platform/types";
import { isSameDay } from "@/features/booking-platform/utils/dates";

export type BookingTiming = "today" | "upcoming" | "past";

// Derived from `start` rather than stored, so it never falls out of sync —
// same principle as Servicekoll's getAssetStatus reading nextServiceDate
// live instead of a cached field.
export function bookingTiming(booking: Booking, now: Date = new Date()): BookingTiming {
  const start = new Date(booking.start);
  if (isSameDay(start, now)) return "today";
  return start.getTime() > now.getTime() ? "upcoming" : "past";
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  confirmed: "Bekräftad",
  cancelled: "Avbokad",
  completed: "Genomförd",
  no_show: "Uteblev",
};

export const bookingStatusTone: Record<BookingStatus, Tone> = {
  confirmed: "primary",
  completed: "info",
  no_show: "danger",
  cancelled: "neutral",
};

const STATUS_PRIORITY: Record<BookingStatus, number> = {
  confirmed: 0,
  completed: 1,
  no_show: 2,
  cancelled: 3,
};

export function statusPriority(status: BookingStatus): number {
  return STATUS_PRIORITY[status];
}
