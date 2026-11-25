"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, CalendarCheck, CalendarClock, MessageSquare, Package } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { filterAssetsByIndustry, industryPresets } from "@/features/service-platform/config/industries";
import { getAssetStatus, statusPriority } from "@/features/service-platform/utils/status";
import { getReminderTimeline } from "@/features/service-platform/utils/reminders";
import { KpiCard } from "@/components/demo/KpiCard";
import { AssetsTable } from "@/features/service-platform/components/AssetsTable";
import { EmptyState } from "@/components/demo/EmptyState";
import { Button } from "@/components/demo/Button";
import { Card } from "@/components/demo/Card";
import { ActivityTimeline } from "@/features/service-platform/components/ActivityTimeline";
import { smsTemplate } from "@/features/service-platform/components/ContactComposer";
import { serviceRoutes } from "@/features/service-platform/config/product";

export default function ServicekollDashboardPage() {
  const { assets, customers, industry, contactEvents, logContacts, notify } = useServicePlatform();
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

  // Försenade objekt med kund som inte redan fått ett sms idag: kan påminnas
  // med ett klick. Efter utskicket försvinner raden.
  const todayIso = new Date().toISOString().slice(0, 10);
  const overdueToRemind = statused
    .filter((item) => item.status === "overdue" && item.asset.customerId && !item.asset.bookedAt)
    .map((item) => item.asset)
    .filter((asset) => !contactEvents.some((e) => e.assetId === asset.id && e.channel === "sms" && e.at.startsWith(todayIso)));

  function remindAllOverdue() {
    const inputs = overdueToRemind.flatMap((asset) => {
      const customer = customers.find((c) => c.id === asset.customerId);
      return customer ? [{ customerId: customer.id, assetId: asset.id, channel: "sms" as const, message: smsTemplate(customer, asset) }] : [];
    });
    logContacts(inputs);
    notify(`Sms skickat till ${inputs.length} ${inputs.length === 1 ? "kund" : "kunder"}`);
  }

  const upcomingBookings = visibleAssets
    .filter((a) => a.bookedAt)
    .sort((a, b) => ((a.bookedAt as string) < (b.bookedAt as string) ? -1 : 1))
    .slice(0, 4);

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

      {overdueToRemind.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-demo-danger/25 bg-demo-danger-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-demo-danger" />
            <div>
              <p className="font-semibold text-demo-text">
                {overdueToRemind.length} {overdueToRemind.length === 1 ? "kund har" : "kunder har"} försenad service
              </p>
              <p className="text-sm text-demo-text-muted">Skicka en personlig påminnelse via sms till alla med ett klick.</p>
            </div>
          </div>
          <Button onClick={remindAllOverdue}>
            <MessageSquare size={15} />
            Påminn alla via sms
          </Button>
        </div>
      )}

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
            <AssetsTable assets={actionItems} customers={customers} showOwnerColumn={preset.ownership === "customer"} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-demo-text">Kommande bokningar</h2>
            <Link href={serviceRoutes.bookings()} className="text-sm font-semibold text-demo-primary hover:text-demo-primary-hover">
              Alla
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="mt-4 text-sm text-demo-text-muted">Inga bokade tider ännu.</p>
          ) : (
            <ul className="mt-4 divide-y divide-demo-border">
              {upcomingBookings.map((asset) => {
                const customer = customers.find((c) => c.id === asset.customerId);
                const at = asset.bookedAt as string;
                return (
                  <li key={asset.id}>
                    <Link href={serviceRoutes.asset(asset.id)} className="flex items-center gap-3 py-3 hover:opacity-80">
                      <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-demo-info-soft text-demo-info">
                        <span className="text-[10px] uppercase leading-none">
                          {new Date(at).toLocaleDateString("sv-SE", { month: "short" })}
                        </span>
                        <span className="font-bold leading-tight">{new Date(at).getDate()}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-demo-text">{asset.name}</span>
                        <span className="block text-sm text-demo-text-muted">
                          {customer ? customer.name : "Internt"} · kl {at.slice(11, 16)}
                        </span>
                      </span>
                      <CalendarCheck size={16} className="text-demo-text-faint" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-display text-lg font-bold text-demo-text">Senaste aktivitet</h2>
          <div className="mt-4">
            <ActivityTimeline assets={visibleAssets} showAsset limit={6} />
          </div>
        </Card>
      </div>
    </div>
  );
}
