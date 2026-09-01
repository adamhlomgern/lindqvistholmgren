import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import type { Article } from "@/lib/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(date));
}

// Shared between the public article page and the admin preview route, so a
// preview genuinely shows "the real article rendering" rather than a
// lookalike that could drift from what visitors actually see.
export function ArticleView({ article }: { article: Article }) {
  return (
    <>
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
                  <span key={tag} className="rounded-full bg-bone/5 px-3 py-1 text-xs font-medium text-stone">
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
