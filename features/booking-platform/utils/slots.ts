import type { Booking, Organization, Staff } from "@/features/booking-platform/types";
import { addDays, addMinutes, startOfDay, toISODate } from "@/features/booking-platform/utils/dates";

// Slots land on a quarter-hour grid — fine enough to feel real (a 45-minute
// klippning doesn't get rounded up to a full hour) without producing an
// overwhelming wall of options.
const SLOT_GRANULARITY_MINUTES = 15;
const DAYS_AHEAD = 7;
// Nothing bookable in the next hour — a demo customer "booking for right
// now" reads as fake; a short lead time reads as a real scheduling system.
const MIN_LEAD_MINUTES = 60;

export type DaySlots = {
  date: string;
  // ISO datetime strings, ascending.
  slots: string[];
};

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart.getTime() < bEnd.getTime() && bStart.getTime() < aEnd.getTime();
}

function setClock(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// A booking "blocks" a slot for a given staffId only if it belongs to the
// same person — bookings.staffId is only ever null for solo organizations
// (see types.ts), so comparing staffId directly (rather than filtering
// "any booking for this org") correctly lets two different staff serve two
// customers at the same time, while a solo business's single booking list
// blocks itself as expected.
function blocksSlot(booking: Booking, organizationId: string, staffId: string | null): boolean {
  return booking.organizationId === organizationId && booking.status !== "cancelled" && booking.staffId === staffId;
}

// Available slots for one specific "resource" — either a named staff member
// (staffId set) or the organization itself for a solo business (staffId
// null). Opening hours + existing bookings + service duration -> free
// windows for the next `daysAhead` days.
export function getStaffAvailableSlots({
  organization,
  bookings,
  durationMinutes,
  staffId,
  now = new Date(),
  daysAhead = DAYS_AHEAD,
}: {
  organization: Organization;
  bookings: Booking[];
  durationMinutes: number;
  staffId: string | null;
  now?: Date;
  daysAhead?: number;
}): DaySlots[] {
  const relevantBookings = bookings.filter((booking) => blocksSlot(booking, organization.id, staffId));
  const earliestBookable = addMinutes(now, MIN_LEAD_MINUTES);
  const today = startOfDay(now);

  const days: DaySlots[] = [];
  for (let i = 0; i < daysAhead; i++) {
    const day = addDays(today, i);
    const hours = organization.openingHours.find((entry) => entry.day === day.getDay());
    if (!hours || !hours.open || !hours.close) {
      days.push({ date: toISODate(day), slots: [] });
      continue;
    }

    const dayOpen = setClock(day, hours.open);
    const dayClose = setClock(day, hours.close);
    const slots: string[] = [];

    let cursor = dayOpen;
    while (addMinutes(cursor, durationMinutes).getTime() <= dayClose.getTime()) {
      const slotStart = cursor;
      const slotEnd = addMinutes(cursor, durationMinutes);
      const tooSoon = slotStart.getTime() < earliestBookable.getTime();
      const conflicted = relevantBookings.some((booking) =>
        overlaps(slotStart, slotEnd, new Date(booking.start), new Date(booking.end)),
      );
      if (!tooSoon && !conflicted) slots.push(slotStart.toISOString());
      cursor = addMinutes(cursor, SLOT_GRANULARITY_MINUTES);
    }

    days.push({ date: toISODate(day), slots });
  }

  return days;
}

function mergeDaySlots(perStaff: DaySlots[][]): DaySlots[] {
  if (perStaff.length === 0) return [];
  return perStaff[0].map((_, dayIndex) => {
    const merged = new Set<string>();
    for (const staffDays of perStaff) {
      for (const slot of staffDays[dayIndex].slots) merged.add(slot);
    }
    return { date: perStaff[0][dayIndex].date, slots: [...merged].sort() };
  });
}

// Salong-level availability for a service: if staff is given, availability
// is the union across every staff member (a slot is bookable as long as at
// least one person is free) — if empty (solo business), it's the
// organization's own single-resource availability.
export function getAvailableSlots({
  organization,
  staff,
  bookings,
  durationMinutes,
  staffId,
  now = new Date(),
  daysAhead = DAYS_AHEAD,
}: {
  organization: Organization;
  staff: Staff[];
  bookings: Booking[];
  durationMinutes: number;
  // Restrict to one specific staff member (e.g. once picked in the booking
  // flow). Omitted -> every staff member (or the solo organization) is
  // considered.
  staffId?: string | null;
  now?: Date;
  daysAhead?: number;
}): DaySlots[] {
  if (staff.length === 0) {
    return getStaffAvailableSlots({ organization, bookings, durationMinutes, staffId: null, now, daysAhead });
  }
  if (staffId) {
    return getStaffAvailableSlots({ organization, bookings, durationMinutes, staffId, now, daysAhead });
  }
  const perStaff = staff.map((member) =>
    getStaffAvailableSlots({ organization, bookings, durationMinutes, staffId: member.id, now, daysAhead }),
  );
  return mergeDaySlots(perStaff);
}

// Resolves "Första lediga" (see StaffPicker's AUTO_STAFF) to one concrete
// staff member once a slot has actually been picked — a staffed
// organization's bookings always carry a real staffId (never null, see
// types.ts), so this runs once at confirm time rather than storing "no
// preference" in the booking itself.
export function findFreeStaffId({
  organization,
  staff,
  bookings,
  durationMinutes,
  slotIso,
}: {
  organization: Organization;
  staff: Staff[];
  bookings: Booking[];
  durationMinutes: number;
  slotIso: string;
}): string | null {
  const slotStart = new Date(slotIso);
  const slotEnd = addMinutes(slotStart, durationMinutes);
  for (const member of staff) {
    const conflicted = bookings.some(
      (booking) =>
        blocksSlot(booking, organization.id, member.id) && overlaps(slotStart, slotEnd, new Date(booking.start), new Date(booking.end)),
    );
    if (!conflicted) return member.id;
  }
  return null;
}

// The single earliest bookable slot — drives the "Nästa lediga tid" chip on
// a salon's catalog card.
export function nextAvailableSlot(params: {
  organization: Organization;
  staff: Staff[];
  bookings: Booking[];
  durationMinutes: number;
  now?: Date;
}): string | null {
  const days = getAvailableSlots(params);
  for (const day of days) {
    if (day.slots.length > 0) return day.slots[0];
  }
  return null;
}
