"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ArticleFormState = { error?: string } | undefined;

function parseArticleForm(formData: FormData) {
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const content = String(formData.get("content") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    tags,
    icon: String(formData.get("icon") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    read_time: String(formData.get("readTime") ?? "").trim(),
    content,
  };
}

export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await verifySession();
  const row = parseArticleForm(formData);

  if (!row.slug || !row.title) {
    return { error: "Slug och titel krävs." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("articles").insert(row);

  if (error) {
    return { error: `Kunde inte skapa artikeln: ${error.message}` };
  }

  updateTag("articles");
  revalidatePath("/artiklar");
  revalidatePath(`/artiklar/${row.slug}`);
  redirect("/admin/artiklar");
}

export async function updateArticle(
  slug: string,
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await verifySession();
  const row = parseArticleForm(formData);

  if (!row.title) {
    return { error: "Titel krävs." };
  }

  const { slug: _slug, ...updates } = row;
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("articles").update(updates).eq("slug", slug);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  updateTag("articles");
  revalidatePath("/artiklar");
  revalidatePath(`/artiklar/${slug}`);
  redirect("/admin/artiklar");
}

export async function deleteArticle(slug: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("articles").delete().eq("slug", slug);
  updateTag("articles");
  revalidatePath("/artiklar");
  revalidatePath(`/artiklar/${slug}`);
  redirect("/admin/artiklar");
}
