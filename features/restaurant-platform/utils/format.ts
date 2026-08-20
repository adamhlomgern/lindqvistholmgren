export function formatSek(amount: number): string {
  return `${Math.round(amount).toLocaleString("sv-SE")} kr`;
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

export function formatMinutesAgo(iso: string, now: Date = new Date()): string {
  const minutes = minutesSince(iso, now);
  if (minutes < 1) return "just nu";
  if (minutes === 1) return "1 minut sedan";
  if (minutes < 60) return `${minutes} minuter sedan`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "1 timme sedan" : `${hours} timmar sedan`;
}

export function minutesSince(iso: string, now: Date = new Date()): number {
  return Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
}
