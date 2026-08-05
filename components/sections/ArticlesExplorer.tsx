"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { articleCategories } from "@/lib/data/articles";
import type { Article } from "@/lib/types";

type ArticlesExplorerProps = {
  articles: Article[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(date));
}

export function ArticlesExplorer({ articles }: ArticlesExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

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

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      for (const tag of article.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [articles]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter((article) => {
      if (activeCategory && article.category !== activeCategory) return false;
      if (activeTags.length > 0 && !activeTags.some((tag) => article.tags.includes(tag))) {
        return false;
      }
      if (normalizedQuery) {
        const haystack = `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [sortedArticles, activeCategory, activeTags, normalizedQuery]);

  const hasActiveFilters = Boolean(activeCategory) || activeTags.length > 0 || normalizedQuery.length > 0;

  function clearFilters() {
    setQuery("");
    setActiveCategory(null);
    setActiveTags([]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      <aside className="lg:sticky lg:top-24">
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
            <div className="mt-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeCategory === null ? "bg-charcoal text-emerald" : "text-bone/80 hover:bg-bone/5"
                }`}
              >
                Alla
                <span className="text-xs text-stone/60">{articles.length}</span>
              </button>
              {articleCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category === activeCategory ? null : category)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-charcoal text-emerald"
                      : "text-bone/80 hover:bg-bone/5"
                  }`}
                >
                  {category}
                  <span className="text-xs text-stone/60">{categoryCounts.get(category) ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {tagCounts.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-label text-stone/70">Ämnen</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tagCounts.map(([tag, count]) => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-emerald text-charcoal"
                          : "bg-bone/5 text-stone hover:bg-bone/10 hover:text-bone"
                      }`}
                    >
                      {tag}
                      <span className={active ? "text-charcoal/60" : "text-stone/60"}> {count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link key={article.slug} href={`/artiklar/${article.slug}`} className="block">
                <Card className="group flex h-full flex-col justify-between transition-colors hover:bg-bone/[0.08]">
                  <div>
                    <div className="flex items-center gap-3">
                      <Tag>{article.category}</Tag>
                      <span className="text-xs text-stone">{article.readTime}</span>
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold text-bone">{article.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{article.excerpt}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-stone">{formatDate(article.date)}</span>
                    <ArrowUpRight
                      className="text-emerald transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      size={18}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-stone">
            Inga artiklar matchar din sökning eller dina filter. Prova att rensa filtren.
          </p>
        )}
      </div>
    </div>
  );
}
