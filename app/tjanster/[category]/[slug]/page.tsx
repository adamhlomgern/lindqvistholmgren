import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { CtaBanner } from "@/components/sections/CtaBanner";

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
  };
}

export default async function ServiceLandingPage({ params }: Props) {
  const { category, slug } = await params;
  const page = servicePages.find((item) => item.category === category && item.slug === slug);

  if (!page) {
    notFound();
  }

  const service = services.find((item) => item.slug === category);

  return (
    <>
      <PageHero icon={Sparkles} eyebrow={service?.title ?? "Tjänst"} title={page.title} description={page.intro} />
      <Section tone="olive">
        <Container>
          <div className="mx-auto max-w-3xl">
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
                    Mer om {service.title.toLowerCase()}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
