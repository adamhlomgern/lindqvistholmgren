import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/data/projects";
import { accentForKey } from "@/lib/design/accents";

// Vilka case som visas på respektive tjänstesida (matchas mot projektets
// kategori och tjänster). Saknas träff visas de senaste casen.
export const serviceCaseMatch: Record<string, RegExp> = {
  webb: /webb|hemsida|webbplats|shop/i,
  seo: /seo|sök/i,
  design: /design|profil|logo|grafisk|varumärke/i,
  tillvaxt: /marknad|tillväxt|annons|seo/i,
  support: /webb|support|underhåll/i,
};

// Ett eller två case i stort format: bild, resultat i stora siffror och en
// tydlig länk. Matchar på kategori (t.ex. /webb|hemsida/) så att en
// tjänstesida visar case från samma område; annars de senaste.
export async function CaseSpotlight({
  match,
  title = "Så har det gått för andra",
  limit = 2,
  tone = "light",
}: {
  match?: RegExp;
  title?: string;
  limit?: number;
  tone?: "light" | "subtle";
}) {
  const projects = await getProjects();
  if (projects.length === 0) return null;
  const matching = match ? projects.filter((p) => match.test(`${p.category} ${p.services ?? ""}`)) : [];
  const picked = (matching.length > 0 ? matching : projects).slice(0, limit);

  return (
    <Section tone={tone}>
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-fg-muted">Utvalda case</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[2.5rem]">
              {title}
            </h2>
          </div>
          <Button href="/projekt" variant="secondary" className="shrink-0">
            Alla case
          </Button>
        </div>
        <div className="mt-12 space-y-6">
          {picked.map((project, index) => {
            const accent = accentForKey(project.category);
            return (
              <Reveal key={project.slug}>
                <Link
                  href={`/projekt/${project.slug}`}
                  className="group grid overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-raised md:grid-cols-2"
                >
                  <div className={`relative aspect-[16/11] overflow-hidden bg-surface-sunken md:aspect-auto md:min-h-[22rem] ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      quality={90}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
                    <div>
                      <CategoryPill accent={accent}>{project.category}</CategoryPill>
                      <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-md leading-relaxed text-fg-muted">{project.summary}</p>
                    </div>
                    {project.stats && project.stats.length > 0 && (
                      <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6">
                        {project.stats.slice(0, 2).map((stat) => (
                          <div key={stat.label}>
                            <dt className="sr-only">{stat.label}</dt>
                            <dd className="font-display text-4xl font-semibold tracking-[-0.04em] text-fg">{stat.value}</dd>
                            <dd className="mt-1 text-sm text-fg-muted">{stat.label}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-[gap] duration-200 group-hover:gap-2.5">
                      Läs hela caset
                      <ArrowUpRight size={16} strokeWidth={2.25} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
