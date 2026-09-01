export function formatCurrencySek(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(amount);
}

export function formatDateSv(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" }).format(new Date(iso));
}

// Compact "when" label for activity feeds: clock time today, "Igår"
// yesterday, otherwise a short day+month.
export function formatRelativeSv(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit" }).format(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Igår";

  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" }).format(date);
}
