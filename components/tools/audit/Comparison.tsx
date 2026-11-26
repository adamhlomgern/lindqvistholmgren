"use client";

import type { AuditResult, CheckStatus } from "@/lib/site-audit/analyze";
import { ScoreRing, SectionTitle, StatusIcon, scoreTone } from "@/components/tools/audit/ui";

const rank: Record<CheckStatus, number> = { good: 2, warn: 1, bad: 0 };

// Ni mot konkurrenten: totalbetyg, varje kategori sida vid sida och de
// punkter där konkurrenten är bättre (det är där det svider, och säljer).
export function Comparison({ own, rival }: { own: AuditResult; rival: AuditResult }) {
  const diff = own.score - rival.score;
  const rivalChecks = new Map(rival.checks.map((c) => [c.id, c]));
  const behind = own.checks.filter((c) => {
    const r = rivalChecks.get(c.id);
    return r && rank[r.status] > rank[c.status];
  });
  const ahead = own.checks.filter((c) => {
    const r = rivalChecks.get(c.id);
    return r && rank[r.status] < rank[c.status];
  });
  const headline =
    diff > 0 ? `Ni ligger ${diff} poäng före ${rival.host}.` : diff < 0 ? `${rival.host} ligger ${-diff} poäng före er.` : `Ni ligger lika med ${rival.host}.`;

  return (
    <section>
      <SectionTitle eyebrow="Jämförelse" title={headline} />
      <div className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
        <div className="grid grid-cols-2 gap-px bg-line">
          {[
            { label: "Ni", r: own, chip: "bg-pine-100 text-pine-800" },
            { label: "Konkurrenten", r: rival, chip: "bg-lilac-100 text-plum-800" },
          ].map(({ label, r, chip }) => (
            <div key={label} className="flex flex-col items-center gap-3 bg-surface p-5 text-center sm:flex-row sm:p-6 sm:text-left">
              <ScoreRing score={r.score} size={92} stroke={10} />
              <div className="min-w-0">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${chip}`}>{label}</span>
                <p className="mt-1.5 truncate font-display text-lg font-semibold text-fg">{r.host}</p>
                <p className={`text-sm font-medium ${scoreTone(r.score).text}`}>{scoreTone(r.score).label}</p>
              </div>
            </div>
          ))}
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {own.categories.map((cat) => {
            const theirs = rival.categories.find((c) => c.id === cat.id)?.score ?? 0;
            return (
              <li key={cat.id} className="grid grid-cols-[7rem_1fr] items-center gap-3 px-5 py-3 text-sm sm:grid-cols-[11rem_1fr] sm:px-6">
                <span className="truncate text-fg">{cat.label}</span>
                <span className="space-y-1">
                  {[
                    { v: cat.score, cls: "bg-pine-600" },
                    { v: theirs, cls: "bg-lilac-400" },
                  ].map((b, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-fg/[0.06]">
                        <span className={`block h-full rounded-full ${b.cls}`} style={{ width: `${b.v}%` }} />
                      </span>
                      <span className="w-7 text-right text-xs font-medium tabular-nums text-fg-muted">{b.v}</span>
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
          <div className="bg-surface p-5 sm:p-6">
            <p className="text-sm font-semibold text-fg">Där konkurrenten är bättre ({behind.length})</p>
            <ul className="mt-3 space-y-2">
              {behind.length === 0 && <li className="text-sm text-fg-muted">Ingenstans. Snyggt!</li>}
              {behind.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <StatusIcon status={c.status} size="sm" />
                  <span className="flex-1 text-fg">{c.label}</span>
                  <span className="text-xs text-fg-muted">hos dem</span>
                  <StatusIcon status={rivalChecks.get(c.id)!.status} size="sm" />
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface p-5 sm:p-6">
            <p className="text-sm font-semibold text-fg">Där ni är bättre ({ahead.length})</p>
            <ul className="mt-3 space-y-2">
              {ahead.length === 0 && <li className="text-sm text-fg-muted">Inga punkter ännu.</li>}
              {ahead.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <StatusIcon status={c.status} size="sm" />
                  <span className="flex-1 text-fg">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="flex items-center gap-4 border-t border-line px-5 py-3 text-xs text-fg-muted sm:px-6">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-pine-600" />
            {own.host}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-lilac-400" />
            {rival.host}
          </span>
        </p>
      </div>
    </section>
  );
}
