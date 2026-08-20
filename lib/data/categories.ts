import { unstable_cache } from "next/cache";
import type { ArticleIconKey } from "@/lib/types";
import type { Accent } from "@/lib/design/accents";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ArticleCategory = {
  name: string;
  icon: ArticleIconKey;
  accent: Accent;
};

export const getCategories = unstable_cache(
  async (): Promise<ArticleCategory[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[getCategories] Supabase-fråga misslyckades", error);
      return [];
    }

    return data as ArticleCategory[];
  },
  ["article-categories"],
  { tags: ["categories"], revalidate: 3600 },
);
