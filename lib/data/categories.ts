import { unstable_cache } from "next/cache";
import type { ArticleIconKey } from "@/lib/types";
import type { Accent } from "@/lib/design/accents";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ArticleCategory = {
  name: string;
  icon: ArticleIconKey;
  accent: Accent;
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

    return data as ArticleCategory[];
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
