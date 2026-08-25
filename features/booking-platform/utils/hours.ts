import type { OpeningHours, Organization } from "@/features/booking-platform/types";

const DAY_LABELS = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

export function dayLabel(day: number): string {
  return DAY_LABELS[day];
}

export function hoursForDay(organization: Organization, day: number): OpeningHours | undefined {
  return organization.openingHours.find((entry) => entry.day === day);
}

export function todaysHours(organization: Organization, now: Date = new Date()): OpeningHours | undefined {
  return hoursForDay(organization, now.getDay());
}

export function isOpenNow(organization: Organization, now: Date = new Date()): boolean {
  const today = todaysHours(organization, now);
  if (!today || !today.open || !today.close) return false;
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return minutesNow >= toMinutes(today.open) && minutesNow < toMinutes(today.close);
}

export function formatHoursRange(hours: OpeningHours): string {
  if (!hours.open || !hours.close) return "Stängt";
  return `${hours.open}–${hours.close}`;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
