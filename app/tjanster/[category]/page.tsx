import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { getServiceAccent, iconTextClasses } from "@/lib/design/accents";
import { serviceIcons, serviceFeatureIcons } from "@/lib/design/service-icons";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const SITE_URL = "https://lindqvistholmgren.se";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ category: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const service = services.find((item) => item.slug === category);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${SITE_URL}/tjanster/${service.slug}`,
    },
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { category } = await params;
  const service = services.find((item) => item.slug === category);

  if (!service) {
    notFound();
  }

  const Icon = serviceIcons[service.slug] ?? Sparkles;
  const accent = getServiceAccent(service.slug);
  const pages = servicePages.filter((page) => page.category === service.slug);
  const pageUrl = `${SITE_URL}/tjanster/${service.slug}`;
  const titleLower = service.titleLower ?? service.title.toLowerCase();

  const breadcrumbs = [
    { label: "Hem", href: "/" },
    { label: "Tjänster", href: "/tjanster" },
    { label: service.title },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.description,
    url: pageUrl,
    areaServed: { "@type": "City", name: "Karlstad" },
    provider: {
      "@type": "Organization",
      name: "Lindqvist / Holmgren",
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tjänster", item: `${SITE_URL}/tjanster` },
      { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
    ],
  };

  const faqJsonLd =
    service.faq && service.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ServiceHero
        icon={Icon}
        eyebrow={service.title}
        headline={service.heroHeadline ?? service.title}
        accentWord={service.heroAccentWord}
        description={service.intro}
        accent={accent}
        breadcrumbs={breadcrumbs}
      />

      <Stats />

      <Section tone="olive">
        <Container>
          <h2 className="max-w-xl font-display text-2xl font-bold leading-[0.95] tracking-tight text-bone md:text-3xl">
            Vad ingår
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <GlassCard key={feature.title} accent={accent}>
                <AccentBadge icon={serviceFeatureIcons[feature.icon]} accent={accent} />
                <h3 className="mt-5 font-display text-lg font-bold text-bone">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{feature.description}</p>
              </GlassCard>
            ))}
          </div>

          {pages.length > 0 && (
            <>
              <h2 className="mt-14 max-w-xl font-display text-2xl font-bold leading-[0.95] tracking-tight text-bone md:text-3xl">
                Läs mer om {titleLower}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/tjanster/${service.slug}/${page.slug}`}
                    className="group block"
                  >
                    <GlassCard accent={accent} className="justify-between">
                      <div>
                        <h3 className="font-display text-base font-bold text-bone">{page.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-stone">{page.description}</p>
                      </div>
                      <ArrowUpRight
                        className={`mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${iconTextClasses[accent]}`}
                        size={18}
                      />
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-10">
            <Button href="/projekt" variant="secondary">
              Se vårt arbete
              <ChevronRight size={16} strokeWidth={2.5} />
            </Button>
          </div>
        </Container>
      </Section>

      {service.process && service.process.length > 0 && (
        <Process
          steps={service.process.map((step, index) => ({
            number: String(index + 1).padStart(2, "0"),
            title: step.title,
            description: step.description,
            icon: serviceFeatureIcons[step.icon],
          }))}
          eyebrow="Vårt arbetssätt"
          title={`Så jobbar vi med ${titleLower}`}
        />
      )}

      <Testimonials />

      {service.faq && service.faq.length > 0 && (
        <Faq
          items={service.faq}
          eyebrow="Vanliga frågor"
          title={`Vanliga frågor om ${titleLower}`}
        />
      )}

      <CtaBanner />
    </>
  );
}
