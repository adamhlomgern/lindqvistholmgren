import { getArticles } from "@/lib/data/articles";
import { TagsManager } from "@/components/admin/TagsManager";

export default async function AdminTagsPage() {
  const articles = await getArticles();
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const tags = Array.from(counts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "sv"),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Taggar</h1>
      <p className="mt-1 text-sm text-stone">
        Byt namn på eller ta bort taggar — ändringen slår igenom på alla artiklar som använder dem.
      </p>

      <TagsManager tags={tags} />
    </div>
  );
}
