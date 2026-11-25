"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarPlus, FileText, Mail, MessageSquareText, Phone, RefreshCw } from "lucide-react";
import { formatPriceRange } from "@/features/forma/utils/format";
import type { LeadNote } from "@/features/forma/state/FormaProvider";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { ConfigurationSummary } from "@/features/forma/configuration/ConfigurationSummary";
import { statusLabels, statusOrder } from "@/features/forma/admin/statusLabels";
import type { QuoteRequestStatus } from "@/features/forma/types/configuration";

export function LeadDetail({ leadId }: { leadId: string }) {
  const { getQuoteRequest, getConfiguration, updateLeadStatus, addLeadNote, leadNotes } = useForma();
  const [note, setNote] = useState("");
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
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
          onChange={(e) => {
            const status = e.target.value as QuoteRequestStatus;
            updateLeadStatus(request.id, status, `Status ändrad till ${statusLabels[status].toLowerCase()}`);
          }}
          className="rounded-full border border-forma-border bg-forma-surface px-3.5 py-2 text-sm font-medium text-forma-text outline-none focus:border-forma-accent"
        >
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`tel:${request.phone.replace(/[^\d+]/g, "")}`}
          onClick={() => {
            addLeadNote(request.id, "call", "Ringde kunden");
            if (request.status === "ny") updateLeadStatus(request.id, "kontaktad", "Status ändrad till kontaktad");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-forma-border bg-forma-surface px-4 py-2 text-sm font-semibold text-forma-text transition-colors hover:border-forma-accent"
        >
          <Phone size={15} /> Ring
        </a>
        <a
          href={`mailto:${request.email}?subject=${encodeURIComponent("Din förfrågan om attefallshus")}`}
          onClick={() => {
            addLeadNote(request.id, "email", "Mejlade kunden");
            if (request.status === "ny") updateLeadStatus(request.id, "kontaktad", "Status ändrad till kontaktad");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-forma-border bg-forma-surface px-4 py-2 text-sm font-semibold text-forma-text transition-colors hover:border-forma-accent"
        >
          <Mail size={15} /> Mejla
        </a>
        <button
          type="button"
          onClick={() => updateLeadStatus(request.id, "mote-bokat", "Bokade platsbesök")}
          className="inline-flex items-center gap-1.5 rounded-full border border-forma-border bg-forma-surface px-4 py-2 text-sm font-semibold text-forma-text transition-colors hover:border-forma-accent"
        >
          <CalendarPlus size={15} /> Boka platsbesök
        </button>
        <button
          type="button"
          onClick={() =>
            updateLeadStatus(
              request.id,
              "offert-skickad",
              `Offert skickad, ${formatPriceRange(request.estimatedLow, request.estimatedHigh)}`,
            )
          }
          className="inline-flex items-center gap-1.5 rounded-full bg-forma-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forma-accent-hover"
        >
          <FileText size={15} /> Skicka offert
        </button>
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ConfigurationSummary configuration={configuration} showCta={false} />
        <section className="rounded-xl border border-forma-border bg-forma-surface p-4">
          <h2 className="font-forma text-base font-bold text-forma-text">Logg</h2>
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              addLeadNote(request.id, "note", note.trim());
              setNote("");
            }}
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anteckning, t.ex. vill ha besked om bygglov först"
              className="min-h-20 rounded-lg border border-forma-border bg-forma-surface px-3 py-2 text-sm text-forma-text outline-none focus:border-forma-accent"
            />
            <button type="submit" className="self-end rounded-full bg-forma-text px-4 py-1.5 text-sm font-semibold text-forma-surface">
              Spara anteckning
            </button>
          </form>
          <ol className="mt-4 space-y-3">
            {[
              ...(leadNotes[request.id] ?? []),
              { id: "created", at: request.createdAt, kind: "note" as LeadNote["kind"], text: "Förfrågan skickad från konfiguratorn" },
            ].map((n) => {
              const Icon = { note: MessageSquareText, call: Phone, email: Mail, quote: FileText, meeting: CalendarPlus, status: RefreshCw }[n.kind];
              return (
                <li key={n.id} className="flex gap-2.5 text-sm">
                  <Icon size={15} className="mt-0.5 shrink-0 text-forma-text-faint" />
                  <div>
                    <p className="text-forma-text">{n.text}</p>
                    <p className="text-xs text-forma-text-faint">
                      {new Date(n.at).toLocaleString("sv-SE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
