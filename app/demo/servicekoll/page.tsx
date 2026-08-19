"use client";

import { useMemo } from "react";
import { AlertTriangle, Bell, CalendarClock, Package } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { filterAssetsByIndustry, industryPresets } from "@/features/service-platform/config/industries";
import { getAssetStatus, statusPriority } from "@/features/service-platform/utils/status";
import { getReminderTimeline } from "@/features/service-platform/utils/reminders";
import { KpiCard } from "@/components/demo/KpiCard";
import { AssetsTable } from "@/features/service-platform/components/AssetsTable";
import { EmptyState } from "@/components/demo/EmptyState";

export default function ServicekollDashboardPage() {
  const { assets, customers, industry } = useServicePlatform();
  const preset = industryPresets[industry];

  const visibleAssets = useMemo(() => filterAssetsByIndustry(assets, industry), [assets, industry]);

  const statused = useMemo(
    () => visibleAssets.map((asset) => ({ asset, status: getAssetStatus(asset) })),
    [visibleAssets],
  );

  const overdueCount = statused.filter((item) => item.status === "overdue").length;
  const dueSoonCount = statused.filter((item) => item.status === "due_soon").length;

  const remindersCount = useMemo(
    () =>
      visibleAssets.reduce(
        (sum, asset) => sum + getReminderTimeline(asset).filter((reminder) => reminder.state === "scheduled").length,
        0,
      ),
    [visibleAssets],
  );

  const actionItems = useMemo(
    () =>
      statused
        .filter((item) => item.status !== "ok" && item.status !== "no_service_date")
        .sort((a, b) => statusPriority(a.status) - statusPriority(b.status))
        .slice(0, 8)
        .map((item) => item.asset),
    [statused],
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">Översikt</h1>
        <p className="mt-1 text-demo-text-muted">{preset.dashboardIntro}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard icon={Package} label={`Aktiva ${preset.assetLabelPlural.toLowerCase()}`} value={visibleAssets.length} tone="primary" />
        <KpiCard icon={CalendarClock} label="Service inom 30 dagar" value={dueSoonCount} tone="warning" />
        <KpiCard icon={AlertTriangle} label="Försenade" value={overdueCount} tone="danger" />
        <KpiCard icon={Bell} label="Planerade påminnelser" value={remindersCount} tone="info" />
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-demo-text">Behöver åtgärd</h2>
        <div className="mt-4">
          {actionItems.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Inget behöver åtgärdas just nu"
              description="Alla objekt i den här vyn ligger inom god tid till nästa service."
            />
          ) : (
            <AssetsTable assets={actionItems} customers={customers} />
          )}
        </div>
      </div>
    </div>
  );
}
