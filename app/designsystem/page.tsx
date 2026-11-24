import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Check, ArrowRight, Info } from "lucide-react";
import { palette, steps, type ScaleName } from "@/lib/design-system/palette";
import { contrast } from "@/lib/design-system/contrast";

// Lekplats för det nya ljusa designsystemet. Ligger utanför SiteChrome
// (se components/layout/SiteChrome.tsx) så att den mörka headern/footern inte
// påverkar hur färgerna upplevs, och indexeras inte.
export const metadata: Metadata = {
  title: "Designsystem (utkast)",
  robots: { index: false, follow: false },
};

const scaleInfo: Record<ScaleName, { name: string; role: string }> = {
  pine: { name: "Pine", role: "Primär. Djupgrön bas för knappar, länkar och mörka block." },
  mint: { name: "Mint", role: "Signal. Klargrön CTA på mörka ytor (som Fortum), alltid med mörk text." },
  lilac: { name: "Lilac", role: "Sekundär yta. Mjuka lila sektioner och kort." },
  plum: { name: "Plum", role: "Vinröd. Rubriker och accenter på lila och rosa ytor." },
  blush: { name: "Blush", role: "Rosa. Rubrikaccent på grönt och vinrött, lätta bakgrunder." },
  ink: { name: "Ink", role: "Neutral med en gnutta grönt. Text, linjer och grå ytor." },
};

const tones = [
  { id: "light", label: "Light", note: "Standard. Vit canvas, nästan svart text." },
  { id: "mist", label: "Mist", note: "Grå-grön variant för att separera sektioner." },
  { id: "pine", label: "Pine", note: "Mörkt block för hero, CTA och avslut." },
  { id: "lilac", label: "Lilac", note: "Mjuk lila sektion med vinröd text." },
  { id: "plum", label: "Plum", note: "Vinrött block för det mest framträdande." },
  { id: "blush", label: "Blush", note: "Ljusrosa, för citat och detaljer." },
] as const;

function Badge({ ratio }: { ratio: number }) {
  const label = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA stor" : "–";
  return (
    <span className="tabular-nums">
      {ratio.toFixed(1)} <span className="opacity-70">{label}</span>
    </span>
  );
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover">
      {children}
    </button>
  );
}

function CtaButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-semibold text-on-cta transition-colors hover:bg-cta-hover">
      {children}
    </button>
  );
}

function OutlineButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-sunken">
      {children}
    </button>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">{children}</p>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="tone-light min-h-screen font-sans">
      {/* Intro */}
      <header className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6">
        <Eyebrow>Lindqvist / Holmgren — designsystem, utkast 01</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Ljust och rent som grund, <span className="text-highlight">färg</span> där det betyder något.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">
          Sex färgskalor i elva steg och sex ytor (tones) som byter färg på allt innehåll i en sektion.
          Varje kombination på sidan klarar WCAG AA. Det betyder att den går att läsa även på
          skärmar som är ljusa, mörka eller dåligt kalibrerade.
        </p>
      </header>

      {/* Hero-exempel i Fortum-anda */}
      <section className="relative">
        <div className="tone-lilac h-56 sm:h-72" aria-hidden>
          <div className="mx-auto flex h-full max-w-6xl items-center justify-end px-4 sm:px-6">
            <span className="font-display text-6xl font-bold tracking-tight text-highlight sm:text-8xl">
              qvistgren
            </span>
          </div>
        </div>
        <div
          className="tone-pine -mt-16 pb-24 pt-24"
          style={{ clipPath: "polygon(0 4rem, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-highlight">
                Starta ett projekt
              </h2>
              <p className="mt-4 text-lg font-medium leading-relaxed">
                Berätta kort vad ni behöver, så återkommer vi inom en arbetsdag med ett förslag och
                ett pris.
              </p>
              <p className="mt-2 text-fg-muted">Personligt, utan mellanhänder.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaButton>
                  Hjälp oss förstå ert behov <ArrowRight className="size-4" />
                </CtaButton>
                <OutlineButton>Se våra case</OutlineButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prislapps-kort, som Fortums avtalskort */}
      <section className="tone-mist py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Komponenter</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Kort med olika djup</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { tone: "tone-pine", title: "Hemsida", price: "från 24 000 kr", featured: true },
              { tone: "tone-light", title: "Löpande förvaltning", price: "från 1 900 kr/mån" },
              { tone: "tone-lilac", title: "Varumärke & identitet", price: "offert" },
            ].map((card) => (
              <article
                key={card.title}
                className={`${card.tone} flex flex-col rounded-2xl p-7 shadow-[0_1px_2px_rgb(21_31_28/0.06),0_8px_24px_-8px_rgb(21_31_28/0.12)] ${card.tone === "tone-light" ? "ring-1 ring-line" : ""}`}
              >
                <h3 className="text-center font-display text-xl font-bold text-highlight">{card.title}</h3>
                <ul className="mt-6 space-y-3 text-[15px] font-medium">
                  {["Personlig kontakt hela vägen", "Klart på veckor, inte månader", "Ni äger allt material"].map(
                    (t) => (
                      <li key={t} className="flex gap-3">
                        <Check className="mt-0.5 size-5 shrink-0 text-check" strokeWidth={2.5} />
                        {t}
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-auto pt-10">
                  <p className="font-display text-2xl font-bold">{card.price}</p>
                  <p className="mt-1 text-sm text-fg-muted">exkl. moms</p>
                  <div className="mt-6 [&>button]:w-full [&>button]:justify-center">
                    {card.featured ? <CtaButton>Välj Hemsida</CtaButton> : <PrimaryButton>Läs mer</PrimaryButton>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Djup: canvas → sunken → surface → raised */}
          <div className="mt-14 rounded-2xl bg-surface-sunken p-6 ring-1 ring-line sm:p-8">
            <p className="text-sm font-semibold text-fg-muted">surface-sunken</p>
            <div className="mt-4 rounded-xl bg-surface p-6 ring-1 ring-line">
              <p className="text-sm font-semibold text-fg-muted">surface</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface p-5 shadow-[0_1px_2px_rgb(21_31_28/0.06),0_12px_32px_-12px_rgb(21_31_28/0.2)] ring-1 ring-line">
                  <p className="text-sm font-semibold">raised (skugga)</p>
                  <p className="mt-1 text-sm text-fg-muted">Dialoger, menyer, kort som ska lyftas.</p>
                </div>
                <div className="flex gap-3 rounded-xl bg-pine-50 p-5 text-pine-900 ring-1 ring-pine-200">
                  <Info className="mt-0.5 size-5 shrink-0 text-pine-700" />
                  <div>
                    <p className="text-sm font-semibold">Infoyta</p>
                    <p className="mt-1 text-sm">Steg 50 som bakgrund, 900 som text: 13:1.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PrimaryButton>Primär</PrimaryButton>
                <OutlineButton>Sekundär</OutlineButton>
                <a href="#" className="text-sm font-semibold text-primary underline underline-offset-4">
                  Länk
                </a>
                <span className="rounded-full bg-lilac-100 px-3 py-1 text-xs font-semibold text-plum-800">Ny</span>
                <span className="rounded-full bg-pine-100 px-3 py-1 text-xs font-semibold text-pine-800">Klar</span>
                <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-800">Design</span>
                <span className="rounded-full bg-plum-100 px-3 py-1 text-xs font-semibold text-plum-800">Akut</span>
              </div>
              <label className="mt-6 block max-w-sm">
                <span className="text-sm font-semibold">E-post</span>
                <input
                  placeholder="namn@foretag.se"
                  className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-4 focus:ring-pine-100"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Tones */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Ytor</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Sex tones, samma komponenter</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">
            Lägg <code className="rounded bg-surface-sunken px-1.5 py-0.5 text-sm">tone-pine</code> på en
            sektion så byter text, knappar, linjer och kort färg av sig själva. Ingen komponent behöver
            egna mörka eller ljusa varianter.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tones.map((t) => (
              <div key={t.id} className={`tone-${t.id} rounded-2xl p-6 ring-1 ring-line`}>
                <Eyebrow>tone-{t.id}</Eyebrow>
                <h3 className="mt-2 font-display text-2xl font-bold">
                  {t.label} <span className="text-highlight">yta</span>
                </h3>
                <p className="mt-2 text-fg-muted">{t.note}</p>
                <div className="mt-5 rounded-xl bg-surface p-4">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Check className="size-4 text-check" strokeWidth={2.5} /> Kort på surface
                  </p>
                  <p className="mt-1 text-sm text-fg-subtle">Hjälptext i fg-subtle</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <PrimaryButton>Primär</PrimaryButton>
                  <OutlineButton>Sekundär</OutlineButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logotypblock, som i utkastet */}
      <section className="grid sm:grid-cols-2">
        <div className="tone-lilac flex aspect-[16/9] items-center justify-center">
          <span className="font-display text-5xl font-bold tracking-tight text-highlight sm:text-6xl">qvistgren</span>
        </div>
        <div className="tone-pine flex aspect-[16/9] items-center justify-center">
          <span className="font-display text-5xl font-bold tracking-tight text-highlight sm:text-6xl">qvistgren</span>
        </div>
        <div className="tone-plum flex aspect-[16/9] items-center justify-center">
          <span className="font-display text-5xl font-bold tracking-tight text-highlight sm:text-6xl">qvistgren</span>
        </div>
        <div className="tone-blush flex aspect-[16/9] items-center justify-center">
          <span className="font-display text-5xl font-bold tracking-tight text-highlight sm:text-6xl">qvistgren</span>
        </div>
      </section>

      {/* Skalor */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Färgskalor</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Elva steg per färg</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">
            Samma ljushet på samma steg i alla skalor, så att plum-700 och pine-700 har ungefär lika
            stark kontrast. Siffrorna visar kontrasten mot vit text och mot ink-950. Från steg 600 och
            uppåt klarar vit text AA.
          </p>
          <div className="mt-10 space-y-10">
            {(Object.keys(palette) as ScaleName[]).map((name) => (
              <div key={name}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-lg font-bold">{scaleInfo[name].name}</h3>
                  <p className="text-sm text-fg-muted">{scaleInfo[name].role}</p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-11">
                  {steps.map((step) => {
                    const hex = palette[name][step];
                    const onWhite = contrast(hex, "#ffffff");
                    const onInk = contrast(hex, palette.ink[950]);
                    const text = onWhite >= onInk ? "#ffffff" : palette.ink[950];
                    return (
                      <div
                        key={step}
                        className="flex aspect-[4/5] flex-col justify-between rounded-lg p-2.5 text-[11px] leading-tight"
                        style={{ background: hex, color: text }}
                      >
                        <span className="text-sm font-bold">{step}</span>
                        <span>
                          <span className="block font-mono uppercase">{hex}</span>
                          <span className="mt-1 block">
                            ◻ <Badge ratio={onWhite} />
                          </span>
                          <span className="block">
                            ◼ <Badge ratio={onInk} />
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="tone-pine py-12">
        <div className="mx-auto max-w-6xl px-4 text-sm text-fg-muted sm:px-6">
          Utkast på branchen <code className="text-fg">claude/hopeful-brown-wvkdjt</code>. Inget här
          påverkar den publika sajten än.
        </div>
      </footer>
    </div>
  );
}
