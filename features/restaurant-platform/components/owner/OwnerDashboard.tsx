"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleCheck, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/demo/KpiCard";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { PeriodFilter } from "@/features/restaurant-platform/components/owner/PeriodFilter";
import { SalesChart, type SalesChartMetric, type SalesChartPoint } from "@/features/restaurant-platform/components/owner/SalesChart";
import { JustNuPanel } from "@/features/restaurant-platform/components/owner/JustNuPanel";
import { TopProducts } from "@/features/restaurant-platform/components/owner/TopProducts";
import { createHistoricalDailyStats, type DailyStat } from "@/features/restaurant-platform/data/historicalStats";
import {
  aggregate,
  buildDailySeries,
  buildHourlySeries,
  buildProductBreakdown,
  computeTrend,
  resolvePeriod,
  toDateKey,
  type PeriodKey,
} from "@/features/restaurant-platform/utils/stats";
import { formatSek } from "@/features/restaurant-platform/utils/format";
import { isOpenNow, todaysHours } from "@/features/restaurant-platform/utils/hours";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatHourLabel(hour: number): string {
  return String(hour).padStart(2, "0");
}

function formatDayLabel(dateKey: string): string {
  return capitalize(new Date(`${dateKey}T12:00:00`).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }));
}

function formatDayTooltip(dateKey: string): string {
  return capitalize(new Date(`${dateKey}T12:00:00`).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" }));
}

// The header (title, date, period filter) needs to sit on one visual row
// with live state, so this owns the whole page rather than splitting it
// across a server component and a client one — see app/demo/mumsa/agare/page.tsx.
export function OwnerDashboard() {
  const { orders, restaurant } = useRestaurantPlatform();
  // Stable per mount, same "fresh but not re-rolled every render" philosophy
  // as createSeedData.
  const now = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(now), [now]);
  // Generated client-side only, in an effect rather than useMemo: it's
  // randomized (Math.random()), so computing it during SSR would produce
  // different numbers server vs. client and fail hydration. Deferring it
  // means the first client render briefly shows a loading state instead.
  const [historicalOrNull, setHistoricalOrNull] = useState<DailyStat[] | null>(null);
  useEffect(() => {
    setHistoricalOrNull(createHistoricalDailyStats(now));
  }, [now]);
  const historical = historicalOrNull ?? [];

  const [periodKey, setPeriodKey] = useState<PeriodKey>("today");
  const [chartMetric, setChartMetric] = useState<SalesChartMetric>("revenue");

  const range = useMemo(() => resolvePeriod(periodKey, now), [periodKey, now]);

  const currentDaily = useMemo(
    () => buildDailySeries(orders, historical, range.currentDates, todayKey),
    [orders, historical, range, todayKey],
  );
  const currentAgg = useMemo(() => aggregate(currentDaily), [currentDaily]);

  // "Idag" needs its comparison day prorated to the current elapsed hour —
  // otherwise a 14:32 total would always read as "down" against a full
  // previous Thursday. Every other period compares two complete windows, no
  // proration needed.
  const comparisonAgg = useMemo(() => {
    if (periodKey === "today") {
      const hourly = buildHourlySeries(orders, historical, range.comparisonDates[0], todayKey, restaurant);
      return aggregate(hourly.filter((point) => point.hour <= now.getHours()));
    }
    return aggregate(buildDailySeries(orders, historical, range.comparisonDates, todayKey));
  }, [periodKey, range, orders, historical, todayKey, restaurant, now]);

  const chartPoints = useMemo<SalesChartPoint[]>(() => {
    if (range.granularity === "hour") {
      const currentHourly = buildHourlySeries(orders, historical, range.currentDates[0], todayKey, restaurant);
      const comparisonHourly = buildHourlySeries(orders, historical, range.comparisonDates[0], todayKey, restaurant);
      return currentHourly.map((point, index) => ({
        label: formatHourLabel(point.hour),
        tooltipLabel: `Kl. ${formatHourLabel(point.hour)}:00`,
        current: chartMetric === "revenue" ? point.revenue : point.orderCount,
        comparison: chartMetric === "revenue" ? comparisonHourly[index].revenue : comparisonHourly[index].orderCount,
      }));
    }
    const comparisonDaily = buildDailySeries(orders, historical, range.comparisonDates, todayKey);
    return currentDaily.map((point, index) => ({
      label: formatDayLabel(point.date),
      tooltipLabel: formatDayTooltip(point.date),
      current: chartMetric === "revenue" ? point.revenue : point.orderCount,
      comparison: chartMetric === "revenue" ? comparisonDaily[index]?.revenue : comparisonDaily[index]?.orderCount,
    }));
  }, [range, orders, historical, todayKey, restaurant, chartMetric, currentDaily]);

  const products = useMemo(
    () => buildProductBreakdown(orders, historical, range.currentDates, todayKey),
    [orders, historical, range, todayKey],
  );

  const revenueTrend = computeTrend(currentAgg.revenue, comparisonAgg.revenue);
  const orderTrend = computeTrend(currentAgg.orderCount, comparisonAgg.orderCount, "count");
  const avgOrderTrend = computeTrend(currentAgg.avgOrderValue, comparisonAgg.avgOrderValue);
  const completedPctValue = Math.round(currentAgg.completedPct * 100);

  const open = isOpenNow(restaurant);
  const hours = todaysHours(restaurant);
  const dateLabel = capitalize(now.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-demo-text">Översikt</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-demo-text-muted">
            {dateLabel}
            <span className="text-demo-border">·</span>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
            {open && hours ? `Öppet till ${hours.close}` : "Stängt"}
          </p>
        </div>
        <PeriodFilter value={periodKey} onChange={setPeriodKey} />
      </div>

      {historicalOrNull === null ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-demo-text-faint">Laddar översikt…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard icon={Receipt} label="Omsättning" value={formatSek(currentAgg.revenue)} tone="primary" trend={revenueTrend} />
            <KpiCard icon={ShoppingBag} label="Ordrar" value={currentAgg.orderCount} tone="info" trend={orderTrend} />
            <KpiCard icon={TrendingUp} label="Snittorder" value={formatSek(currentAgg.avgOrderValue)} tone="warning" trend={avgOrderTrend} />
            <KpiCard
              icon={CircleCheck}
              label="Genomförda ordrar"
              value={`${completedPctValue}%`}
              tone="neutral"
              trend={{ label: `${currentAgg.cancelledCount} nekade`, direction: currentAgg.cancelledCount > 0 ? "down" : "flat" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesChart
                points={chartPoints}
                metric={chartMetric}
                onMetricChange={setChartMetric}
                valueFormatter={chartMetric === "revenue" ? formatSek : (value) => `${value} st`}
              />
            </div>
            <JustNuPanel />
          </div>

          <TopProducts products={products} />
        </>
      )}
    </div>
  );
}
