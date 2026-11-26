"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Columns3, List } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { getModel } from "@/features/forma/data/models";
import { formatPriceRange } from "@/features/forma/utils/format";
import { statusLabels, statusOrder } from "@/features/forma/admin/statusLabels";
import type { QuoteRequest, QuoteRequestStatus } from "@/features/forma/types/configuration";

const statusTone: Record<QuoteRequestStatus, string> = {
  ny: "bg-forma-accent-soft text-forma-accent-soft-text",
  kontaktad: "bg-amber-100 text-amber-800",
  "mote-bokat": "bg-blue-100 text-blue-800",
  "offert-skickad": "bg-lilac-100 text-plum-800",
  vunnen: "bg-pine-100 text-pine-800",
  forlorad: "bg-ink-100 text-ink-700",
};

const mid = (r: QuoteRequest) => (r.estimatedLow + r.estimatedHigh) / 2;
const kr = (n: number) => `${Math.round(n / 1000).toLocaleString("sv-SE")} tkr`;

// Säljarens vy över förfrågningar från konfiguratorn: nyckeltal, en tabell
// och en tavla per säljsteg där man flyttar förfrågan vidare.
export function LeadsTable() {
  const router = useRouter();
  const { quoteRequests, getConfiguration, updateLeadStatus } = useForma();
  const [view, setView] = useState<"tabell" | "tavla">("tabell");
  const requests = Object.values(quoteRequests).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const open = requests.filter((r) => r.status !== "vunnen" && r.status !== "forlorad");
  const kpis = [
    { label: "Förfrågningar", value: String(requests.length) },
    { label: "Nya att kontakta", value: String(requests.filter((r) => r.status === "ny").length) },
    { label: "Öppet värde", value: kr(open.reduce((s, r) => s + mid(r), 0)) },
    { label: "Vunna", value: kr(requests.filter((r) => r.status === "vunnen").reduce((s, r) => s + mid(r), 0)) },
  ];

  function move(request: QuoteRequest, status: QuoteRequestStatus) {
    updateLeadStatus(request.id, status, `Flyttad till ${statusLabels[status].toLowerCase()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-forma text-2xl font-bold text-forma-text">Förfrågningar</h1>
          <p className="mt-1 text-sm text-forma-text-muted">Inkomna offertförfrågningar från konfiguratorn.</p>
        </div>
        <div className="inline-flex rounded-full border border-forma-border bg-forma-surface p-1 text-sm">
          {(["tabell", "tavla"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium capitalize transition-colors ${
                view === v ? "bg-forma-text text-forma-surface" : "text-forma-text-muted hover:text-forma-text"
              }`}
            >
              {v === "tabell" ? <List size={15} /> : <Columns3 size={15} />}
              {v}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-forma-border bg-forma-surface p-4">
            <dt className="text-xs text-forma-text-faint">{k.label}</dt>
            <dd className="mt-1 font-forma text-2xl font-bold text-forma-text">{k.value}</dd>
          </div>
        ))}
      </dl>

      {requests.length === 0 ? (
        <p className="mt-8 text-sm text-forma-text-muted">Inga förfrågningar ännu.</p>
      ) : view === "tabell" ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-forma-border bg-forma-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-forma-border bg-forma-surface-hover text-xs uppercase tracking-label text-forma-text-faint">
                <th className="px-4 py-2.5 font-semibold">Kund</th>
                <th className="px-4 py-2.5 font-semibold">Modell</th>
                <th className="px-4 py-2.5 font-semibold">Värde</th>
                <th className="px-4 py-2.5 font-semibold">Ort</th>
                <th className="px-4 py-2.5 font-semibold">Inkom</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const configuration = getConfiguration(request.configurationId);
                return (
                  <tr
                    key={request.id}
                    onClick={() => router.push(formaRoutes.lead(request.id))}
                    className="cursor-pointer border-b border-forma-border transition-colors last:border-0 hover:bg-forma-surface-hover"
                  >
                    <td className="px-4 py-3">
                      <Link href={formaRoutes.lead(request.id)} className="font-medium text-forma-text">
                        {request.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-forma-text-muted">{configuration ? getModel(configuration.model).name : "—"}</td>
                    <td className="px-4 py-3 text-forma-text-muted">~{formatPriceRange(request.estimatedLow, request.estimatedHigh)}</td>
                    <td className="px-4 py-3 text-forma-text-muted">{request.municipality}</td>
                    <td className="px-4 py-3 text-forma-text-muted">
                      {new Date(request.createdAt).toLocaleDateString("sv-SE", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={request.status}
                        onChange={(e) => move(request, e.target.value as QuoteRequestStatus)}
                        aria-label={`Status för ${request.name}`}
                        className={`cursor-pointer rounded-full border-0 py-1 pl-2.5 pr-7 text-xs font-medium outline-none ${statusTone[request.status]}`}
                      >
                        {statusOrder.map((s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
          {statusOrder.map((status) => {
            const column = requests.filter((r) => r.status === status);
            return (
              <section key={status} className="w-64 shrink-0 rounded-xl bg-forma-surface-hover p-2.5">
                <header className="flex items-center justify-between px-1.5 pb-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[status]}`}>{statusLabels[status]}</span>
                  <span className="text-xs text-forma-text-faint">
                    {column.length} · {kr(column.reduce((s, r) => s + mid(r), 0))}
                  </span>
                </header>
                <div className="flex flex-col gap-2">
                  {column.map((request) => {
                    const configuration = getConfiguration(request.configurationId);
                    const index = statusOrder.indexOf(status);
                    const next = statusOrder[index + 1];
                    return (
                      <div key={request.id} className="rounded-lg border border-forma-border bg-forma-surface p-3 shadow-sm">
                        <Link href={formaRoutes.lead(request.id)} className="block font-medium text-forma-text hover:text-forma-accent">
                          {request.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-forma-text-muted">
                          {configuration ? getModel(configuration.model).name : "—"} · {request.municipality}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-forma-text">~{kr(mid(request))}</p>
                        {next && status !== "vunnen" && status !== "forlorad" && (
                          <div className="mt-2 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => move(request, next === "forlorad" ? "vunnen" : next)}
                              className="flex-1 rounded-md bg-forma-accent px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-forma-accent-hover"
                            >
                              {next === "forlorad" ? "Vunnen" : `→ ${statusLabels[next]}`}
                            </button>
                            <button
                              type="button"
                              onClick={() => move(request, "forlorad")}
                              title="Markera som förlorad"
                              className="rounded-md border border-forma-border px-2 py-1 text-xs text-forma-text-muted transition-colors hover:text-forma-text"
                            >
                              Förlorad
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {column.length === 0 && <p className="px-1.5 py-3 text-xs text-forma-text-faint">Inget här just nu.</p>}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
