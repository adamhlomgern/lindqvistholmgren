import { ChevronRight, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { badgeClasses, type Accent } from "@/lib/design/accents";

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

export function AboutTeaser() {
  return (
    <Section tone="charcoal">
      <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <Eyebrow icon={Heart}>Om oss</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Två personer. Ett gemensamt hantverk.
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {team.map((person) => (
              <div key={person.name} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeClasses[person.accent]}`}
                >
                  {person.initial}
                </span>
                <p className="text-sm text-stone">
                  <span className="font-semibold text-bone">{person.name}</span> —{" "}
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-stone">
            Vi är inte en stor byrå med projektledare och mellanhänder — vi är två
            frilansare som driver Lindqvist / Holmgren tillsammans, med bas i Karlstad.
            Ni pratar alltid direkt med den som faktiskt gör jobbet, och vi lägger
            stolthet i att leverera något genomarbetat, oavsett hur stort eller litet
            projektet är.
          </p>
          <Button href="/om-oss" variant="secondary" className="mt-6">
            Läs mer om oss
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
