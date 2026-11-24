import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { getCategories } from "@/lib/data/categories";
import { resolveCategoryVisual } from "@/lib/articles/visuals";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import type { Article } from "@/lib/types";

// Avslutande CTA som knyter an till det artikeln handlar om. Den som läst
// klart en artikel om SEO är varmare för en SEO-fråga än för "Kontakta oss".
const ctaByTopic: { match: RegExp; title: string }[] = [
  { match: /seo|sök|google/i, title: "Vill ni synas bättre på Google?" },
  { match: /e-handel|webbshop|shop/i, title: "Vill ni börja sälja online?" },
  { match: /design|varumärke|profil|logo/i, title: "Behöver ni en tydligare profil?" },
  { match: /marknadsföring|tillväxt|annons/i, title: "Vill ni få fler kunder via nätet?" },
  { match: /webb|hemsida/i, title: "Funderar ni på en ny hemsida?" },
];

function ArticleCta({ category }: { category: string }) {
  const title = ctaByTopic.find((topic) => topic.match.test(category))?.title ?? "Har ni ett projekt på gång?";
  return (
    <aside className="tone-lilac mt-14 rounded-3xl p-8 sm:p-10">
      <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-fg sm:text-3xl">
        {title}
      </p>
      <p className="mt-3 max-w-lg text-fg-muted">
        Berätta kort om er situation, så får ni ett förslag på upplägg från oss — Ada och Malin, inga mellanhänder.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <StartProjectButton trackingLocation="artikel-slut">
          Få ett förslag
          <ChevronRight size={16} strokeWidth={2.5} />
        </StartProjectButton>
        <Button href="/artiklar" variant="secondary">
          Fler artiklar
        </Button>
      </div>
      <CtaReassurance className="mt-6" />
    </aside>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(date));
}

// Shared between the public article page and the admin preview route, so a
// preview genuinely shows "the real article rendering" rather than a
// lookalike that could drift from what visitors actually see.
export async function ArticleView({ article }: { article: Article }) {
  const categories = await getCategories();
  const { accent } = resolveCategoryVisual(categories, article.category);
  return (
    <>
      <Section tone="light" className="pb-10 pt-16 md:pb-14 md:pt-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Brödsmulor" className="flex items-center gap-1.5 text-xs text-fg-muted">
              <Link href="/" className="transition-colors hover:text-fg">
                Hem
              </Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <Link href="/artiklar" className="transition-colors hover:text-fg">
                Artiklar
              </Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <span className="truncate text-fg-subtle">{article.title}</span>
            </nav>
            <div className="mt-4 flex items-center gap-3">
              <CategoryPill accent={accent}>{article.category}</CategoryPill>
              <span className="text-[13px] text-fg-muted">
                {formatDate(article.date)} · {article.readTime}
              </span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[3.25rem]">
              {article.title}
            </h1>
            {article.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-medium text-fg-muted ring-1 ring-inset ring-line">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
      <Section tone="light" className="border-t border-line pt-12 md:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.content }} />
            <ArticleCta category={article.category} />
            <RelatedArticles currentSlug={article.slug} category={article.category} />
          </div>
        </Container>
      </Section>
    </>
  );
}
