import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BarChart3,
  ChefHat,
  ChevronRight,
  ClipboardList,
  Palette,
  Pizza,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { accents } from "@/lib/design/accents";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";

export const metadata: Metadata = {
  title: "Mumsa — demo",
  description:
    "En egen beställningssida för restauranger — kunder beställer online, restaurangen ser ordrarna live och ägaren följer försäljningen. Se en interaktiv demo av Mumsa.",
};

const onboardingSteps = [
  { icon: Palette, title: "Namn, logga & meny", description: "Välj varumärkesfärg och importera menyn från en färdig mall — redo på några minuter." },
  { icon: ShoppingBag, title: "Kunder beställer direkt", description: "En egen beställningssida med bilder, tillbehör och avhämtning eller leverans." },
  { icon: ChefHat, title: "Ordrar landar i köket live", description: "Restaurangen bekräftar, markerar tillagas, redo och levererad — i realtid." },
  { icon: BarChart3, title: "Ägaren följer försäljningen", description: "Dagens omsättning, antal ordrar och mest sålda rätter, alltid uppdaterat." },
];

const views = [
  { icon: Pizza, title: "Kund", description: "Bläddrar menyn med bilder, väljer tillbehör och storlek, betalar och följer sin order live." },
  { icon: ChefHat, title: "Restaurang", description: "Ser nya ordrar dyka upp direkt, flyttar dem genom köket och slår av/på leverans." },
  { icon: Truck, title: "Ägare", description: "Statistik över dagens försäljning, snittordervärde och vilka rätter som säljer bäst." },
];

export default function MumsaMarketingPage() {
  return (
    <>
      <PageHero
        icon={Sparkles}
        eyebrow="Produktdemo från Lindqvist / Holmgren"
        title="En egen beställningssida — redo på några minuter"
        description="Onboarda restaurangen med logga, meny och öppettider. Kunder beställer direkt på sajten, restaurangen ser ordrarna live i köket och ägaren följer försäljningen — allt i samma system."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Mumsa" }]}
        visual={
          <div className="relative mx-auto w-[220px] -rotate-2 sm:w-[260px] lg:mx-0 lg:w-[300px]">
            {/* No synthetic ambient glow behind this one, unlike Servicekoll's
                hero: that's a flat UI screenshot that benefits from an added
                halo, but this is a real photo that already has its own warm
                light from the oven — an extra CSS glow just reads as a stray
                smudge above the card instead of intentional lighting. */}
            <div className="animate-float relative h-[280px] overflow-hidden rounded-[1.75rem] border border-bone/10 shadow-2xl shadow-charcoal/50 ring-1 ring-bone/5 sm:h-[340px]">
              <Image
                src="/images/demos/mumsa/hero-pizza-oven.jpg"
                alt="Nybakad pizza"
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 260px, 220px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        }
      >
        <Button href={mumsaRoutes.storefront()}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
        <Button href={mumsaRoutes.onboarding()} variant="secondary">
          Se onboardingflödet
        </Button>
      </PageHero>

      <Section tone="olive">
        <Container>
          <Eyebrow icon={Sparkles}>Så fungerar det</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Från tom meny till första ordern
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            Restaurangen kommer igång utan tekniskt kunnande — och kunderna märker aldrig att det inte är en dyr, skräddarsydd lösning.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {onboardingSteps.map((step, index) => {
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
          <Eyebrow icon={ClipboardList}>Tre vyer, ett system</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Kund, restaurang och ägare ser samma order
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {views.map((view, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={view.title} accent={accent}>
                  <AccentBadge icon={view.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{view.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{view.description}</p>
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
                Klicka runt i en färdig demo
              </h2>
              <p className="mt-2 text-stone">
                Ingen inloggning behövs — beställ en pizza som kund, byt vy och se ordern landa i köket direkt.
              </p>
            </div>
            <Link
              href={mumsaRoutes.storefront()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-peach px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Öppna Mumsa
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>
    </>
  );
}
