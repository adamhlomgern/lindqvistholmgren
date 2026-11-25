"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, LayoutGrid, Search, X } from "lucide-react";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { articleIcons, blobClasses, iconTextClasses, resolveCategoryVisual } from "@/lib/articles/visuals";
import type { ArticleSummary } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";

type ArticlesExplorerProps = {
  articles: ArticleSummary[];
  categories: ArticleCategory[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

// Färgad bildyta med kategorins ikon: ger varje artikel en egen bild utan
// att vi behöver ta fram omslagsbilder.
function Art({ article, categories, large = false }: { article: ArticleSummary; categories: ArticleCategory[]; large?: boolean }) {
  const { icon, accent } = resolveCategoryVisual(categories, article.category);
  const Icon = articleIcons[article.icon] ?? articleIcons[icon] ?? LayoutGrid;
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${blobClasses[accent].big} ${large ? "min-h-64 md:min-h-full" : "aspect-[16/10]"}`}>
      <span aria-hidden className={`absolute -right-8 -top-8 h-40 w-40 rounded-full ${blobClasses[accent].small} opacity-80 mix-blend-multiply`} />
      <span aria-hidden className={`absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/40`} />
      <span className="relative flex h-20 w-20 -rotate-6 items-center justify-center rounded-3xl bg-surface shadow-raised transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-105">
        <Icon size={34} strokeWidth={1.75} className={iconTextClasses[accent]} />
      </span>
    </div>
  );
}

// Artikellistan: senaste artikeln stort överst, kategorier och sök på en
// rad, och kort med färgad bildyta. Ersätter tidigare sidokolumn + kortrutnät.
export function ArticlesExplorer({ articles, categories }: ArticlesExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const sortedArticles = useMemo(() => [...articles].sort((a, b) => (a.date < b.date ? 1 : -1)), [articles]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    return counts;
  }, [articles]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      sortedArticles.filter((article) => {
        if (activeCategory && article.category !== activeCategory) return false;
        if (normalizedQuery) {
          const haystack = `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase();
          if (!haystack.includes(normalizedQuery)) return false;
        }
        return true;
      }),
    [sortedArticles, activeCategory, normalizedQuery],
  );

  const showFeatured = !activeCategory && !normalizedQuery && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;
  const usedCategories = categories.filter((c) => (categoryCounts.get(c.name) ?? 0) > 0);

  return (
    <div>
      {featured && (
        <Link
          href={`/artiklar/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-raised md:grid-cols-[1.1fr_1fr]"
        >
          <Art article={featured} categories={categories} large />
          <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-medium text-canvas">Senaste</span>
                <CategoryPill accent={resolveCategoryVisual(categories, featured.category).accent}>{featured.category}</CategoryPill>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-fg md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">{featured.excerpt}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-fg-muted">
              <span>
                {formatDate(featured.date)} · {featured.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-fg transition-[gap] group-hover:gap-2.5">
                Läs artikeln
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${featured ? "mt-14" : ""}`}>
        <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-wrap lg:px-0">
          {[{ name: null as string | null, count: articles.length }, ...usedCategories.map((c) => ({ name: c.name, count: categoryCounts.get(c.name) ?? 0 }))].map(
            ({ name, count }) => {
              const selected = activeCategory === name;
              const visual = name ? resolveCategoryVisual(categories, name) : null;
              const Icon = visual ? articleIcons[visual.icon] ?? LayoutGrid : LayoutGrid;
              return (
                <button
                  key={name ?? "alla"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveCategory(name)}
                  className={`flex shrink-0 items-center gap-2 rounded-full py-2 pl-3 pr-4 text-sm font-medium transition-colors ${
                    selected ? "bg-fg text-canvas" : "bg-surface text-fg ring-1 ring-inset ring-line hover:ring-line-strong"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.25} className={selected || !visual ? "" : iconTextClasses[visual.accent]} />
                  {name ?? "Alla"}
                  <span className={`text-xs tabular-nums ${selected ? "text-canvas/70" : "text-fg-subtle"}`}>{count}</span>
                </button>
              );
            },
          )}
        </div>
        <div className="relative w-full lg:w-72">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök artiklar"
            aria-label="Sök artiklar"
            className="h-11 w-full rounded-full bg-surface pl-10 pr-10 text-sm text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Rensa sökning"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-surface-sunken p-10 text-center ring-1 ring-line">
          <p className="text-fg-muted">Inga artiklar matchar sökningen.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory(null);
            }}
            className="mt-3 text-sm font-semibold text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
          >
            Visa alla artiklar
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rest.map((article) => {
              const { accent } = resolveCategoryVisual(categories, article.category);
              return (
                <motion.article
                  layout
                  key={article.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/artiklar/${article.slug}`} className="group block">
                    <div className="overflow-hidden rounded-3xl ring-1 ring-line transition-shadow duration-300 group-hover:shadow-raised">
                      <Art article={article} categories={categories} />
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-sm text-fg-muted">
                      <CategoryPill accent={accent}>{article.category}</CategoryPill>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-[-0.015em] text-fg underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-line-strong">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 leading-relaxed text-fg-muted">{article.excerpt}</p>
                  </Link>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
