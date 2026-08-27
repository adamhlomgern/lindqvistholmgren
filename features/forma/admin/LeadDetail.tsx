"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { ConfigurationSummary } from "@/features/forma/configuration/ConfigurationSummary";
import { statusLabels, statusOrder } from "@/features/forma/admin/statusLabels";
import type { QuoteRequestStatus } from "@/features/forma/types/configuration";

export function LeadDetail({ leadId }: { leadId: string }) {
  const { getQuoteRequest, getConfiguration, updateLeadStatus } = useForma();
  const request = getQuoteRequest(leadId);
  const configuration = request ? getConfiguration(request.configurationId) : undefined;

  if (!request || !configuration) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-forma-text-muted">Förfrågan hittades inte.</p>
        <Link href={formaRoutes.leads()} className="mt-4 inline-block text-sm font-semibold text-forma-accent">
          Till förfrågningar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href={formaRoutes.leads()} className="flex items-center gap-1.5 text-sm font-medium text-forma-text-muted hover:text-forma-text">
        <ArrowLeft size={15} /> Förfrågningar
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-forma text-2xl font-bold text-forma-text">{request.name}</h1>
          <p className="mt-1 text-sm text-forma-text-muted">
            {request.email} · {request.phone}
          </p>
        </div>
        <select
          value={request.status}
          onChange={(e) => updateLeadStatus(request.id, e.target.value as QuoteRequestStatus)}
          className="rounded-full border border-forma-border bg-forma-surface px-3.5 py-2 text-sm font-medium text-forma-text outline-none focus:border-forma-accent"
        >
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-forma-border bg-forma-surface p-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-forma-text-faint">Ort</dt>
          <dd className="font-medium text-forma-text">{configuration.site.municipality || request.municipality}</dd>
        </div>
        <div>
          <dt className="text-xs text-forma-text-faint">Önskad byggstart</dt>
          <dd className="font-medium text-forma-text">{request.desiredStart || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-forma-text-faint">Terräng</dt>
          <dd className="font-medium text-forma-text">{configuration.site.terrain ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-forma-text-faint">Vatten/avlopp</dt>
          <dd className="font-medium text-forma-text">{configuration.site.waterAndSewer ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-6 max-w-md">
        <ConfigurationSummary configuration={configuration} showCta={false} />
      </div>
    </div>
  );
}
