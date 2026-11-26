"use server";

import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type CategoryFormState = { error?: string } | undefined;

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await verifySession();

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const accent = String(formData.get("accent") ?? "").trim();

  if (!name || !icon || !accent) {
    return { error: "Namn, ikon och färg krävs." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("article_categories").insert({ name, icon, accent });

  if (error) {
    return { error: `Kunde inte skapa kategorin: ${error.message}` };
  }

  updateTag("categories");
  revalidatePath("/admin/kategorier");
  revalidatePath("/artiklar");
}

export async function deleteCategory(name: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("article_categories").delete().eq("name", name);
  updateTag("categories");
  revalidatePath("/admin/kategorier");
  revalidatePath("/artiklar");
}

function revalidateCourse() {
  updateTag("categories");
  updateTag("articles");
  revalidatePath("/admin/kategorier");
  revalidatePath("/artiklar");
  revalidatePath("/artiklar/[slug]", "page");
}

const missingColumns = (message: string) => /column .* does not exist|schema cache|lesson_order|position|description/i.test(message);
const migrationHint = "Kör docs/migrations/2026-11-26-course-modules.sql i Supabase först.";

export type ModuleActionResult = { error?: string };

// Ordningen på modulerna i Kunskapsbanken.
export async function reorderModules(names: string[]): Promise<ModuleActionResult> {
  await verifySession();
  const supabase = createServiceRoleClient();
  for (const [index, name] of names.entries()) {
    const { error } = await supabase.from("article_categories").update({ position: index + 1 }).eq("name", name);
    if (error) return { error: missingColumns(error.message) ? migrationHint : error.message };
  }
  revalidateCourse();
  return {};
}

// Ordningen på lektionerna i en modul (artiklarnas slugs).
export async function reorderLessons(name: string, slugs: string[]): Promise<ModuleActionResult> {
  await verifySession();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("article_categories").update({ lesson_order: slugs }).eq("name", name);
  if (error) return { error: missingColumns(error.message) ? migrationHint : error.message };
  revalidateCourse();
  return {};
}

// Byt namn, beskrivning, ikon och färg. Byter modulen namn flyttas
// artiklarna med (articles.category lagrar namnet).
export async function updateModule(
  name: string,
  patch: { name?: string; description?: string; icon?: string; accent?: string },
): Promise<ModuleActionResult> {
  await verifySession();
  const supabase = createServiceRoleClient();
  const nextName = patch.name?.trim();
  if (patch.name !== undefined && !nextName) return { error: "Namnet kan inte vara tomt." };

  const update: Record<string, unknown> = {};
  if (patch.icon) update.icon = patch.icon;
  if (patch.accent) update.accent = patch.accent;
  if (patch.description !== undefined) update.description = patch.description.trim() || null;
  if (nextName && nextName !== name) update.name = nextName;

  if (Object.keys(update).length) {
    const { error } = await supabase.from("article_categories").update(update).eq("name", name);
    if (error) {
      if (error.code === "23505") return { error: "Det finns redan en kategori med det namnet." };
      return { error: missingColumns(error.message) && "description" in update ? migrationHint : error.message };
    }
  }
  if (nextName && nextName !== name) {
    const { error } = await supabase.from("articles").update({ category: nextName }).eq("category", name);
    if (error) return { error: `Kategorin bytte namn men artiklarna kunde inte flyttas: ${error.message}` };
  }
  revalidateCourse();
  return {};
}
