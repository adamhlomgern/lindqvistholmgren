import type { LucideIcon } from "lucide-react";
import { Code2, Compass, Rocket, Route, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { accents, iconTextClasses } from "@/lib/design/accents";

const defaultSteps = [
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

type ProcessProps = {
  steps?: { number: string; title: string; description: string; icon: LucideIcon }[];
  eyebrow?: string;
  title?: string;
};

export function Process({
  steps = defaultSteps,
  eyebrow = "Vårt arbetssätt",
  title = "En nära process, från idé till lansering",
}: ProcessProps) {
  return (
    <Section tone="olive">
      <Container>
        <Eyebrow icon={Route}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const accent = accents[index % accents.length];
            return (
              <GlassCard key={step.number} accent={accent}>
                <div className="flex items-center gap-3">
                  <AccentBadge icon={step.icon} accent={accent} />
                  <span className={`font-display text-sm font-bold ${iconTextClasses[accent]}`}>
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-bone">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
