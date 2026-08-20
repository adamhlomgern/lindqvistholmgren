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

export const getArticles = unstable_cache(
  async (): Promise<ArticleSummary[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("articles")
      .select(summaryColumns)
      .order("date", { ascending: false });

    if (error) {
      console.error("[getArticles] Supabase-fråga misslyckades", error);
      return [];
    }

    return (data as ArticleSummaryRow[]).map(toArticleSummary);
  },
  ["articles-list"],
  { tags: ["articles"], revalidate: 3600 },
);

export const getArticlesCount = unstable_cache(
  async (): Promise<number> => {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[getArticlesCount] Supabase-fråga misslyckades", error);
      return 0;
    }

    return count ?? 0;
  },
  ["articles-count"],
  { tags: ["articles"], revalidate: 3600 },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();

    if (error) {
      console.error("[getArticleBySlug] Supabase-fråga misslyckades", error);
      return null;
    }

    return data ? toArticle(data as ArticleRow) : null;
  },
  ["article-by-slug"],
  { tags: ["articles"], revalidate: 3600 },
);
