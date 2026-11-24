import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Code2, Palette, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { testimonials } from "@/lib/data/testimonials";

const tags = [
  { icon: Code2, label: "Webb" },
  { icon: Palette, label: "Design" },
  { icon: TrendingUp, label: "Tillväxt" },
];

const team = [
  { name: "Ada", avatar: "/images/lindqvist-holmgren/ada-avatar-done.png" },
  { name: "Malin", avatar: "/images/lindqvist-holmgren/malin-avataar-done.png" },
];

// Rubriken säger vad kunden får (fler kunder), inte vilka vi är — det
// kommer direkt efter. Bevis (riktiga kunder, 50+ uppdrag) ligger precis
// under knapparna så att det syns innan man behöver scrolla.
export function Hero() {
  const quote = testimonials[1] ?? testimonials[0];

  return (
    <Section tone="light" className="pb-16 pt-14 md:pb-24 md:pt-20">
      <Container>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface py-1 pl-2 pr-3 text-[13px] font-medium text-fg-muted shadow-card ring-1 ring-line"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pine-100 text-pine-800">
                <tag.icon size={12} strokeWidth={2.5} />
              </span>
              {tag.label}
            </span>
          ))}
        </div>
        <h1 className="mt-7 max-w-4xl font-display text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-fg sm:text-6xl md:text-7xl">
          Webb och design som ger er <span className="text-fg-subtle">fler kunder.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
          Vi är två frilansare i Karlstad som bygger hemsidor, varumärken och marknadsföring för
          företag som vill synas och få fler förfrågningar — i Värmland och i hela Sverige.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <StartProjectButton trackingLocation="hero">
            Få ett förslag på ert projekt
            <ChevronRight size={16} strokeWidth={2.5} />
          </StartProjectButton>
          <Button href="/projekt" variant="secondary">
            Se vad vi byggt
          </Button>
        </div>
        <CtaReassurance className="mt-5" />

        <figure className="mt-10 flex max-w-2xl flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex shrink-0 items-center">
            {testimonials.map((t, i) => (
              <span
                key={t.name}
                className={`relative h-11 w-11 overflow-hidden rounded-full ring-[3px] ring-canvas ${i > 0 ? "-ml-3" : ""}`}
              >
                <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
              </span>
            ))}
            <span className="relative -ml-3 flex h-11 w-11 items-center justify-center rounded-full bg-pine-800 text-xs font-semibold text-white ring-[3px] ring-canvas">
              50+
            </span>
          </div>
          <div>
            <blockquote className="text-[15px] leading-snug text-fg">“{quote.quote}”</blockquote>
            <figcaption className="mt-1 text-sm text-fg-muted">
              {quote.name}, {quote.role} · en av 50+ företag vi hjälpt
            </figcaption>
          </div>
        </figure>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Link
            href="/tjanster"
            className="tone-pine group flex min-h-72 flex-col justify-between rounded-3xl p-8 transition-transform duration-300 ease-out hover:-translate-y-0.5 sm:p-10 md:col-span-2 md:row-span-2"
          >
            <p className="flex items-center justify-between text-sm font-medium text-fg-muted">
              Webb, design och tillväxt
              <ArrowUpRight
                size={20}
                className="text-fg transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </p>
            <div>
              <p className="max-w-lg font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                En sajt ni kan vara <span className="text-highlight">stolta</span> över.
              </p>
              <p className="mt-4 max-w-md text-fg-muted">
                Design, utveckling och innehåll från samma två personer. Klart på veckor, inte månader.
              </p>
            </div>
          </Link>
          <div className="tone-lilac flex min-h-44 flex-col justify-between rounded-3xl p-8">
            <p className="text-sm font-medium text-fg-muted">Svarstid</p>
            <p>
              <span className="block font-display text-6xl font-semibold tracking-[-0.04em] text-highlight">
                24 h
              </span>
              <span className="mt-1 block text-fg-muted">till ett första svar, alltid.</span>
            </p>
          </div>
          <Link
            href="/om-oss"
            className="group flex min-h-44 flex-col justify-between rounded-3xl bg-surface p-8 shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-raised"
          >
            <div className="flex items-center justify-between">
              <div className="flex">
                {team.map((person, i) => (
                  <span
                    key={person.name}
                    className={`relative h-11 w-11 overflow-hidden rounded-full bg-lilac-100 ring-[3px] ring-surface ${i > 0 ? "-ml-2.5" : ""}`}
                  >
                    <Image src={person.avatar} alt={person.name} fill sizes="44px" className="object-cover" />
                  </span>
                ))}
              </div>
              <ArrowUpRight size={18} className="text-fg-muted transition-colors group-hover:text-fg" />
            </div>
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em]">
              Ni pratar alltid direkt med Ada &amp; Malin.
            </p>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
