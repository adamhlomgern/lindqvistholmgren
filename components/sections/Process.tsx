import type { LucideIcon } from "lucide-react";
import { Code2, Compass, Rocket, Route, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
        <div className="relative mt-16">
          {/* Connects the badges into a single flow once all steps fit on
              one row (tablet landscape and up); below that they wrap onto
              separate rows, so each gets its own short vertical connector
              instead. */}
          <div className="absolute inset-x-0 top-5 hidden h-px bg-bone/10 md:block" />
          <div className="grid gap-x-6 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
            {steps.map((step, index) => {
              const accent = accents[index % accents.length];
              const isLast = index === steps.length - 1;
              return (
                <div key={step.number} className={`flex gap-4 md:block ${isLast ? "" : "pb-10 md:pb-0"}`}>
                  <div className="flex flex-col items-center md:hidden">
                    <AccentBadge icon={step.icon} accent={accent} />
                    {!isLast && <div className="mt-2 w-px flex-1 bg-bone/10" />}
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <AccentBadge icon={step.icon} accent={accent} />
                    <span className={`font-display text-sm font-bold ${iconTextClasses[accent]}`}>
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className={`font-display text-sm font-bold md:hidden ${iconTextClasses[accent]}`}>
                      {step.number}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-bone md:mt-4">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
