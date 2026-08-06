import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { ArticlesExplorer } from "@/components/sections/ArticlesExplorer";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Tips och råd om webb, design och digital marknadsföring för småföretag — skrivet av Lindqvist / Holmgren.",
};

export default async function ArtiklarPage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Artiklar",
    description:
      "Tips och råd om webb, design och digital marknadsföring för småföretag — skrivet av Lindqvist / Holmgren.",
    url: "https://lindqvistholmgren.se/artiklar",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://lindqvistholmgren.se/artiklar/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        icon={Newspaper}
        eyebrow="Artiklar"
        title="Tips och tankar om digital tillväxt"
        description="Kort och konkret läsning om webb, design och marknadsföring — skrivet för er som driver företag, inte för andra byråer."
      />
      <Section tone="olive">
        <Container>
          <ArticlesExplorer articles={articles} categories={categories} />
        </Container>
      </Section>
    </>
  );
}
