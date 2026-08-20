import { Card } from "@/components/demo/Card";

export type SalesChartMetric = "revenue" | "orderCount";
export type SalesChartPoint = { label: string; tooltipLabel: string; current: number; comparison?: number };

const METRIC_OPTIONS: { key: SalesChartMetric; label: string }[] = [
  { key: "revenue", label: "Omsättning" },
  { key: "orderCount", label: "Ordrar" },
];

// Dumb/presentational — no context reads, no aggregation. The caller (Owner
// Dashboard) resolves points for whichever metric is selected and passes
// them straight through; this component only draws them. Plain SVG, no
// charting dependency: a viewBox-based coordinate space (0-100 x 0-40) with
// preserveAspectRatio="none" lets it stretch to fill its container without
// any resize-observer JS.
export function SalesChart({
  points,
  metric,
  onMetricChange,
  valueFormatter,
}: {
  points: SalesChartPoint[];
  metric: SalesChartMetric;
  onMetricChange: (metric: SalesChartMetric) => void;
  valueFormatter: (value: number) => string;
}) {
  const maxValue = Math.max(1, ...points.flatMap((point) => [point.current, point.comparison ?? 0]));
  const hasComparison = points.some((point) => point.comparison !== undefined);
  const slotWidth = points.length > 0 ? 100 / points.length : 100;
  const barWidth = slotWidth * 0.55;
  const chartHeight = 36; // out of 40, leaves headroom above the tallest bar

  const linePoints = points
    .map((point, index) => {
      const x = index * slotWidth + slotWidth / 2;
      const y = 40 - ((point.comparison ?? 0) / maxValue) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  // Sparse x-axis labels so 24 hourly or 30 daily points don't overlap —
  // roughly 6 labels regardless of point count.
  const labelStep = Math.max(1, Math.round(points.length / 6));

  return (
    <Card padding="compact" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-demo-text">Försäljning</p>
        <div className="flex gap-1 rounded-full border border-demo-border bg-demo-neutral-soft p-1">
          {METRIC_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onMetricChange(option.key)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                metric === option.key ? "bg-demo-text text-demo-surface" : "text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40 w-full sm:h-52">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          {[0, 0.5, 1].map((fraction) => (
            <line
              key={fraction}
              x1={0}
              x2={100}
              y1={40 - fraction * chartHeight}
              y2={40 - fraction * chartHeight}
              stroke="var(--color-demo-border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {points.map((point, index) => {
            const height = (point.current / maxValue) * chartHeight;
            const x = index * slotWidth + (slotWidth - barWidth) / 2;
            return (
              <g key={point.label}>
                {/* Invisible full-height hit area — a near-zero bar is
                    otherwise nearly impossible to hover precisely. */}
                <rect x={index * slotWidth} y={0} width={slotWidth} height={40} fill="transparent">
                  <title>{`${point.tooltipLabel}: ${valueFormatter(point.current)}`}</title>
                </rect>
                <rect x={x} y={40 - height} width={barWidth} height={height} fill="var(--color-demo-primary)" />
              </g>
            );
          })}
          {hasComparison && (
            <polyline
              points={linePoints}
              fill="none"
              stroke="var(--color-demo-text-faint)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="3 2"
            />
          )}
        </svg>
      </div>

      <div className="flex text-[10px] text-demo-text-faint">
        {points.map((point, index) => (
          <span key={point.label} style={{ width: `${slotWidth}%` }} className="text-center">
            {index % labelStep === 0 ? point.label : ""}
          </span>
        ))}
      </div>

      {hasComparison && (
        <p className="flex items-center gap-1.5 text-xs text-demo-text-faint">
          <span className="h-0 w-3 border-t border-dashed border-demo-text-faint" />
          Föregående period
        </p>
      )}
    </Card>
  );
}
