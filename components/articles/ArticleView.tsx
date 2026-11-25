import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { getCategories } from "@/lib/data/categories";
import { getPublishedArticles } from "@/lib/data/articles";
import { buildCourse, findLesson } from "@/lib/articles/course";
import { MarkLessonRead } from "@/components/articles/MarkLessonRead";
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
  const [categories, published] = await Promise.all([getCategories(), getPublishedArticles()]);
  const { accent } = resolveCategoryVisual(categories, article.category);
  // Artikeln som lektion i Kunskapsbanken (lib/articles/course.ts).
  const course = buildCourse(published, categories);
  const lesson = findLesson(course, article.slug);
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
                Kunskapsbanken
              </Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <span className="truncate text-fg-subtle">
                {lesson ? `Modul ${lesson.mod.number}: ${lesson.mod.name}` : article.title}
              </span>
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {lesson && (
                <span className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-medium text-canvas">
                  Lektion {lesson.mod.number}.{lesson.index + 1} av {lesson.mod.lessons.length}
                </span>
              )}
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
            <MarkLessonRead slug={article.slug} />
            {lesson && (lesson.previous || lesson.next) && (
              <nav aria-label="Lektioner" className="mt-14 grid gap-3 sm:grid-cols-2">
                {lesson.previous ? (
                  <Link
                    href={`/artiklar/${lesson.previous.slug}`}
                    className="group rounded-2xl bg-surface p-5 ring-1 ring-line transition-shadow hover:shadow-raised"
                  >
                    <span className="flex items-center gap-1.5 text-sm text-fg-muted">
                      <ArrowLeft size={14} /> Föregående lektion
                    </span>
                    <span className="mt-1 block font-medium leading-snug text-fg">{lesson.previous.title}</span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {lesson.next && (
                  <Link
                    href={`/artiklar/${lesson.next.slug}`}
                    className="group rounded-2xl bg-fg p-5 text-canvas transition-colors hover:bg-ink-800 sm:text-right"
                  >
                    <span className="flex items-center gap-1.5 text-sm text-canvas/70 sm:justify-end">
                      {lesson.nextIsNewModule ? "Nästa modul" : "Nästa lektion"} <ArrowRight size={14} />
                    </span>
                    <span className="mt-1 block font-medium leading-snug">{lesson.next.title}</span>
                  </Link>
                )}
              </nav>
            )}
            <ArticleCta category={article.category} />
            <RelatedArticles currentSlug={article.slug} category={article.category} />
          </div>
        </Container>
      </Section>
    </>
  );
}
