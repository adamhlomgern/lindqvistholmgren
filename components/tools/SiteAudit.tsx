"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  Globe,
  Loader2,
  Mail,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Swords,
  X,
  Zap,
} from "lucide-react";
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

function ScoreRing({ score, small = false }: { score: number; small?: boolean }) {
  const tone = scoreTone(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className={`relative shrink-0 ${small ? "h-24 w-24" : "h-36 w-36"}`}>
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
        <span className={`font-display font-semibold tracking-[-0.04em] ${small ? "text-3xl" : "text-4xl"} ${tone.text}`}>{score}</span>
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

type Audit = { result: AuditResult; token: string };

async function fetchAudit(url: string): Promise<Audit> {
  const response = await fetch("/api/hemsidekollen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Något gick fel.");
  return data as Audit;
}

const sortIssues = (checks: AuditCheck[]) =>
  checks.filter((c) => c.status !== "good").sort((a, b) => b.weight - a.weight || (a.status === "bad" ? -1 : 1));

const rank: Record<AuditCheck["status"], number> = { good: 2, warn: 1, bad: 0 };

const inputClass =
  "h-14 w-full rounded-2xl bg-surface pl-12 pr-4 text-base text-fg shadow-card ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary";

// Hemsidekollen: skriv in en adress (och gärna en konkurrents), få ett betyg
// och konkreta förbättringar på vanlig svenska. Därefter två vägar vidare:
// rapporten som PDF på mejl, eller en personlig genomgång.
export function SiteAudit({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [rivalUrl, setRivalUrl] = useState("");
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [own, setOwn] = useState<Audit | null>(null);
  const [rival, setRival] = useState<AuditResult | null>(null);
  const [rivalError, setRivalError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 900);
    return () => clearInterval(id);
  }, [loading]);

  async function run(event: FormEvent) {
    event.preventDefault();
    const withRival = compare && rivalUrl.trim().length > 0;
    setLoading(true);
    setStep(0);
    setError(null);
    setOwn(null);
    setRival(null);
    setRivalError(null);
    trackConversion({ name: "cta_click", location: withRival ? "hemsidekollen-jamfor" : "hemsidekollen-kor" });
    const [mine, theirs] = await Promise.allSettled([fetchAudit(url), withRival ? fetchAudit(rivalUrl) : Promise.resolve(null)]);
    if (mine.status === "rejected") {
      setError(mine.reason instanceof Error ? mine.reason.message : "Något gick fel.");
    } else {
      setOwn(mine.value);
      if (theirs.status === "fulfilled") setRival(theirs.value?.result ?? null);
      else setRivalError(theirs.reason instanceof Error ? theirs.reason.message : "Något gick fel.");
    }
    setLoading(false);
  }

  const result = own?.result ?? null;
  const issues = result ? sortIssues(result.checks) : [];
  const groups = result ? [...new Set(result.checks.map((c) => c.group))] : [];

  return (
    <div>
      <form onSubmit={run} className="flex flex-col gap-2">
        {/* I mobilen hamnar knappen sist, under konkurrentens adress. */}
        <div className="flex flex-col gap-2 max-sm:contents sm:flex-row">
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
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-medium text-on-primary shadow-card transition-colors hover:bg-primary-hover disabled:opacity-70 max-sm:order-last sm:min-w-[11.5rem]"
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
              className="relative block overflow-hidden sm:mr-[calc(11.5rem+0.5rem)]"
            >
              <span className="sr-only">Konkurrentens adress</span>
              <Swords size={18} className="pointer-events-none absolute left-4 top-[1.75rem] -translate-y-1/2 text-plum-700" />
              <input
                value={rivalUrl}
                onChange={(e) => setRivalUrl(e.target.value)}
                placeholder="En konkurrents adress, t.ex. konkurrenten.se"
                inputMode="url"
                autoFocus
                className={`${inputClass} pr-12 ring-lilac-300`}
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
        <span className="text-fg-subtle">Gratis och utan konto. Tar ungefär tio sekunder.</span>
        {!compare && (
          <button
            type="button"
            onClick={() => setCompare(true)}
            className="inline-flex items-center gap-1.5 font-medium text-plum-700 underline-offset-4 hover:underline"
          >
            <Swords size={14} />
            Jämför med en konkurrent
          </button>
        )}
      </div>

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
        {own && result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {rival ? (
              <Comparison own={result} rival={rival} />
            ) : (
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
                  {rivalError && <p className="mt-3 text-sm text-red-700">Konkurrenten gick inte att kolla: {rivalError}</p>}
                </div>
              </div>
            )}

            <ReportForm audit={own} />

            <div className={`mt-4 grid gap-4 ${compact ? "" : "lg:grid-cols-[1.2fr_1fr]"}`}>
              <div className="rounded-3xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
                <p className="mb-5 font-display text-lg font-semibold tracking-[-0.01em] text-fg">Alla kontroller för {result.host}</p>
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
              <AuditLead result={result} rival={rival} topIssues={issues.slice(0, 3)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ni mot konkurrenten: två betyg och varje kontroll sida vid sida. Rader där
// konkurrenten är bättre markeras, det är där det svider (och säljer).
function Comparison({ own, rival }: { own: AuditResult; rival: AuditResult }) {
  const diff = own.score - rival.score;
  const rivalChecks = new Map(rival.checks.map((c) => [c.id, c]));
  const behind = own.checks.filter((c) => {
    const r = rivalChecks.get(c.id);
    return r && rank[r.status] > rank[c.status];
  }).length;
  const ahead = own.checks.filter((c) => {
    const r = rivalChecks.get(c.id);
    return r && rank[r.status] < rank[c.status];
  }).length;

  const headline =
    diff > 0
      ? `Ni ligger ${diff} poäng före ${rival.host}.`
      : diff < 0
        ? `${rival.host} ligger ${-diff} poäng före er.`
        : `Ni ligger på samma nivå som ${rival.host}.`;

  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
      <div className="p-6 sm:p-8">
        <p className="text-sm text-fg-muted">Jämförelse</p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-fg">{headline}</p>
        <p className="mt-1 text-sm text-fg-muted">
          {behind > 0 ? `Konkurrenten är bättre på ${behind} ${behind === 1 ? "punkt" : "punkter"}` : "Konkurrenten är inte bättre på någon punkt"}
          {ahead > 0 ? `, ni är bättre på ${ahead}.` : "."}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { label: "Ni", r: own, chip: "bg-pine-100 text-pine-800" },
            { label: "Konkurrenten", r: rival, chip: "bg-lilac-100 text-plum-800" },
          ].map(({ label, r, chip }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-2xl bg-surface-sunken p-4 text-center ring-1 ring-line sm:flex-row sm:text-left">
              <ScoreRing score={r.score} small />
              <div className="min-w-0">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${chip}`}>{label}</span>
                <p className="mt-1.5 truncate font-display text-lg font-semibold text-fg">{r.host}</p>
                <p className={`text-sm font-medium ${scoreTone(r.score).text}`}>{scoreTone(r.score).label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-y border-line bg-surface-sunken text-left text-xs uppercase tracking-label text-fg-subtle">
            <th className="px-6 py-2.5 font-semibold sm:px-8">Kontroll</th>
            <th className="w-16 px-2 py-2.5 text-center font-semibold sm:w-28">Ni</th>
            <th className="w-16 px-2 py-2.5 pr-6 text-center font-semibold sm:w-32 sm:pr-8">
              <span className="sm:hidden">Konk.</span>
              <span className="hidden sm:inline">Konkurrent</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {own.checks.map((c) => {
            const r = rivalChecks.get(c.id);
            const worse = r && rank[r.status] > rank[c.status];
            return (
              <tr key={c.id} className={`border-b border-line last:border-0 ${worse ? "bg-lilac-50" : ""}`}>
                <td className="px-6 py-2.5 sm:px-8">
                  <span className="text-fg">{c.label}</span>
                  {worse && <span className="ml-2 hidden text-xs font-medium text-plum-700 sm:inline">Konkurrenten är bättre</span>}
                </td>
                <td className="px-2 py-2.5">
                  <span className="flex justify-center">
                    <StatusIcon status={c.status} />
                  </span>
                </td>
                <td className="px-2 py-2.5 pr-6 sm:pr-8">
                  <span className="flex justify-center">{r ? <StatusIcon status={r.status} /> : "–"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// "Få rapporten som PDF": låg tröskel — bara e-post. Servern verifierar att
// resultatet är vårt eget (token) och sparar adressen som ett lead.
function ReportForm({ audit }: { audit: Audit }) {
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
        body: JSON.stringify({ result: audit.result, token: audit.token, email: email.trim(), website }),
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
    <div className="mt-4 flex flex-col gap-4 rounded-3xl bg-lilac-50 p-5 ring-1 ring-lilac-200 sm:p-6 lg:flex-row lg:items-center">
      <div className="flex items-center gap-4 lg:flex-1">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-plum-700 shadow-card ring-1 ring-lilac-200">
          <FileText size={22} />
        </span>
        <div>
          <p className="font-medium text-fg">Få rapporten som PDF</p>
          <p className="text-sm text-fg-muted">Spara den eller skicka vidare till den som sköter sajten.</p>
        </div>
      </div>
      {state === "done" ? (
        <p className="flex items-center gap-2 font-medium text-pine-800">
          <Check size={18} strokeWidth={2.5} />
          Skickad! Kolla inkorgen om en minut.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row lg:w-[27rem]">
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
          <label className="relative flex-1">
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
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-fg px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {state === "sending" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Mejla rapporten
          </button>
        </form>
      )}
      {error && <p className="text-sm text-red-700 lg:basis-full">{error}</p>}
    </div>
  );
}

function AuditLead({ result, rival, topIssues }: { result: AuditResult; rival: AuditResult | null; topIssues: AuditCheck[] }) {
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
          description: `Hemsidekollen: ${result.url} fick ${result.score}/100. Vill ha en personlig genomgång.${rival ? `\nJämförde med ${rival.url} (${rival.score}/100).` : ""}\n\nViktigast att förbättra:\n${summary}`,
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
