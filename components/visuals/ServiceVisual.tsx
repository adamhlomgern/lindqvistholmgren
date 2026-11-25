"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { BadgeCheck, Bell, Check, Gauge, Search, ShieldCheck, TrendingUp } from "lucide-react";

// Kodade illustrationer, en per tjänst. De är inte skärmdumpar utan riktiga
// små gränssnitt byggda med samma tokens som sajten — sajten ska visa vad vi
// kan bygga, och varje tjänstesida får därmed ett eget utseende i stället för
// samma kortrutnät. Rörelserna är små och stängs av vid "minska rörelse".

const ease = [0.22, 1, 0.36, 1] as const;

function Frame({ tint, children, className = "" }: { tint: string; children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative isolate aspect-[5/4] w-full overflow-hidden rounded-3xl ring-1 ring-line ${tint} ${className}`}
    >
      {children}
    </div>
  );
}

function Float({ children, className = "", delay = 0, distance = 6 }: { children: ReactNode; className?: string; delay?: number; distance?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease }}
    >
      <motion.div
        className="h-full"
        animate={reduce ? undefined : { y: [0, -distance, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Bar({ w, className = "bg-ink-200" }: { w: string; className?: string }) {
  return <div className={`h-2 rounded-full ${className}`} style={{ width: w }} />;
}

function useCycle(length: number, ms: number) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, reduce]);
  return index;
}

/* ─── Webb: en minisajt i ett webbläsarfönster + mobilvy + hastighetsbetyg ── */
export function WebVisual() {
  return (
    <Frame tint="bg-gradient-to-br from-pine-50 to-lilac-50">
      <Float className="absolute left-[7%] top-[9%] w-[74%]">
        <div className="overflow-hidden rounded-xl bg-surface shadow-pop ring-1 ring-line">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-ink-200" />
            <span className="h-2 w-2 rounded-full bg-ink-200" />
            <span className="h-2 w-2 rounded-full bg-ink-200" />
            <span className="ml-2 rounded-full bg-surface-sunken px-2.5 py-0.5 text-[9px] text-fg-muted">ertforetag.se</span>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="h-2.5 w-14 rounded-full bg-pine-800" />
              <div className="flex gap-2">
                <Bar w="1.5rem" />
                <Bar w="1.5rem" />
                <span className="h-3.5 w-10 rounded-full bg-pine-700" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-[1.2fr_1fr] gap-3">
              <div className="space-y-2">
                <div className="h-3 w-[90%] rounded-full bg-ink-900" />
                <div className="h-3 w-[70%] rounded-full bg-ink-900" />
                <Bar w="85%" />
                <Bar w="60%" />
                <div className="flex gap-1.5 pt-1.5">
                  <span className="h-4 w-14 rounded-full bg-pine-700" />
                  <span className="h-4 w-10 rounded-full ring-1 ring-inset ring-line-strong" />
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-lilac-200 via-lilac-100 to-pine-100" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1.5 rounded-md bg-surface-sunken p-2">
                  <span className="block h-3 w-3 rounded bg-pine-200" />
                  <Bar w="80%" className="bg-ink-300" />
                  <Bar w="55%" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Float>
      <Float className="absolute bottom-[7%] right-[6%] w-[24%]" delay={0.25} distance={8}>
        <div className="overflow-hidden rounded-[1.1rem] bg-surface p-2 shadow-pop ring-1 ring-line">
          <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-ink-200" />
          <div className="space-y-1.5">
            <div className="h-10 rounded-md bg-gradient-to-br from-lilac-200 to-pine-100" />
            <div className="h-2 w-[85%] rounded-full bg-ink-900" />
            <Bar w="70%" />
            <span className="mt-1 block h-3.5 w-full rounded-full bg-pine-700" />
          </div>
        </div>
      </Float>
      <Float className="absolute bottom-[10%] left-[5%]" delay={0.45}>
        <div className="flex items-center gap-2 rounded-full bg-surface py-1.5 pl-1.5 pr-3 text-[11px] shadow-raised ring-1 ring-line">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pine-100 text-pine-800">
            <Gauge size={13} strokeWidth={2.5} />
          </span>
          <span className="font-semibold text-fg">98</span>
          <span className="text-fg-muted">laddtid & prestanda</span>
        </div>
      </Float>
    </Frame>
  );
}

/* ─── System: dashboard där nya bokningar dyker upp ──────────────────────── */
const bookings = [
  { time: "09:00", name: "Elin Berg", what: "Klippning", status: "Bekräftad", tone: "bg-pine-100 text-pine-800" },
  { time: "10:30", name: "Omar Ali", what: "Service bil", status: "Ny", tone: "bg-blue-100 text-blue-800" },
  { time: "13:00", name: "Sara Lund", what: "Konsultation", status: "Väntar", tone: "bg-amber-100 text-amber-800" },
  { time: "15:15", name: "Jonas Ek", what: "Leverans", status: "Bekräftad", tone: "bg-pine-100 text-pine-800" },
];
const incoming = ["Ny bokning · Maja K. 14:30", "Order #1042 betald", "Kunden godkände förslaget"];

export function SystemVisual() {
  const i = useCycle(incoming.length, 3200);
  return (
    <Frame tint="bg-gradient-to-br from-teal-50 to-pine-50">
      <Float className="absolute inset-x-[6%] top-[9%]" distance={4}>
        <div className="flex overflow-hidden rounded-xl bg-surface shadow-pop ring-1 ring-line">
          <div className="flex w-12 shrink-0 flex-col items-center gap-2.5 bg-surface-sunken py-3">
            <span className="h-5 w-5 rounded-md bg-pine-800" />
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className={`h-4 w-4 rounded ${n === 0 ? "bg-pine-200" : "bg-ink-200"}`} />
            ))}
          </div>
          <div className="min-w-0 flex-1 p-3.5">
            <p className="text-[11px] font-semibold text-fg">Bokningar idag</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                ["12", "bokningar"],
                ["8 400 kr", "intäkter"],
                ["3", "nya kunder"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-lg bg-surface-sunken px-2 py-1.5">
                  <p className="text-[12px] font-semibold text-fg">{v}</p>
                  <p className="text-[9px] text-fg-muted">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-2.5 divide-y divide-line">
              {bookings.map((b) => (
                <div key={b.time} className="flex items-center gap-2 py-1.5 text-[10px]">
                  <span className="w-8 tabular-nums text-fg-muted">{b.time}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-fg">{b.name}</span>
                  <span className="hidden truncate text-fg-muted sm:block">{b.what}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${b.tone}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Float>
      <div className="absolute bottom-[7%] right-[5%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            className="flex items-center gap-2 rounded-xl bg-surface py-2 pl-2 pr-3 text-[11px] shadow-pop ring-1 ring-line"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
              <Bell size={13} strokeWidth={2.5} />
            </span>
            <span className="font-medium text-fg">{incoming[i]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* ─── SEO: ert företag klättrar till plats 1 i sökresultatet ─────────────── */
const competitors = ["Konkurrent AB", "Branschkatalogen"];

export function SeoVisual() {
  const reduce = useReducedMotion();
  const step = useCycle(3, 1800);
  const position = reduce ? 0 : 2 - step; // plats 3 → 1, sedan om igen
  const list = [...competitors];
  list.splice(position, 0, "Ert företag");
  return (
    <Frame tint="bg-gradient-to-br from-rose-50 to-lilac-50">
      <div className="absolute inset-x-[8%] top-[9%]">
        <div className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[12px] shadow-raised ring-1 ring-line">
          <Search size={14} className="text-fg-muted" />
          <span className="text-fg">hemsida företag karlstad</span>
        </div>
        <div className="mt-3 space-y-2">
          {list.map((name) => {
            const ours = name === "Ert företag";
            return (
              <motion.div
                layout
                key={name}
                transition={{ duration: 0.5, ease }}
                className={`rounded-xl px-3.5 py-3 ${ours ? "bg-surface shadow-pop ring-2 ring-pine-600" : "bg-surface/70 ring-1 ring-line"}`}
              >
                <p className="text-[9px] text-fg-muted">{ours ? "ertforetag.se" : name.toLowerCase().replace(/\s/g, "") + ".se"}</p>
                <p className={`text-[12px] font-semibold ${ours ? "text-blue-700" : "text-blue-700/70"}`}>{name}</p>
                <div className="mt-1.5 space-y-1">
                  <Bar w="92%" className={ours ? "bg-ink-300" : "bg-ink-200"} />
                  <Bar w="64%" className="bg-ink-200" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Float className="absolute bottom-[6%] right-[6%]" delay={0.3}>
        <div className="flex items-center gap-2 rounded-full bg-pine-800 py-1.5 pl-1.5 pr-3 text-[11px] text-white shadow-pop">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <TrendingUp size={13} strokeWidth={2.5} />
          </span>
          <span className="font-semibold">Plats {position + 1}</span>
        </div>
      </Float>
    </Frame>
  );
}

/* ─── Design: en varumärkestavla ─────────────────────────────────────────── */
export function DesignVisual() {
  const swatches = ["bg-pine-800", "bg-lilac-300", "bg-plum-800", "bg-amber-300", "bg-ink-950"];
  return (
    <Frame tint="bg-gradient-to-br from-amber-50 to-rose-50">
      <div className="absolute inset-[7%] grid grid-cols-3 grid-rows-3 gap-3">
        <Float className="col-span-2 row-span-2" distance={3}>
          <div className="flex h-full items-center justify-center rounded-2xl bg-pine-800 shadow-pop">
            <div className="flex items-center gap-3">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-lilac-200">
                <span className="h-6 w-6 rounded-full bg-pine-800" />
                <span className="absolute right-1 top-2 h-3 w-3 rounded-full bg-amber-300" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                ert<span className="text-lilac-200">märke</span>
              </span>
            </div>
          </div>
        </Float>
        <Float className="row-span-2" delay={0.15} distance={4}>
          <div className="flex h-full flex-col gap-1.5 rounded-2xl bg-surface p-2 shadow-raised ring-1 ring-line">
            {swatches.map((s, n) => (
              <motion.span
                key={s}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + n * 0.08, ease }}
                className={`block flex-1 origin-left rounded-lg ${s}`}
              />
            ))}
          </div>
        </Float>
        <Float delay={0.25} distance={4}>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-surface p-3 shadow-raised ring-1 ring-line">
            <span className="font-display text-3xl font-semibold leading-none text-fg">Aa</span>
            <span className="text-[9px] text-fg-muted">Poppins · Geist</span>
          </div>
        </Float>
        <Float className="col-span-2" delay={0.35} distance={5}>
          <div className="flex h-full -rotate-2 items-center justify-between rounded-2xl bg-lilac-200 px-4 shadow-pop">
            <div>
              <p className="text-[12px] font-semibold text-plum-900">Anna Andersson</p>
              <p className="text-[9px] text-plum-900/80">VD · 070-123 45 67</p>
            </div>
            <span className="h-6 w-6 rounded-full bg-pine-800" />
          </div>
        </Float>
      </div>
    </Frame>
  );
}

/* ─── Tillväxt: graf som växer + annons ──────────────────────────────────── */
export function GrowthVisual() {
  const bars = [28, 34, 31, 42, 47, 55, 61, 74, 86];
  return (
    <Frame tint="bg-gradient-to-br from-lilac-50 to-pine-50">
      <Float className="absolute inset-x-[7%] top-[9%]" distance={4}>
        <div className="rounded-xl bg-surface p-4 shadow-pop ring-1 ring-line">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold text-fg">Förfrågningar per månad</p>
            <span className="rounded-full bg-pine-100 px-2 py-0.5 text-[10px] font-semibold text-pine-800">+38 %</span>
          </div>
          <div className="mt-4 flex h-32 items-end gap-2">
            {bars.map((h, n) => (
              <motion.div
                key={n}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 + n * 0.06, ease }}
                className={`flex-1 rounded-t-md ${n === bars.length - 1 ? "bg-pine-700" : "bg-lilac-300"}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-fg-subtle">
            <span>mar</span>
            <span>nov</span>
          </div>
        </div>
      </Float>
      <Float className="absolute bottom-[7%] left-[7%] w-[52%]" delay={0.3}>
        <div className="rounded-xl bg-surface p-3 shadow-pop ring-1 ring-line">
          <p className="text-[9px] text-fg-muted">Sponsrad · ertforetag.se</p>
          <p className="mt-0.5 text-[12px] font-semibold text-blue-700">Boka tid online idag</p>
          <Bar w="90%" className="mt-1.5 bg-ink-200" />
        </div>
      </Float>
      <Float className="absolute bottom-[9%] right-[7%]" delay={0.45}>
        <div className="rounded-xl bg-plum-800 px-3 py-2 text-white shadow-pop">
          <p className="text-[9px] text-white/80">Kostnad per kund</p>
          <p className="text-[14px] font-semibold">−24 %</p>
        </div>
      </Float>
    </Frame>
  );
}

