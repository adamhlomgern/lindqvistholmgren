import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerActivityEntry } from "@/lib/data/customer-activity";

export function CustomerRecentActivityCard({ activity }: { activity: CustomerActivityEntry[] }) {
  return (
    <Card>
      <h2 className="font-display text-sm font-semibold text-fg">Senaste aktivitet</h2>

      {activity.length === 0 ? (
        <p className="mt-3 text-sm text-fg-muted">Inget har hänt ännu.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1">
          {activity.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-fg/[0.06]"
            >
              <span className="truncate text-sm text-fg">{entry.label}</span>
              <span className="shrink-0 text-xs text-fg-muted">{formatRelativeSv(entry.timestamp)}</span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
