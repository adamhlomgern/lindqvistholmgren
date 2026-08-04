import { Code2, Compass, Rocket, Route, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    number: "01",
    title: "Upptäckt",
    description: "Vi lär känna ert företag, era mål och utmaningar.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Strategi",
    description: "Vi sätter en tydlig plan och riktning tillsammans med er.",
    icon: Target,
  },
  {
    number: "03",
    title: "Utveckling",
    description: "Vi designar och bygger med genomtänkta detaljer.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Lansering",
    description: "Vi lanserar, finslipar och finns kvar som stöd.",
    icon: Rocket,
  },
];

export function Process() {
  return (
    <Section tone="olive">
      <Container>
        <Eyebrow icon={Route}>Vårt arbetssätt</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
          En nära process, från idé till lansering
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <step.icon size={18} strokeWidth={2} />
                </span>
                <span className="font-display text-sm font-bold text-emerald">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-bone">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
