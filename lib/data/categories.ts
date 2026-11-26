import { unstable_cache } from "next/cache";
import type { ArticleIconKey } from "@/lib/types";
import type { Accent } from "@/lib/design/accents";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ArticleCategory = {
  name: string;
  icon: ArticleIconKey;
  accent: Accent;
  // Kunskapsbanken: modulens plats, beskrivning och lektionsordning (slugs).
  // Saknas tills migrationen 2026-11-26-course-modules.sql körts.
  position?: number | null;
  description?: string | null;
  lessonOrder?: string[] | null;
};

// Throws on failure instead of returning [] so a transient Supabase error
// never gets cached as "no categories" for the full revalidate window.
const fetchCategoriesCached = unstable_cache(
  async (): Promise<ArticleCategory[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw new Error(`[getCategories] ${error.message}`);

    // Sorteras här i stället för i frågan, så att det fungerar även innan
    // kolumnen position finns. Moduler utan plats hamnar sist, i bokstavsordning.
    return (data as Record<string, unknown>[])
      .map((row) => ({
        name: row.name as string,
        icon: row.icon as ArticleIconKey,
        accent: row.accent as Accent,
        position: (row.position as number | null | undefined) ?? null,
        description: (row.description as string | null | undefined) ?? null,
        lessonOrder: (row.lesson_order as string[] | null | undefined) ?? null,
      }))
      .sort((a, b) => (a.position ?? 1e9) - (b.position ?? 1e9) || a.name.localeCompare(b.name, "sv"));
  },
  ["article-categories"],
  { tags: ["categories"], revalidate: 300 },
);

export async function getCategories(): Promise<ArticleCategory[]> {
  try {
    return await fetchCategoriesCached();
  } catch (error) {
    console.error("[getCategories] Supabase-fråga misslyckades", error);
    return [];
  }
}
