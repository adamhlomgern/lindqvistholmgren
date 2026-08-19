"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Circle, Mail, MessageSquare, Wrench } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { getReminderTimeline } from "@/features/service-platform/utils/reminders";
import { formatDateSv, formatRelativeSv } from "@/features/service-platform/utils/dates";
import { categoryLabels } from "@/features/service-platform/config/categories";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { StatusBadge } from "@/features/service-platform/components/StatusBadge";
import { Button } from "@/components/demo/Button";
import { Card } from "@/components/demo/Card";
import { RegisterServiceModal } from "@/features/service-platform/components/RegisterServiceModal";
import { EmptyState } from "@/components/demo/EmptyState";

export function AssetDetailView({ assetId }: { assetId: string }) {
  const { assets, customers, serviceEvents, toggleManualContact } = useServicePlatform();
  const [registerOpen, setRegisterOpen] = useState(false);

  const asset = assets.find((item) => item.id === assetId);

  const history = useMemo(
    () =>
      serviceEvents
        .filter((event) => event.assetId === assetId)
        .sort((a, b) => (a.performedAt < b.performedAt ? 1 : -1)),
    [serviceEvents, assetId],
  );

  const reminders = useMemo(() => (asset ? getReminderTimeline(asset) : []), [asset]);

  if (!asset) {
    return (
      <EmptyState
        icon={Wrench}
        title="Objektet hittades inte"
        description="Det kan ha återställts när demon nollställdes."
        action={
          <Link href={serviceRoutes.assets()} className="text-sm font-semibold text-demo-primary hover:text-demo-primary-hover">
            Tillbaka till objekt
          </Link>
        }
      />
    );
  }

  const customer = asset.customerId ? customers.find((c) => c.id === asset.customerId) : undefined;
  const status = getAssetStatus(asset);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={serviceRoutes.assets()}
          className="inline-flex items-center gap-1.5 text-sm text-demo-text-muted hover:text-demo-text"
        >
          <ArrowLeft size={15} />
          Tillbaka till objekt
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-label text-demo-text-muted">{categoryLabels[asset.category]}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-demo-text md:text-3xl">{asset.name}</h1>
            {asset.identifier && <p className="mt-1 text-demo-text-muted">{asset.identifier}</p>}
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-label text-demo-text-muted">Kund</p>
          <p className="mt-1.5 font-medium text-demo-text">{customer ? customer.name : "Internt"}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-label text-demo-text-muted">Senaste service</p>
          <p className="mt-1.5 font-medium text-demo-text">{formatDateSv(asset.lastServiceDate)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-label text-demo-text-muted">Nästa service</p>
          <p className="mt-1.5 font-medium text-demo-text">{formatDateSv(asset.nextServiceDate)}</p>
          <p className="text-sm text-demo-text-muted">{formatRelativeSv(asset.nextServiceDate)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-label text-demo-text-muted">Serviceintervall</p>
          <p className="mt-1.5 font-medium text-demo-text">
            {asset.serviceIntervalMonths ? `${asset.serviceIntervalMonths} månader` : "Inget satt"}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-bold text-demo-text">Servicehistorik</h2>
          <div className="mt-4 flex flex-col gap-3">
            {history.length === 0 ? (
              <p className="text-sm text-demo-text-muted">Ingen service registrerad ännu.</p>
            ) : (
              history.map((event) => (
                <Card key={event.id}>
                  <p className="font-medium text-demo-text">{formatDateSv(event.performedAt)}</p>
                  <p className="text-sm text-demo-text-muted">{event.serviceType ?? "Service"}</p>
                  {event.notes && <p className="mt-1 text-sm text-demo-text-muted">{event.notes}</p>}
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-demo-text">Påminnelser</h2>
          <div className="mt-4 flex flex-col gap-2">
            {reminders.length === 0 ? (
              <p className="text-sm text-demo-text-muted">Inga påminnelser planerade — sätt ett nästa servicedatum.</p>
            ) : (
              reminders.map((reminder) => {
                const ChannelIcon = reminder.channel === "email" ? Mail : MessageSquare;
                const sent = reminder.state === "sent";
                return (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 rounded-xl border border-demo-border bg-demo-surface px-4 py-3 text-sm"
                  >
                    {sent ? (
                      <Check size={15} className="text-demo-primary" />
                    ) : (
                      <Circle size={11} className="text-demo-text-faint" />
                    )}
                    <span className="text-demo-text">{reminder.daysBefore} dagar innan</span>
                    <ChannelIcon size={14} className="text-demo-text-muted" />
                    <span className="text-demo-text-muted">{reminder.channel === "email" ? "Email" : "SMS"}</span>
                    <span className="ml-auto text-xs text-demo-text-muted">{sent ? "skickad" : "planerad"}</span>
                  </div>
                );
              })
            )}
          </div>

          {customer && (
            <button
              type="button"
              onClick={() => toggleManualContact(asset.id)}
              className={`mt-3 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                asset.manualContactedAt
                  ? "border-demo-primary/30 bg-demo-primary-soft"
                  : "border-dashed border-demo-border bg-demo-surface hover:border-demo-text-faint"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  asset.manualContactedAt ? "border-demo-primary bg-demo-primary text-white" : "border-demo-border"
                }`}
              >
                {asset.manualContactedAt && <Check size={13} />}
              </span>
              <span className={asset.manualContactedAt ? "text-demo-primary-soft-text" : "text-demo-text"}>
                Vi har själva ringt {customer.name} om servicen
                {asset.manualContactedAt && ` — ${formatDateSv(asset.manualContactedAt)}`}
              </span>
            </button>
          )}
        </div>
      </div>

      <div>
        <Button onClick={() => setRegisterOpen(true)}>
          <Wrench size={16} />
          Registrera service
        </Button>
      </div>

      <RegisterServiceModal open={registerOpen} onClose={() => setRegisterOpen(false)} asset={asset} />
    </div>
  );
}
