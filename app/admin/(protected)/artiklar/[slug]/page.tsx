import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { BackLink } from "@/components/admin/BackLink";

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
      <BackLink href="/admin/artiklar" label="Artiklar" />
      <ArticleForm article={article} availableTags={availableTags} categories={categories} />
    </div>
  );
}
