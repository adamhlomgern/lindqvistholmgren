import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CourseLibrary } from "@/components/articles/CourseLibrary";
import { getPublishedArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Kunskapsbanken: artiklar om webb och marknadsföring",
  description:
    "Tips och råd om webb, design och digital marknadsföring för småföretag — skrivet av Lindqvist / Holmgren.",
  alternates: {
    canonical: "/artiklar",
  },
};

export const revalidate = 3600;

export default async function ArtiklarPage() {
  const [articles, categories] = await Promise.all([getPublishedArticles(), getCategories()]);

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
      <Section tone="light" className="pb-10 pt-12 md:pb-14 md:pt-16">
        <Container>
          <p className="flex items-center gap-2 text-sm font-medium text-fg-muted">
            <GraduationCap size={16} className="text-primary" />
            Kunskapsbanken
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-[3.25rem]">
            Lär er det viktigaste om webb, Google och marknadsföring.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Korta lektioner skrivna för er som driver företag. Börja från början eller hoppa direkt till
            det ni undrar över.
          </p>
        </Container>
      </Section>
      <Section tone="light" className="pt-0 md:pt-0">
        <Container>
          <CourseLibrary articles={articles} categories={categories} />
        </Container>
      </Section>
    </>
  );
}
