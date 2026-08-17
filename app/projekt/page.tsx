import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { getProjects } from "@/lib/data/projects";
import { accentForKey, iconTextClasses } from "@/lib/design/accents";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Projekt",
  description:
    "Ett urval av webbplatser, grafiska profiler och skräddarsydda lösningar vi byggt åt småföretag i Karlstad och Värmland.",
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
                      </div>
                      <Tag>{project.category}</Tag>
                      <h2 className="mt-4 font-display text-xl font-bold text-bone">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-stone">{project.summary}</p>
                      <p className="mt-4 text-xs uppercase tracking-label text-stone/70">
                        {project.industry} · {project.launch}
                      </p>
                    </div>
                    <ArrowUpRight
                      className={`mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${iconTextClasses[accent]}`}
                      size={18}
                    />
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
