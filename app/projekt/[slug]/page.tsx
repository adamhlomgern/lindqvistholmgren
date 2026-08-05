import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { projects } from "@/lib/data/projects";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProjectHeroImage } from "@/components/projects/ProjectHeroImage";
import { ProjectGallery } from "@/components/projects/ProjectGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

const metaFields = [
  { key: "client", label: "Kund" },
  { key: "industry", label: "Bransch" },
  { key: "services", label: "Tjänster" },
  { key: "launch", label: "Lansering" },
  { key: "platform", label: "Plattform" },
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Section tone="forest" className="pt-20 md:pt-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag>Projekt</Tag>
                <Tag>{project.category}</Tag>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">{project.intro}</p>
            </div>
            <ProjectHeroImage src={project.image} alt={project.title} />
          </div>
        </Container>
      </Section>
      <Section tone="olive">
        <Container>
          <Card className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            {metaFields.map(({ key, label }) => (
              <div key={key}>
                <p className="text-xs uppercase tracking-label text-stone/70">{label}</p>
                <p className="mt-1.5 text-sm font-medium text-bone">{project[key]}</p>
              </div>
            ))}
          </Card>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card>
              <h2 className="font-display text-lg font-bold text-bone">Utmaningen</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{project.challenge}</p>
            </Card>
            <Card>
              <h2 className="font-display text-lg font-bold text-bone">Vår lösning</h2>
              {project.solution.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-stone first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Card>
          </div>

          {project.stats && project.stats.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-emerald">{stat.value}</p>
                  <p className="mt-2 text-sm leading-snug text-stone">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-lg font-bold text-bone">Från projektet</h2>
              <p className="mt-2 text-sm text-stone/70">Klicka på en bild för att förstora.</p>
              <div className="mt-6">
                <ProjectGallery images={project.gallery} alt={project.title} />
              </div>
            </div>
          )}

          <div className="mt-10">
            <Button href="/projekt" variant="secondary">
              Se fler projekt
              <ChevronRight size={16} strokeWidth={2.5} />
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
