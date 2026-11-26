"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Maximize2, Monitor, Pipette, Share2, Smartphone, X } from "lucide-react";
import { useProjectInquiry } from "@/components/contact/ProjectInquiryContext";
import { trackConversion } from "@/lib/analytics";
import {
  fonts,
  heroLayouts,
  industries,
  palettes,
  scale,
  sectionOptions,
  type FontId,
  type HeroId,
  type IndustryId,
  type SectionId,
} from "@/components/tools/builder/data";
import { MiniSite, type SiteConfig } from "@/components/tools/builder/MiniSite";

const demoLogos: Record<string, string | undefined> = {
  servicekoll: "/images/demos/servicekoll-logo.svg",
  mumsa: "/images/demos/mumsa-logo.svg",
  bokad: "/images/demos/bokad-logo.svg",
};

// Skissen sparas i adressen så att den går att dela och finns kvar om man
// går till en demo och tillbaka.
type Config = { industry: IndustryId; name: string; city: string; color: string; font: FontId; hero: HeroId; sections: SectionId[] };
const allSections = sectionOptions.map((s) => s.id);
const defaults: Config = { industry: "hantverk", name: "", city: "", color: palettes[0].primary, font: "modern", hero: "delad", sections: allSections };

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function parseConfig(search: string): Partial<Config> {
  const p = new URLSearchParams(search);
  const out: Partial<Config> = {};
  const industry = p.get("bransch");
  if (industry && industry in industries) out.industry = industry as IndustryId;
  if (p.get("namn")) out.name = p.get("namn")!.slice(0, 32);
  if (p.get("ort")) out.city = p.get("ort")!.slice(0, 24);
  const color = p.get("farg");
  const named = palettes.find((x) => x.id === color);
  if (named) out.color = named.primary;
  else if (color && /^[0-9a-f]{6}$/i.test(color)) out.color = `#${color}`;
  const font = fonts.find((x) => x.id === p.get("typsnitt"));
  if (font) out.font = font.id;
  const hero = heroLayouts.find((x) => x.id === p.get("hero"));
  if (hero) out.hero = hero.id;
  if (p.has("delar")) out.sections = (p.get("delar") ?? "").split(",").filter((s): s is SectionId => (allSections as string[]).includes(s));
  return out;
}

