"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Check, Circle, Mail, MessageSquare, Wrench, X } from "lucide-react";
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
import { BookServiceModal } from "@/features/service-platform/components/BookServiceModal";
import { ContactButtons } from "@/features/service-platform/components/ContactButtons";
import { ActivityTimeline } from "@/features/service-platform/components/ActivityTimeline";
import { EmptyState } from "@/components/demo/EmptyState";

function formatBooked(bookedAt: string) {
  return `${new Date(bookedAt).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })} kl ${bookedAt.slice(11, 16)}`;
}

export function AssetDetailView({ assetId }: { assetId: string }) {
  const { assets, customers, bookService, notify } = useServicePlatform();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const asset = assets.find((item) => item.id === assetId);
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
        <Link href={serviceRoutes.assets()} className="inline-flex items-center gap-1.5 text-sm text-demo-text-muted hover:text-demo-text">
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
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {customer && <ContactButtons customer={customer} asset={asset} />}
          <Button variant="secondary" onClick={() => setBookOpen(true)}>
            <CalendarCheck size={15} />
            {asset.bookedAt ? "Ändra bokning" : "Boka tid"}
          </Button>
          <Button onClick={() => setRegisterOpen(true)}>
            <Wrench size={15} />
            Registrera service
          </Button>
        </div>
      </div>

      {asset.bookedAt && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-demo-info/30 bg-demo-info-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <CalendarCheck size={20} className="text-demo-info" />
            <div>
              <p className="text-sm text-demo-text-muted">Bokad tid</p>
              <p className="font-semibold capitalize text-demo-text">{formatBooked(asset.bookedAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              bookService(asset.id, null);
              notify("Bokningen är avbokad");
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-demo-text-muted hover:text-demo-danger"
          >
            <X size={14} />
            Avboka
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-label text-demo-text-muted">Kund</p>
          {customer ? (
            <Link href={serviceRoutes.customer(customer.id)} className="group mt-1.5 block">
              <span className="font-medium text-demo-text group-hover:underline">{customer.name}</span>
              {customer.phone && <span className="block text-sm text-demo-text-muted">{customer.phone}</span>}
            </Link>
          ) : (
            <p className="mt-1.5 font-medium text-demo-text">Internt</p>
          )}
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

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="font-display text-lg font-bold text-demo-text">Historik</h2>
          <p className="mt-0.5 text-sm text-demo-text-muted">Service, samtal, sms, mejl och påminnelser.</p>
          <div className="mt-5">
            <ActivityTimeline assets={[asset]} emptyText="Ingen historik ännu." />
          </div>
        </Card>

        <div>
          <h2 className="font-display text-lg font-bold text-demo-text">Automatiska påminnelser</h2>
          <div className="mt-4 flex flex-col gap-2">
            {reminders.length === 0 ? (
              <p className="text-sm text-demo-text-muted">Inga påminnelser planerade. Sätt ett nästa servicedatum.</p>
            ) : (
              reminders.map((reminder) => {
                const ChannelIcon = reminder.channel === "email" ? Mail : MessageSquare;
                const sent = reminder.state === "sent";
                return (
                  <div key={reminder.id} className="flex items-center gap-3 rounded-xl border border-demo-border bg-demo-surface px-4 py-3 text-sm">
                    {sent ? <Check size={15} className="text-demo-primary" /> : <Circle size={11} className="text-demo-text-faint" />}
                    <span className="text-demo-text">{reminder.daysBefore} dagar innan</span>
                    <ChannelIcon size={14} className="text-demo-text-muted" />
                    <span className="text-demo-text-muted">{reminder.channel === "email" ? "Mejl" : "Sms"}</span>
                    <span className="ml-auto text-xs text-demo-text-muted">{sent ? "skickad" : "planerad"}</span>
                  </div>
                );
              })
            )}
          </div>
          {asset.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-demo-text">Anteckningar</h3>
              <p className="mt-1 text-sm text-demo-text-muted">{asset.notes}</p>
            </div>
          )}
        </div>
      </div>

      <RegisterServiceModal open={registerOpen} onClose={() => setRegisterOpen(false)} asset={asset} />
      <BookServiceModal open={bookOpen} onClose={() => setBookOpen(false)} asset={asset} customer={customer} />
    </div>
  );
}
