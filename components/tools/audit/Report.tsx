"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDown,
  BarChart3,
  Blocks,
  ChevronDown,
  Code2,
  Cookie,
  FileText,
  Gauge,
  Globe,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Link2,
  MessageCircle,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Type,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { actionPlan, type AuditCheck, type AuditResult, type CategoryId } from "@/lib/site-audit/analyze";
import type { Tech, TechKind } from "@/lib/site-audit/tech";
import { versionBelow } from "@/lib/site-audit/tech";
import { Chip, effortLabel, impactLabel, ScoreRing, SectionTitle, StatusIcon, scoreTone } from "@/components/tools/audit/ui";

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  speed: Zap,
  seo: Search,
  mobile: Smartphone,
  trust: Users,
  security: ShieldCheck,
  access: Sparkles,
};

const sv = (n: number) => n.toLocaleString("sv-SE");

// ---- Toppen: betyg + kategorier -----------------------------------------

export function ReportHero({ result }: { result: AuditResult }) {
  const tone = scoreTone(result.score);
  const issues = result.checks.filter((c) => c.status !== "good").length;
  const date = new Date(result.checkedAt).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="tone-pine relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lilac-300/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-pine-400/20 blur-3xl" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <ScoreRing score={result.score} size={150} stroke={11} inverse />
          <div className="min-w-0">
            <p className="text-sm text-fg-muted">Hemsidekollen · {date}</p>
            <p className="mt-1 break-words font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{result.host}</p>
            <p className={`mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold ${tone.text}`}>{tone.label}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
              {result.checks.length} kontroller, {issues} att förbättra. {result.summary}
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {result.categories.map((cat, i) => {
            const Icon = categoryIcons[cat.id];
            const t = scoreTone(cat.score);
            return (
              <li key={cat.id}>
                <a
                  href={`#kat-${cat.id}`}
                  className="group block rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={17} className="text-highlight" />
                    <span className="font-display text-2xl font-semibold tracking-[-0.03em]">{cat.score}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-tight">{cat.label}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className={`h-full rounded-full ${t.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-fg-muted">{cat.issues === 0 ? "Inget att anmärka" : `${cat.issues} att förbättra`}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function FactsStrip({ result }: { result: AuditResult }) {
  const secs = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
  const facts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Server, label: "Serverns svar", value: secs(result.ttfbMs) },
    { icon: Gauge, label: "Hämtad på", value: secs(result.responseMs) },
    { icon: FileText, label: "Sidans kod", value: `${sv(result.sizeKb)} kB` },
    { icon: Type, label: "Ord på sidan", value: sv(result.facts.words) },
    { icon: ImageIcon, label: "Bilder", value: sv(result.facts.images) },
    { icon: Code2, label: "Skript", value: sv(result.facts.scripts) },
    { icon: Globe, label: "Externa tjänster", value: sv(result.facts.thirdParties.length) },
    { icon: Layers, label: "Byggd med", value: result.platform ?? "Okänt" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line shadow-card ring-1 ring-line sm:grid-cols-4">
      {facts.map((f) => (
        <li key={f.label} className="bg-surface px-4 py-4 sm:px-5">
          <p className="flex items-center gap-1.5 text-xs text-fg-muted">
            <f.icon size={13} />
            {f.label}
          </p>
          <p className="mt-1 truncate font-display text-xl font-semibold tracking-[-0.02em] text-fg">{f.value}</p>
        </li>
      ))}
    </ul>
  );
}

// ---- Åtgärdsplan ---------------------------------------------------------

export function ActionPlan({ result }: { result: AuditResult }) {
  const { quickWins, rest } = actionPlan(result);
  const [showAll, setShowAll] = useState(false);
  if (quickWins.length + rest.length === 0)
    return (
      <div className="rounded-3xl bg-surface p-8 text-center shadow-card ring-1 ring-line">
        <p className="font-display text-2xl font-semibold text-fg">Inget att anmärka på. Snyggt!</p>
        <p className="mt-2 text-fg-muted">Sajten klarar alla våra kontroller.</p>
      </div>
    );
  const later = showAll ? rest : rest.slice(0, 5);
  return (
    <section>
      <SectionTitle eyebrow="Er åtgärdsplan" title="Gör det här först" />
      {quickWins.length > 0 && (
        <ol className="grid gap-3 md:grid-cols-2">
          {quickWins.map((c, i) => (
            <li key={c.id} className={i === 0 && quickWins.length % 2 === 1 ? "md:col-span-2" : ""}>
              <a href={`#check-${c.id}`} className="group flex h-full gap-4 rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-raised">
                <span className="font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-lilac-300">{i + 1}</span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <Chip tone={c.impact === "hög" ? "pine" : "neutral"}>{impactLabel[c.impact]}</Chip>
                    <Chip tone="lilac">{effortLabel[c.effort]}</Chip>
                  </span>
                  <span className="mt-2 block font-medium text-fg">{c.label}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-fg-muted">{c.fix[0] ?? c.detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
      {rest.length > 0 && (
        <div className="mt-4 rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line sm:p-6">
          <p className="text-sm font-semibold text-fg">Därefter</p>
          <ul className="mt-3 divide-y divide-line">
            {later.map((c) => (
              <li key={c.id}>
                <a href={`#check-${c.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:text-fg">
                  <StatusIcon status={c.status} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-fg">{c.label}</span>
                  <span className="hidden sm:inline">
                    <Chip>{impactLabel[c.impact]}</Chip>
                  </span>
                  <Chip tone="lilac">{effortLabel[c.effort]}</Chip>
                </a>
              </li>
            ))}
          </ul>
          {rest.length > 5 && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 text-sm font-medium text-plum-700 hover:underline">
              {showAll ? "Visa färre" : `Visa alla ${rest.length}`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// ---- Förhandsvisningar ----------------------------------------------------

export function Previews({ result }: { result: AuditResult }) {
  const f = result.facts;
  const path = new URL(result.url).pathname.replace(/\/$/, "");
  const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()} …` : s);
  const shareTitle = f.ogTitle || f.title || result.host;
  const shareText = f.ogDescription || f.description;
  return (
    <section>
      <SectionTitle eyebrow="Så ser ni ut utåt" title="I sökresultatet och när länken delas" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line sm:p-6">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-fg-subtle">
            <Search size={13} />
            Sökresultat
          </p>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-100 ring-1 ring-ink-100">
                {f.favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element -- extern favicon från den kollade sajten
                  <img src={f.favicon} alt="" className="h-4 w-4" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <Globe size={13} className="text-ink-500" />
                )}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[13px] text-ink-900">{result.host}</span>
                <span className="block truncate text-xs text-ink-500">
                  {new URL(result.url).origin}
                  {path ? ` › ${path.split("/").filter(Boolean).join(" › ")}` : ""}
                </span>
              </span>
            </div>
            <p className="mt-2 text-[19px] leading-snug text-[#1a0dab]">{f.title ? cut(f.title, 60) : <span className="text-red-600">Titel saknas</span>}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-700">
              {f.description ? cut(f.description, 158) : <span className="italic text-ink-500">Ingen beskrivning, så Google väljer en textbit från sidan själv.</span>}
            </p>
          </div>
          <PreviewNote checks={result.checks} ids={["title", "description"]} />
        </div>
        <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line sm:p-6">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-fg-subtle">
            <MessageCircle size={13} />
            Delad länk
          </p>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
            <div className="relative aspect-[1.91/1] bg-ink-100">
              {f.ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- extern delningsbild från den kollade sajten
                <img src={f.ogImage} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-500">
                  <ImageIcon size={28} strokeWidth={1.5} />
                  <span className="text-sm">Ingen delningsbild</span>
                </div>
              )}
            </div>
            <div className="border-t border-ink-100 bg-ink-50 px-4 py-3">
              <p className="truncate text-[11px] uppercase tracking-wide text-ink-500">{result.host}</p>
              <p className="mt-0.5 line-clamp-1 text-[15px] font-semibold text-ink-900">{shareTitle}</p>
              {shareText && <p className="line-clamp-1 text-[13px] text-ink-600">{shareText}</p>}
            </div>
          </div>
          <PreviewNote checks={result.checks} ids={["social"]} />
        </div>
      </div>
    </section>
  );
}

function PreviewNote({ checks, ids }: { checks: AuditCheck[]; ids: string[] }) {
  const open = checks.filter((c) => ids.includes(c.id) && c.status !== "good");
  if (!open.length) return <p className="mt-3 flex items-center gap-2 text-sm text-pine-800"><StatusIcon status="good" size="sm" />Ser bra ut.</p>;
  return (
    <ul className="mt-3 space-y-1.5">
      {open.map((c) => (
        <li key={c.id} className="flex items-start gap-2 text-sm text-fg-muted">
          <StatusIcon status={c.status} size="sm" />
          {c.detail}
        </li>
      ))}
    </ul>
  );
}

// ---- Teknik ----------------------------------------------------------------

const kindIcons: Record<TechKind, LucideIcon> = {
  Plattform: Layers,
  Tillägg: Blocks,
  Analys: BarChart3,
  Marknadsföring: Sparkles,
  Samtycke: Cookie,
  Chatt: MessageCircle,
  Typsnitt: Type,
  Drift: Server,
  Bibliotek: Code2,
  Övrigt: Link2,
};

function outdated(t: Tech) {
  if (!t.version) return false;
  if (t.name === "jQuery") return versionBelow(t.version, "3.5");
  if (t.name === "PHP") return versionBelow(t.version, "8.2");
  if (t.name === "WordPress") return versionBelow(t.version, "6.0");
  return false;
}

export function TechStack({ result }: { result: AuditResult }) {
  if (!result.tech.length) return null;
  const kinds = [...new Set(result.tech.map((t) => t.kind))];
  return (
    <section>
      <SectionTitle eyebrow="Under huven" title="Det här kör sajten på" />
      <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line sm:p-6">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {kinds.map((kind) => {
            const Icon = kindIcons[kind];
            return (
              <div key={kind} className="flex gap-3">
                <dt className="flex w-32 shrink-0 items-center gap-2 text-sm text-fg-muted">
                  <Icon size={15} />
                  {kind}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {result.tech
                    .filter((t) => t.kind === kind)
                    .map((t) => (
                      <span
                        key={t.name}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium ring-1 ${
                          outdated(t) ? "bg-red-50 text-red-800 ring-red-200" : "bg-surface-sunken text-fg ring-line"
                        }`}
                      >
                        {t.name}
                        {t.version && <span className="font-normal opacity-70">{t.version}</span>}
                        {outdated(t) && <span className="text-[11px] font-semibold">· gammal</span>}
                      </span>
                    ))}
                </dd>
              </div>
            );
          })}
        </dl>
        {result.platform && (
          <p className="mt-5 flex items-start gap-2 rounded-2xl bg-lilac-50 px-4 py-3 text-sm text-plum-900 ring-1 ring-lilac-200">
            <Lightbulb size={16} className="mt-0.5 shrink-0" />
            Sajten verkar byggd med {result.platform}. Förslagen nedan är anpassade efter det där det går.
          </p>
        )}
      </div>
    </section>
  );
}

// ---- Alla kontroller -------------------------------------------------------

const statusOrder = { bad: 0, warn: 1, good: 2 } as const;

export function AllChecks({ result }: { result: AuditResult }) {
  const [onlyIssues, setOnlyIssues] = useState(false);
  return (
    <section>
      <SectionTitle eyebrow="Detaljerna" title={`Alla ${result.checks.length} kontroller`}>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
          <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />
          Visa bara det som kan bli bättre
        </label>
      </SectionTitle>
      <div className="space-y-4">
        {result.categories.map((cat) => {
          const Icon = categoryIcons[cat.id];
          const checks = result.checks
            .filter((c) => c.category === cat.id && (!onlyIssues || c.status !== "good"))
            .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.weight - a.weight);
          if (!checks.length) return null;
          const t = scoreTone(cat.score);
          return (
            <div key={cat.id} id={`kat-${cat.id}`} className="scroll-mt-24 overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
              <div className="flex items-center gap-4 border-b border-line px-5 py-4 sm:px-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700 ring-1 ring-pine-100">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold tracking-[-0.01em] text-fg">{cat.label}</p>
                  <p className="text-sm text-fg-muted">{cat.issues === 0 ? "Allt ser bra ut" : `${cat.issues} att förbättra`}</p>
                </div>
                <div className="hidden w-28 sm:block">
                  <div className="h-1.5 overflow-hidden rounded-full bg-fg/[0.08]">
                    <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
                <span className={`font-display text-2xl font-semibold tracking-[-0.03em] ${t.text}`}>{cat.score}</span>
              </div>
              <ul className="divide-y divide-line">
                {checks.map((c) => (
                  <CheckRow key={c.id} check={c} platform={result.platform} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CheckRow({ check: c, platform }: { check: AuditCheck; platform: string | null }) {
  const [open, setOpen] = useState(c.status === "bad");
  return (
    <li id={`check-${c.id}`} className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-fg/[0.02] sm:px-6"
      >
        <StatusIcon status={c.status} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-medium text-fg">{c.label}</span>
            {c.value && <span className="rounded-md bg-fg/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">{c.value}</span>}
            {c.status !== "good" && c.impact === "hög" && <Chip tone="pine">Stor effekt</Chip>}
          </span>
          <span className="mt-0.5 block text-sm leading-relaxed text-fg-muted">{c.detail}</span>
        </span>
        <ChevronDown size={17} className={`mt-1 shrink-0 text-fg-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid gap-4 px-5 pb-5 pl-14 sm:grid-cols-2 sm:px-6 sm:pl-[3.75rem]">
          <div className="rounded-2xl bg-surface-sunken p-4 ring-1 ring-line">
            <p className="text-xs font-semibold uppercase tracking-label text-fg-subtle">Varför det spelar roll</p>
            <p className="mt-1.5 text-sm leading-relaxed text-fg">{c.why}</p>
          </div>
          {c.fix.length > 0 ? (
            <div className="rounded-2xl bg-lilac-50 p-4 ring-1 ring-lilac-200">
              <p className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-label text-plum-700">
                Så fixar ni det
                <span className="font-medium normal-case tracking-normal text-plum-700/80">
                  {effortLabel[c.effort]}
                  {platform ? ` · ${platform}` : ""}
                </span>
              </p>
              <ol className="mt-2 space-y-1.5">
                {c.fix.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg">
                    <span className="font-display font-semibold text-plum-700">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-pine-50 p-4 text-sm text-pine-900 ring-1 ring-pine-100">
              <StatusIcon status="good" size="sm" />
              Inget att göra här.
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export function JumpToChecks() {
  return (
    <a href="#kat-speed" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg">
      Alla detaljer
      <ArrowDown size={14} />
    </a>
  );
}
