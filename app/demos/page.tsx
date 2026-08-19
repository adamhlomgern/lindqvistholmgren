import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { accents, iconTextClasses } from "@/lib/design/accents";
import { demos } from "@/lib/data/demos";

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Klicka runt i interaktiva produktdemos byggda av Lindqvist / Holmgren — se hur en färdig lösning skulle kunna se ut för ert företag.",
};

export default function DemosPage() {
  return (
    <>
      <PageHero
        icon={Sparkles}
        eyebrow="Produktdemos"
        title="Testa hur en färdig lösning skulle kunna se ut"
        description="Interaktiva demos ni kan klicka runt i själva — ingen inloggning, inga förpliktelser. Se hur vi skulle kunna bygga just er lösning."
      />
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo, index) => {
              const accent = accents[index % accents.length];
              const comingSoon = demo.status === "kommer-snart";

              const card = (
                <GlassCard accent={accent} className="justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <AccentBadge icon={demo.icon} accent={accent} size={22} />
                      {comingSoon && <Tag>Kommer snart</Tag>}
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold text-bone">{demo.title}</h2>
                    <p className="mt-1 text-xs uppercase tracking-label text-stone">{demo.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-stone">{demo.description}</p>
                  </div>
                  {!comingSoon && (
                    <span
                      className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 ${iconTextClasses[accent]}`}
                    >
                      Se demon
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  )}
                </GlassCard>
              );

              if (comingSoon) {
                return (
                  <div key={demo.slug} className="opacity-70">
                    {card}
                  </div>
                );
              }

              return (
                <Link key={demo.slug} href={`/demos/${demo.slug}`} className="group block">
                  {card}
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
