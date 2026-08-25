export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function diffInDays(target: Date, from: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const t = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const f = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((t - f) / msPerDay);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatDateSv(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
}

export function formatTimeSv(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "Idag", "Imorgon", or a short weekday+date label ("Ons 27 aug") — used for
// day headers in the slot picker and booking queue.
export function formatDayHeaderSv(value: string | Date, today: Date = new Date()): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isSameDay(date, today)) return "Idag";
  if (isSameDay(date, addDays(today, 1))) return "Imorgon";
  return capitalize(date.toLocaleDateString("sv-SE", { weekday: "short", day: "numeric", month: "short" }));
}

// "Idag 14:30" / "Imorgon 09:00" / "Ons 27 aug, 10:00" — the compact form
// used for "nästa lediga tid" on a salon card and in confirmation copy.
export function formatSlotLabelSv(value: string | Date, today: Date = new Date()): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const dayLabel = formatDayHeaderSv(date, today);
  const timeLabel = formatTimeSv(date);
  return dayLabel === "Idag" || dayLabel === "Imorgon" ? `${dayLabel} ${timeLabel}` : `${dayLabel}, ${timeLabel}`;
}
