import Link from "next/link";
import { ArrowUpRight, ChevronRight, Code2, MapPin, Palette, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

const tags = [
  { icon: Code2, label: "Webb" },
  { icon: Palette, label: "Design" },
  { icon: TrendingUp, label: "Tillväxt" },
];

export function Hero() {
  return (
    <Section tone="light" className="pb-16 pt-16 md:pb-24 md:pt-24">
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
          Två frilansare. Ett team.{" "}
          <span className="text-fg-subtle">Er digitala partner.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
          Vi är ett litet, sammansvetsat team som hjälper företag växa digitalt med
          webb, design och marknadsföring — lokalt i Karlstad och Värmland, och på
          distans i hela landet.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <StartProjectButton>
            Starta ett projekt
            <ChevronRight size={16} strokeWidth={2.5} />
          </StartProjectButton>
          <Button href="/projekt" variant="secondary">
            Se vårt arbete
          </Button>
        </div>

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
          <div className="flex min-h-44 flex-col justify-between rounded-3xl bg-surface p-8 shadow-card ring-1 ring-line">
            <p className="flex items-center gap-2 text-sm font-medium text-fg-muted">
              <MapPin size={15} strokeWidth={2.25} className="text-primary" />
              Karlstad
            </p>
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em]">
              Lokalt i Värmland. På distans i hela Sverige.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
