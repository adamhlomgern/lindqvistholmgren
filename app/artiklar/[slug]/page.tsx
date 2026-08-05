import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { articles } from "@/lib/data/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(date));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Lindqvist / Holmgren",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section tone="forest" className="pt-20 md:pt-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <Tag>{article.category}</Tag>
              <span className="text-xs text-stone">
                {formatDate(article.date)} · {article.readTime}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[0.98] tracking-tight text-bone md:text-5xl">
              {article.title}
            </h1>
            {article.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bone/5 px-3 py-1 text-xs font-medium text-stone"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
      <Section tone="olive">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-5">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-stone">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-start gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone">Har ni frågor eller ett projekt på gång?</p>
              <div className="flex gap-3">
                <Button href="/kontakt">
                  Kontakta oss
                  <ChevronRight size={16} strokeWidth={2.5} />
                </Button>
                <Button href="/artiklar" variant="secondary">
                  Fler artiklar
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
