import { ArticleForm } from "@/components/admin/ArticleForm";
import { BackLink } from "@/components/admin/BackLink";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export default async function NewArticlePage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);
  const availableTags = Array.from(new Set(articles.flatMap((article) => article.tags))).sort();

  return (
    <div>
      <div className="hidden md:block">
        <BackLink href="/admin/artiklar" label="Artiklar" />
      </div>
      <ArticleForm availableTags={availableTags} categories={categories} />
    </div>
  );
}