/* ─── Support: driftstatus, ärenden som löses ────────────────────────────── */
const log = [
  "Säkerhetsuppdatering installerad",
  "Backup klar 03:00",
  "Nya öppettider publicerade",
];

export function SupportVisual() {
  const reduce = useReducedMotion();
  return (
    <Frame tint="bg-gradient-to-br from-blue-50 to-pine-50">
      <Float className="absolute inset-x-[7%] top-[9%]" distance={4}>
        <div className="rounded-xl bg-surface p-4 shadow-pop ring-1 ring-line">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine-400 opacity-60" />}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pine-600" />
            </span>
            <p className="text-[12px] font-semibold text-fg">Allt fungerar</p>
            <span className="ml-auto text-[10px] text-fg-muted">99,98 % upptid</span>
          </div>
          <div className="mt-3 flex gap-[3px]">
            {Array.from({ length: 36 }).map((_, n) => (
              <span key={n} className={`h-6 flex-1 rounded-sm ${n === 22 ? "bg-amber-300" : "bg-pine-400"}`} />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {log.map((item, n) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + n * 0.12, ease }}
                className="flex items-center gap-2 text-[10.5px] text-fg"
              >
                <Check size={12} strokeWidth={3} className="text-pine-700" />
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </Float>
      <Float className="absolute bottom-[8%] left-[7%] max-w-[46%]" delay={0.35}>
        <div className="rounded-2xl rounded-bl-md bg-surface px-3 py-2 text-[11px] text-fg shadow-raised ring-1 ring-line">
          Kan ni byta öppettiderna inför julen?
        </div>
      </Float>
      <Float className="absolute bottom-[8%] right-[7%]" delay={0.6}>
        <div className="flex items-center gap-1.5 rounded-2xl rounded-br-md bg-pine-800 px-3 py-2 text-[11px] text-white shadow-pop">
          <BadgeCheck size={13} />
          Klart, ligger ute nu!
        </div>
      </Float>
    </Frame>
  );
}

/* ─── Kundportal/allmän: används som fallback ─────────────────────────────── */
export function TrustVisual() {
  return (
    <Frame tint="bg-gradient-to-br from-pine-50 to-lilac-50">
      <Float className="absolute inset-[12%] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-5 shadow-pop ring-1 ring-line">
          <ShieldCheck size={28} className="text-pine-700" />
          <p className="font-display text-lg font-semibold text-fg">Byggt för er</p>
        </div>
      </Float>
    </Frame>
  );
}

const visuals: Record<string, () => ReactNode> = {
  webb: WebVisual,
  automation: SystemVisual,
  seo: SeoVisual,
  design: DesignVisual,
  tillvaxt: GrowthVisual,
  support: SupportVisual,
};

export function ServiceVisual({ slug }: { slug: string }) {
  const Visual = visuals[slug] ?? TrustVisual;
  return <Visual />;
}
