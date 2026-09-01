import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { getArticleBySlug } from "@/lib/data/articles";
import { ArticleView } from "@/components/articles/ArticleView";
import { articleStatusLabels } from "@/lib/articles/status";

type Props = { params: Promise<{ slug: string }> };

// Deliberately outside app/admin/(protected) — that layout wraps every page
// in the admin shell (sidebar, max-w-5xl content column), which would make
// this look nothing like the real public page. verifySession() here does
// the same auth check the layout would have, just without the chrome.
//
// Renders the exact same ArticleView the public route uses, fed by
// getArticleBySlug (any status) instead of the public
// getPublishedArticleBySlug — so a draft/scheduled/unpublished article can
// be checked for real before it ever goes live.
export default async function ArticlePreviewPage({ params }: Props) {
  await verifySession();
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-forest">
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-bone/10 bg-charcoal px-4 py-3">
        <Link
          href={`/admin/artiklar/${article.slug}`}
          className="flex items-center gap-1.5 text-sm text-bone hover:text-emerald"
        >
          <ArrowLeft size={15} strokeWidth={2.25} />
          Tillbaka till redigering
        </Link>
        <span className="rounded-full bg-bone/10 px-3 py-1 text-xs font-medium text-bone">
          Förhandsgranskning · {articleStatusLabels[article.status]}
        </span>
      </div>
      <ArticleView article={article} />
    </div>
  );
}
