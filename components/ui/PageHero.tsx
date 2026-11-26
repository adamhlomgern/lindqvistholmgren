import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type PageHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  // Optional side visual (e.g. a floating app-screenshot mockup) — when
  // present the hero switches to a two-column layout on large screens, with
  // the visual stacking below the text on mobile.
  visual?: ReactNode;
};

export function PageHero({ icon, eyebrow, title, description, children, breadcrumbs, visual }: PageHeroProps) {
  const content = (
    <div>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <h1 className="mt-5 max-w-3xl font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-[3.25rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">{description}</p>
      )}
      {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
    </div>
  );

  return (
    <Section tone="light" className="pb-14 pt-12 md:pb-20 md:pt-16">
      <Container>
        {visual ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            {content}
            {visual}
          </div>
        ) : (
          content
        )}
      </Container>
    </Section>
  );
}
