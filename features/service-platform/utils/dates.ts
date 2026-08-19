export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
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

export function formatDateSv(value: string | null | undefined): string {
  if (!value) return "Inget datum";
  return new Date(value).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelativeSv(value: string | null | undefined, today: Date = new Date()): string {
  if (!value) return "—";
  const diff = diffInDays(new Date(value), today);
  if (diff < 0) return `Försenad ${Math.abs(diff)} ${Math.abs(diff) === 1 ? "dag" : "dagar"}`;
  if (diff === 0) return "Idag";
  return `Om ${diff} ${diff === 1 ? "dag" : "dagar"}`;
}
