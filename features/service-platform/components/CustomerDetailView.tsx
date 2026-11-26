"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, Users } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { AssetsTable } from "@/features/service-platform/components/AssetsTable";
import { ContactButtons } from "@/features/service-platform/components/ContactButtons";
import { ActivityTimeline } from "@/features/service-platform/components/ActivityTimeline";
import { Card } from "@/components/demo/Card";
import { EmptyState } from "@/components/demo/EmptyState";
import { inputClass } from "@/components/demo/Field";

// Allt om en kund: kontaktuppgifter, snabbkontakt, kundens objekt, all
// historik och egna anteckningar som sparas direkt.
export function CustomerDetailView({ customerId }: { customerId: string }) {
  const { customers, assets, updateCustomerNotes, notify } = useServicePlatform();
  const customer = customers.find((c) => c.id === customerId);
  const [notes, setNotes] = useState(customer?.notes ?? "");

  if (!customer) {
    return (
      <EmptyState
        icon={Users}
        title="Kunden hittades inte"
        description="Det kan ha återställts när demon nollställdes."
        action={
          <Link href={serviceRoutes.customers()} className="text-sm font-semibold text-demo-primary hover:text-demo-primary-hover">
            Tillbaka till kunder
          </Link>
        }
      />
    );
  }

  const theirAssets = assets.filter((a) => a.customerId === customer.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href={serviceRoutes.customers()} className="inline-flex items-center gap-1.5 text-sm text-demo-text-muted hover:text-demo-text">
          <ArrowLeft size={15} />
          Tillbaka till kunder
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-demo-primary-soft font-display text-xl font-bold text-demo-primary-soft-text">
              {customer.name.charAt(0)}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">{customer.companyName ?? customer.name}</h1>
              {customer.companyName && <p className="text-demo-text-muted">Kontakt: {customer.name}</p>}
            </div>
          </div>
          <ContactButtons customer={customer} asset={theirAssets[0]} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-label text-demo-text-muted">
            <Phone size={12} /> Telefon
          </p>
          <a href={customer.phone ? `tel:${customer.phone.replace(/[^\d+]/g, "")}` : undefined} className="mt-1.5 block font-medium text-demo-text hover:underline">
            {customer.phone ?? "—"}
          </a>
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-label text-demo-text-muted">
            <Mail size={12} /> E-post
          </p>
          <a href={customer.email ? `mailto:${customer.email}` : undefined} className="mt-1.5 block truncate font-medium text-demo-text hover:underline">
            {customer.email ?? "—"}
          </a>
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-label text-demo-text-muted">
            <Building2 size={12} /> Kund sedan
          </p>
          <p className="mt-1.5 font-medium text-demo-text">
            {new Date(customer.createdAt).toLocaleDateString("sv-SE", { month: "long", year: "numeric" })}
          </p>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-demo-text">Objekt ({theirAssets.length})</h2>
        <div className="mt-4">
          {theirAssets.length === 0 ? (
            <p className="text-sm text-demo-text-muted">Inga objekt registrerade på kunden.</p>
          ) : (
            <AssetsTable assets={theirAssets} customers={customers} showOwnerColumn={false} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="font-display text-lg font-bold text-demo-text">Historik</h2>
          <div className="mt-5">
            <ActivityTimeline assets={theirAssets} customerId={customer.id} showAsset emptyText="Ingen historik med kunden ännu." />
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-bold text-demo-text">Anteckningar</h2>
          <p className="mt-0.5 text-sm text-demo-text-muted">Bara för er, syns inte för kunden.</p>
          <textarea
            className={`${inputClass} mt-4 min-h-36`}
            placeholder="T.ex. vill ha sms i stället för samtal, nyckel finns i receptionen"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              if (notes !== (customer.notes ?? "")) {
                updateCustomerNotes(customer.id, notes);
                notify("Anteckningen är sparad");
              }
            }}
          />
        </Card>
      </div>
    </div>
  );
}
