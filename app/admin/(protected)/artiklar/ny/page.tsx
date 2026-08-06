import { ArticleForm } from "@/components/admin/ArticleForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export default async function NewArticlePage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);
  const availableTags = Array.from(new Set(articles.flatMap((article) => article.tags))).sort();

  return (
    <div>
      <BackLink href="/admin/artiklar" label="Tillbaka till artiklar" />
      <h1 className="font-display text-2xl font-bold text-bone">Ny artikel</h1>
      <Card className="mt-8 max-w-3xl">
        <ArticleForm availableTags={availableTags} categories={categories} />
      </Card>
    </div>
  );
}
