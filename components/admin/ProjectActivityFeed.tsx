import { formatRelativeSv } from "@/lib/format";
import type { ProjectActivityEntry } from "@/lib/types";

export function ProjectActivityFeed({ activity }: { activity: ProjectActivityEntry[] }) {
  if (activity.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-display text-sm font-bold text-bone">Aktivitet</h2>
      <div className="mt-3 flex flex-col gap-1">
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
            <span className="text-stone">{entry.message}</span>
            <span className="shrink-0 text-xs text-stone/70">{formatRelativeSv(entry.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
