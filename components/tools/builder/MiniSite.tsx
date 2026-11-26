"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Calendar, Check, ChevronDown, Clock, MapPin, Menu, Minus, Phone, Plus, ShoppingBag, Star, X } from "lucide-react";
import { fonts, industries, menu, products, type FontId, type HeroId, type IndustryId, type Scale, type SectionId } from "@/components/tools/builder/data";

export type SiteConfig = {
  industry: IndustryId;
  name: string;
  city: string;
  colors: Scale;
  font: FontId;
  hero: HeroId;
  sections: SectionId[];
};

const fill = (text: string, city: string) => text.replaceAll("{ort}", city);
const initials = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// En hel, scrollbar mini-hemsida. Allt är ritat med kod (inga foton) men med
// riktigt innehåll, fungerande widgets och navigering inom förhandsvisningen.
export function MiniSite({ config, mobile, slug }: { config: SiteConfig; mobile: boolean; slug: string }) {
  const ind = industries[config.industry];
  const c = config.colors;
  const f = fonts.find((x) => x.id === config.font)!;
  const r = f.radius;
  const scroller = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState(0);
  const has = (id: SectionId) => config.sections.includes(id);
  const city = config.city || "Karlstad";

  const vars = { "--p": c.primary, "--soft": c.soft, "--ink": c.ink, fontFamily: f.body, color: c.ink } as CSSProperties;
  function go(id: string) {
    setMenuOpen(false);
    const el = scroller.current?.querySelector(`[data-sec="${id}"]`) as HTMLElement | null;
    if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" });
  }
  const navTargets = ["tjanster", "widget", "om", "kontakt"];

  const pad = mobile ? "px-5" : "px-8";
  const sec = mobile ? "py-10" : "py-14";
  const dark = config.hero === "mork";

  return (
    <div ref={scroller} className="relative h-full overflow-y-auto overscroll-contain bg-white text-left [scrollbar-width:thin]" style={vars}>
      {/* Sidhuvud */}
      <header className={`sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/90 py-3 backdrop-blur ${pad}`} style={{ borderColor: c.soft }}>
        <button type="button" onClick={() => scroller.current?.scrollTo({ top: 0, behavior: "smooth" })} className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-bold text-white" style={{ background: c.primary, borderRadius: Math.min(r, 10) }}>
            {initials(config.name)}
          </span>
          <span className="truncate text-[15px] font-bold" style={{ fontFamily: f.heading }}>
            {config.name}
          </span>
        </button>
        {mobile ? (
          <div className="flex items-center gap-3">
            {ind.widget === "shop" && <CartIcon count={cart} color={c.primary} />}
            <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Meny">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        ) : (
          <nav className="flex shrink-0 items-center gap-5 text-[13px]">
            {ind.nav.slice(0, 3).map((n, i) => (
              <button key={n} type="button" onClick={() => go(navTargets[i])} className="opacity-70 transition-opacity hover:opacity-100">
                {n}
              </button>
            ))}
            {ind.widget === "shop" ? <CartIcon count={cart} color={c.primary} /> : <Btn c={c} r={r} onClick={() => go("widget")}>{ind.cta}</Btn>}
          </nav>
        )}
      </header>
      <AnimatePresence>
        {mobile && menuOpen && (
          <motion.nav initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="sticky top-[57px] z-10 overflow-hidden border-b bg-white" style={{ borderColor: c.soft }}>
            {ind.nav.map((n, i) => (
              <button key={n} type="button" onClick={() => go(navTargets[i] ?? "kontakt")} className="block w-full px-5 py-3 text-left text-[15px] font-medium">
                {n}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section
        className={`relative overflow-hidden ${pad} ${mobile ? "py-9" : "py-14"}`}
        style={dark ? { background: `linear-gradient(135deg, ${c.ink} 0%, ${c.deep} 100%)`, color: "#fff" } : config.hero === "centrerad" ? { background: c.softer } : undefined}
      >
        {dark && <HeroArt ind={config.industry} c={c} r={r} variant="bg" />}
        <div className={`relative grid items-center gap-8 ${!mobile && config.hero === "delad" ? "grid-cols-[1.1fr_1fr]" : ""} ${config.hero === "centrerad" ? "text-center" : ""}`}>
          <div className={config.hero === "centrerad" ? "mx-auto max-w-lg" : dark && !mobile ? "max-w-md" : ""}>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: dark ? "#ffffff1f" : c.soft, color: dark ? "#fff" : c.primary, borderRadius: 999 }}
            >
              <Star size={11} fill="currentColor" />
              {ind.rating} · {ind.reviewCount} omdömen på Google
            </span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-60">{fill(ind.eyebrow, city)}</p>
            <h1 className={`mt-1.5 font-bold leading-[1.05] tracking-[-0.03em] ${mobile ? "text-[27px]" : config.hero === "delad" ? "text-[31px]" : "text-[38px]"}`} style={{ fontFamily: f.heading }}>
              {ind.headline}
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed opacity-80">{fill(ind.lead, city)}</p>
            <div className={`mt-5 flex flex-wrap gap-2 ${config.hero === "centrerad" ? "justify-center" : ""}`}>
              <Btn c={c} r={r} light={dark} onClick={() => go("widget")}>
                {ind.cta}
                <ArrowRight size={14} />
              </Btn>
              <Btn c={c} r={r} ghost light={dark} onClick={() => go("tjanster")}>
                {ind.cta2}
              </Btn>
            </div>
          </div>
          {config.hero === "delad" && <HeroArt ind={config.industry} c={c} r={r} badge={ind.badge} />}
        </div>
        <div
          className={`relative mt-8 grid gap-px overflow-hidden ${mobile ? "grid-cols-3" : "grid-cols-3"}`}
          style={{ background: dark ? "#ffffff22" : c.soft, borderRadius: r }}
        >
          {ind.stats.map((s) => (
            <div key={s.label} className="px-3 py-3" style={{ background: dark ? "#ffffff0d" : "#fff" }}>
              <p className="truncate text-[15px] font-bold" style={{ fontFamily: f.heading }}>
                {s.value}
              </p>
              <p className="truncate text-[11px] opacity-60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {has("tjanster") && (
        <section data-sec="tjanster" className={`${pad} ${sec}`}>
          <Heading font={f.heading} className={mobile ? "text-[22px]" : "text-[26px]"}>{ind.servicesTitle}</Heading>
          <div className={`mt-5 grid gap-3 ${mobile ? "" : "grid-cols-2"}`}>
            {ind.services.map((s) => (
              <div key={s.title} className="group flex gap-3 p-4 transition-shadow hover:shadow-lg" style={{ background: c.softer, borderRadius: r, border: `1px solid ${c.soft}` }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-white" style={{ background: c.primary, borderRadius: Math.min(r, 12) }}>
                  <s.icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[14px] font-semibold" style={{ fontFamily: f.heading }}>
                      {s.title}
                    </p>
                    {s.price && <span className="shrink-0 text-[11px] font-semibold" style={{ color: c.primary }}>{s.price}</span>}
                  </div>
                  <p className="mt-0.5 text-[12.5px] leading-snug opacity-70">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {has("widget") && (
        <section data-sec="widget" className={`${pad} ${sec}`} style={{ background: c.softer }}>
          <Heading font={f.heading} className={mobile ? "text-[22px]" : "text-[26px]"}>{ind.widgetTitle}</Heading>
          <div className="mt-5">
            {ind.widget === "quote" && <QuoteWidget c={c} r={r} heading={f.heading} />}
            {ind.widget === "menu" && <MenuWidget c={c} r={r} heading={f.heading} mobile={mobile} />}
            {(ind.widget === "booking" || ind.widget === "meeting") && <BookingWidget c={c} r={r} heading={f.heading} meeting={ind.widget === "meeting"} services={ind.services.slice(0, 3).map((s) => s.title)} mobile={mobile} />}
            {ind.widget === "shop" && <ShopWidget c={c} r={r} heading={f.heading} mobile={mobile} onAdd={() => setCart((n) => n + 1)} />}
          </div>
        </section>
      )}

      {has("omdomen") && (
        <section className={`${pad} ${sec}`}>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Heading font={f.heading} className={mobile ? "text-[22px]" : "text-[26px]"}>Vad kunderna säger</Heading>
            <p className="flex items-center gap-1 text-[13px] font-semibold">
              <span className="flex" style={{ color: "#f5a524" }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              {ind.rating} av 5
            </p>
          </div>
          <div className={`mt-5 grid gap-3 ${mobile ? "" : "grid-cols-3"}`}>
            {ind.reviews.map((rv) => (
              <figure key={rv.name} className="flex flex-col p-4" style={{ border: `1px solid ${c.soft}`, borderRadius: r }}>
                <span className="flex" style={{ color: "#f5a524" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <blockquote className="mt-2 flex-1 text-[13px] leading-relaxed">”{rv.text}”</blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-[12px] font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px]" style={{ background: c.soft, color: c.primary }}>
                    {rv.name[0]}
                  </span>
                  {rv.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {has("om") && (
        <section data-sec="om" className={`${pad} ${sec}`} style={{ background: c.ink, color: "#fff" }}>
          <div className={`grid items-center gap-8 ${mobile ? "" : "grid-cols-[1.2fr_1fr]"}`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-60">Om oss</p>
              <Heading font={f.heading} className={`mt-1.5 ${mobile ? "text-[22px]" : "text-[26px]"}`}>{ind.aboutTitle}</Heading>
              <p className="mt-3 text-[13.5px] leading-relaxed opacity-80">{fill(ind.about, city)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ind.team.map((t, i) => (
                <div key={t.name} className="p-3 text-center" style={{ background: "#ffffff10", borderRadius: r }}>
                  <div className="mx-auto flex aspect-square w-full max-w-[110px] items-end justify-center overflow-hidden" style={{ background: i ? c.mid : c.primary, borderRadius: Math.max(r, 8) }}>
                    <Person color={i ? c.deep : c.soft} skin={i ? "#f1c9a5" : "#d9a77f"} />
                  </div>
                  <p className="mt-2 text-[13px] font-semibold">{t.name}</p>
                  <p className="text-[11px] opacity-60">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {has("faq") && (
        <section className={`${pad} ${sec}`}>
          <Heading font={f.heading} className={mobile ? "text-[22px]" : "text-[26px]"}>Vanliga frågor</Heading>
          <div className="mt-4 divide-y" style={{ borderColor: c.soft }}>
            {ind.faq.map((q, i) => (
              <Faq key={q.q} q={q.q} a={q.a} defaultOpen={i === 0} color={c.primary} />
            ))}
          </div>
        </section>
      )}

      {has("kontakt") && (
        <section data-sec="kontakt" className={`${pad} ${sec}`} style={{ background: c.softer }}>
          <div className={`grid gap-6 ${mobile ? "" : "grid-cols-2"}`}>
            <div>
              <Heading font={f.heading} className={mobile ? "text-[22px]" : "text-[26px]"}>Hitta hit</Heading>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center gap-2">
                  <MapPin size={15} style={{ color: c.primary }} />
                  {fill(ind.address, city)}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={15} style={{ color: c.primary }} />
                  054-12 34 56
                </li>
                {ind.hours.map(([d, h]) => (
                  <li key={d} className="flex items-center gap-2">
                    <Clock size={15} style={{ color: c.primary }} />
                    <span className="w-16 opacity-70">{d}</span>
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <MapArt c={c} r={r} />
          </div>
        </section>
      )}

      <footer className={`${pad} py-8 text-[12px] text-white`} style={{ background: c.ink }}>
        <div className={`grid gap-6 ${mobile ? "" : "grid-cols-3"}`}>
          <div>
            <p className="text-[15px] font-bold" style={{ fontFamily: f.heading }}>
              {config.name}
            </p>
            <p className="mt-1 opacity-60">{fill(ind.eyebrow, city)}</p>
          </div>
          <div className="space-y-1 opacity-70">
            {ind.nav.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
          <div className="space-y-1 opacity-70">
            <p>info@{slug}.se</p>
            <p>054-12 34 56</p>
            <p>Org.nr 559123-4567</p>
          </div>
        </div>
        <p className="mt-6 border-t border-white/10 pt-4 opacity-50">© {new Date().getFullYear()} {config.name}</p>
      </footer>
    </div>
  );
}

function Heading({ children, className = "", font }: { children: ReactNode; className?: string; font: string }) {
  return (
    <h2 className={`font-semibold tracking-[-0.02em] ${className}`} style={{ fontFamily: font }}>
      {children}
    </h2>
  );
}

function Btn({ children, ghost = false, onClick, light = false, c, r }: { children: ReactNode; ghost?: boolean; onClick?: () => void; light?: boolean; c: Scale; r: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-px"
      style={
        ghost
          ? { border: `1.5px solid ${light ? "#ffffff66" : c.primary + "40"}`, color: light ? "#fff" : c.ink, borderRadius: r }
          : { background: light ? "#fff" : c.primary, color: light ? c.ink : "#fff", borderRadius: r }
      }
    >
      {children}
    </button>
  );
}

function CartIcon({ count, color }: { count: number; color: string }) {
  return (
    <span className="relative inline-flex">
      <ShoppingBag size={19} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
            style={{ background: color }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Faq({ q, a, defaultOpen, color }: { q: string; a: string; defaultOpen: boolean; color: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-3">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 text-left text-[14px] font-semibold">
        {q}
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color }} />
      </button>
      {open && <p className="mt-1.5 text-[13px] leading-relaxed opacity-70">{a}</p>}
    </div>
  );
}

type W = { c: Scale; r: number; heading: string };

function QuoteWidget({ c, r, heading }: W) {
  const [kind, setKind] = useState("Kök");
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="flex items-center gap-3 bg-white p-5" style={{ borderRadius: r }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: c.primary }}>
          <Check size={18} />
        </span>
        <div>
          <p className="font-semibold" style={{ fontFamily: heading }}>
            Tack! Vi hör av oss inom 24 timmar.
          </p>
          <p className="text-[12.5px] opacity-70">Förfrågan om {kind.toLowerCase()} är skickad.</p>
        </div>
      </div>
    );
  return (
    <div className="bg-white p-5" style={{ borderRadius: r, boxShadow: "0 10px 30px -15px rgba(0,0,0,.2)" }}>
      <p className="text-[12px] font-semibold opacity-70">Vad gäller det?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["Kök", "Badrum", "Tillbyggnad", "Annat"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className="px-3 py-1.5 text-[12.5px] font-medium transition-colors"
            style={kind === k ? { background: c.primary, color: "#fff", borderRadius: r } : { border: `1px solid ${c.soft}`, borderRadius: r }}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {["Namn", "Telefon"].map((p) => (
          <div key={p} className="px-3 py-2.5 text-[12.5px] opacity-50" style={{ border: `1px solid ${c.soft}`, borderRadius: Math.min(r, 10) }}>
            {p}
          </div>
        ))}
      </div>
      <div className="mt-2 h-16 px-3 py-2.5 text-[12.5px] opacity-50" style={{ border: `1px solid ${c.soft}`, borderRadius: Math.min(r, 10) }}>
        Berätta kort om projektet …
      </div>
      <button type="button" onClick={() => setSent(true)} className="mt-3 w-full py-2.5 text-[13px] font-semibold text-white" style={{ background: c.primary, borderRadius: r }}>
        Skicka förfrågan
      </button>
    </div>
  );
}

function MenuWidget({ c, r, heading, mobile }: W & { mobile: boolean }) {
  const tabs = Object.keys(menu) as (keyof typeof menu)[];
  const [tab, setTab] = useState<keyof typeof menu>("Pizza");
  const [order, setOrder] = useState<Record<string, number>>({});
  const total = Object.entries(order).reduce((s, [n, q]) => s + q * (Object.values(menu).flat().find((d) => d.name === n)?.price ?? 0), 0);
  const count = Object.values(order).reduce((s, q) => s + q, 0);
  return (
    <div className={`grid gap-4 ${mobile ? "" : "grid-cols-[1.5fr_1fr]"}`}>
      <div className="bg-white p-4" style={{ borderRadius: r }}>
        <div className="flex gap-1.5">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className="px-3 py-1.5 text-[12.5px] font-semibold" style={tab === t ? { background: c.primary, color: "#fff", borderRadius: r } : { borderRadius: r }}>
              {t}
            </button>
          ))}
        </div>
        <ul className="mt-3 divide-y" style={{ borderColor: c.soft }}>
          {menu[tab].map((d) => (
            <li key={d.name} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold" style={{ fontFamily: heading }}>
                  {d.name}
                </p>
                <p className="truncate text-[12px] opacity-60">{d.text}</p>
              </div>
              <span className="text-[13px] font-semibold">{d.price} kr</span>
              <div className="flex items-center gap-1.5">
                {order[d.name] ? (
                  <>
                    <button type="button" aria-label="Färre" onClick={() => setOrder((o) => ({ ...o, [d.name]: Math.max(0, (o[d.name] ?? 0) - 1) }))} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: c.soft }}>
                      <Minus size={12} />
                    </button>
                    <span className="w-3 text-center text-[12px] font-semibold">{order[d.name]}</span>
                  </>
                ) : null}
                <button type="button" aria-label="Lägg till" onClick={() => setOrder((o) => ({ ...o, [d.name]: (o[d.name] ?? 0) + 1 }))} className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: c.primary }}>
                  <Plus size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col bg-white p-4" style={{ borderRadius: r }}>
        <p className="text-[13px] font-semibold" style={{ fontFamily: heading }}>
          Din beställning
        </p>
        {count === 0 ? (
          <p className="mt-2 flex-1 text-[12.5px] opacity-60">Lägg till rätter med plus-knappen.</p>
        ) : (
          <ul className="mt-2 flex-1 space-y-1 text-[12.5px]">
            {Object.entries(order)
              .filter(([, q]) => q > 0)
              .map(([n, q]) => (
                <li key={n} className="flex justify-between">
                  <span>
                    {q} × {n}
                  </span>
                </li>
              ))}
          </ul>
        )}
        <p className="mt-3 flex items-center gap-1.5 text-[12px] opacity-70">
          <Clock size={13} />
          Klar för avhämtning om ca 15 min
        </p>
        <button type="button" className="mt-2 w-full py-2.5 text-[13px] font-semibold text-white disabled:opacity-40" disabled={count === 0} style={{ background: c.primary, borderRadius: r }}>
          {count ? `Beställ · ${total} kr` : "Beställ"}
        </button>
      </div>
    </div>
  );
}

function BookingWidget({ c, r, heading, meeting, services, mobile }: W & { meeting: boolean; services: string[]; mobile: boolean }) {
  const [service, setService] = useState(meeting ? "Introsamtal 20 min" : services[0]);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const days = Array.from({ length: mobile ? 4 : 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { label: d.toLocaleDateString("sv-SE", { weekday: "short" }), date: d.getDate(), month: d.toLocaleDateString("sv-SE", { month: "short" }) };
  });
  const times = ["09:00", "09:30", "10:30", "13:00", "14:30", "16:00"].filter((_, i) => (i + day) % 3 !== 0);
  if (done)
    return (
      <div className="flex items-center gap-3 bg-white p-5" style={{ borderRadius: r }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: c.primary }}>
          <Calendar size={18} />
        </span>
        <div>
          <p className="font-semibold" style={{ fontFamily: heading }}>
            Bokat! {days[day].label} {days[day].date} {days[day].month} kl {time}
          </p>
          <p className="text-[12.5px] opacity-70">{service}. Bekräftelse skickas med sms.</p>
        </div>
      </div>
    );
  const options = meeting ? ["Introsamtal 20 min", "Rådgivning 60 min", "Besök på kontoret"] : services;
  return (
    <div className="bg-white p-5" style={{ borderRadius: r, boxShadow: "0 10px 30px -15px rgba(0,0,0,.2)" }}>
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <button key={s} type="button" onClick={() => setService(s)} className="px-3 py-1.5 text-[12.5px] font-medium" style={service === s ? { background: c.primary, color: "#fff", borderRadius: r } : { border: `1px solid ${c.soft}`, borderRadius: r }}>
            {s}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {days.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setDay(i);
              setTime(null);
            }}
            className="flex flex-1 flex-col items-center py-2 text-[11px]"
            style={day === i ? { background: c.ink, color: "#fff", borderRadius: Math.min(r, 12) } : { background: c.softer, borderRadius: Math.min(r, 12) }}
          >
            <span className="capitalize opacity-70">{d.label}</span>
            <span className="text-[15px] font-bold">{d.date}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {times.map((t) => (
          <button key={t} type="button" onClick={() => setTime(t)} className="py-2 text-[12.5px] font-semibold" style={time === t ? { background: c.primary, color: "#fff", borderRadius: Math.min(r, 10) } : { border: `1px solid ${c.soft}`, borderRadius: Math.min(r, 10), color: c.primary }}>
            {t}
          </button>
        ))}
      </div>
      <button type="button" disabled={!time} onClick={() => setDone(true)} className="mt-4 w-full py-2.5 text-[13px] font-semibold text-white disabled:opacity-40" style={{ background: c.primary, borderRadius: r }}>
        {time ? `Boka ${time}` : "Välj en tid"}
      </button>
    </div>
  );
}

function ShopWidget({ c, r, heading, mobile, onAdd }: W & { mobile: boolean; onAdd: () => void }) {
  const [added, setAdded] = useState<string | null>(null);
  return (
    <div className={`grid gap-3 ${mobile ? "grid-cols-2" : "grid-cols-4"}`}>
      {products.map((p, i) => (
        <div key={p.name} className="bg-white p-2.5" style={{ borderRadius: r }}>
          <div className="flex aspect-square items-center justify-center" style={{ background: i % 2 ? c.soft : c.softer, borderRadius: Math.max(r - 4, 4) }}>
            <ProductArt shape={p.shape} c={c} />
          </div>
          <p className="mt-2 text-[13px] font-semibold" style={{ fontFamily: heading }}>
            {p.name}
          </p>
          <p className="text-[12px] opacity-70">{p.price} kr</p>
          <button
            type="button"
            onClick={() => {
              onAdd();
              setAdded(p.name);
              setTimeout(() => setAdded(null), 1200);
            }}
            className="mt-2 w-full py-1.5 text-[12px] font-semibold text-white"
            style={{ background: added === p.name ? c.ink : c.primary, borderRadius: Math.min(r, 10) }}
          >
            {added === p.name ? "Tillagd ✓" : "Köp"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ---- Illustrationer --------------------------------------------------------

function HeroArt({ ind, c, r, badge, variant = "card" }: { ind: IndustryId; c: Scale; r: number; badge?: [string, string]; variant?: "card" | "bg" }) {
  const Icon = industries[ind].icon;
  if (variant === "bg")
    return (
      <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden>
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full" style={{ background: c.primary }} />
        <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full" style={{ background: c.mid }} />
        <Icon size={220} strokeWidth={0.6} className="absolute -right-6 bottom-4 text-white" />
      </div>
    );
  return (
    <div className="relative aspect-[4/3.2] overflow-hidden" style={{ background: `linear-gradient(150deg, ${c.soft} 0%, ${c.mid} 100%)`, borderRadius: r * 1.5 }} aria-hidden>
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full">
        <circle cx="330" cy="40" r="90" fill={c.primary} opacity="0.25" />
        <circle cx="40" cy="300" r="70" fill={c.ink} opacity="0.12" />
        {ind === "hantverk" && (
          <g>
            <path d="M110 230 L200 150 L290 230 Z" fill={c.ink} opacity="0.85" />
            <rect x="130" y="228" width="140" height="70" fill="#fff" />
            <rect x="185" y="250" width="30" height="48" fill={c.primary} />
            <rect x="145" y="245" width="26" height="22" fill={c.soft} />
            <rect x="229" y="245" width="26" height="22" fill={c.soft} />
            <rect x="240" y="165" width="16" height="40" fill={c.ink} opacity="0.85" />
          </g>
        )}
        {ind === "restaurang" && (
          <g>
            <ellipse cx="200" cy="215" rx="120" ry="34" fill={c.ink} opacity="0.15" />
            <ellipse cx="200" cy="200" rx="110" ry="40" fill="#fff" />
            <ellipse cx="200" cy="195" rx="70" ry="22" fill={c.primary} opacity="0.85" />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={160 + i * 20} cy={188 + (i % 2) * 8} r="7" fill="#fff" opacity="0.9" />
            ))}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${175 + i * 25} 140 q 8 -14 0 -28 q -8 -14 0 -28`} stroke={c.ink} strokeWidth="3" fill="none" opacity="0.35" />
            ))}
          </g>
        )}
        {ind === "salong" && (
          <g>
            <ellipse cx="200" cy="165" rx="78" ry="98" fill="#fff" />
            <ellipse cx="200" cy="165" rx="64" ry="84" fill={c.soft} />
            <rect x="192" y="262" width="16" height="40" fill={c.ink} opacity="0.7" />
            <path d="M150 120 q 50 -60 100 0 q -10 40 -50 50 q -40 -10 -50 -50z" fill={c.primary} opacity="0.85" />
          </g>
        )}
        {ind === "konsult" && (
          <g>
            <rect x="90" y="90" width="220" height="150" rx="14" fill="#fff" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={115 + i * 38} y={200 - [40, 70, 55, 95, 80][i]} width="24" height={[40, 70, 55, 95, 80][i]} rx="5" fill={i === 3 ? c.primary : c.mid} />
            ))}
            <rect x="115" y="110" width="80" height="10" rx="5" fill={c.ink} opacity="0.7" />
          </g>
        )}
        {ind === "butik" && (
          <g>
            <path d="M150 260 q -40 -60 0 -130 l 30 0 q 40 70 0 130z" fill={c.primary} opacity="0.9" />
            <ellipse cx="250" cy="250" rx="60" ry="16" fill={c.ink} opacity="0.15" />
            <path d="M195 210 q 55 70 110 0z" fill="#fff" />
            <rect x="160" y="118" width="10" height="16" fill={c.ink} opacity="0.6" />
          </g>
        )}
      </svg>
      {badge && (
        <div className="absolute bottom-3 left-3 bg-white px-3 py-2 shadow-lg" style={{ borderRadius: Math.min(r, 12) }}>
          <p className="text-[10px] uppercase tracking-wide opacity-60">{badge[0]}</p>
          <p className="text-[13px] font-semibold" style={{ color: c.ink }}>
            {badge[1]}
          </p>
        </div>
      )}
      <div className="absolute right-3 top-3 flex items-center gap-1 bg-white px-2.5 py-1.5 text-[11px] font-semibold shadow-lg" style={{ borderRadius: 999, color: c.ink }}>
        <Star size={11} fill="#f5a524" strokeWidth={0} />
        {industries[ind].rating}
      </div>
    </div>
  );
}

function ProductArt({ shape, c }: { shape: string; c: Scale }) {
  return (
    <svg viewBox="0 0 100 100" className="h-3/4 w-3/4">
      <ellipse cx="50" cy="88" rx="30" ry="5" fill={c.ink} opacity="0.12" />
      {shape === "bowl" && <path d="M18 50 q 32 50 64 0z" fill={c.primary} />}
      {shape === "bowl" && <ellipse cx="50" cy="50" rx="32" ry="7" fill={c.deep} />}
      {shape === "vase" && <path d="M40 20 h20 v8 q 18 20 8 50 q -18 12 -36 0 q -10 -30 8 -50z" fill={c.primary} />}
      {shape === "cup" && (
        <g>
          <path d="M28 40 h40 v28 q -20 18 -40 0z" fill={c.primary} />
          <path d="M68 46 q 14 2 10 14 q -3 8 -10 6" stroke={c.primary} strokeWidth="5" fill="none" />
        </g>
      )}
      {shape === "cloth" && (
        <g>
          <rect x="20" y="30" width="60" height="50" rx="4" fill={c.mid} />
          <path d="M20 45 h60 M20 60 h60 M35 30 v50 M65 30 v50" stroke={c.primary} strokeWidth="3" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

function MapArt({ c, r }: { c: Scale; r: number }) {
  return (
    <div className="relative min-h-[180px] overflow-hidden" style={{ background: "#eef0ec", borderRadius: r }} aria-hidden>
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path d="M-10 140 Q 80 120 150 150 T 320 130" stroke="#bcd6e8" strokeWidth="22" fill="none" />
        <path d="M0 60 H300 M0 100 H300 M60 0 V200 M150 0 V200 M230 0 V200 M20 0 L280 200" stroke="#fff" strokeWidth="7" />
        <rect x="160" y="18" width="60" height="34" fill="#dfe8da" />
        <rect x="70" y="110" width="70" height="24" fill="#dfe8da" />
      </svg>
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
        <MapPin size={34} fill={c.primary} color="#fff" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function Person({ color, skin }: { color: string; skin: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-[88%] w-[88%]">
      <circle cx="50" cy="38" r="18" fill={skin} />
      <path d="M32 34 q 18 -26 36 0 q -4 -18 -18 -20 q -14 2 -18 20z" fill={color} opacity="0.9" />
      <path d="M14 100 q 4 -36 36 -38 q 32 2 36 38z" fill={color} />
    </svg>
  );
}
