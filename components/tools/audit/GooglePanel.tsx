"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, RefreshCw, Smartphone, Users } from "lucide-react";
import type { GoogleMetric, GoogleResult, MetricStatus } from "@/lib/site-audit/pagespeed";
import { ScoreRing, SectionTitle } from "@/components/tools/audit/ui";

export type GoogleState =
  | { status: "loading" }
  | { status: "done"; data: GoogleResult; token: string }
  | { status: "error"; error: string };

const statusStyle: Record<MetricStatus, { dot: string; text: string; label: string }> = {
  good: { dot: "bg-pine-500", text: "text-pine-700", label: "Bra" },
  warn: { dot: "bg-amber-500", text: "text-amber-700", label: "Kan bli bättre" },
  bad: { dot: "bg-red-500", text: "text-red-700", label: "Långsamt" },
};

const loadingSteps = ["Google startar en mobil", "Laddar er sajt över 4G", "Filmar hur sidan växer fram", "Mäter Core Web Vitals", "Räknar ihop"];

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[210px] shrink-0 rounded-[2.2rem] bg-ink-900 p-2 shadow-pop ring-1 ring-ink-700">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white" style={{ aspectRatio: "412 / 823" }}>
        <span className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-ink-900" aria-hidden />
        {children}
      </div>
    </div>
  );
}

function Metric({ m }: { m: GoogleMetric }) {
  const s = statusStyle[m.status];
  return (
    <li className="rounded-2xl bg-surface-sunken p-4 ring-1 ring-line" title={m.hint}>
      <p className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
        {m.label}
      </p>
      <p className={`mt-1 font-display text-2xl font-semibold tracking-[-0.03em] ${s.text}`}>{m.value}</p>
      <p className="mt-0.5 text-xs leading-snug text-fg-subtle">{m.hint}</p>
    </li>
  );
}

// Googles mätning: prestandabetyg, Core Web Vitals, filmremsa och skärmdump
// i mobilen. Hämtas separat eftersom den tar 15–40 sekunder.
export function GooglePanel({ state, onRetry }: { state: GoogleState; onRetry: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (state.status !== "loading") return;
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => {
      clearInterval(id);
      setElapsed(0);
    };
  }, [state.status]);

  return (
    <section>
      <SectionTitle eyebrow="Googles egen mätning" title="Så upplevs sajten i en mobil" />
      <div className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
        {state.status === "loading" && (
          <div className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr]">
            <Phone>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-ink-100 to-ink-50" />
              <div className="absolute inset-x-4 top-12 space-y-3">
                {[70, 90, 55, 100, 80].map((w, i) => (
                  <motion.div
                    key={i}
                    className="h-3 rounded bg-ink-200"
                    style={{ width: `${w}%` }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </Phone>
            <div>
              <p className="flex items-center gap-2 font-medium text-fg">
                <Loader2 size={18} className="animate-spin text-primary" />
                {loadingSteps[Math.min(Math.floor(elapsed / 6), loadingSteps.length - 1)]} …
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                Google laddar er sajt i en simulerad mobil på 4G och mäter samma saker som påverkar er placering i sökresultaten.
                Det tar oftast 20–40 sekunder. Resten av rapporten kan ni läsa under tiden.
              </p>
              <div className="mt-5 h-1.5 max-w-md overflow-hidden rounded-full bg-fg/[0.08]">
                <div className="h-full rounded-full bg-primary transition-[width] duration-1000" style={{ width: `${Math.min(95, (elapsed / 40) * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs tabular-nums text-fg-subtle">{elapsed} s</p>
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-medium text-fg">Googles mätning gick inte att hämta</p>
              <p className="mt-1 text-sm text-fg-muted">{state.error} Vår egen genomgång ovan och nedan påverkas inte.</p>
            </div>
            <button type="button" onClick={onRetry} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-canvas">
              <RefreshCw size={14} />
              Försök igen
            </button>
          </div>
        )}

        {state.status === "done" && <GoogleResultView g={state.data} />}
      </div>
    </section>
  );
}

function GoogleResultView({ g }: { g: GoogleResult }) {
  return (
    <div>
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Phone>
            {g.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element -- skärmdump från Google (data-URI)
              <img src={g.screenshot} alt="Skärmdump av sajten i mobilen" className="h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-400">
                <Smartphone size={32} />
              </div>
            )}
          </Phone>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-5">
            <ScoreRing score={g.performance} size={104} stroke={10} label="av 100" />
            <div>
              <p className="font-display text-xl font-semibold tracking-[-0.02em] text-fg">Prestanda i mobilen</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-fg-muted">
                Googles betyg för hur snabb och stabil sajten är på en vanlig mobil. 90+ är bra, under 50 är långsamt.
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {g.metrics.map((m) => (
              <Metric key={m.id} m={m} />
            ))}
          </ul>
        </div>
      </div>

      {g.filmstrip.length > 0 && (
        <div className="border-t border-line bg-surface-sunken px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold text-fg">Så växer sidan fram</p>
          <p className="text-sm text-fg-muted">Bilder från laddningen, sekund för sekund.</p>
          <ol className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {g.filmstrip.map((f, i) => (
              <li key={i} className="shrink-0 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- filmremsa från Google (data-URI) */}
                <img src={f.data} alt="" className="h-36 w-auto rounded-lg bg-white shadow-card ring-1 ring-line" />
                <span className="mt-1.5 block text-xs tabular-nums text-fg-muted">{(f.ms / 1000).toFixed(1).replace(".", ",")} s</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
        <div className="bg-surface p-6 sm:p-8">
          <p className="text-sm font-semibold text-fg">Störst vinst enligt Google</p>
          {g.opportunities.length ? (
            <ol className="mt-3 space-y-2.5">
              {g.opportunities.map((o, i) => (
                <li key={i} className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex gap-2 text-fg">
                    <span className="font-display font-semibold text-plum-700">{i + 1}.</span>
                    {o.title}
                  </span>
                  {o.saving && <span className="shrink-0 rounded-full bg-pine-50 px-2 py-0.5 text-xs font-medium text-pine-800 ring-1 ring-pine-100">{o.saving}</span>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-fg-muted">Google hittar inget stort att vinna. Bra!</p>
          )}
        </div>
        <div className="bg-surface p-6 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Users size={15} />
            Riktiga besökare
          </p>
          {g.field ? (
            <>
              <p className="mt-1 text-sm text-fg-muted">
                Från Chrome-användare de senaste 28 dagarna ({g.field.scope}).
                {g.field.overall && ` Helhet: ${statusStyle[g.field.overall].label.toLowerCase()}.`}
              </p>
              <ul className="mt-3 space-y-2">
                {g.field.metrics.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-fg">
                      <span className={`h-2 w-2 rounded-full ${statusStyle[m.status].dot}`} />
                      {m.label}
                    </span>
                    <span className={`font-medium tabular-nums ${statusStyle[m.status].text}`}>{m.value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Sajten har för få besökare för att Google ska visa data från riktiga användare. Mätningen ovan är en simulering.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
