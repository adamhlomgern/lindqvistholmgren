import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { getPublishedArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { articleIcons, resolveCategoryVisual } from "@/lib/articles/visuals";

type RelatedArticlesProps = {
  currentSlug: string;
  category: string;
};

export async function RelatedArticles({ currentSlug, category }: RelatedArticlesProps) {
  const [articles, categories] = await Promise.all([getPublishedArticles(), getCategories()]);
  const others = articles.filter((article) => article.slug !== currentSlug);
  const sameCategory = others.filter((article) => article.category === category);
  const rest = others
    .filter((article) => article.category !== category)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const related = [...sameCategory, ...rest].slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-bone/10 pt-10">
      <h2 className="font-display text-xl font-bold text-bone">Fler artiklar</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {related.map((article) => {
          const accent = resolveCategoryVisual(categories, article.category).accent;
          const Icon = articleIcons[article.icon];
          return (
            <Link key={article.slug} href={`/artiklar/${article.slug}`} className="group block">
              <GlassCard accent={accent}>
                <AccentBadge icon={Icon} accent={accent} />
                <h3 className="mt-3 font-display text-sm font-bold leading-snug text-bone">
                  {article.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <Tag>{article.category}</Tag>
                  <span className="text-xs text-stone">{article.readTime}</span>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
