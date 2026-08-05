import { Clock, ShieldCheck, Target, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const values = [
  {
    icon: Users,
    title: "En kontaktperson, hela vägen",
    description:
      "Ni slipper mellanhänder och upprepade avstämningar — samma person håller ihop projektet från start till leverans.",
  },
  {
    icon: Target,
    title: "Skräddarsytt efter era mål",
    description:
      "Inga färdiga paket eller mallar. Varje tjänst anpassas efter vad just ert företag behöver för att växa.",
  },
  {
    icon: Clock,
    title: "Svar inom 24 timmar",
    description:
      "Vi håller en snabb dialog genom hela projektet, så att ni aldrig behöver vänta länge på besked.",
  },
];

export function ValueProps() {
  return (
    <Section tone="forest">
      <Container>
        <Eyebrow icon={ShieldCheck}>Varför vi</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
          Det som skiljer oss från en vanlig byrå
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                <value.icon size={18} strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-bone">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{value.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
