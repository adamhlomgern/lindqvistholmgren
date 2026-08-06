import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Calendar, ChevronRight, Globe, Images, Lightbulb, Sparkles, Target, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { getProjectBySlug } from "@/lib/data/projects";
import { accentForKey, iconTextClasses } from "@/lib/design/accents";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProjectHeroImage } from "@/components/projects/ProjectHeroImage";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { RelatedProjects } from "@/components/projects/RelatedProjects";

const SITE_URL = "https://lindqvistholmgren.se";

type Props = {
  params: Promise<{ slug: string }>;
};

const metaFields = [
  { key: "client", label: "Kund", icon: User },
  { key: "industry", label: "Bransch", icon: Building2 },
  { key: "services", label: "Tjänster", icon: Sparkles },
  { key: "launch", label: "Lansering", icon: Calendar },
  { key: "platform", label: "Plattform", icon: Globe },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${SITE_URL}/projekt/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const accent = accentForKey(project.category);
  const categoryTags = project.category
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const breadcrumbs = [
    { label: "Hem", href: "/" },
    { label: "Projekt", href: "/projekt" },
    { label: project.title },
  ];

  const pageUrl = `${SITE_URL}/projekt/${project.slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${SITE_URL}${crumb.href}` : pageUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Section tone="forest" className="pt-20 md:pt-28">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone">{project.intro}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/kontakt">
                  Starta ett liknande projekt
                  <ChevronRight size={16} strokeWidth={2.5} />
                </Button>
                <Button href="/projekt" variant="ghost">
                  Alla projekt
                </Button>
              </div>
            </div>
            <ProjectHeroImage src={project.image} alt={project.title} />
          </div>
        </Container>
      </Section>
      <Section tone="olive">
        <Container>
          <GlassCard accent={accent}>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
              {metaFields.map(({ key, label, icon }) => (
                <div key={key} className="flex flex-col gap-3">
                  <AccentBadge icon={icon} accent={accent} size={16} />
                  <div>
                    <p className="text-xs uppercase tracking-label text-stone/70">{label}</p>
                    <p className="mt-1.5 text-sm font-medium text-bone">{project[key]}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <GlassCard accent={accent}>
              <AccentBadge icon={Target} accent={accent} />
              <h2 className="mt-4 font-display text-lg font-bold text-bone">Utmaningen</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{project.challenge}</p>
            </GlassCard>
            <GlassCard accent={accent}>
              <AccentBadge icon={Lightbulb} accent={accent} />
              <h2 className="mt-4 font-display text-lg font-bold text-bone">Vår lösning</h2>
              {project.solution.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-stone first:mt-0">
                  {paragraph}
                </p>
              ))}
            </GlassCard>
          </div>

          {project.stats && project.stats.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.stats.map((stat) => (
                <GlassCard key={stat.label} accent={accent} className="text-center">
                  <p className={`font-display text-3xl font-bold ${iconTextClasses[accent]}`}>{stat.value}</p>
                  <p className="mt-2 text-sm leading-snug text-stone">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3">
                <AccentBadge icon={Images} accent={accent} size={16} />
                <div>
                  <h2 className="font-display text-lg font-bold text-bone">Från projektet</h2>
                  <p className="text-sm text-stone/70">Klicka på en bild för att förstora.</p>
                </div>
              </div>
              <div className="mt-6">
                <ProjectGallery images={project.gallery} alt={project.title} />
              </div>
            </div>
          )}

          <div className="mt-14 flex flex-col items-start gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone">Har ni ett liknande projekt på gång?</p>
            <div className="flex gap-3">
              <Button href="/kontakt">
                Kontakta oss
                <ChevronRight size={16} strokeWidth={2.5} />
              </Button>
              <Button href="/projekt" variant="secondary">
                Fler projekt
              </Button>
            </div>
          </div>

          <RelatedProjects currentSlug={project.slug} category={project.category} />
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
