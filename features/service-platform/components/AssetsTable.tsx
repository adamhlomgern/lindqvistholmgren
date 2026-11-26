"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Mail, MessageSquare } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { ContactButtons } from "@/features/service-platform/components/ContactButtons";
import type { Asset, ContactChannel, Customer } from "@/features/service-platform/types";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { getReminderTimeline } from "@/features/service-platform/utils/reminders";
import { formatRelativeSv } from "@/features/service-platform/utils/dates";
import { categoryLabels } from "@/features/service-platform/config/categories";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { StatusBadge } from "@/features/service-platform/components/StatusBadge";
import { HorizontalScroller } from "@/components/demo/HorizontalScroller";

type AssetsTableProps = {
  assets: Asset[];
  customers: Customer[];
  // Hide the "Kund/ägare" column in the internal/eget-underhåll persona,
  // where every row would otherwise just say "Internt".
  showOwnerColumn?: boolean;
};

function useUsedChannels(asset: Asset): Partial<Record<ContactChannel, boolean>> {
  const { contactEvents } = useServicePlatform();
  const reminders = getReminderTimeline(asset);
  const mine = contactEvents.filter((e) => e.assetId === asset.id);
  return {
    email: reminders.some((r) => r.channel === "email" && r.state === "sent") || mine.some((e) => e.channel === "email"),
    sms: reminders.some((r) => r.channel === "sms" && r.state === "sent") || mine.some((e) => e.channel === "sms"),
    call: Boolean(asset.manualContactedAt) || mine.some((e) => e.channel === "call"),
  };
}

// Utan kund (eget underhåll) finns ingen att kontakta: visa bara status.
function ContactCell({ asset, customer }: { asset: Asset; customer?: Customer }) {
  const used = useUsedChannels(asset);
  if (!customer) {
    return (
      <div className="flex items-center gap-2.5 text-demo-text-faint">
        <Mail size={14} className={used.email ? "text-demo-primary" : ""} />
        <MessageSquare size={14} className={used.sms ? "text-demo-primary" : ""} />
      </div>
    );
  }
  return <ContactButtons customer={customer} asset={asset} variant="icons" used={used} />;
}

function BookedChip({ asset }: { asset: Asset }) {
  if (!asset.bookedAt) return null;
  const d = new Date(asset.bookedAt);
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-demo-info-soft px-2 py-0.5 text-[11px] font-medium text-demo-info">
      <CalendarCheck size={11} />
      Bokad {d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })} {asset.bookedAt.slice(11, 16)}
    </span>
  );
}

function AssetCard({ asset, customer, showOwnerColumn }: { asset: Asset; customer?: Customer; showOwnerColumn: boolean }) {
  return (
    <Link
      href={serviceRoutes.asset(asset.id)}
      className="block rounded-2xl border border-demo-border bg-demo-surface p-4 transition-colors hover:bg-demo-surface-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-demo-text">{asset.name}</p>
          <p className="text-xs text-demo-text-muted">{asset.identifier ?? categoryLabels[asset.category]}</p>
        </div>
        <StatusBadge status={getAssetStatus(asset)} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="text-sm text-demo-text-muted">
          {showOwnerColumn && <p>{customer ? customer.name : "Internt"}</p>}
          <p>{formatRelativeSv(asset.nextServiceDate)}</p>
        </div>
        <ContactCell asset={asset} customer={customer} />
      </div>
      {asset.bookedAt && (
        <div className="mt-2">
          <BookedChip asset={asset} />
        </div>
      )}
    </Link>
  );
}

export function AssetsTable({ assets, customers, showOwnerColumn = true }: AssetsTableProps) {
  const router = useRouter();
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <>
      {/* A table that scrolls sideways is awkward to use on a phone, so
          mobile gets a stacked card list instead — same data, no horizontal
          scrolling required. */}
      <div className="flex flex-col gap-3 md:hidden">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            customer={asset.customerId ? customerById.get(asset.customerId) : undefined}
            showOwnerColumn={showOwnerColumn}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <HorizontalScroller className="rounded-2xl border border-demo-border bg-demo-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-demo-border text-left text-xs uppercase tracking-label text-demo-text-muted">
                <th className="px-4 py-3 font-medium">Objekt</th>
                {showOwnerColumn && <th className="px-4 py-3 font-medium">Kund/ägare</th>}
                <th className="px-4 py-3 font-medium">Nästa service</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const customer = asset.customerId ? customerById.get(asset.customerId) : undefined;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => router.push(serviceRoutes.asset(asset.id))}
                    className="cursor-pointer border-b border-demo-border transition-colors last:border-0 hover:bg-demo-surface-hover"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={serviceRoutes.asset(asset.id)} className="block">
                        <span className="font-medium text-demo-text">{asset.name}</span>
                        <span className="ml-2 text-xs text-demo-text-muted">
                          {asset.identifier ?? categoryLabels[asset.category]}
                        </span>
                        <BookedChip asset={asset} />
                      </Link>
                    </td>
                    {showOwnerColumn && (
                      <td className="whitespace-nowrap px-4 py-3 text-demo-text-muted">
                        {customer ? (
                          <Link
                            href={serviceRoutes.customer(customer.id)}
                            onClick={(event) => event.stopPropagation()}
                            className="hover:text-demo-text hover:underline"
                          >
                            {customer.name}
                          </Link>
                        ) : (
                          "Internt"
                        )}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-demo-text-muted">
                      {formatRelativeSv(asset.nextServiceDate)}
                    </td>
                    <td className="px-2 py-1.5">
                      <ContactCell asset={asset} customer={customer} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={getAssetStatus(asset)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </HorizontalScroller>
      </div>
    </>
  );
}
