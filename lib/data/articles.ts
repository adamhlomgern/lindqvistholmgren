import { unstable_cache } from "next/cache";
import type { Article, ArticleIconKey, ArticleSummary } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

type ArticleRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  icon: string;
  date: string;
  read_time: string;
  content: string;
};

type ArticleSummaryRow = Omit<ArticleRow, "content">;

const summaryColumns = "slug, title, excerpt, category, tags, icon, date, read_time";

function toArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    icon: row.icon as ArticleIconKey,
    date: row.date,
    readTime: row.read_time,
    content: row.content,
  };
}

function toArticleSummary(row: ArticleSummaryRow): ArticleSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    icon: row.icon as ArticleIconKey,
    date: row.date,
    readTime: row.read_time,
  };
}

// The cached fetchers below throw on failure instead of swallowing the
// error, so a transient Supabase hiccup never gets cached as "no data" for
// the full revalidate window. Each exported function catches around its own
// cached fetcher so callers still get a graceful fallback, but that
// fallback itself is never persisted to the cache.

const fetchArticlesCached = unstable_cache(
  async (): Promise<ArticleSummary[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("articles")
      .select(summaryColumns)
      .order("date", { ascending: false });

    if (error) throw new Error(`[getArticles] ${error.message}`);

    return (data as ArticleSummaryRow[]).map(toArticleSummary);
  },
  ["articles-list"],
  { tags: ["articles"], revalidate: 300 },
);

export async function getArticles(): Promise<ArticleSummary[]> {
  try {
    return await fetchArticlesCached();
  } catch (error) {
    console.error("[getArticles] Supabase-fråga misslyckades", error);
    return [];
  }
}

const fetchArticlesCountCached = unstable_cache(
  async (): Promise<number> => {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(`[getArticlesCount] ${error.message}`);

    return count ?? 0;
  },
  ["articles-count"],
  { tags: ["articles"], revalidate: 300 },
);

export async function getArticlesCount(): Promise<number> {
  try {
    return await fetchArticlesCountCached();
  } catch (error) {
    console.error("[getArticlesCount] Supabase-fråga misslyckades", error);
    return 0;
  }
}

const fetchArticleBySlugCached = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();

    if (error) throw new Error(`[getArticleBySlug] ${error.message}`);

    return data ? toArticle(data as ArticleRow) : null;
  },
  ["article-by-slug"],
  { tags: ["articles"], revalidate: 300 },
);

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await fetchArticleBySlugCached(slug);
  } catch (error) {
    console.error("[getArticleBySlug] Supabase-fråga misslyckades", error);
    return null;
  }
}
