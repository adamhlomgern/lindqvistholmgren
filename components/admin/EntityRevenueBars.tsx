import type { EntityRevenue } from "@/lib/data/invoices";
import { formatCurrencySek } from "@/lib/format";

// Fixed emerald/lavender pair — validated for CVD separation (ΔE 10.1
// deutan · 17.5 tritan, normal-vision ΔE 23.4). Assigned by a stable
// per-entity order (not by revenue rank) so a firma's color never changes
// just because it had a slower month — see the dataviz skill's
// "color follows the entity, never its rank" rule.
const colors = ["bg-primary", "bg-lavender"];
const textColors = ["text-primary", "text-lavender"];

export function EntityRevenueBars({
  data,
  colorByEntityId,
}: {
  data: EntityRevenue[];
  colorByEntityId: Map<string, number>;
}) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="flex flex-col gap-4">
      {data.map((entity) => {
        const colorIndex = colorByEntityId.get(entity.entityId) ?? 0;
        const width = Math.max((entity.total / max) * 100, 3);
        return (
          <div key={entity.entityId}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-fg">{entity.entityName}</span>
              <span className={`text-sm font-bold ${textColors[colorIndex] ?? "text-primary"}`}>
                {formatCurrencySek(entity.total)}
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-fg/5">
              <div
                className={`h-full rounded-full ${colors[colorIndex] ?? "bg-primary"}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
