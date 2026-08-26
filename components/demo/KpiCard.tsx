import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { toneIconBgClasses, type Tone } from "@/components/demo/tokens";

export type KpiTrend = { label: string; direction: "up" | "down" | "flat" };

type KpiCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
  // Optional — omitted entirely, existing callers (e.g. Servicekoll's
  // dashboard) render exactly as before.
  trend?: KpiTrend;
};

// Hardcodes "up = good" (green), which only holds because every current
// trend-bearing KPI (revenue, orders, avg order value) treats more as
// better. A future metric where up is bad (e.g. a trended "nekade ordrar"
// count) would need its own inverted mapping, not this one reused blindly.
const trendClasses: Record<KpiTrend["direction"], string> = {
  up: "text-demo-primary",
  down: "text-demo-danger",
  flat: "text-demo-text-muted",
};

const trendIcons: Record<KpiTrend["direction"], LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

export function KpiCard({ icon: Icon, label, value, tone = "primary", trend }: KpiCardProps) {
  const TrendIcon = trend ? trendIcons[trend.direction] : null;
  return (
    <Card padding="compact" className="flex flex-row items-start gap-3 sm:gap-4">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${toneIconBgClasses[tone]}`}>
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl font-bold tracking-tight text-demo-text sm:text-3xl">{value}</p>
        <p className="mt-1 break-words text-sm text-demo-text-muted">{label}</p>
        {trend && TrendIcon && (
          <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${trendClasses[trend.direction]}`}>
            <TrendIcon size={12} />
            {trend.label}
          </p>
        )}
      </div>
    </Card>
  );
}
