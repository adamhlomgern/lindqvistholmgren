import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
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
  pine: { name: "Pine", role: "Den enda starka färgen. Knappar, länkar, mörka block." },
  lilac: { name: "Lilac", role: "Mjuk yta. Aldrig som text på vitt." },
  plum: { name: "Plum", role: "Liten accent på lila. Sparsamt." },
  ink: { name: "Ink", role: "Neutral grå. Text, linjer, grå ytor." },
};

const core = [
  { name: "White", token: "canvas", hex: "#ffffff" },
  { name: "Ink 950", token: "fg", hex: palette.ink[950] },
  { name: "Pine 800", token: "primary", hex: palette.pine[800] },
  { name: "Lilac 200", token: "tone-lilac", hex: palette.lilac[200] },
  { name: "Plum 800", token: "accent", hex: palette.plum[800] },
];

const tones = [
  { id: "light", note: "Standard. Det mesta av sajten." },
  { id: "subtle", note: "Ljusgrå, för att skilja sektioner åt." },
  { id: "pine", note: "Mörkt block. Hero, CTA, footer." },
  { id: "lilac", note: "Mjukt block. Citat, case, detaljer." },
] as const;

const card = "rounded-2xl ring-1 ring-line";

function Button({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "outline" }) {
  const styles =
    variant === "primary"
      ? "bg-primary text-on-primary hover:bg-primary-hover"
      : "ring-1 ring-inset ring-line-strong text-fg hover:bg-surface-sunken";
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors ${styles}`}
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-fg-muted">{children}</p>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{children}</h2>;
}

export default function DesignSystemPage() {
  return (
    <div className="tone-light min-h-screen font-sans antialiased">
      {/* Nav */}
      <nav className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-semibold tracking-[-0.04em]">qvistgren</span>
          <div className="hidden items-center gap-8 text-[15px] text-fg-muted md:flex">
            <span className="text-fg">Tjänster</span>
            <span>Case</span>
            <span>Om oss</span>
            <span>Artiklar</span>
          </div>
          <Button>Kontakt</Button>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <Label>Designsystem · utkast 02</Label>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl">
          Webb och design som syns.{" "}
          <span className="text-fg-subtle">Utan krångel.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
          Vitt och svart bär sidan. Grönt är den enda starka färgen, lila en mjuk yta. Allt
          annat är luft.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button>
            Starta ett projekt <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline">Se våra case</Button>
        </div>
      </header>

      {/* Bento */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="tone-pine flex min-h-80 flex-col justify-between rounded-3xl p-8 md:col-span-2 md:row-span-2 sm:p-10">
            <Label>Hemsidor</Label>
            <div>
              <p className="max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                En sajt ni kan vara <span className="text-highlight">stolta</span> över.
              </p>
              <p className="mt-4 max-w-md text-fg-muted">
                Design, utveckling och innehåll från samma två personer. Klart på veckor.
              </p>
              <div className="mt-8">
                <Button>
                  Läs mer <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="tone-lilac flex flex-col justify-between rounded-3xl p-8">
            <Label>Svarstid</Label>
            <p>
              <span className="block text-6xl font-semibold tracking-[-0.05em] text-highlight">24 h</span>
              <span className="mt-1 block text-fg-muted">till ett första förslag.</span>
            </p>
          </div>
          <div className={`${card} flex flex-col justify-between p-8`}>
            <Label>Senaste case</Label>
            <p className="flex items-end justify-between gap-4">
              <span className="text-xl font-semibold tracking-[-0.02em]">Mumsa — beställning online</span>
              <ArrowUpRight className="size-5 shrink-0 text-fg-muted" />
            </p>
          </div>
        </div>
      </section>

      {/* Priskort */}
      <section className="tone-subtle py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Label>Komponenter</Label>
          <H2>Kort och priser</H2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { tone: "tone-light", title: "Löpande", price: "1 900 kr", unit: "/mån" },
              { tone: "tone-pine", title: "Hemsida", price: "24 000 kr", unit: "", featured: true },
              { tone: "tone-light", title: "Identitet", price: "Offert", unit: "" },
            ].map((c) => (
              <article
                key={c.title}
                className={`${c.tone} flex flex-col rounded-3xl p-8 ${c.featured ? "" : "ring-1 ring-line"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{c.title}</h3>
                  {c.featured && (
                    <span className="rounded-full bg-lilac-200 px-2.5 py-1 text-xs font-medium text-plum-900">
                      Populärast
                    </span>
                  )}
                </div>
                <p className="mt-6">
                  <span className="text-4xl font-semibold tracking-[-0.04em]">{c.price}</span>
                  <span className="text-fg-muted">{c.unit}</span>
                </p>
                <p className="mt-1 text-sm text-fg-muted">exkl. moms</p>
                <ul className="mt-8 space-y-3 border-t border-line pt-8 text-[15px]">
                  {["Personlig kontakt hela vägen", "Klart på veckor, inte månader", "Ni äger allt material"].map(
                    (t) => (
                      <li key={t} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-check" strokeWidth={2.5} />
                        {t}
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-10 grid">
                  <Button variant={c.featured ? "primary" : "outline"}>Välj {c.title.toLowerCase()}</Button>
                </div>
              </article>
            ))}
          </div>

          <div className={`${card} mt-4 grid gap-10 bg-surface p-8 md:grid-cols-2`}>
            <div>
              <Label>Knappar & taggar</Label>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button>Primär</Button>
                <Button variant="outline">Sekundär</Button>
                <a href="#" className="text-[15px] font-medium text-primary underline decoration-line-strong underline-offset-4 hover:decoration-primary">
                  Länk
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-fg-muted">Utkast</span>
                <span className="rounded-full bg-pine-50 px-2.5 py-1 text-pine-800">Klar</span>
                <span className="rounded-full bg-lilac-100 px-2.5 py-1 text-plum-900">Ny</span>
              </div>
            </div>
            <label className="block">
              <Label>Fält</Label>
              <input
                placeholder="namn@foretag.se"
                className="mt-5 h-11 w-full rounded-xl bg-surface px-4 text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="mt-2 block text-sm text-fg-subtle">Vi svarar inom en arbetsdag.</span>
            </label>
          </div>
        </div>
      </section>

      {/* Ytor */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Label>Ytor</Label>
          <H2>Fyra tones. Inte fler.</H2>
          <p className="mt-4 max-w-xl text-fg-muted">
            En klass på en sektion, till exempel <code className="text-fg">tone-pine</code>, byter färg på
            text, knappar och linjer. Komponenterna är desamma överallt.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tones.map((t) => (
              <div key={t.id} className={`tone-${t.id} flex min-h-64 flex-col rounded-3xl p-6 ring-1 ring-line`}>
                <Label>tone-{t.id}</Label>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Rubrik <span className="text-highlight">här</span>
                </p>
                <p className="mt-2 text-[15px] text-fg-muted">{t.note}</p>
                <div className="mt-auto pt-6">
                  <Button>Knapp</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Palett */}
      <section className="tone-subtle py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Label>Palett</Label>
          <H2>Fem färger bär allt</H2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {core.map((c) => (
              <div key={c.name}>
                <div className="aspect-square rounded-2xl ring-1 ring-inset ring-line" style={{ background: c.hex }} />
                <p className="mt-3 text-[15px] font-medium">{c.name}</p>
                <p className="font-mono text-xs uppercase text-fg-muted">
                  {c.hex} · {c.token}
                </p>
              </div>
            ))}
          </div>

          <details className="group mt-16">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-fg">
              <span className="underline decoration-line-strong underline-offset-4 group-open:hidden">
                Visa alla skalor med kontrast
              </span>
              <span className="hidden underline decoration-line-strong underline-offset-4 group-open:inline">
                Dölj skalorna
              </span>
            </summary>
            <div className="mt-8 space-y-8">
              {(Object.keys(palette) as ScaleName[]).map((name) => (
                <div key={name}>
                  <p className="text-[15px]">
                    <span className="font-semibold">{scaleInfo[name].name}</span>{" "}
                    <span className="text-fg-muted">— {scaleInfo[name].role}</span>
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-11">
                    {steps.map((step) => {
                      const hex = palette[name][step];
                      const onWhite = contrast(hex, "#ffffff");
                      const onInk = contrast(hex, palette.ink[950]);
                      const light = onWhite >= onInk;
                      return (
                        <div
                          key={step}
                          className="flex aspect-[4/3] flex-col justify-between rounded-lg p-2 text-[11px] leading-tight"
                          style={{ background: hex, color: light ? "#ffffff" : palette.ink[950] }}
                        >
                          <span className="font-semibold">{step}</span>
                          <span className="tabular-nums opacity-80">
                            {Math.max(onWhite, onInk).toFixed(1)}:1
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <footer className="tone-pine">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <p className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Hör av er.<span className="text-highlight"> Vi svarar snabbt.</span>
          </p>
          <p className="text-sm text-fg-muted">Utkast 02 · claude/hopeful-brown-wvkdjt</p>
        </div>
      </footer>
    </div>
  );
}
