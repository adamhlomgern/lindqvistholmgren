import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { getArticleBySlug } from "@/lib/data/articles";
import { RelatedArticles } from "@/components/sections/RelatedArticles";

const SITE_URL = "https://lindqvistholmgren.se";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/artiklar/${article.slug}`,
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(date));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `https://lindqvistholmgren.se/artiklar/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    articleSection: article.category,
    keywords: article.tags.join(", "),
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    image: `${articleUrl}/opengraph-image`,
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
            <nav aria-label="Brödsmulor" className="flex items-center gap-1.5 text-xs text-stone">
              <Link href="/" className="hover:text-emerald">
                Hem
              </Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <Link href="/artiklar" className="hover:text-emerald">
                Artiklar
              </Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <span className="truncate text-stone/70">{article.title}</span>
            </nav>
            <div className="mt-4 flex items-center gap-3">
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
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.content }} />
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
            <RelatedArticles currentSlug={article.slug} category={article.category} />
          </div>
        </Container>
      </Section>
    </>
  );
}
