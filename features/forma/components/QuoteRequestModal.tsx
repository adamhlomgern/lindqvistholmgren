"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import type { Configuration } from "@/features/forma/types/configuration";

const inputClass =
  "w-full rounded-lg border border-forma-border bg-forma-surface px-3 py-2 text-sm text-forma-text outline-none focus:border-forma-accent";

export function QuoteRequestModal({ configuration, onClose }: { configuration: Configuration; onClose: () => void }) {
  const { submitQuoteRequest } = useForma();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState(configuration.site.municipality);
  const [desiredStart, setDesiredStart] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && email.trim().length > 3 && phone.trim().length > 3;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const quoteRequest = submitQuoteRequest({
      configuration,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      municipality: municipality.trim(),
      desiredStart: desiredStart.trim(),
    });
    router.push(formaRoutes.success(quoteRequest.id));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-forma-surface p-5 shadow-2xl shadow-black/20 sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-forma text-lg font-bold text-forma-text">Få en exakt offert</h2>
          <button type="button" onClick={onClose} aria-label="Stäng" className="rounded-full p-1 text-forma-text-faint hover:text-forma-text">
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-sm text-forma-text-muted">Din konfiguration följer automatiskt med förfrågan.</p>

        <div className="mt-5 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-forma-text-muted" htmlFor="quote-name">
              Namn
            </label>
            <input id="quote-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="För- och efternamn" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-forma-text-muted" htmlFor="quote-email">
              E-post
            </label>
            <input
              id="quote-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@exempel.se"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-forma-text-muted" htmlFor="quote-phone">
              Telefon
            </label>
            <input id="quote-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070-123 45 67" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-forma-text-muted" htmlFor="quote-municipality">
              Kommun
            </label>
            <input id="quote-municipality" className={inputClass} value={municipality} onChange={(e) => setMunicipality(e.target.value)} placeholder="Karlstad" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-forma-text-muted" htmlFor="quote-start">
              Önskad byggstart
            </label>
            <input
              id="quote-start"
              className={inputClass}
              value={desiredStart}
              onChange={(e) => setDesiredStart(e.target.value)}
              placeholder="T.ex. våren 2027"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="mt-5 w-full rounded-full bg-forma-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-forma-accent/25 transition-colors hover:bg-forma-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {submitting ? "Skickar…" : "Skicka förfrågan"}
        </button>
      </div>
    </div>
  );
}
