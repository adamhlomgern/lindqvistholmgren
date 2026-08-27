import { formatSek } from "@/features/forma/utils/format";

export function PriceDelta({ amount }: { amount: number }) {
  if (amount === 0) {
    return <span className="text-xs font-medium text-forma-text-faint">Ingår</span>;
  }
  return <span className="text-xs font-medium text-forma-text-muted">+{formatSek(amount)}</span>;
}
