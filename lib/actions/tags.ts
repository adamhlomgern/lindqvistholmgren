"use server";

import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getArticles } from "@/lib/data/articles";

export async function renameTag(oldName: string, formData: FormData) {
  await verifySession();
  const newName = String(formData.get("newName") ?? "").trim();
  if (!newName || newName === oldName) return;

  const supabase = createServiceRoleClient();
  const articles = await getArticles();

  for (const article of articles) {
    if (!article.tags.includes(oldName)) continue;
    const nextTags = Array.from(
      new Set(article.tags.map((tag) => (tag === oldName ? newName : tag))),
    );
    await supabase.from("articles").update({ tags: nextTags }).eq("slug", article.slug);
  }

  updateTag("articles");
  revalidatePath("/admin/taggar");
  revalidatePath("/artiklar");
}

export async function deleteTag(name: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const articles = await getArticles();

  for (const article of articles) {
    if (!article.tags.includes(name)) continue;
    const nextTags = article.tags.filter((tag) => tag !== name);
    await supabase.from("articles").update({ tags: nextTags }).eq("slug", article.slug);
  }

  updateTag("articles");
  revalidatePath("/admin/taggar");
  revalidatePath("/artiklar");
}
