import Link from "next/link";
import { Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { articleIcons, resolveCategoryVisual } from "@/lib/articles/visuals";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bone">Artiklar</h1>
        <Link
          href="/admin/artiklar/ny"
          className="flex items-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny artikel
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const accent = resolveCategoryVisual(categories, article.category).accent;
          const Icon = articleIcons[article.icon];
          return (
            <Link key={article.slug} href={`/admin/artiklar/${article.slug}`} className="group block">
              <GlassCard accent={accent}>
                <AccentBadge icon={Icon} accent={accent} />
                <h2 className="mt-4 font-display text-base font-bold text-bone">{article.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-stone">{article.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Tag>{article.category}</Tag>
                  <span className="text-xs text-stone">{article.date}</span>
                </div>
              </GlassCard>
            </Link>
          );
        })}
        {articles.length === 0 && <p className="text-sm text-stone">Inga artiklar ännu.</p>}
      </div>
    </div>
  );
}
