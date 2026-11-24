import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { getCategories } from "@/lib/data/categories";
import { resolveCategoryVisual } from "@/lib/articles/visuals";
import { Button } from "@/components/ui/Button";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import type { Article } from "@/lib/types";

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
            <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-fg-muted">Har ni frågor eller ett projekt på gång?</p>
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
