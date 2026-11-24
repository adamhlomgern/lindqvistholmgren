import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { iconTextClasses, type Accent } from "@/lib/design/accents";

type ServiceHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  accentWord?: string;
  description: string;
  accent: Accent;
  breadcrumbs: { label: string; href?: string }[];
};

export function ServiceHero({
  icon,
  eyebrow,
  headline,
  accentWord,
  description,
  accent,
  breadcrumbs,
}: ServiceHeroProps) {
  const parts = accentWord ? headline.split(accentWord) : [headline];

  return (
    <Section tone="forest" className="pt-16 md:pt-24">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6">
          <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-6xl">
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
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <StartProjectButton trackingLocation="tjanst-hero">
            Få ett förslag
            <ChevronRight size={16} strokeWidth={2.5} />
          </StartProjectButton>
          <Button href="/projekt" variant="secondary">
            Se vårt arbete
          </Button>
        </div>
        <CtaReassurance className="mt-5" />
      </Container>
    </Section>
  );
}
