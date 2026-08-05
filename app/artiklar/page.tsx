import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArticlesExplorer } from "@/components/sections/ArticlesExplorer";
import { articles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Tips och råd om webb, design och digital marknadsföring för småföretag — skrivet av Lindqvist / Holmgren.",
};

export default function ArtiklarPage() {
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
    <Section tone="forest" className="pt-10 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <div className="max-w-2xl">
          <Eyebrow icon={Newspaper}>Artiklar</Eyebrow>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
            Tips och tankar om digital tillväxt
          </h1>
          <p className="mt-2 text-sm text-stone">
            Kort och konkret läsning om webb, design och marknadsföring — skrivet för er som driver
            företag, inte för andra byråer.
          </p>
        </div>
        <div className="mt-10">
          <ArticlesExplorer articles={articles} />
        </div>
      </Container>
    </Section>
  );
}
