"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, X } from "lucide-react";
import type { CheckStatus } from "@/lib/site-audit/analyze";

export function scoreTone(score: number) {
  if (score >= 80) return { ring: "stroke-pine-500", text: "text-pine-700", bar: "bg-pine-600", label: "Bra grund" };
  if (score >= 55) return { ring: "stroke-amber-500", text: "text-amber-700", bar: "bg-amber-500", label: "Går att förbättra" };
  return { ring: "stroke-red-500", text: "text-red-700", bar: "bg-red-500", label: "Mycket att vinna" };
}

export function ScoreRing({
  score,
  size = 144,
  stroke = 10,
  label = "av 100",
  inverse = false,
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string | null;
  inverse?: boolean;
}) {
  const tone = scoreTone(score);
  const r = 60 - stroke / 2 - 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} className={`fill-none ${inverse ? "stroke-white/15" : "stroke-fg/[0.08]"}`} strokeWidth={stroke} />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className={`fill-none ${tone.ring}`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display font-semibold leading-none tracking-[-0.04em] ${inverse ? "text-white" : tone.text}`}
          style={{ fontSize: size * 0.3 }}
        >
          {score}
        </span>
        {label && <span className={`mt-1 text-xs ${inverse ? "text-white/60" : "text-fg-muted"}`}>{label}</span>}
      </div>
    </div>
  );
}

export function StatusIcon({ status, size = "md" }: { status: CheckStatus; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  if (status === "good")
    return (
      <span className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-pine-100 text-pine-800`}>
        <Check size={size === "sm" ? 11 : 13} strokeWidth={3} />
      </span>
    );
  if (status === "warn")
    return (
      <span className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800`}>
        <AlertTriangle size={size === "sm" ? 10 : 12} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800`}>
      <X size={size === "sm" ? 11 : 13} strokeWidth={3} />
    </span>
  );
}

export const impactLabel = { hög: "Stor effekt", medel: "Märkbar effekt", låg: "Liten effekt" } as const;
export const effortLabel = { snabbfix: "Snabbfix", medel: "Några timmar", större: "Större jobb" } as const;

export function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "pine" | "lilac" | "amber" | "red" }) {
  const tones = {
    neutral: "bg-fg/[0.06] text-fg-muted",
    pine: "bg-pine-100 text-pine-800",
    lilac: "bg-lilac-100 text-plum-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
  };
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-label text-fg-subtle">{eyebrow}</p>}
        <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-fg">{title}</h3>
      </div>
      {children}
    </div>
  );
}
