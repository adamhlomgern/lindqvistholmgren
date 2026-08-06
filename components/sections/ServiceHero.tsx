import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
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
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone md:text-6xl">
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
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/kontakt">
            Kontakta oss
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
          <Button href="/projekt" variant="ghost">
            Se vårt arbete
          </Button>
        </div>
        <p className="mt-5 text-xs uppercase tracking-label text-stone/70">
          Svar inom 24 timmar · Ingen bindningstid
        </p>
      </Container>
    </Section>
  );
}
