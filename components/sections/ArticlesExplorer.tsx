"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ListFilter, Search, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { articleIcons, resolveCategoryVisual, iconTextClasses } from "@/lib/articles/visuals";
import type { Article } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";

type ArticlesExplorerProps = {
  articles: Article[];
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
          className="flex w-full items-center justify-between rounded-full border border-bone/10 bg-bone/5 px-4 py-2.5 text-sm font-medium text-bone"
        >
          <span className="flex items-center gap-2">
            <ListFilter size={16} strokeWidth={2.25} />
            Filtrera
          </span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs font-semibold text-charcoal">
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
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/60"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök artiklar..."
              className="w-full rounded-lg border border-bone/10 bg-bone/5 py-2.5 pl-10 pr-9 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Rensa sökning"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone/60 hover:text-bone"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-label text-stone/70">Kategori</p>
            <div className="mt-3 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => selectCategory(null)}
                className={`flex items-center justify-between rounded-full px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === null ? "bg-charcoal text-emerald" : "text-bone/80 hover:bg-bone/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={14} strokeWidth={2.25} />
                  Alla
                </span>
                <span className="text-xs text-stone/60">{articles.length}</span>
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
                      active ? "bg-charcoal text-emerald" : "text-bone/80 hover:bg-bone/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon size={14} strokeWidth={2.25} className={iconTextClasses[accent]} />
                      {category}
                    </span>
                    <span className="text-xs text-stone/60">{categoryCounts.get(category) ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-xs font-medium text-stone underline decoration-stone/40 underline-offset-4 hover:text-emerald"
            >
              Rensa alla filter
            </button>
          )}
        </Card>
      </aside>

      <div>
        <p className="text-sm text-stone">
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
                    <h2 className="mt-4 break-words font-display text-base font-bold leading-snug text-bone">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone/80">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <Tag>{article.category}</Tag>
                      <span className="text-xs text-stone">{article.readTime}</span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-bone/10 bg-bone/5 p-6 text-center">
            <p className="text-sm text-stone">
              Inga artiklar matchar din sökning eller dina filter.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-emerald underline decoration-emerald/40 underline-offset-4 hover:text-bone"
            >
              Rensa alla filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
