import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/data/articles";
import { ArticleView } from "@/components/articles/ArticleView";

const SITE_URL = "https://lindqvistholmgren.se";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/artiklar/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `https://lindqvistholmgren.se/artiklar/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription || article.excerpt,
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
      <ArticleView article={article} />
    </>
  );
}
