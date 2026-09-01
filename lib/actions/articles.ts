"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getArticleBySlug } from "@/lib/data/articles";
import { estimateReadTime } from "@/lib/articles/reading-time";
import type { ArticleStatus } from "@/lib/types";

export type ArticleFormState = { error?: string } | undefined;

const articleStatuses: ArticleStatus[] = ["publicerad", "utkast", "schemalagd", "avpublicerad"];

function parseArticleForm(formData: FormData) {
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const content = String(formData.get("content") ?? "").trim();
  const statusInput = String(formData.get("status") ?? "").trim() as ArticleStatus;

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    tags,
    icon: String(formData.get("icon") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    // Read time is derived from the content itself, not a manually-typed
    // field — it can only ever drift from reality otherwise.
    read_time: estimateReadTime(content),
    content,
    status: articleStatuses.includes(statusInput) ? statusInput : "publicerad",
    seo_title: String(formData.get("seoTitle") ?? "").trim() || null,
    meta_description: String(formData.get("metaDescription") ?? "").trim() || null,
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
  const { error } = await supabase
    .from("articles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  updateTag("articles");
  revalidatePath("/artiklar");
  revalidatePath(`/artiklar/${slug}`);
  redirect("/admin/artiklar");
}

export async function setArticleStatus(slug: string, status: ArticleStatus) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("articles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  updateTag("articles");
  revalidatePath("/artiklar");
  revalidatePath(`/artiklar/${slug}`);
  revalidatePath("/admin/artiklar");
}

export async function duplicateArticle(slug: string) {
  await verifySession();
  const original = await getArticleBySlug(slug);
  if (!original) return;

  const supabase = createServiceRoleClient();

  let newSlug = `${original.slug}-kopia`;
  let attempt = 1;
  while (true) {
    const { data: existing } = await supabase.from("articles").select("slug").eq("slug", newSlug).maybeSingle();
    if (!existing) break;
    attempt += 1;
    newSlug = `${original.slug}-kopia-${attempt}`;
  }

  const { error } = await supabase.from("articles").insert({
    slug: newSlug,
    title: `${original.title} (kopia)`,
    excerpt: original.excerpt,
    category: original.category,
    tags: original.tags,
    icon: original.icon,
    date: original.date,
    read_time: original.readTime,
    content: original.content,
    status: "utkast",
    seo_title: original.seoTitle ?? null,
    meta_description: original.metaDescription ?? null,
  });

  if (error) {
    console.error("[duplicateArticle] Kunde inte duplicera artikeln", error);
    return;
  }

  updateTag("articles");
  revalidatePath("/admin/artiklar");
  redirect(`/admin/artiklar/${newSlug}`);
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
