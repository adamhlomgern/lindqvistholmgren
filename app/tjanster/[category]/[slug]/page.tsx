import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { getServiceAccent, iconTextClasses } from "@/lib/design/accents";
import { serviceIcons } from "@/lib/design/service-icons";
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
      <PageHero
        icon={Icon}
        eyebrow={service?.title ?? "Tjänst"}
        title={page.title}
        description={page.intro}
        breadcrumbs={breadcrumbs}
      />
      <Section tone="olive">
        <Container>
          <div className="mx-auto max-w-3xl">
            {page.highlights && page.highlights.length > 0 && (
              <GlassCard accent={accent} className="mb-8">
                <ul className="flex flex-col gap-3">
                  {page.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 shrink-0 ${iconTextClasses[accent]}`}
                        size={16}
                        strokeWidth={2.5}
                      />
                      <span className="text-sm leading-relaxed text-bone">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
            <div className="flex flex-col gap-5">
              {page.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-stone">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-start gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone">Vill ni komma igång?</p>
              <div className="flex gap-3">
                <Button href="/kontakt">
                  Kontakta oss
                  <ChevronRight size={16} strokeWidth={2.5} />
                </Button>
                {service && (
                  <Button href={`/tjanster/${service.slug}`} variant="secondary">
                    Mer om {service.titleLower ?? service.title.toLowerCase()}
                  </Button>
                )}
              </div>
            </div>

            {siblingPages.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-xl font-bold text-bone">
                  Fler sidor om {service ? service.titleLower ?? service.title.toLowerCase() : "tjänsten"}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {siblingPages.map((sibling) => (
                    <Link
                      key={sibling.slug}
                      href={`/tjanster/${category}/${sibling.slug}`}
                      className="group block"
                    >
                      <GlassCard accent={accent} className="justify-between">
                        <div>
                          <h3 className="font-display text-base font-bold text-bone">
                            {sibling.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-stone">
                            {sibling.description}
                          </p>
                        </div>
                        <ArrowUpRight
                          className={`mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${iconTextClasses[accent]}`}
                          size={18}
                        />
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
