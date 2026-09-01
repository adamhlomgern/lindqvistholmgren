import { unstable_cache } from "next/cache";
import type { Article, ArticleIconKey, ArticleStatus, ArticleSummary } from "@/lib/types";
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
  status: ArticleStatus;
  updated_at: string;
  seo_title: string | null;
  meta_description: string | null;
};

type ArticleSummaryRow = Omit<ArticleRow, "content">;

const summaryColumns = "slug, title, excerpt, category, tags, icon, date, read_time, status, updated_at";

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
    status: row.status,
    updatedAt: row.updated_at,
    seoTitle: row.seo_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
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
    status: row.status,
    updatedAt: row.updated_at,
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

// Admin-facing — every status, unfiltered. Public pages must never use this.
export async function getArticles(): Promise<ArticleSummary[]> {
  try {
    return await fetchArticlesCached();
  } catch (error) {
    console.error("[getArticles] Supabase-fråga misslyckades", error);
    return [];
  }
}

// A "schemalagd" article is publicly visible once its date arrives — there's
// no cron flipping status, so visibility for that status is computed from
// today's date instead. Cache key/tag intentionally separate from
// getArticles() even though they share a revalidate window, since this
// filter is date-dependent and the two must never be confused for each
// other by a caller.
const fetchPublishedArticlesCached = unstable_cache(
  async (): Promise<ArticleSummary[]> => {
    const supabase = createServiceRoleClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("articles")
      .select(summaryColumns)
      .or(`status.eq.publicerad,and(status.eq.schemalagd,date.lte.${today})`)
      .order("date", { ascending: false });

    if (error) throw new Error(`[getPublishedArticles] ${error.message}`);

    return (data as ArticleSummaryRow[]).map(toArticleSummary);
  },
  ["articles-published-list"],
  { tags: ["articles"], revalidate: 300 },
);

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  try {
    return await fetchPublishedArticlesCached();
  } catch (error) {
    console.error("[getPublishedArticles] Supabase-fråga misslyckades", error);
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

// Admin-facing — returns the article regardless of status.
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await fetchArticleBySlugCached(slug);
  } catch (error) {
    console.error("[getArticleBySlug] Supabase-fråga misslyckades", error);
    return null;
  }
}

// Public-facing — returns null (renders as 404) for a draft, unpublished,
// or not-yet-scheduled article, even if the slug is guessed directly.
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const today = new Date().toISOString().slice(0, 10);
  const isVisible =
    article.status === "publicerad" || (article.status === "schemalagd" && article.date <= today);

  return isVisible ? article : null;
}
