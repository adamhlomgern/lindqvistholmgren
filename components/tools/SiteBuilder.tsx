"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Share2,
  Briefcase,
  Check,
  Hammer,
  Monitor,
  Scissors,
  ShoppingBag,
  Smartphone,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useProjectInquiry } from "@/components/contact/ProjectInquiryContext";
import { trackConversion } from "@/lib/analytics";

type Industry = "hantverk" | "restaurang" | "salong" | "konsult" | "butik";

type IndustryCopy = {
  label: string;
  icon: LucideIcon;
  defaultName: string;
  headline: string;
  lead: string;
  cta: string;
  nav: string[];
  items: { title: string; text: string }[];
  proof: string;
  badge: [string, string];
  feature: string;
  // Demon som visar funktionen på riktigt (app/demo/*).
  demo: { slug: string; name: string; text: string };
};

const industries: Record<Industry, IndustryCopy> = {
  hantverk: {
    label: "Hantverkare",
    icon: Hammer,
    defaultName: "Berg Bygg & Snickeri",
    headline: "Snickeri och renovering med fast offert.",
    lead: "Kök, badrum och tillbyggnader i hela länet. Vi kommer ut och tittar gratis.",
    cta: "Begär offert",
    nav: ["Tjänster", "Projekt", "Om oss", "Kontakt"],
    items: [
      { title: "Kök", text: "Från ritning till sista lister" },
      { title: "Badrum", text: "Våtrumscertifierade" },
      { title: "ROT-avdrag", text: "Vi sköter ansökan" },
    ],
    proof: "4,9 av 5 från 120 kunder",
    badge: ["Gratis hembesök", "Svar inom en dag"],
    feature: "Offertformulär med bilder",
    demo: { slug: "servicekoll", name: "Servicekoll", text: "Kundregister med påminnelser, bokningar och sms." },
  },
  restaurang: {
    label: "Restaurang",
    icon: UtensilsCrossed,
    defaultName: "Trattoria Lunda",
    headline: "Handgjord pasta, mitt i stan.",
    lead: "Lunch vardagar 11–14 och middag sju dagar i veckan. Beställ hämtmat direkt här.",
    cta: "Beställ hämtmat",
    nav: ["Meny", "Boka bord", "Hitta hit"],
    items: [
      { title: "Dagens lunch", text: "135 kr inkl. sallad" },
      { title: "Boka bord", text: "Svar direkt" },
      { title: "Catering", text: "För 10–200 gäster" },
    ],
    proof: "Över 2 000 beställningar i månaden",
    badge: ["Öppet idag", "11–22"],
    feature: "Egen beställning utan provision",
    demo: { slug: "mumsa", name: "Mumsa", text: "Beställ som kund och följ ordern i köket." },
  },
  salong: {
    label: "Frisör & salong",
    icon: Scissors,
    defaultName: "Studio Lin",
    headline: "Klippning och färg som håller.",
    lead: "Boka tid online dygnet runt. Välj frisör, behandling och tid som passar.",
    cta: "Boka tid",
    nav: ["Behandlingar", "Frisörer", "Priser"],
    items: [
      { title: "Klippning", text: "45 min" },
      { title: "Färg & slingor", text: "2 tim" },
      { title: "Presentkort", text: "Köp online" },
    ],
    proof: "Lediga tider redan i morgon",
    badge: ["Nästa lediga tid", "I morgon 09:30"],
    feature: "Onlinebokning med sms-påminnelse",
    demo: { slug: "bokad", name: "Bokad", text: "Boka en tid som kund och se salongens kalender." },
  },
  konsult: {
    label: "Konsult & byrå",
    icon: Briefcase,
    defaultName: "Norrsken Redovisning",
    headline: "Ekonomin under kontroll, varje månad.",
    lead: "Bokföring, löner och bokslut för små och medelstora företag. Fast månadspris.",
    cta: "Boka ett samtal",
    nav: ["Tjänster", "Kunder", "Om oss", "Kontakt"],
    items: [
      { title: "Bokföring", text: "Löpande varje månad" },
      { title: "Löner", text: "Klart den 25:e" },
      { title: "Bokslut", text: "Inga överraskningar" },
    ],
    proof: "Över 80 företag litar på oss",
    badge: ["Fast pris", "från 2 900 kr/mån"],
    feature: "Kundportal för underlag",
    demo: { slug: "kundportal", name: "Kundportalen", text: "Kunden godkänner, hittar filer och skriver till er." },
  },
  butik: {
    label: "Butik & webbshop",
    icon: ShoppingBag,
    defaultName: "Lera & Lin",
    headline: "Keramik och textil, gjort för hand.",
    lead: "Små serier från egen ateljé. Fri frakt över 500 kr och 30 dagars öppet köp.",
    cta: "Handla nu",
    nav: ["Nyheter", "Keramik", "Textil", "Om oss"],
    items: [
      { title: "Skålar", text: "från 249 kr" },
      { title: "Linneduk", text: "590 kr" },
      { title: "Vas Ö", text: "420 kr" },
    ],
    proof: "Skickas inom 24 timmar",
    badge: ["Fri frakt", "över 500 kr"],
    feature: "Webbshop med Klarna och Swish",
    demo: { slug: "forma", name: "Forma", text: "Kunden bygger sin produkt och ser priset direkt." },
  },
};

