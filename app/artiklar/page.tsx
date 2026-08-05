import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { ArticlesExplorer } from "@/components/sections/ArticlesExplorer";
import { articles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Tips och råd om webb, design och digital marknadsföring för småföretag — skrivet av Lindqvist / Holmgren.",
};

export default function ArtiklarPage() {
  return (
    <>
      <PageHero
        icon={Newspaper}
        eyebrow="Artiklar"
        title="Tips och tankar om digital tillväxt"
        description="Kort och konkret läsning om webb, design och marknadsföring — skrivet för er som driver företag, inte för andra byråer."
      />
      <Section tone="olive">
        <Container>
          <ArticlesExplorer articles={articles} />
        </Container>
      </Section>
    </>
  );
}
