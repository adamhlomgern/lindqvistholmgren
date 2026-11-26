"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Globe, Loader2, Search, ShieldCheck, Swords, Users, X, Zap } from "lucide-react";
import { trackConversion } from "@/lib/analytics";
import type { AuditResult } from "@/lib/site-audit/analyze";
import { ActionPlan, AllChecks, FactsStrip, Previews, ReportHero, TechStack } from "@/components/tools/audit/Report";
import { GooglePanel, type GoogleState } from "@/components/tools/audit/GooglePanel";
import { Comparison } from "@/components/tools/audit/Comparison";
import { AuditLead, ReportForm, type SignedAudit } from "@/components/tools/audit/Sidebar";

const checkedAreas = [
  { icon: Zap, title: "Hastighet", text: "Svarstid, bilder, skript och Googles mätning i mobilen" },
  { icon: Search, title: "Google", text: "Titel, beskrivning, sitemap, indexering och strukturerad data" },
  { icon: Users, title: "Förtroende", text: "Kontaktvägar, knappar, omdömen och cookie-samtycke" },
  { icon: ShieldCheck, title: "Säkerhet", text: "HTTPS, säkerhetsinställningar och gammal programvara" },
];

const steps = ["Hämtar sajten", "Mäter svarstiden", "Läser koden", "Kollar Google", "Kollar säkerheten", "Känner igen tekniken", "Skriver rapporten"];

const inputClass =
  "h-14 w-full rounded-2xl bg-surface pl-12 pr-4 text-base text-fg shadow-card ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary";

async function fetchAudit(url: string): Promise<SignedAudit> {
  const response = await fetch("/api/hemsidekollen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Något gick fel.");
  return data as SignedAudit;
}

// Hemsidekollen: skriv in en adress (och gärna en konkurrents) och få en
// utförlig rapport: betyg per kategori, åtgärdsplan, Googles mätning i
// mobilen, förhandsvisningar, teknik och ~40 kontroller med "så fixar ni det".
export function SiteAudit() {
  const [url, setUrl] = useState("");
  const [rivalUrl, setRivalUrl] = useState("");
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [own, setOwn] = useState<SignedAudit | null>(null);
  const [rival, setRival] = useState<AuditResult | null>(null);
  const [rivalError, setRivalError] = useState<string | null>(null);
  const [google, setGoogle] = useState<GoogleState | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1100);
    return () => clearInterval(id);
  }, [loading]);

  const runGoogle = useCallback(async (target: string) => {
    setGoogle({ status: "loading" });
    try {
      const response = await fetch("/api/hemsidekollen/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? "Googles mätning gick inte att hämta just nu.");
      setGoogle({ status: "done", data: data.google, token: data.token });
    } catch (e) {
      setGoogle({ status: "error", error: e instanceof Error ? e.message : "Något gick fel." });
    }
  }, []);

  async function run(event: FormEvent) {
    event.preventDefault();
    const withRival = compare && rivalUrl.trim().length > 0;
    setLoading(true);
    setStep(0);
    setError(null);
    setOwn(null);
    setRival(null);
    setRivalError(null);
    setGoogle(null);
    trackConversion({ name: "cta_click", location: withRival ? "hemsidekollen-jamfor" : "hemsidekollen-kor" });
    const [mine, theirs] = await Promise.allSettled([fetchAudit(url), withRival ? fetchAudit(rivalUrl) : Promise.resolve(null)]);
    if (mine.status === "rejected") {
      setError(mine.reason instanceof Error ? mine.reason.message : "Något gick fel.");
    } else {
      setOwn(mine.value);
      if (theirs.status === "fulfilled") setRival(theirs.value?.result ?? null);
      else setRivalError(theirs.reason instanceof Error ? theirs.reason.message : "Något gick fel.");
      void runGoogle(mine.value.result.url);
    }
    setLoading(false);
  }

  const result = own?.result ?? null;
  const signedGoogle = google?.status === "done" ? { data: google.data, token: google.token } : null;

  return (
    <div>
      <form onSubmit={run} className="flex flex-col gap-2">
        {/* I mobilen hamnar knappen sist, under konkurrentens adress. */}
        <div className="flex flex-col gap-2 max-sm:contents sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Er hemsidas adress</span>
            <Globe size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="ertforetag.se" inputMode="url" autoComplete="url" required className={inputClass} />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-medium text-on-primary shadow-card transition-colors hover:bg-primary-hover disabled:opacity-70 max-sm:order-last sm:min-w-[12.5rem]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? steps[step] : compare && rivalUrl.trim() ? "Jämför sajterna" : "Kolla sajten"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {compare && (
            <motion.label
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative block overflow-hidden sm:mr-[calc(12.5rem+0.5rem)]"
            >
              <span className="sr-only">Konkurrentens adress</span>
              <Swords size={18} className="pointer-events-none absolute left-4 top-[1.75rem] -translate-y-1/2 text-plum-700" />
              <input
                value={rivalUrl}
                onChange={(e) => setRivalUrl(e.target.value)}
                placeholder="En konkurrents adress, t.ex. konkurrenten.se"
                inputMode="url"
                autoFocus
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => {
                  setCompare(false);
                  setRivalUrl("");
                }}
                aria-label="Ta bort jämförelsen"
                className="absolute right-3 top-[1.75rem] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle hover:bg-fg/5 hover:text-fg"
              >
                <X size={16} />
              </button>
            </motion.label>
          )}
        </AnimatePresence>
      </form>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-fg-subtle">Gratis och utan konto. Ett 40-tal kontroller plus Googles egen mätning.</span>
        {!compare && (
          <button type="button" onClick={() => setCompare(true)} className="inline-flex items-center gap-1.5 font-medium text-plum-700 underline-offset-4 hover:underline">
            <Swords size={14} />
            Jämför med en konkurrent
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">{error}</p>}

      {!result && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {checkedAreas.map((area, i) => {
            const done = loading && i <= step - 2;
            return (
              <li key={area.title} className={`rounded-2xl bg-surface p-5 ring-1 ring-line transition-all duration-300 ${done ? "shadow-raised ring-primary/40" : "shadow-card"}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700 ring-1 ring-pine-100">
                  {done ? <Check size={18} strokeWidth={2.5} /> : <area.icon size={18} />}
                </span>
                <p className="mt-4 font-medium text-fg">{area.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{area.text}</p>
              </li>
            );
          })}
        </ul>
      )}

      {own && result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="mt-8 space-y-4">
          <ReportHero result={result} />
          <FactsStrip result={result} />
          {rivalError && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">Konkurrenten gick inte att kolla: {rivalError}</p>}

          <div className="grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
            <div className="min-w-0 space-y-12">
              {rival && <Comparison own={result} rival={rival} />}
              <ActionPlan result={result} />
              {/* I mobilen kommer erbjudandena direkt efter åtgärdsplanen. */}
              <div className="space-y-4 lg:hidden">
                <ReportForm audit={own} google={signedGoogle} />
                <AuditLead result={result} rival={rival} />
              </div>
              {google && <GooglePanel state={google} onRetry={() => runGoogle(result.url)} />}
              <Previews result={result} />
              <TechStack result={result} />
              <AllChecks result={result} />
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <ReportForm audit={own} google={signedGoogle} />
                <AuditLead result={result} rival={rival} />
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </div>
  );
}