function configQuery(c: Config) {
  const named = palettes.find((x) => x.primary === c.color);
  const p = new URLSearchParams({ bransch: c.industry, farg: named ? named.id : c.color.replace("#", ""), typsnitt: c.font, hero: c.hero });
  if (c.name.trim()) p.set("namn", c.name.trim());
  if (c.city.trim()) p.set("ort", c.city.trim());
  if (c.sections.length !== allSections.length) p.set("delar", c.sections.join(","));
  return p.toString();
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
        active ? "bg-fg text-canvas shadow-card" : "bg-surface text-fg ring-1 ring-inset ring-line hover:ring-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-fg">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[11px] text-canvas">{n}</span>
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

// Sajtbyggaren: välj bransch, namn, ort, färg, typsnitt, hero och delar och
// se en hel hemsida byggas live, med fungerande bokning/meny/shop. "Vill ni
// ha den på riktigt?" öppnar förfrågan med valen och en länk till skissen.
export function SiteBuilder() {
  const { open } = useProjectInquiry();
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const fromUrl = useMemo(() => parseConfig(search), [search]);
  const [changes, setChanges] = useState<Partial<Config>>({});
  const [mobile, setMobile] = useState(false);
  const [shared, setShared] = useState(false);
  const [full, setFull] = useState(false);

  const config: Config = { ...defaults, ...fromUrl, ...changes };
  const ind = industries[config.industry];
  const shownName = config.name.trim() || ind.defaultName;
  const slug = shownName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "") || "ertforetag";
  const colors = useMemo(() => scale(config.color), [config.color]);
  const siteConfig: SiteConfig = { industry: config.industry, name: shownName, city: config.city.trim(), colors, font: config.font, hero: config.hero, sections: config.sections };
  const previewKey = `${config.industry}-${config.font}-${config.hero}`;

  function update(patch: Partial<Config>) {
    setChanges({ ...changes, ...patch });
    const url = new URL(window.location.href);
    url.search = configQuery({ ...config, ...patch });
    window.history.replaceState(window.history.state, "", url);
  }

  function toggleSection(id: SectionId) {
    const next = config.sections.includes(id) ? config.sections.filter((s) => s !== id) : allSections.filter((s) => s === id || config.sections.includes(s));
    update({ sections: next });
  }

  const shareUrl = () => `${window.location.origin}/verktyg?${configQuery(config)}#sajtbyggaren`;

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
      // Avbruten delning eller blockerat urklipp.
    }
  }

  function requestIt() {
    trackConversion({ name: "cta_click", location: "sajtbyggaren" });
    const font = fonts.find((x) => x.id === config.font)!.label;
    const hero = heroLayouts.find((x) => x.id === config.hero)!.label;
    const parts = sectionOptions.filter((s) => config.sections.includes(s.id)).map((s) => s.label.toLowerCase());
    open({
      source: "sajtbyggaren",
      company: config.name.trim(),
      description: `Från Sajtbyggaren: vi vill ha en hemsida${config.name.trim() ? ` för ${config.name.trim()}` : ""}${config.city.trim() ? ` i ${config.city.trim()}` : ""}.\nBransch: ${ind.label}\nFärg: ${config.color}\nTypsnitt: ${font}, hero: ${hero}\nDelar: ${parts.join(", ")}\nSkiss: ${shareUrl()}\n\nMer om oss: `,
    });
  }

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  const preview = (fullscreen: boolean) => (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto flex w-full flex-col overflow-hidden bg-white shadow-pop ring-1 ring-line ${
        mobile ? "max-w-[340px] rounded-[2.2rem] border-[7px] border-ink-900" : "rounded-2xl"
      }`}
      style={{ height: fullscreen ? "100%" : mobile ? 660 : 620 }}
    >
      {!mobile && (
        <div className="flex shrink-0 items-center gap-3 border-b border-line bg-surface-sunken px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex-1 truncate rounded-md bg-surface px-3 py-1 text-center text-xs text-fg-muted ring-1 ring-line">🔒 {slug}.se</span>
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={previewKey + mobile} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="min-h-0 flex-1">
          <MiniSite config={siteConfig} mobile={mobile} slug={slug} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  const deviceToggle = (
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
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${mobile === m ? "bg-fg text-canvas" : "text-fg-muted hover:text-fg"}`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );

  const named = palettes.find((p) => p.primary === config.color);

  return (
    <div className="grid gap-8 lg:grid-cols-[23rem_minmax(0,1fr)] lg:gap-10">
      <div className="flex flex-col gap-6">
        <Step n={1} title="Bransch">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(industries) as IndustryId[]).map((key) => {
              const Icon = industries[key].icon;
              return (
                <Choice key={key} active={config.industry === key} onClick={() => update({ industry: key })}>
                  <Icon size={15} />
                  {industries[key].label}
                </Choice>
              );
            })}
          </div>
        </Step>
        <Step n={2} title="Namn och ort">
          <div className="grid grid-cols-[1.4fr_1fr] gap-2">
            <input
              value={config.name}
              onChange={(e) => update({ name: e.target.value.slice(0, 32) })}
              placeholder={ind.defaultName}
              aria-label="Företagets namn"
              className="h-11 w-full rounded-xl bg-surface px-3.5 text-[15px] text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              value={config.city}
              onChange={(e) => update({ city: e.target.value.slice(0, 24) })}
              placeholder="Karlstad"
              aria-label="Ort"
              className="h-11 w-full rounded-xl bg-surface px-3.5 text-[15px] text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </Step>
        <Step n={3} title="Färg">
          <div className="flex flex-wrap items-center gap-2.5">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={config.color === p.primary}
                aria-label={p.label}
                title={p.label}
                onClick={() => update({ color: p.primary })}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 ${
                  config.color === p.primary ? "ring-2 ring-fg ring-offset-2 ring-offset-canvas" : "ring-1 ring-line"
                }`}
                style={{ background: `linear-gradient(135deg, ${p.primary} 55%, ${scale(p.primary).soft} 55%)` }}
              >
                {config.color === p.primary && <Check size={15} strokeWidth={3} className="text-white drop-shadow" />}
              </button>
            ))}
            <label
              title="Egen färg"
              className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105 ${
                !named ? "ring-2 ring-fg ring-offset-2 ring-offset-canvas" : "ring-1 ring-line"
              }`}
              style={{ background: !named ? config.color : "conic-gradient(#e0453f, #e39a1f, #2f9a6c, #1d5c9c, #6b3fa0, #e0453f)" }}
            >
              <Pipette size={15} className="text-white drop-shadow" />
              <input type="color" value={config.color} onChange={(e) => update({ color: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Välj egen färg" />
            </label>
          </div>
        </Step>
        <Step n={4} title="Stil">
          <div className="flex flex-wrap gap-2">
            {fonts.map((s) => (
              <Choice key={s.id} active={config.font === s.id} onClick={() => update({ font: s.id })}>
                <span style={{ fontFamily: s.heading, borderRadius: s.radius }}>{s.label}</span>
              </Choice>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {heroLayouts.map((h) => (
              <Choice key={h.id} active={config.hero === h.id} onClick={() => update({ hero: h.id })}>
                {h.label}
              </Choice>
            ))}
          </div>
        </Step>
        <Step n={5} title="Delar på sidan">
          <div className="flex flex-wrap gap-2">
            {sectionOptions.map((s) => {
              const on = config.sections.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSection(s.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    on ? "bg-pine-100 text-pine-900 ring-1 ring-pine-200" : "bg-surface text-fg-muted ring-1 ring-line hover:text-fg"
                  }`}
                >
                  {on ? <Check size={13} strokeWidth={3} /> : <span className="h-[13px] w-[13px] rounded-full ring-1 ring-current" />}
                  {s.label}
                </button>
              );
            })}
          </div>
        </Step>

        <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
          <p className="text-sm text-fg-muted">Vi skulle också bygga in</p>
          <p className="mt-1 font-medium text-fg">{ind.feature}</p>
          <Link
            href={`/demo/${ind.demo.slug}`}
            onClick={() => trackConversion({ name: "cta_click", location: `sajtbyggaren-demo-${ind.demo.slug}` })}
            className="group mt-4 flex items-center gap-3 rounded-xl bg-surface-sunken p-3 ring-1 ring-line transition-colors hover:bg-fg/[0.05] hover:ring-line-strong"
          >
            {demoLogos[ind.demo.slug] ? (
              <Image src={demoLogos[ind.demo.slug]!} alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fg text-canvas">
                <ind.icon size={17} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-fg">Testa {ind.demo.name}-demon</span>
              <span className="block text-xs leading-snug text-fg-muted">{ind.demo.text}</span>
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
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-xs font-medium text-fg ring-1 ring-line transition-colors hover:ring-line-strong"
            >
              {shared ? <Check size={14} className="text-pine-700" /> : <Share2 size={14} />}
              {shared ? "Länken är kopierad" : "Dela skissen"}
            </button>
            <button
              type="button"
              onClick={() => setFull(true)}
              className="hidden items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-xs font-medium text-fg ring-1 ring-line transition-colors hover:ring-line-strong sm:inline-flex"
            >
              <Maximize2 size={14} />
              Helskärm
            </button>
          </div>
          {deviceToggle}
        </div>
        <div className="rounded-3xl bg-surface-sunken p-3 ring-1 ring-line sm:p-6">{preview(false)}</div>
        <p className="mt-2 text-center text-xs text-fg-subtle">Scrolla och klicka runt i förhandsvisningen. Bokning, meny och varukorg fungerar.</p>
      </div>

      {full &&
        createPortal(
          <div className="fixed inset-0 z-[120] flex flex-col bg-ink-950/80 p-3 backdrop-blur-sm sm:p-6" onClick={() => setFull(false)}>
            <div className="mx-auto mb-3 flex w-full max-w-6xl items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
              {deviceToggle}
              <button type="button" onClick={() => setFull(false)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-ink-900">
                <X size={14} />
                Stäng
              </button>
            </div>
            <div className="mx-auto min-h-0 w-full max-w-6xl flex-1" onClick={(e) => e.stopPropagation()}>
              {preview(true)}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
