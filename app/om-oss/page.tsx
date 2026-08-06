import type { Metadata } from "next";
import { Heart, MapPin, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { accents, badgeClasses, type Accent } from "@/lib/design/accents";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lindqvist / Holmgren är två frilansare, Ada och Malin, som tillsammans hjälper småföretag i Karlstad och hela Sverige med webb, design och marknadsföring.",
};

const team: { initial: string; name: string; role: string; accent: Accent }[] = [
  {
    initial: "A",
    name: "Ada",
    role: "Projektledning, frontend & marknadsföring",
    accent: "emerald",
  },
  {
    initial: "M",
    name: "Malin",
    role: "Utveckling, UX & digital design",
    accent: "peach",
  },
];

const values = [
  {
    icon: Users,
    title: "Ingen mellanhand",
    description: "Ni pratar alltid direkt med den som faktiskt gör jobbet — främst Ada.",
  },
  {
    icon: Sparkles,
    title: "Skräddarsytt",
    description: "Inga mallar eller genvägar. Varje projekt byggs utifrån era behov.",
  },
  {
    icon: MapPin,
    title: "Karlstad, hela Sverige",
    description: "Bas i Karlstad, men vi jobbar med kunder i hela landet på distans.",
  },
];

export default function OmOssPage() {
  return (
    <>
      <PageHero
        icon={Heart}
        eyebrow="Om oss"
        title="Två personer. Ett gemensamt hantverk."
        description="Vi är inte en stor byrå med projektledare och mellanhänder — vi är två frilansare som driver Lindqvist / Holmgren tillsammans, med bas i Karlstad. Ni pratar alltid direkt med den som faktiskt gör jobbet, och vi lägger stolthet i att leverera något genomarbetat, oavsett hur stort eller litet projektet är."
      />
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((person) => (
              <GlassCard key={person.name} accent={person.accent}>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${badgeClasses[person.accent]}`}
                  >
                    {person.initial}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-bone">{person.name}</p>
                    <p className="mt-1 text-sm text-stone">{person.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {values.map((value, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={value.title} accent={accent}>
                  <AccentBadge icon={value.icon} accent={accent} />
                  <h2 className="mt-4 font-display text-lg font-bold text-bone">{value.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{value.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
