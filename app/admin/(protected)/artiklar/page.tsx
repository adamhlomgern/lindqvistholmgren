import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminArticlesGrid } from "@/components/admin/AdminArticlesGrid";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

  const publishedCount = articles.filter((a) => a.status === "publicerad").length;
  const draftCount = articles.filter((a) => a.status === "utkast").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">Artiklar</h1>
          <p className="mt-1 text-sm text-stone">
            {publishedCount} publicerade{draftCount > 0 ? ` · ${draftCount} utkast` : ""}
          </p>
        </div>
        <Link
          href="/admin/artiklar/ny"
          className="flex items-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny artikel
        </Link>
      </div>

      <AdminArticlesGrid articles={articles} categories={categories} />
    </div>
  );
}
