import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { getServiceAccent, iconTextClasses } from "@/lib/design/accents";
import { serviceFeatureIcons, serviceIcons } from "@/lib/design/service-icons";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { CaseSpotlight, serviceCaseMatch } from "@/components/sections/CaseSpotlight";
import { Reveal } from "@/components/motion/Reveal";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { ToolsShowcase } from "@/components/sections/ToolsShowcase";
import { SetupPlanner } from "@/components/sections/SetupPlanner";
import { SituationPicker } from "@/components/sections/SituationPicker";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { seoSituations } from "@/lib/data/service-plans";
import { CtaBanner } from "@/components/sections/CtaBanner";

const SITE_URL = "https://lindqvistholmgren.se";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return servicePages.map((page) => ({ category: page.category, slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const page = servicePages.find((item) => item.category === category && item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${SITE_URL}/tjanster/${category}/${slug}`,
    },
  };
}

export default async function ServiceLandingPage({ params }: Props) {
  const { category, slug } = await params;
  const page = servicePages.find((item) => item.category === category && item.slug === slug);

  if (!page) {
    notFound();
  }

  const service = services.find((item) => item.slug === category);
  const Icon = (service && serviceIcons[service.slug]) ?? Sparkles;
  const accent = getServiceAccent(category);
  const siblingPages = servicePages
    .filter((item) => item.category === category && item.slug !== slug)
    .slice(0, 4);
  const pageUrl = `${SITE_URL}/tjanster/${category}/${slug}`;

  const breadcrumbs = [
    { label: "Hem", href: "/" },
    { label: "Tjänster", href: "/tjanster" },
    ...(service ? [{ label: service.title, href: `/tjanster/${service.slug}` }] : []),
    { label: page.title },
  ];

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
      <ServiceHero
        icon={Icon}
        eyebrow={service?.title ?? "Tjänst"}
        headline={page.title}
        description={page.intro}
        accent={accent}
        breadcrumbs={breadcrumbs}
        visual={<ServiceVisual slug={category} />}
      />
      <Section tone="subtle">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            {page.body.map((paragraph, index) => (
              <Reveal key={index} delay={Math.min(index, 3) * 0.05}>
                <p className={index === 0 ? "font-display text-2xl font-medium leading-snug tracking-[-0.015em] text-fg" : "text-[17px] leading-relaxed text-fg-muted"}>
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            {page.highlights && page.highlights.length > 0 && (
              <div className="rounded-3xl bg-surface p-7 shadow-card ring-1 ring-line">
                <p className="font-display text-lg font-semibold tracking-[-0.01em] text-fg">Det här får ni</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {page.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <Check className={`mt-0.5 shrink-0 ${iconTextClasses[accent]}`} size={17} strokeWidth={2.5} />
                      <span className="leading-relaxed text-fg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="tone-pine rounded-3xl p-7">
              <p className="font-display text-xl font-semibold tracking-[-0.015em]">Vill ni komma igång?</p>
              <p className="mt-2 text-fg-muted">Berätta kort vad ni behöver, så återkommer vi inom 24 timmar.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <StartProjectButton trackingLocation="tjanst-undersida">
                  Få ett förslag
                  <ChevronRight size={16} strokeWidth={2.5} />
                </StartProjectButton>
              </div>
            </div>
            {siblingPages.length > 0 && (
              <nav aria-label="Fler sidor" className="px-1 pt-4">
                <p className="text-sm font-semibold text-fg">
                  Fler sidor om {service ? service.titleLower ?? service.title.toLowerCase() : "tjänsten"}
                </p>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {siblingPages.map((sibling) => (
                    <li key={sibling.slug}>
                      <Link
                        href={`/tjanster/${category}/${sibling.slug}`}
                        className="group flex items-center justify-between gap-4 py-2.5 text-[15px] text-fg-muted transition-colors hover:text-fg"
                      >
                        {sibling.title}
                        <ArrowUpRight size={15} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {service && (
                  <Link
                    href={`/tjanster/${service.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg"
                  >
                    Allt om {service.titleLower ?? service.title.toLowerCase()}
                    <ArrowUpRight size={15} />
                  </Link>
                )}
              </nav>
            )}
          </aside>
        </Container>
      </Section>
      {category === "webb" ? (
        <SetupPlanner />
      ) : category === "seo" ? (
        <SituationPicker title="Välj det som stämmer bäst, så berättar vi var vi skulle börja." situations={seoSituations} />
      ) : (
        <EngagementModels />
      )}
      {(category === "webb" || category === "seo") && <ToolsShowcase only="kollen" eyebrow="Gratis koll" />}
      <CaseSpotlight
        title="Ett case från samma område"
        limit={1}
        match={serviceCaseMatch[category]}
        tone={category === "webb" || category === "seo" ? "light" : "subtle"}
      />
      {service?.process && service.process.length > 0 && (
        <ProcessTimeline
          title="Så går det till"
          steps={service.process.map((step) => ({
            title: step.title,
            description: step.description,
            icon: serviceFeatureIcons[step.icon],
          }))}
        />
      )}
      <Testimonials />
      {service?.faq && service.faq.length > 0 && <Faq items={service.faq} title="Vanliga frågor" />}
      <CtaBanner />
    </>
  );
}
