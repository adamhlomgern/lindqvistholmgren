"use client";

import Link from "next/link";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { getModel } from "@/features/forma/data/models";
import { formatPriceRange } from "@/features/forma/utils/format";
import { statusLabels } from "@/features/forma/admin/statusLabels";

// Intentionally plain — no shared dashboard shell, table-as-page is fine
// here because this view is explicitly secondary (see brief: "ska hållas
// mycket enklare än i våra övriga demos").
export function LeadsTable() {
  const { quoteRequests, getConfiguration } = useForma();
  const requests = Object.values(quoteRequests).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-forma text-2xl font-bold text-forma-text">Förfrågningar</h1>
      <p className="mt-1 text-sm text-forma-text-muted">Inkomna offertförfrågningar från konfiguratorn.</p>

      {requests.length === 0 ? (
        <p className="mt-8 text-sm text-forma-text-muted">Inga förfrågningar ännu.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-forma-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-forma-border bg-forma-surface-hover text-xs uppercase tracking-label text-forma-text-faint">
                <th className="px-4 py-2.5 font-semibold">Kund</th>
                <th className="px-4 py-2.5 font-semibold">Modell</th>
                <th className="px-4 py-2.5 font-semibold">Värde</th>
                <th className="px-4 py-2.5 font-semibold">Ort</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const configuration = getConfiguration(request.configurationId);
                return (
                  <tr key={request.id} className="border-b border-forma-border last:border-0 hover:bg-forma-surface-hover">
                    <td className="px-4 py-2.5">
                      <Link href={formaRoutes.lead(request.id)} className="font-medium text-forma-text hover:text-forma-accent">
                        {request.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-forma-text-muted">{configuration ? getModel(configuration.model).name : "—"}</td>
                    <td className="px-4 py-2.5 text-forma-text-muted">~{formatPriceRange(request.estimatedLow, request.estimatedHigh)}</td>
                    <td className="px-4 py-2.5 text-forma-text-muted">{request.municipality}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full bg-forma-accent-soft px-2.5 py-1 text-xs font-medium text-forma-accent-soft-text">
                        {statusLabels[request.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
