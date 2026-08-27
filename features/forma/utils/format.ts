const sekFormatter = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });

export function formatSek(amount: number): string {
  return `${sekFormatter.format(amount)} kr`;
}

export function formatPriceRange(low: number, high: number): string {
  if (low === high) return formatSek(low);
  return `${sekFormatter.format(low)}–${formatSek(high)}`;
}
