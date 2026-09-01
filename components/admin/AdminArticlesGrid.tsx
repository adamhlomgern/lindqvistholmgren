"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { Select } from "@/components/ui/Select";
import { ArticleCardMenu } from "@/components/admin/ArticleCardMenu";
import { articleIcons, resolveCategoryVisual } from "@/lib/articles/visuals";
import { articleStatusClasses, articleStatusIcons, articleStatusLabels } from "@/lib/articles/status";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { ArticleCategory } from "@/lib/data/categories";
import type { ArticleSummary, ArticleStatus } from "@/lib/types";

type SortOption = "updated" | "newest" | "oldest" | "alpha";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "updated", label: "Senast ändrad" },
  { value: "newest", label: "Nyast publicerad" },
  { value: "oldest", label: "Äldst" },
  { value: "alpha", label: "A–Ö" },
];

const selectClasses = "rounded-full px-3.5 py-2 text-xs";

export function AdminArticlesGrid({
  articles,
  categories,
}: {
  articles: ArticleSummary[];
  categories: ArticleCategory[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ArticleStatus | "alla">("alla");
  const [category, setCategory] = useState<string>("alla");
  const [sort, setSort] = useState<SortOption>("updated");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = articles.filter((article) => {
      if (status !== "alla" && article.status !== status) return false;
      if (category !== "alla" && article.category !== category) return false;
      if (query && !article.title.toLowerCase().includes(query) && !article.excerpt.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.date.localeCompare(a.date);
        case "oldest":
          return a.date.localeCompare(b.date);
        case "alpha":
          return a.title.localeCompare(b.title, "sv");
        case "updated":
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
  }, [articles, search, status, category, sort]);

  if (articles.length === 0) {
    return <p className="mt-8 text-sm text-stone">Inga artiklar ännu.</p>;
  }

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} strokeWidth={2.25} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Sök artiklar…"
            className="w-full rounded-full border border-bone/10 bg-bone/5 py-2 pl-9 pr-3.5 text-xs text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ArticleStatus | "alla")}
          className={selectClasses}
          options={[
            { value: "alla", label: "Alla statusar" },
            ...(Object.keys(articleStatusLabels) as ArticleStatus[]).map((value) => ({
              value,
              label: articleStatusLabels[value],
            })),
          ]}
        />
        <Select
          value={category}
          onValueChange={setCategory}
          className={selectClasses}
          options={[
            { value: "alla", label: "Alla kategorier" },
            ...categories.map((c) => ({ value: c.name, label: c.name })),
          ]}
        />
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortOption)}
          className={selectClasses}
          options={sortOptions}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-stone">Inga artiklar matchar filtret.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => {
            const accent = resolveCategoryVisual(categories, article.category).accent;
            const Icon = articleIcons[article.icon];
            const StatusIcon = articleStatusIcons[article.status];
            const statusClass = articleStatusClasses[article.status];

            return (
              <Link key={article.slug} href={`/admin/artiklar/${article.slug}`} className="group block">
                <GlassCard accent={accent} padding="compact">
                  <div className="flex items-start justify-between gap-2">
                    <AccentBadge icon={Icon} accent={accent} />
                    <div className="flex items-center gap-1">
                      {statusClass && StatusIcon && (
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass}`}
                        >
                          <StatusIcon size={11} strokeWidth={2.25} />
                          {articleStatusLabels[article.status]}
                        </span>
                      )}
                      <ArticleCardMenu slug={article.slug} title={article.title} status={article.status} />
                    </div>
                  </div>
                  <h2 className="mt-3 line-clamp-2 font-display text-base font-bold text-bone">{article.title}</h2>
                  <p className="mt-1.5 line-clamp-2 text-sm text-stone">{article.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <Tag className="bg-bone/10 text-bone">{article.category}</Tag>
                    <span className="text-xs text-stone">
                      {article.status === "publicerad"
                        ? `Publicerad ${formatDateSv(article.date)}`
                        : `Ändrad ${formatRelativeSv(article.updatedAt)}`}
                    </span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
