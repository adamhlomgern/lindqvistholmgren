"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ListFilter, Search, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { articleIcons, resolveCategoryVisual, iconTextClasses } from "@/lib/articles/visuals";
import type { ArticleSummary } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";

type ArticlesExplorerProps = {
  articles: ArticleSummary[];
  categories: ArticleCategory[];
};

export function ArticlesExplorer({ articles, categories }: ArticlesExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [articles]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    }
    return counts;
  }, [articles]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter((article) => {
      if (activeCategory && article.category !== activeCategory) return false;
      if (normalizedQuery) {
        const haystack = `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [sortedArticles, activeCategory, normalizedQuery]);

  const hasActiveFilters = Boolean(activeCategory) || normalizedQuery.length > 0;
  const activeFilterCount = (activeCategory ? 1 : 0) + (normalizedQuery.length > 0 ? 1 : 0);

  function clearFilters() {
    setQuery("");
    setActiveCategory(null);
  }

  function selectCategory(category: string | null) {
    setActiveCategory(category);
    setFiltersOpen(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-full border border-line bg-fg/5 px-4 py-2.5 text-sm font-medium text-fg"
        >
          <span className="flex items-center gap-2">
            <ListFilter size={16} strokeWidth={2.25} />
            Filtrera
          </span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <aside className={`${filtersOpen ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
        <Card>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök artiklar..."
              className="w-full rounded-lg border border-line-strong bg-surface py-2.5 pl-10 pr-9 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Rensa sökning"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-label text-fg-subtle">Kategori</p>
            <div className="mt-3 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => selectCategory(null)}
                className={`flex items-center justify-between rounded-full px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === null ? "bg-fg text-canvas" : "text-fg hover:bg-fg/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={14} strokeWidth={2.25} />
                  Alla
                </span>
                <span className="text-xs text-fg-subtle">{articles.length}</span>
              </button>
              {categories.map(({ name: category }) => {
                const active = activeCategory === category;
                const { icon, accent } = resolveCategoryVisual(categories, category);
                const CategoryIcon = articleIcons[icon] ?? LayoutGrid;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(active ? null : category)}
                    className={`flex items-center justify-between rounded-full px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                      active ? "bg-fg text-canvas" : "text-fg hover:bg-fg/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon size={14} strokeWidth={2.25} className={active ? "" : iconTextClasses[accent]} />
                      {category}
                    </span>
                    <span className="text-xs text-fg-subtle">{categoryCounts.get(category) ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-xs font-medium text-fg-muted underline decoration-fg-muted/40 underline-offset-4 hover:text-primary"
            >
              Rensa alla filter
            </button>
          )}
        </Card>
      </aside>

      <div>
        <p className="text-sm text-fg-muted">
          {filteredArticles.length} {filteredArticles.length === 1 ? "artikel" : "artiklar"}
        </p>

        {filteredArticles.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const accent = resolveCategoryVisual(categories, article.category).accent;
              const Icon = articleIcons[article.icon];
              return (
                <Link key={article.slug} href={`/artiklar/${article.slug}`} className="group block">
                  <GlassCard accent={accent}>
                    <AccentBadge icon={Icon} accent={accent} size={20} className="h-11 w-11" />
                    <h2 className="mt-4 break-words font-display text-base font-semibold leading-snug text-fg">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-subtle">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <CategoryPill accent={accent}>{article.category}</CategoryPill>
                      <span className="text-xs text-fg-muted">{article.readTime}</span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-line bg-fg/5 p-6 text-center">
            <p className="text-sm text-fg-muted">
              Inga artiklar matchar din sökning eller dina filter.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:text-fg"
            >
              Rensa alla filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
