import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { deleteArticle } from "@/lib/actions/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, articles, categories] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  const availableTags = Array.from(new Set(articles.flatMap((item) => item.tags))).sort();

  return (
    <div>
      <BackLink href="/admin/artiklar" label="Tillbaka till artiklar" />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bone">Redigera artikel</h1>
        <form action={deleteArticle.bind(null, article.slug)}>
          <button type="submit" className="text-sm font-medium text-coral hover:underline">
            Radera artikel
          </button>
        </form>
      </div>
      <Card className="mt-8 max-w-3xl">
        <ArticleForm article={article} availableTags={availableTags} categories={categories} />
      </Card>
    </div>
  );
}
