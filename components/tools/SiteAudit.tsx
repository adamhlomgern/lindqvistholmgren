"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowRight, Check, Globe, Loader2, Search, ShieldCheck, Smartphone, X, Zap } from "lucide-react";
import { trackConversion } from "@/lib/analytics";
import type { AuditCheck, AuditResult } from "@/lib/site-audit/audit";

const checkedAreas = [
  { icon: Zap, title: "Hastighet", text: "Svarstid, storlek och hur mycket som laddas" },
  { icon: Smartphone, title: "Mobil", text: "Visas sajten rätt på en telefon?" },
  { icon: Search, title: "Google", text: "Titel, beskrivning, rubriker och sitemap" },
  { icon: ShieldCheck, title: "Förtroende", text: "HTTPS, kontaktvägar och delningsbild" },
];

const steps = ["Hämtar sajten", "Mäter hastigheten", "Kollar mobilen", "Kollar Google", "Räknar ihop"];

function scoreTone(score: number) {
  if (score >= 80) return { ring: "stroke-pine-600", text: "text-pine-700", label: "Bra grund" };
  if (score >= 55) return { ring: "stroke-amber-500", text: "text-amber-700", label: "Går att förbättra" };
  return { ring: "stroke-red-500", text: "text-red-700", label: "Mycket att vinna" };
}

function ScoreRing({ score }: { score: number }) {
  const tone = scoreTone(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-fg/[0.08]" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className={`fill-none ${tone.ring}`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-display text-4xl font-semibold tracking-[-0.04em] ${tone.text}`}>{score}</span>
        <span className="text-xs text-fg-muted">av 100</span>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: AuditCheck["status"] }) {
  if (status === "good")
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine-100 text-pine-800">
        <Check size={13} strokeWidth={3} />
      </span>
    );
  if (status === "warn")
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <AlertTriangle size={12} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800">
      <X size={13} strokeWidth={3} />
    </span>
  );
}

// Hemsidekollen: skriv in en adress, få ett betyg och konkreta förbättringar
// på vanlig svenska, och erbjudandet om en personlig genomgång (skickas som
// en vanlig förfrågan via /api/projektforfragan).
export function SiteAudit({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 900);
    return () => clearInterval(id);
  }, [loading]);

  async function run(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStep(0);
    setError(null);
    setResult(null);
    trackConversion({ name: "cta_click", location: "hemsidekollen-kor" });
    try {
      const response = await fetch("/api/hemsidekollen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Något gick fel.");
      setResult(data as AuditResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  const issues = result?.checks.filter((c) => c.status !== "good").sort((a, b) => b.weight - a.weight || (a.status === "bad" ? -1 : 1)) ?? [];
  const groups = result ? [...new Set(result.checks.map((c) => c.group))] : [];

  return (
    <div>
      <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Er hemsidas adress</span>
          <Globe size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ertforetag.se"
            inputMode="url"
            autoComplete="url"
            required
            className="h-14 w-full rounded-2xl bg-surface pl-12 pr-4 text-base text-fg shadow-card ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-medium text-on-primary shadow-card transition-colors hover:bg-primary-hover disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          {loading ? steps[step] : "Kolla sajten"}
        </button>
      </form>
      <p className="mt-2 text-sm text-fg-subtle">Gratis och utan konto. Tar ungefär tio sekunder.</p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">{error}</p>}

      {!result && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {checkedAreas.map((area, i) => (
            <li
              key={area.title}
              className={`rounded-2xl bg-surface p-5 ring-1 ring-line transition-all duration-300 ${
                loading && i <= step - 1 ? "shadow-raised ring-primary/40" : "shadow-card"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700 ring-1 ring-pine-100">
                {loading && i <= step - 1 ? <Check size={18} strokeWidth={2.5} /> : <area.icon size={18} />}
              </span>
              <p className="mt-4 font-medium text-fg">{area.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{area.text}</p>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <div className="flex flex-col gap-6 rounded-3xl bg-surface p-6 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:p-8">
              <ScoreRing score={result.score} />
              <div>
                <p className="text-sm text-fg-muted">Resultat för</p>
                <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg">{result.host}</p>
                <p className={`mt-1 font-medium ${scoreTone(result.score).text}`}>{scoreTone(result.score).label}</p>
                <p className="mt-2 text-sm text-fg-muted">
                  {issues.length === 0
                    ? "Vi hittade inget att anmärka på i den här snabbkollen. Snyggt!"
                    : `${issues.length} saker att förbättra. Det viktigaste står först.`}
                </p>
              </div>
            </div>

            <div className={`mt-4 grid gap-4 ${compact ? "" : "lg:grid-cols-[1.2fr_1fr]"}`}>
              <div className="rounded-3xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
                {groups.map((group) => (
                  <div key={group} className="mb-6 last:mb-0">
                    <p className="text-xs font-semibold uppercase tracking-label text-fg-subtle">{group}</p>
                    <ul className="mt-3 space-y-3">
                      {result.checks
                        .filter((c) => c.group === group)
                        .map((c) => (
                          <li key={c.id} className="flex gap-3">
                            <StatusIcon status={c.status} />
                            <div>
                              <p className="text-[15px] font-medium text-fg">{c.label}</p>
                              <p className="text-sm leading-relaxed text-fg-muted">{c.detail}</p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
              <AuditLead result={result} topIssues={issues.slice(0, 3)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditLead({ result, topIssues }: { result: AuditResult; topIssues: AuditCheck[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("sending");
    const summary = topIssues.length ? topIssues.map((i) => `- ${i.label}: ${i.detail}`).join("\n") : "Inga anmärkningar.";
    try {
      const response = await fetch("/api/projektforfragan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: ["webb"],
          budget: "vet-inte",
          timeline: "utforskar",
          description: `Hemsidekollen: ${result.url} fick ${result.score}/100. Vill ha en personlig genomgång.\n\nViktigast att förbättra:\n${summary}`,
          name: name.trim(),
          company: result.host,
          email: email.trim(),
          phone: "",
          website,
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
    <div className="tone-pine order-first flex flex-col rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24 lg:order-none lg:self-start">
      {state === "done" ? (
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fg/10">
            <Check size={20} />
          </span>
          <p className="mt-4 font-display text-xl font-semibold">Tack! Vi hör av oss inom 24 timmar.</p>
          <p className="mt-2 text-fg-muted">Vi går igenom {result.host} och berättar vad som skulle ge mest effekt.</p>
        </div>
      ) : (
        <>
          <p className="font-display text-xl font-semibold tracking-[-0.015em]">Vill ni ha en personlig genomgång?</p>
          <p className="mt-2 text-fg-muted">
            Vi tittar på er sajt på riktigt och föreslår vad som ger mest effekt först. Gratis och utan krav.
          </p>
          {topIssues.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm">
              {topIssues.map((i) => (
                <li key={i.id} className="flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-highlight" />
                  {i.label}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={submit} className="mt-6 flex flex-col gap-2.5">
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
