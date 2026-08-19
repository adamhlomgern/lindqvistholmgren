import type { Metadata } from "next";
import Link from "next/link";
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
  { icon: Flame, title: "Värmepumpar", description: "Serienummer och serviceintervall för anläggningar hos era kunder." },
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
        eyebrow="Produktdemo från Lindqvist / Holmgren"
        title="Håll koll på vad som behöver service — innan det blir för sent"
        description="Samla kunder, fordon, maskiner och utrustning på ett ställe. Se kommande service, automatisera påminnelser och registrera historik. Fungerar för alla branscher med återkommande underhåll."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Servicekoll" }]}
      >
        <Button href={serviceRoutes.dashboard()}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
      </PageHero>

      <Section tone="olive">
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
                Ingen inloggning behövs — testa med färdig exempeldata direkt, för bilverkstad, värmepump eller eget underhåll.
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
