import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Bell,
  Car,
  ChevronRight,
  ClipboardList,
  Cog,
  Flame,
  Gauge,
  Sparkles,
  Wind,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { accents } from "@/lib/design/accents";
import { serviceRoutes } from "@/features/service-platform/config/product";

export const metadata: Metadata = {
  title: "Servicekoll — demo",
  description:
    "Håll koll på vad som behöver service innan det blir för sent. Se en interaktiv demo av Servicekoll, ett service- och underhållssystem för valfri bransch.",
};

const useCases = [
  { icon: Car, title: "Bil & verkstad", description: "Registreringsnummer, servicehistorik och påminnelser för kundernas fordon." },
  { icon: Flame, title: "VVS", description: "Serienummer och serviceintervall för värmepumpar och installationer hos era kunder." },
  { icon: Wind, title: "Ventilation", description: "Kontroll- och servicedatum för ventilationsaggregat." },
  { icon: Cog, title: "Maskiner", description: "Underhållsplaner för maskinpark, kompressorer och entreprenadmaskiner." },
  { icon: ClipboardList, title: "Företagets egen utrustning", description: "Egna fordon, truckar och utrustning som behöver återkommande kontroll." },
];

const steps = [
  { icon: ClipboardList, title: "Lägg till objekt", description: "Registrera kunder och objekt manuellt eller importera i bulk." },
  { icon: Gauge, title: "Se vad som behöver service", description: "Dashboarden visar direkt vad som är försenat eller snart dags." },
  { icon: Bell, title: "Påminnelser sköter sig själva", description: "Systemet planerar email- och sms-påminnelser innan servicedatumet." },
];

export default function ServicekollMarketingPage() {
  return (
    <>
      <PageHero
        icon={Sparkles}
        eyebrow="Produktdemo"
        title="Håll koll på vad som behöver service — innan det blir för sent"
        description="Samla kunder, fordon, maskiner och utrustning på ett ställe. Se kommande service, automatisera påminnelser och registrera historik. Fungerar för alla branscher med återkommande underhåll."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Servicekoll" }]}
        visual={
          <div className="relative mx-auto w-[220px] translate-y-[140px] rotate-3 sm:w-[260px] sm:translate-y-[175px] lg:mx-0 lg:w-[270px] lg:translate-y-0">
            {/* Cropped to roughly the top half on small screens, with a
                hard-cut (unrounded) bottom edge. translate-y shifts the
                (normally-positioned, space-still-reserved) card down past
                the hero section's own bottom edge so it visually sticks up
                out of — and half behind — the section below, instead of a
                long strip of app stacked under the hero copy. Full
                screenshot, normal corners and no shift on desktop, where it
                sits beside the text instead of above the next section. */}
            <div className="animate-float relative h-[290px] overflow-hidden rounded-t-2xl border border-bone/10 shadow-2xl shadow-charcoal/50 ring-1 ring-bone/5 sm:h-[340px] lg:h-[493px] lg:rounded-2xl">
              <Image
                src="/images/demos/servicekoll-mobileview.png"
                alt="Servicekoll i mobilen"
                fill
                sizes="(min-width: 1024px) 270px, (min-width: 640px) 260px, 220px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        }
      >
        <Button href={serviceRoutes.dashboard()}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
      </PageHero>

      {/* relative z-10: the hero preview image above overflows past its
          section's bottom edge on mobile/tablet via a negative margin — this
          stacking context needs to sit above that (position:relative)
          overflow so its own background covers the card's lower half instead
          of the card floating fully in front of it. */}
      <Section tone="olive" className="relative z-10">
        <Container>
          <Eyebrow icon={Sparkles}>Passar er bransch</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            En plattform, många branscher
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            Samma system fungerar oavsett om ni servar kunders utrustning eller vill hålla koll på er egen.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={useCase.title} accent={accent}>
                  <AccentBadge icon={useCase.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{useCase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{useCase.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <Eyebrow icon={Gauge}>Så fungerar det</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Från kundlista till skickad påminnelse
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => {
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
          <GlassCard accent="emerald" className="-m-6 items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
                Klicka runt i en färdig demo
              </h2>
              <p className="mt-2 text-stone">
                Ingen inloggning behövs — testa med färdig exempeldata direkt, för bilverkstad, VVS eller eget underhåll.
              </p>
            </div>
            <Link
              href={serviceRoutes.dashboard()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Öppna Servicekoll
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>
    </>
  );
}
