import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

type Step = { title: string; description: string; icon: LucideIcon };

// Processen som en tidslinje på mörkgrönt: stora nummer, en linje som binder
// ihop stegen och ett steg i taget som glider in. Skiljer sig medvetet från
// startsidans horisontella Process-komponent.
export function ProcessTimeline({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <Section tone="pine">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium text-fg-muted">Så går det till</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-[2.5rem]">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-fg-muted">
            Ni har en kontaktperson hela vägen och vet alltid vad som händer härnäst.
          </p>
        </div>
        <ol className="relative">
          <span aria-hidden className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-line" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative pb-10 last:pb-0">
              <Reveal delay={index * 0.08} className="flex gap-6">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface font-display text-sm font-semibold ring-1 ring-line">
                  {index + 1}
                </span>
                <div className="flex-1 rounded-2xl bg-surface p-6 ring-1 ring-line">
                  <div className="flex items-center gap-3">
                    <step.icon size={18} className="text-highlight" />
                    <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-fg-muted">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
