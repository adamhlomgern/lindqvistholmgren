import type { Booking, Organization, Service } from "@/features/booking-platform/types";
import { addDays, startOfDay } from "@/features/booking-platform/utils/dates";

// Måndag 00:00 .. nästa måndag 00:00 — the calendar week containing `now`.
export function getWeekRange(now: Date = new Date()): { start: Date; end: Date } {
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = addDays(startOfDay(now), diffToMonday);
  const end = addDays(start, 7);
  return { start, end };
}

function inRange(dateIso: string, start: Date, end: Date): boolean {
  const t = new Date(dateIso).getTime();
  return t >= start.getTime() && t < end.getTime();
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export type OwnerStats = {
  bookingsThisWeek: number;
  revenueThisWeek: number;
  // 0..1 — booked minutes this week divided by total bookable minutes
  // (opening hours × number of staff, or 1 resource for a solo business).
  occupancyRate: number;
  // 0..1 — share of this week's *resolved* bookings (completed or no_show)
  // that were a no-show. Bookings still "confirmed" (not yet happened, or
  // not yet marked) aren't counted either way.
  noShowRate: number;
};

export function computeOwnerStats({
  organization,
  staffCount,
  bookings,
  services,
  now = new Date(),
}: {
  organization: Organization;
  staffCount: number;
  bookings: Booking[];
  services: Service[];
  now?: Date;
}): OwnerStats {
  const { start, end } = getWeekRange(now);
  const weekBookings = bookings.filter((booking) => booking.organizationId === organization.id && inRange(booking.start, start, end));
  const nonCancelled = weekBookings.filter((booking) => booking.status !== "cancelled");

  const revenueThisWeek = nonCancelled.reduce((sum, booking) => {
    const service = services.find((candidate) => candidate.id === booking.serviceId);
    return sum + (service?.priceSek ?? 0);
  }, 0);

  const bookedMinutes = nonCancelled.reduce((sum, booking) => {
    return sum + (new Date(booking.end).getTime() - new Date(booking.start).getTime()) / 60_000;
  }, 0);

  const openMinutesPerWeek = organization.openingHours.reduce((sum, day) => {
    if (!day.open || !day.close) return sum;
    return sum + (toMinutes(day.close) - toMinutes(day.open));
  }, 0);
  const resources = Math.max(1, staffCount);
  const capacityMinutes = openMinutesPerWeek * resources;
  const occupancyRate = capacityMinutes > 0 ? Math.min(1, bookedMinutes / capacityMinutes) : 0;

  const resolved = nonCancelled.filter((booking) => booking.status === "completed" || booking.status === "no_show");
  const noShowCount = resolved.filter((booking) => booking.status === "no_show").length;
  const noShowRate = resolved.length > 0 ? noShowCount / resolved.length : 0;

  return { bookingsThisWeek: nonCancelled.length, revenueThisWeek, occupancyRate, noShowRate };
}