const palettes = [
  { id: "skog", label: "Skog", primary: "#1f5f4a", soft: "#e4efe9", ink: "#13251f" },
  { id: "lila", label: "Lila", primary: "#6b3fa0", soft: "#efe7f7", ink: "#231833" },
  { id: "hav", label: "Hav", primary: "#1d5c9c", soft: "#e3edf8", ink: "#12223a" },
  { id: "terrakotta", label: "Terrakotta", primary: "#b4512d", soft: "#f8e9e2", ink: "#311a12" },
  { id: "kol", label: "Kol", primary: "#1c1c1e", soft: "#eeeeec", ink: "#111111" },
] as const;

const styles = [
  { id: "mjuk", label: "Mjuk", radius: 16, font: "var(--font-heading)" },
  { id: "skarp", label: "Skarp", radius: 4, font: "var(--font-heading)" },
  { id: "klassisk", label: "Klassisk", radius: 10, font: "Georgia, 'Times New Roman', serif" },
] as const;

type Palette = (typeof palettes)[number];
type Style = (typeof styles)[number];

function MiniSite({ name, slug, copy, palette, style, mobile }: { name: string; slug: string; copy: IndustryCopy; palette: Palette; style: Style; mobile: boolean }) {
  const r = style.radius;
  return (
    <div className="bg-white text-left" style={{ color: palette.ink }}>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${palette.soft}` }}>
        <span className="truncate text-[15px] font-bold" style={{ fontFamily: style.font }}>
          {name}
        </span>
        {mobile ? (
          <span className="flex flex-col gap-[3px]" aria-hidden>
            <span className="h-[2px] w-4 rounded" style={{ background: palette.ink }} />
            <span className="h-[2px] w-4 rounded" style={{ background: palette.ink }} />
            <span className="h-[2px] w-4 rounded" style={{ background: palette.ink }} />
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-4 text-xs opacity-70">
            {copy.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        )}
      </div>

      <div className={`grid gap-5 px-5 py-7 ${mobile ? "" : "grid-cols-[1.15fr_1fr] items-center py-9"}`}>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold" style={{ background: palette.soft, color: palette.primary, borderRadius: 999 }}>
            <Star size={11} fill="currentColor" />
            {copy.proof}
          </span>
          <p className={`mt-3 font-bold leading-[1.08] tracking-[-0.02em] ${mobile ? "text-[22px]" : "text-[28px]"}`} style={{ fontFamily: style.font }}>
            {copy.headline}
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed opacity-75">{copy.lead}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white" style={{ background: palette.primary, borderRadius: r }}>
              {copy.cta}
              <ArrowRight size={13} />
            </span>
            <span className="inline-flex px-4 py-2 text-[13px] font-semibold" style={{ border: `1px solid ${palette.primary}33`, borderRadius: r }}>
              {copy.nav[0]}
            </span>
          </div>
        </div>
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: `linear-gradient(140deg, ${palette.soft} 0%, ${palette.primary}55 100%)`, borderRadius: r * 1.5 }}
          aria-hidden
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-25" style={{ background: palette.primary }} />
          <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full opacity-20" style={{ background: palette.ink }} />
          <copy.icon size={mobile ? 56 : 64} strokeWidth={1.25} className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" style={{ color: palette.primary }} />
          <div className="absolute bottom-3 left-3 bg-white px-3 py-2 shadow-lg" style={{ borderRadius: r }}>
            <p className="text-[10px] uppercase tracking-wide opacity-60">{copy.badge[0]}</p>
            <p className="text-[13px] font-semibold" style={{ fontFamily: style.font }}>
              {copy.badge[1]}
            </p>
          </div>
        </div>
      </div>

      <div className={`grid gap-2.5 px-5 pb-6 ${mobile ? "" : "grid-cols-3"}`}>
        {copy.items.map((item) => (
          <div key={item.title} className="p-3.5" style={{ background: palette.soft, borderRadius: r }}>
            <p className="text-[13px] font-semibold" style={{ fontFamily: style.font }}>
              {item.title}
            </p>
            <p className="mt-0.5 text-[12px] opacity-70">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-[11px] text-white" style={{ background: palette.ink }}>
        <span className="truncate">{name}</span>
        <span className="opacity-60">info@{slug}.se</span>
      </div>
    </div>
  );
}

function Choice({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
        active ? "bg-fg text-canvas shadow-card" : "bg-surface text-fg ring-1 ring-inset ring-line hover:ring-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

const demoLogos: Record<string, string | undefined> = {
  servicekoll: "/images/demos/servicekoll-logo.svg",
  mumsa: "/images/demos/mumsa-logo.svg",
  bokad: "/images/demos/bokad-logo.svg",
};

// Skissen sparas i adressen (?bransch=…&namn=…&farg=…&stil=…) så att den går
// att dela och finns kvar om man går till en demo och tillbaka.
type Config = { industry: Industry; name: string; paletteId: Palette["id"]; styleId: Style["id"] };

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function parseConfig(search: string): Partial<Config> {
  const params = new URLSearchParams(search);
  const config: Partial<Config> = {};
  const industry = params.get("bransch");
  if (industry && industry in industries) config.industry = industry as Industry;
  const name = params.get("namn");
  if (name) config.name = name.slice(0, 32);
  const palette = palettes.find((p) => p.id === params.get("farg"));
  if (palette) config.paletteId = palette.id;
  const style = styles.find((x) => x.id === params.get("stil"));
  if (style) config.styleId = style.id;
  return config;
}

function configQuery(config: Config) {
  const params = new URLSearchParams({ bransch: config.industry, farg: config.paletteId, stil: config.styleId });
  if (config.name.trim()) params.set("namn", config.name.trim());
  return params.toString();
}

// Sajtbyggaren: välj bransch, namn, färg och stil och se en liten hemsida
// byggas live. "Vill ni ha den på riktigt?" öppnar förfrågan med valen ifyllda.
export function SiteBuilder() {
  const { open } = useProjectInquiry();
  const reduce = useReducedMotion();
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const fromUrl = useMemo(() => parseConfig(search), [search]);
  const [changes, setChanges] = useState<Partial<Config>>({});
  const [mobile, setMobile] = useState(false);
  const [shared, setShared] = useState(false);

  const config: Config = { industry: "hantverk", name: "", paletteId: "skog", styleId: "mjuk", ...fromUrl, ...changes };
  const { industry, name, paletteId, styleId } = config;

  function update(patch: Partial<Config>) {
    const next = { ...changes, ...patch };
    setChanges(next);
    const url = new URL(window.location.href);
    url.search = configQuery({ ...config, ...patch });
    window.history.replaceState(window.history.state, "", url);
  }
  const setIndustry = (value: Industry) => update({ industry: value });
  const setName = (value: string) => update({ name: value });
  const setPaletteId = (value: Palette["id"]) => update({ paletteId: value });
  const setStyleId = (value: Style["id"]) => update({ styleId: value });

  function shareUrl() {
    return `${window.location.origin}/verktyg?${configQuery(config)}#sajtbyggaren`;
  }

  async function share() {
    const url = shareUrl();
    trackConversion({ name: "cta_click", location: "sajtbyggaren-dela" });
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `Skiss: ${shownName}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      // Avbruten delning eller blockerat urklipp — inget att göra.
    }
  }

  const copy = industries[industry];
  const palette = palettes.find((p) => p.id === paletteId)!;
  const style = styles.find((s) => s.id === styleId)!;
  const shownName = name.trim() || copy.defaultName;
  const slug = shownName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "") || "ertforetag";

  function requestIt() {
    trackConversion({ name: "cta_click", location: "sajtbyggaren" });
    open({
      source: "sajtbyggaren",
      company: name.trim(),
      description: `Från Sajtbyggaren: vi vill ha en hemsida${name.trim() ? ` för ${name.trim()}` : ""}.\nBransch: ${copy.label}\nFärg: ${palette.label}\nStil: ${style.label}\nSkiss: ${shareUrl()}\n\nMer om oss: `,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold text-fg">1. Bransch</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(industries) as Industry[]).map((key) => {
              const Icon = industries[key].icon;
              return (
                <Choice key={key} active={industry === key} onClick={() => setIndustry(key)}>
                  <Icon size={15} />
                  {industries[key].label}
                </Choice>
              );
            })}
          </div>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-fg">2. Företagets namn</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 32))}
            placeholder={copy.defaultName}
            className="mt-3 h-12 w-full rounded-xl bg-surface px-4 text-[15px] text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <div>
          <p className="text-sm font-semibold text-fg">3. Färg</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={paletteId === p.id}
                aria-label={p.label}
                title={p.label}
                onClick={() => setPaletteId(p.id)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 ${
                  paletteId === p.id ? "ring-2 ring-fg ring-offset-2 ring-offset-canvas" : "ring-1 ring-line"
                }`}
                style={{ background: `linear-gradient(135deg, ${p.primary} 55%, ${p.soft} 55%)` }}
              >
                {paletteId === p.id && <Check size={16} strokeWidth={3} className="text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-fg">4. Stil</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {styles.map((s) => (
              <Choice key={s.id} active={styleId === s.id} onClick={() => setStyleId(s.id)}>
                <span style={{ fontFamily: s.font }}>{s.label}</span>
              </Choice>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
          <p className="text-sm text-fg-muted">Vi skulle också bygga in</p>
          <p className="mt-1 font-medium text-fg">{copy.feature}</p>
          <Link
            href={`/demo/${copy.demo.slug}`}
            onClick={() => trackConversion({ name: "cta_click", location: `sajtbyggaren-demo-${copy.demo.slug}` })}
            className="group mt-4 flex items-center gap-3 rounded-xl bg-surface-sunken p-3 ring-1 ring-line transition-colors hover:bg-fg/[0.05] hover:ring-line-strong"
          >
            {demoLogos[copy.demo.slug] ? (
              <Image src={demoLogos[copy.demo.slug]!} alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fg text-canvas">
                <copy.icon size={17} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-fg">Testa {copy.demo.name}-demon</span>
              <span className="block text-xs leading-snug text-fg-muted">{copy.demo.text}</span>
            </span>
            <ArrowUpRight size={16} className="shrink-0 text-fg-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={requestIt}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-on-primary transition-colors hover:bg-primary-hover"
          >
            Vill ni ha den på riktigt?
            <ArrowRight size={16} />
          </button>
          <p className="mt-2 text-center text-xs text-fg-subtle">Vi svarar inom 24 timmar med ett förslag.</p>
        </div>
      </div>

      <div className="order-first min-w-0 lg:order-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-xs font-medium text-fg ring-1 ring-line transition-colors hover:ring-line-strong"
          >
            {shared ? <Check size={14} className="text-pine-700" /> : <Share2 size={14} />}
            {shared ? "Länken är kopierad" : "Dela skissen"}
          </button>
          <div className="inline-flex rounded-full bg-surface p-1 ring-1 ring-line">
            {[
              { m: false, icon: Monitor, label: "Dator" },
              { m: true, icon: Smartphone, label: "Mobil" },
            ].map(({ m, icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-pressed={mobile === m}
                onClick={() => setMobile(m)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  mobile === m ? "bg-fg text-canvas" : "text-fg-muted hover:text-fg"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center rounded-3xl bg-surface-sunken p-4 ring-1 ring-line sm:p-8">
          <motion.div
            layout={!reduce}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full overflow-hidden bg-white shadow-pop ring-1 ring-line ${mobile ? "max-w-[300px] rounded-[2rem] border-[6px] border-ink-900" : "rounded-2xl"}`}
          >
            {!mobile && (
              <div className="flex items-center gap-3 border-b border-line bg-surface-sunken px-4 py-2.5">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                </span>
                <span className="flex-1 truncate rounded-md bg-surface px-3 py-1 text-center text-xs text-fg-muted ring-1 ring-line">{slug}.se</span>
              </div>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${industry}-${paletteId}-${styleId}-${mobile}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MiniSite name={shownName} slug={slug} copy={copy} palette={palette} style={style} mobile={mobile} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
