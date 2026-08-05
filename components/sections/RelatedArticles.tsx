import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { articles } from "@/lib/data/articles";
import { articleIcons, badgeClasses, getAccent } from "@/lib/articles/visuals";

type RelatedArticlesProps = {
  currentSlug: string;
  category: string;
};

export function RelatedArticles({ currentSlug, category }: RelatedArticlesProps) {
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
          const accent = getAccent(article.category);
          const Icon = articleIcons[article.icon];
          return (
            <Link key={article.slug} href={`/artiklar/${article.slug}`} className="group block">
              <div className="flex h-full flex-col rounded-2xl border border-bone/10 bg-bone/5 p-5 transition-colors group-hover:bg-bone/[0.08]">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badgeClasses[accent]}`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <h3 className="mt-3 font-display text-sm font-bold leading-snug text-bone">
                  {article.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <Tag>{article.category}</Tag>
                  <span className="text-xs text-stone">{article.readTime}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
