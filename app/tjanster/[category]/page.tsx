import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { getServiceAccent } from "@/lib/design/accents";
import { serviceIcons, serviceFeatureIcons } from "@/lib/design/service-icons";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { FeatureList } from "@/components/sections/FeatureList";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CaseSpotlight, serviceCaseMatch } from "@/components/sections/CaseSpotlight";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SystemsShowcase } from "@/components/sections/SystemsShowcase";

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
        visual={<ServiceVisual slug={service.slug} />}
      />

      <FeatureList
        eyebrow="Vad ingår"
        title={`Allt ni behöver för ${titleLower}, från en och samma plats`}
        intro={service.description}
        accent={accent}
        features={service.features.map((feature) => ({
          icon: serviceFeatureIcons[feature.icon],
          title: feature.title,
          description: feature.description,
        }))}
        aside={
          pages.length > 0 ? (
            <nav aria-label={`Mer om ${titleLower}`}>
              <p className="text-sm font-semibold text-fg">Läs mer om {titleLower}</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/tjanster/${service.slug}/${page.slug}`}
                      className="group flex items-center justify-between gap-4 py-2.5 text-[15px] text-fg-muted transition-colors hover:text-fg"
                    >
                      {page.title}
                      <ArrowUpRight
                        size={15}
                        className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : undefined
        }
      />

      {/* Systemtjänsten visar demos man kan klicka i — bästa beviset på att vi
          faktiskt bygger system. Övriga tjänster visar case från samma område. */}
      {service.slug === "automation" ? (
        <SystemsShowcase />
      ) : (
        <CaseSpotlight match={serviceCaseMatch[service.slug]} title={`${service.title} vi har gjort`} />
      )}

      {service.process && service.process.length > 0 && (
        <ProcessTimeline
          title={`Så jobbar vi med ${titleLower}`}
          steps={service.process.map((step) => ({
            title: step.title,
            description: step.description,
            icon: serviceFeatureIcons[step.icon],
          }))}
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
