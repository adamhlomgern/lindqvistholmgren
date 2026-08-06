import type { Article, ArticleIconKey } from "@/lib/types";
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

export async function getArticles(): Promise<Article[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("[getArticles] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data as ArticleRow[]).map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[getArticleBySlug] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toArticle(data as ArticleRow) : null;
}
