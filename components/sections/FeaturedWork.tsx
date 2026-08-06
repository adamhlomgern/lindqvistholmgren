import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { getProjects } from "@/lib/data/projects";
import { accentForKey, iconTextClasses } from "@/lib/design/accents";

export async function FeaturedWork() {
  const projects = await getProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <Section tone="forest">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow icon={Briefcase}>Utvalda projekt</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
              Ett urval av vad vi byggt
            </h2>
          </div>
          <Button href="/projekt" variant="secondary" className="shrink-0">
            Se allt arbete
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project) => {
            const accent = accentForKey(project.category);
            return (
              <Link key={project.slug} href={`/projekt/${project.slug}`} className="group block">
                <GlassCard accent={accent} className="justify-between">
                  <div>
                    <div className="relative -mx-6 -mt-6 mb-4 aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        quality={90}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <Tag>{project.category}</Tag>
                    <h3 className="mt-4 font-display text-lg font-bold text-bone">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {project.summary}
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
  );
}
