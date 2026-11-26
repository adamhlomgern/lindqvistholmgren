"use client";

import Link from "next/link";
import { Bell, CalendarCheck, Mail, MessageSquare, Phone, PhoneMissed, PhoneOutgoing, Wrench } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { getReminderTimeline } from "@/features/service-platform/utils/reminders";
import { serviceRoutes } from "@/features/service-platform/config/product";
import type { Asset } from "@/features/service-platform/types";

type Item = {
  key: string;
  at: string;
  icon: typeof Phone;
  tone: string;
  title: string;
  detail?: string;
  assetId?: string | null;
  customerName?: string;
};

const outcomeText = {
  booked: { title: "Samtal, tid bokad", icon: CalendarCheck },
  talked: { title: "Samtal", icon: Phone },
  call_back: { title: "Samtal, kunden ringer tillbaka", icon: PhoneOutgoing },
  no_answer: { title: "Samtal, inget svar", icon: PhoneMissed },
};

function formatAt(at: string): string {
  const hasTime = at.length > 10 && at.slice(11, 16) !== "00:00";
  const date = new Date(`${at.slice(0, 10)}T12:00`);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  const day = date.toLocaleDateString("sv-SE", { day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) });
  return hasTime ? `${day} ${at.slice(11, 16)}` : day;
}

// Allt som hänt kring ett eller flera objekt i en lista, nyast först:
// utförd service, egna samtal/sms/mejl och automatiska påminnelser.
export function ActivityTimeline({
  assets,
  customerId,
  showAsset = false,
  limit,
  emptyText = "Inget har hänt ännu.",
}: {
  assets: Asset[];
  customerId?: string;
  showAsset?: boolean;
  limit?: number;
  emptyText?: string;
}) {
  const { serviceEvents, contactEvents, customers } = useServicePlatform();
  const assetIds = new Set(assets.map((a) => a.id));
  const assetName = new Map(assets.map((a) => [a.id, a.name]));
  const customerName = new Map(customers.map((c) => [c.id, c.name]));
  const today = new Date().toISOString().slice(0, 10);

  const items: Item[] = [
    ...serviceEvents
      .filter((e) => assetIds.has(e.assetId))
      .map((e) => ({
        key: e.id,
        at: e.performedAt,
        icon: Wrench,
        tone: "bg-demo-primary-soft text-demo-primary-soft-text",
        title: `Service utförd${e.serviceType ? `: ${e.serviceType.toLowerCase()}` : ""}`,
        detail: e.notes,
        assetId: e.assetId,
      })),
    ...contactEvents
      .filter((e) => (e.assetId ? assetIds.has(e.assetId) : customerId ? e.customerId === customerId : false))
      .map((e) => {
        const call = e.channel === "call" ? outcomeText[e.outcome ?? "talked"] : null;
        return {
          key: e.id,
          at: e.at,
          icon: call ? call.icon : e.channel === "sms" ? MessageSquare : Mail,
          tone: "bg-demo-info-soft text-demo-info",
          title: call ? call.title : e.channel === "sms" ? "Sms skickat" : "Mejl skickat",
          detail: e.message,
          assetId: e.assetId,
          customerName: customerName.get(e.customerId),
        };
      }),
    ...assets.flatMap((asset) =>
      getReminderTimeline(asset)
        .filter((r) => r.state === "sent" && r.scheduledAt <= today)
        .map((r) => ({
          key: r.id,
          at: r.scheduledAt.slice(0, 10),
          icon: Bell,
          tone: "bg-demo-neutral-soft text-demo-text-muted",
          title: `Automatisk påminnelse via ${r.channel === "sms" ? "sms" : "mejl"}`,
          detail: `${r.daysBefore} dagar innan service`,
          assetId: asset.id,
        })),
    ),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  const shown = limit ? items.slice(0, limit) : items;

  if (shown.length === 0) return <p className="text-sm text-demo-text-muted">{emptyText}</p>;

  return (
    <ol className="relative flex flex-col">
      {shown.map((item, index) => (
        <li key={item.key} className="relative flex gap-3 pb-5 last:pb-0">
          {index < shown.length - 1 && <span aria-hidden className="absolute left-4 top-9 bottom-0 w-px bg-demo-border" />}
          <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
            <item.icon size={15} />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-sm font-medium text-demo-text">{item.title}</p>
              <p className="text-xs tabular-nums text-demo-text-muted">{formatAt(item.at)}</p>
            </div>
            {showAsset && item.assetId && (
              <Link href={serviceRoutes.asset(item.assetId)} className="text-xs text-demo-text-muted hover:text-demo-text hover:underline">
                {assetName.get(item.assetId)}
                {item.customerName ? ` · ${item.customerName}` : ""}
              </Link>
            )}
            {item.detail && <p className="mt-1 line-clamp-2 text-sm text-demo-text-muted">{item.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
