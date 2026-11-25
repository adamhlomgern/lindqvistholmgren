"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarCheck, Clock } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { filterAssetsByIndustry } from "@/features/service-platform/config/industries";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { categoryLabels } from "@/features/service-platform/config/categories";
import { ContactButtons } from "@/features/service-platform/components/ContactButtons";
import { EmptyState } from "@/components/demo/EmptyState";

function dayLabel(date: string) {
  const d = new Date(`${date}T12:00`);
  const today = new Date();
  const diff = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  const label = d.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
  if (diff === 0) return `Idag · ${label}`;
  if (diff === 1) return `Imorgon · ${label}`;
  return label;
}

// Bokade servicetider grupperade per dag, med snabbkontakt för att påminna
// kunden eller flytta tiden.
export function BookingsView() {
  const { assets, customers, industry } = useServicePlatform();
  const customerById = new Map(customers.map((c) => [c.id, c]));

  const groups = useMemo(() => {
    const booked = filterAssetsByIndustry(assets, industry)
      .filter((a) => a.bookedAt)
      .sort((a, b) => ((a.bookedAt as string) < (b.bookedAt as string) ? -1 : 1));
    const map = new Map<string, typeof booked>();
    for (const asset of booked) {
      const day = (asset.bookedAt as string).slice(0, 10);
      map.set(day, [...(map.get(day) ?? []), asset]);
    }
    return [...map.entries()];
  }, [assets, industry]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">Bokningar</h1>
        <p className="mt-1 text-demo-text-muted">Inbokade servicetider. Boka nya från ett objekt eller när du ringer kunden.</p>
      </div>
      {groups.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Inga bokade tider"
          description="Öppna ett objekt som behöver service och tryck på Boka tid."
          action={
            <Link href={serviceRoutes.assets()} className="text-sm font-semibold text-demo-primary hover:text-demo-primary-hover">
              Gå till objekt
            </Link>
          }
        />
      ) : (
        groups.map(([day, dayAssets]) => (
          <section key={day}>
            <h2 className="text-sm font-semibold capitalize text-demo-text-muted">{dayLabel(day)}</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-demo-border bg-demo-surface">
              {dayAssets.map((asset) => {
                const customer = asset.customerId ? customerById.get(asset.customerId) : undefined;
                return (
                  <div key={asset.id} className="flex flex-wrap items-center gap-4 border-b border-demo-border px-4 py-3 last:border-0 hover:bg-demo-surface-hover">
                    <span className="flex w-16 items-center gap-1.5 font-semibold tabular-nums text-demo-text">
                      <Clock size={14} className="text-demo-text-muted" />
                      {(asset.bookedAt as string).slice(11, 16)}
                    </span>
                    <Link href={serviceRoutes.asset(asset.id)} className="min-w-0 flex-1">
                      <span className="block font-medium text-demo-text hover:underline">{asset.name}</span>
                      <span className="block text-sm text-demo-text-muted">
                        {customer ? customer.name : "Internt"} · {asset.identifier ?? categoryLabels[asset.category]}
                      </span>
                    </Link>
                    {customer && <ContactButtons customer={customer} asset={asset} variant="icons" />}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
