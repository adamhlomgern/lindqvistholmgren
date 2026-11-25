import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { badgeClasses, type Accent } from "@/lib/design/accents";

type Feature = { icon: LucideIcon; title: string; description: string };

// "Vad ingår" som en redaktionell lista i stället för ännu ett kortrutnät:
// rubriken står kvar till vänster medan man scrollar listan, varje rad har
// nummer, ikon och lyfts lätt vid hover.
export function FeatureList({
  eyebrow,
  title,
  intro,
  features,
  accent,
  aside,
  tone = "subtle",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  features: Feature[];
  accent: Accent;
  aside?: ReactNode;
  tone?: "light" | "subtle";
}) {
  return (
    <Section tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium text-fg-muted">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[2.5rem]">
            {title}
          </h2>
          {intro && <p className="mt-5 max-w-md text-fg-muted">{intro}</p>}
          {aside && <div className="mt-8">{aside}</div>}
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {features.map((feature, index) => (
            <li key={feature.title}>
              <Reveal delay={index * 0.05} className="group flex gap-5 py-7 sm:gap-7">
                <span className="w-7 shrink-0 pt-1 font-display text-sm font-semibold tabular-nums text-fg-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 ${badgeClasses[accent]}`}
                >
                  <feature.icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.015em] text-fg">{feature.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-fg-muted">{feature.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
