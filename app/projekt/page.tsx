import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { getProjects } from "@/lib/data/projects";
import { accentForKey } from "@/lib/design/accents";
import { ProjectResultBadge } from "@/components/projects/ProjectResultBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Projekt",
  description:
    "Ett urval av webbplatser, grafiska profiler och skräddarsydda lösningar vi byggt åt småföretag i Karlstad och Värmland.",
  alternates: {
    canonical: "/projekt",
  },
};

export const revalidate = 3600;

export default async function ProjektPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        icon={Briefcase}
        eyebrow="Projekt"
        title="Ett urval av vad vi byggt"
        description="Riktiga projekt för riktiga företag — här är några exempel på hur vi hjälpt kunder synas och växa digitalt."
      />
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const accent = accentForKey(project.category);
              return (
                <Link key={project.slug} href={`/projekt/${project.slug}`} className="group block">
                  <GlassCard accent={accent} className="justify-between">
                    <div>
                      <div className="relative -mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          quality={90}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <ProjectResultBadge project={project} className="absolute bottom-3 left-3" />
                      </div>
                      <CategoryPill accent={accent}>{project.category}</CategoryPill>
                      <h2 className="mt-4 font-display text-xl font-semibold text-fg">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{project.summary}</p>
                      <p className="mt-4 text-xs uppercase tracking-label text-fg-subtle">
                        {project.industry} · {project.launch}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-[gap] duration-200 group-hover:gap-2.5">
                      Se caset
                      <ArrowUpRight size={16} strokeWidth={2.25} />
                    </span>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
