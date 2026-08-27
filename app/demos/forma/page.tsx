import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calculator, ChevronRight, GitBranch, Home, Layers, Palette, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { accents } from "@/lib/design/accents";
import { formaRoutes } from "@/features/forma/config/product";

export const metadata: Metadata = {
  title: "Forma — produktkonfigurator för attefallshus",
  description:
    "Forma är en interaktiv produktkonfigurator och offertmotor — bygg ditt eget attefallshus, se priset uppdateras live och skicka en kvalificerad offertförfrågan.",
};

const differentiators = [
  {
    icon: Palette,
    title: "Visuell konfigurator",
    description: "Varje val — fasad, tak, fönster — uppdaterar husets illustration direkt, inte bara en textlista.",
  },
  {
    icon: Calculator,
    title: "Realtidspris",
    description: "Priset räknas fram löpande utifrån varje val, med ett realistiskt intervall snarare än en falsk exakthet.",
  },
  {
    icon: GitBranch,
    title: "Regelmotor",
    description: "Automatiska krav, inkompatibla kombinationer och rekommendationer — deklarativa regler, inte hårdkodad if-logik i UI:t.",
  },
  {
    icon: Target,
    title: "Kvalificerade leads",
    description: "Offertförfrågan följer med hela konfigurationen — säljaren ser exakt vad kunden vill ha, inte bara ett namn och en fråga.",
  },
];

const journey = [
  { icon: Home, title: "Konfigurera", description: "Modell, exteriör, planlösning, kök, badrum och tillval — åtta steg, ett pris som följer med hela vägen." },
  { icon: Layers, title: "Sammanställning", description: "En visuell sammanfattning av hela huset, med ett prisintervall och tydlig reservation för markarbete." },
  { icon: Target, title: "Offert & lead", description: "Kunden skickar in kontaktuppgifter — säljaren ser förfrågan med hela konfigurationen i en enkel lista." },
];

export default function FormaMarketingPage() {
  return (
    <>
      <PageHero
        icon={Home}
        eyebrow="Produktkonfigurator & offertmotor"
        title="Vi kan digitalisera hela er säljprocess — inte bara bygga en hemsida"
        description="Forma visar hur en kund kan konfigurera en egen lösning visuellt, se ett pris i realtid och skicka en kvalificerad offertförfrågan — här med attefallshus som exempelbransch."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Forma" }]}
        visual={
          <div className="relative mx-auto w-[260px] rotate-2 sm:w-[300px] lg:mx-0 lg:w-[360px]">
            {/* Real render, not a UI screenshot — no synthetic glow, same
                reasoning as Mumsa's hero photo: it already has its own warm
                light from the house windows. */}
            <div className="relative h-[340px] overflow-hidden rounded-[1.75rem] border border-bone/10 shadow-2xl shadow-charcoal/50 ring-1 ring-bone/5 sm:h-[400px]">
              <Image
                src="/images/demos/forma/hero-attefallshus.webp"
                alt="Forma 30 i faluröd träpanel med sadeltak, i skymning"
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 300px, 260px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        }
      >
        <Button href={formaRoutes.home()}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
        <Button href={formaRoutes.contactCta()} variant="secondary">
          Vill ni ha en egen konfigurator?
        </Button>
      </PageHero>

      <Section tone="olive">
        <Container>
          <Eyebrow icon={Layers}>Mer än ett kontaktformulär</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Konfiguratorer, kalkylatorer och komplex affärslogik
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            De flesta av våra demos visar kompletta system. Forma visar något annat — ett fristående, avancerat
            säljverktyg som kan byggas runt hur ett specifikt företag faktiskt säljer, med produktvisualisering och
            regelstyrd prissättning i centrum.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={item.title} accent={accent}>
                  <AccentBadge icon={item.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{item.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <Eyebrow icon={Target}>Från konfiguration till kvalificerat lead</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Tre steg, en sammanhängande resa
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {journey.map((step, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={step.title} accent={accent}>
                  <AccentBadge icon={step.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <GlassCard accent="peach" className="-m-6 items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
                Sälj ni något med flera val, tillval och prisberoenden?
              </h2>
              <p className="mt-2 text-stone">
                Attefallshus är exempelbranschen — samma konfigurator- och regelmotor kan byggas runt vilken
                produktkatalog som helst med varianter, tillval och beroenden mellan val.
              </p>
            </div>
            <Link
              href={formaRoutes.contactCta()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-peach px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Prata med oss
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <GlassCard accent="emerald" className="-m-6 items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">Klicka runt i en färdig demo</h2>
              <p className="mt-2 text-stone">
                Ingen inloggning behövs — bygg ett hus från grunden, se priset uppdateras live och skicka en
                offertförfrågan.
              </p>
            </div>
            <Link
              href={formaRoutes.home()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Öppna Forma
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>
    </>
  );
}
