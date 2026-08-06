"use server";

import { revalidatePath } from "next/cache";
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

  revalidatePath("/admin/kategorier");
  revalidatePath("/artiklar");
}

export async function deleteCategory(name: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("article_categories").delete().eq("name", name);
  revalidatePath("/admin/kategorier");
  revalidatePath("/artiklar");
}
