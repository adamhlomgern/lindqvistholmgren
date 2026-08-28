import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Home, Leaf } from "lucide-react";
import { HouseIllustration } from "@/features/forma/components/HouseIllustration";
import { ConfiguratorPreview } from "@/features/forma/components/ConfiguratorPreview";
import { models } from "@/features/forma/data/models";
import { formaRoutes } from "@/features/forma/config/product";
import { formatSek } from "@/features/forma/utils/format";

const proofPoints = [
  { icon: Home, label: "20–30 m²", detail: "Tre smarta modeller" },
  { icon: Calculator, label: "Direkt pris", detail: "Se kostnaden medan du bygger" },
  { icon: Leaf, label: "Byggt för Norden", detail: "Året-runt-standard" },
];

export default function FormaHomePage() {
  return (
    <main>
      {/* ————— Hero ————— */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-forma-text lg:min-h-screen">
        <Image
          src="/images/demos/forma/hero-lake.png"
          alt="Forma 30 i faluröd träpanel vid en sjö, i kvällsljus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "70% 55%" }}
        />
        {/* Local gradient from the left, where the copy sits — not a flat
            overlay across the whole frame — so the house on the right and
            the sky stay close to their natural light. Two thin scrims (top
            for the header, bottom for the proof points) exist purely for
            text legibility, not as a mood layer. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-label text-white/70">Attefallshus, konfigurerat efter dig</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Bygg huset som
              <br />
              <span className="font-light italic text-white/90">passar ditt liv.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
              Anpassa modell, material och utrustning och få ett uppskattat pris direkt.
            </p>
            <Link
              href={formaRoutes.configure()}
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-forma-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-colors hover:bg-forma-accent-hover"
            >
              Börja konfigurera
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {proofPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-3">
                <point.icon size={18} className="text-white/60" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-white">{point.label}</p>
                  <p className="text-xs text-white/55">{point.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Manifesto ————— */}
      <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <p className="text-xs font-semibold uppercase tracking-label text-forma-accent">Filosofin</p>
          <div>
            <h2 className="text-3xl font-bold leading-[1.05] tracking-tight text-forma-text sm:text-5xl">
              Tre modeller. <span className="font-light italic">Tusentals möjligheter.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-forma-text-muted">
              Börja med en genomtänkt grundmodell. Anpassa sedan material, planlösning och detaljer tills huset
              känns som ditt.
            </p>
          </div>
        </div>
      </section>

      {/* ————— Models ————— */}
      <section id="modeller" className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 sm:pb-32 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {models.map((model, index) => {
            const featured = model.id === "forma-25";
            return (
              <Link
                key={model.id}
                href={`${formaRoutes.configure()}?model=${model.id}`}
                className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] transition-colors ${
                  featured ? "bg-forma-accent-soft/40" : "bg-forma-surface-hover"
                }`}
              >
                {/* Absolutely positioned so it never adds flow height — the
                    featured card must reserve exactly the same vertical
                    space as the other two, or every zone below it (image,
                    number, title, CTA) drifts out of alignment across the
                    row. */}
                {featured && (
                  <p className="absolute left-7 top-6 z-10 text-xs font-semibold uppercase tracking-label text-forma-accent">
                    Vår mest populära
                  </p>
                )}
                {/* Image zone: identical height on every card regardless of
                    featured status or the model's own footprint — the house
                    is centered inside it, and HouseIllustration's shared
                    viewBox keeps every model's foundation line at the same
                    Y, so this zone alone guarantees the baseline lines up. */}
                <div className="flex h-72 items-end justify-center overflow-hidden sm:h-80">
                  <HouseIllustration
                    model={model.id}
                    facade="natur"
                    roof="platt"
                    windows="standard"
                    className="h-full w-full p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                {/* Content zone: fixed structure, identical on every card —
                    number, title and meta always the same three lines, so
                    they land on the same Y across all three cards. */}
                <div className="flex flex-1 flex-col px-7 pb-8">
                  <p className="text-xs font-medium text-forma-text-faint">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-xl font-bold text-forma-text">{model.name}</h3>
                  <p className="mt-1 text-sm text-forma-text-muted">
                    {model.sizeSqm} m² · Från {formatSek(model.basePrice)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-forma-text">
                    Utforska modellen
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ————— Configurator preview ————— */}
      <section id="sa-fungerar-det" className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <ConfiguratorPreview />
      </section>
    </main>
  );
}
