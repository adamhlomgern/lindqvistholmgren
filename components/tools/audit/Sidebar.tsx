"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, FileText, Loader2, Mail, Send } from "lucide-react";
import { trackConversion } from "@/lib/analytics";
import { actionPlan, type AuditResult } from "@/lib/site-audit/analyze";
import type { GoogleResult } from "@/lib/site-audit/pagespeed";

export type SignedAudit = { result: AuditResult; token: string };
export type SignedGoogle = { data: GoogleResult; token: string } | null;

// "Få rapporten som PDF": bara e-post. Servern verifierar att resultaten är
// våra egna (token) och sparar adressen som ett lead.
export function ReportForm({ audit, google }: { audit: SignedAudit; google: SignedGoogle }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("sending");
    setError(null);
    try {
      const response = await fetch("/api/hemsidekollen/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result: audit.result,
          token: audit.token,
          google: google?.data ?? null,
          googleToken: google?.token ?? null,
          email: email.trim(),
          website,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Något gick fel.");
      trackConversion({ name: "inquiry_submit", mode: "quick" });
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
      setState("idle");
    }
  }

  return (
    <div className="rounded-3xl bg-lilac-50 p-6 ring-1 ring-lilac-200">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-plum-700 shadow-card ring-1 ring-lilac-200">
        <FileText size={20} />
      </span>
      <p className="mt-4 font-display text-lg font-semibold tracking-[-0.01em] text-fg">Hela rapporten som PDF</p>
      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
        Med åtgärdsplan och steg-för-steg-förslag. Spara den eller skicka till den som sköter sajten.
      </p>
      {state === "done" ? (
        <p className="mt-4 flex items-center gap-2 font-medium text-pine-800">
          <Check size={18} strokeWidth={2.5} />
          Skickad! Kolla inkorgen om en minut.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
          <label className="relative">
            <span className="sr-only">E-post</span>
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Er e-post"
              className="h-11 w-full rounded-xl bg-surface pl-10 pr-3 text-sm text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-plum-600"
            />
          </label>
          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-fg px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {state === "sending" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Mejla rapporten
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>
      )}
    </div>
  );
}

export function AuditLead({ result, rival }: { result: AuditResult; rival: AuditResult | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const top = actionPlan(result).ranked.slice(0, 3);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("sending");
    const summary = top.length ? top.map((i) => `- ${i.label}: ${i.detail}`).join("\n") : "Inga anmärkningar.";
    try {
      const response = await fetch("/api/projektforfragan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: ["webb"],
          budget: "vet-inte",
          timeline: "utforskar",
          description: `Hemsidekollen: ${result.url} fick ${result.score}/100${result.platform ? ` (${result.platform})` : ""}. Vill ha en personlig genomgång.${
            rival ? `\nJämförde med ${rival.url} (${rival.score}/100).` : ""
          }\n\nViktigast att förbättra:\n${summary}`,
          name: name.trim(),
          company: result.host,
          email: email.trim(),
          phone: "",
          website,
          source: "hemsidekollen",
          page: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error();
      trackConversion({ name: "inquiry_submit", mode: "quick" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="tone-pine rounded-3xl p-6">
      {state === "done" ? (
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fg/10">
            <Check size={20} />
          </span>
          <p className="mt-4 font-display text-xl font-semibold">Tack! Vi hör av oss inom 24 timmar.</p>
          <p className="mt-2 text-fg-muted">Vi går igenom {result.host} och berättar vad som ger mest effekt.</p>
        </div>
      ) : (
        <>
          <p className="font-display text-lg font-semibold tracking-[-0.01em]">Vill ni att vi fixar det?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
            Vi går igenom sajten på riktigt och berättar vad som ger mest effekt först. Gratis och utan krav.
          </p>
          {top.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm">
              {top.map((i) => (
                <li key={i.id} className="flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-highlight" />
                  {i.label}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={submit} className="mt-5 flex flex-col gap-2">
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ert namn"
              className="h-11 rounded-xl bg-surface px-4 text-sm text-fg ring-1 ring-inset ring-line placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-post"
              className="h-11 rounded-xl bg-surface px-4 text-sm text-fg ring-1 ring-inset ring-line placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-70"
            >
              {state === "sending" ? "Skickar…" : "Ja, gå igenom min sajt"}
            </button>
            {state === "error" && <p className="text-sm text-fg-muted">Något gick fel. Mejla oss gärna på info@lindqvistholmgren.se.</p>}
          </form>
        </>
      )}
    </div>
  );
}
