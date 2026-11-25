import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { Reveal } from "@/components/motion/Reveal";
import { iconTextClasses, type Accent } from "@/lib/design/accents";

type ServiceHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  accentWord?: string;
  description: string;
  accent: Accent;
  breadcrumbs: { label: string; href?: string }[];
  // Kodad illustration till höger (components/visuals/ServiceVisual). Ger
  // varje tjänstesida ett eget utseende redan i första vyn.
  visual?: ReactNode;
};

export function ServiceHero({
  icon,
  eyebrow,
  headline,
  accentWord,
  description,
  accent,
  breadcrumbs,
  visual,
}: ServiceHeroProps) {
  const parts = accentWord ? headline.split(accentWord) : [headline];

  return (
    <Section tone="light" className="pb-16 pt-12 md:pb-24 md:pt-16">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <div className={visual ? "mt-8 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16" : "mt-8"}>
          <div>
            <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-fg md:text-5xl xl:text-[3.25rem]">
              {parts.length > 1 ? (
                <>
                  {parts[0]}
                  <span className={iconTextClasses[accent]}>{accentWord}</span>
                  {parts[1]}
                </>
              ) : (
                headline
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">{description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StartProjectButton trackingLocation="tjanst-hero">
                Få ett förslag
                <ChevronRight size={16} strokeWidth={2.5} />
              </StartProjectButton>
              <Button href="/projekt" variant="secondary">
                Se vårt arbete
              </Button>
            </div>
            <CtaReassurance className="mt-5" />
          </div>
          {visual && <Reveal delay={0.15}>{visual}</Reveal>}
        </div>
      </Container>
    </Section>
  );
}
