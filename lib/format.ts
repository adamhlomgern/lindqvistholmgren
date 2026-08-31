export function formatCurrencySek(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(amount);
}

export function formatDateSv(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" }).format(new Date(iso));
}
