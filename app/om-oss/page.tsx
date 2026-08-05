import type { Metadata } from "next";
import { Heart, MapPin, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lindqvist / Holmgren är två frilansare, Ada och Malin, som tillsammans hjälper småföretag i Karlstad och hela Sverige med webb, design och marknadsföring.",
};

const team = [
  {
    initial: "A",
    name: "Ada",
    role: "Projektledning, frontend & marknadsföring",
    accent: "bg-emerald/20 text-emerald",
  },
  {
    initial: "M",
    name: "Malin",
    role: "Utveckling, UX & digital design",
    accent: "bg-peach/20 text-peach",
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
              <Card key={person.name} className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${person.accent}`}
                >
                  {person.initial}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-bone">{person.name}</p>
                  <p className="mt-1 text-sm text-stone">{person.role}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <value.icon size={18} strokeWidth={2} />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-bone">{value.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
