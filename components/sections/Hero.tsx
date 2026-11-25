import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { HeroShowcase, HeroShowcaseProvider, HeroTags } from "@/components/visuals/HeroShowcase";
import { testimonials } from "@/lib/data/testimonials";

const team = [
  { name: "Ada", avatar: "/images/lindqvist-holmgren/ada-avatar-done.png" },
  { name: "Malin", avatar: "/images/lindqvist-holmgren/malin-avataar-done.png" },
];

// Kort rubrik, personlig ingress och ett riktigt kundcitat direkt under
// knapparna. Taggarna styr illustrationen till höger (HeroShowcase).
export function Hero() {
  const quote = testimonials[1] ?? testimonials[0];

  return (
    <Section tone="light" className="pb-16 pt-14 md:pb-24 md:pt-20">
      <Container>
        <HeroShowcaseProvider>
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
          <div>
          <HeroTags />
          <h1 className="mt-7 max-w-xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg sm:text-[3.25rem] xl:text-[3.6rem]">
            Vi bygger det ert företag behöver <span className="text-fg-subtle">på nätet.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Hej! Vi är Ada och Malin, två frilansare i Karlstad. Vi gör hemsidor, webbshoppar, logotyper
            och egna system som bokning och kundportaler. Ni pratar alltid direkt med oss.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <StartProjectButton trackingLocation="hero">
              Berätta om ert projekt
              <ChevronRight size={16} strokeWidth={2.5} />
            </StartProjectButton>
            <Button href="/projekt" variant="secondary">
              Se våra case
            </Button>
          </div>
          <CtaReassurance className="mt-5" />

          <figure className="mt-10 flex max-w-xl flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex shrink-0 items-center">
              {testimonials.map((t, i) => (
                <span
                  key={t.name}
                  className={`relative h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-canvas ${i > 0 ? "-ml-3" : ""}`}
                >
                  <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                </span>
              ))}
            </div>
            <div>
              <blockquote className="text-[15px] leading-snug text-fg">“{quote.quote}”</blockquote>
              <figcaption className="mt-1 text-sm text-fg-muted">
                {quote.name}, {quote.role}
              </figcaption>
            </div>
          </figure>
          </div>
          <Reveal delay={0.2}>
            <HeroShowcase />
          </Reveal>
        </div>
        </HeroShowcaseProvider>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-3">
          <div className="bg-surface p-7">
            <p className="text-sm text-fg-muted">Företag vi hjälpt</p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-[-0.04em] text-fg">
              <CountUp to={50} suffix="+" />
            </p>
          </div>
          <div className="tone-lilac p-7">
            <p className="text-sm text-fg-muted">Svarstid, alltid</p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-[-0.04em] text-highlight">
              <CountUp to={24} suffix=" h" />
            </p>
          </div>
          <Link href="/om-oss" className="group flex items-end justify-between gap-4 bg-surface p-7 transition-colors hover:bg-surface-sunken">
            <div>
              <p className="text-sm text-fg-muted">Ni pratar alltid med</p>
              <p className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-fg">Ada &amp; Malin</p>
            </div>
            <div className="flex">
              {team.map((person, i) => (
                <span
                  key={person.name}
                  className={`relative h-12 w-12 overflow-hidden rounded-full bg-lilac-100 ring-[3px] ring-surface ${i > 0 ? "-ml-3" : ""}`}
                >
                  <Image src={person.avatar} alt={person.name} fill sizes="48px" className="object-cover" />
                </span>
              ))}
            </div>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
