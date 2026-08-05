import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type PageHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHero({ icon, eyebrow, title, description, children }: PageHeroProps) {
  return (
    <Section tone="forest" className="pt-20 md:pt-28">
      <Container>
        <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{description}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
      </Container>
    </Section>
  );
}
