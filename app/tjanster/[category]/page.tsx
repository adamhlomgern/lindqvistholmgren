import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  LifeBuoy,
  Palette,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { CtaBanner } from "@/components/sections/CtaBanner";

const icons = {
  webb: Code2,
  seo: Search,
  design: Palette,
  tillvaxt: TrendingUp,
  automation: Zap,
  support: LifeBuoy,
} as const;

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
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { category } = await params;
  const service = services.find((item) => item.slug === category);

  if (!service) {
    notFound();
  }

  const Icon = icons[service.slug as keyof typeof icons] ?? Sparkles;
  const pages = servicePages.filter((page) => page.category === service.slug);

  return (
    <>
      <PageHero icon={Icon} eyebrow="Tjänst" title={service.title} description={service.intro} />
      <Section tone="olive">
        <Container>
          <h2 className="max-w-xl font-display text-2xl font-bold leading-[0.95] tracking-tight text-bone md:text-3xl">
            Vad ingår
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.features.map((feature) => (
              <Card key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <p className="text-sm leading-relaxed text-bone">{feature}</p>
              </Card>
            ))}
          </div>

          {pages.length > 0 && (
            <>
              <h2 className="mt-14 max-w-xl font-display text-2xl font-bold leading-[0.95] tracking-tight text-bone md:text-3xl">
                Läs mer om {service.title.toLowerCase()}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/tjanster/${service.slug}/${page.slug}`}
                    className="block"
                  >
                    <Card className="group flex h-full flex-col justify-between transition-colors hover:bg-bone/[0.08]">
                      <div>
                        <h3 className="font-display text-base font-bold text-bone">{page.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-stone">{page.description}</p>
                      </div>
                      <ArrowUpRight
                        className="mt-6 text-emerald transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        size={18}
                      />
                    </Card>
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
      <CtaBanner />
    </>
  );
}
