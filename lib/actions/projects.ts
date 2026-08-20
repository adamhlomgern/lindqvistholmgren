"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ProjectFormState = { error?: string } | undefined;

function parseProjectForm(formData: FormData) {
  const solution = String(formData.get("solution") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const gallery = String(formData.get("gallery") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const stats = String(formData.get("stats") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, label] = line.split("|").map((part) => part?.trim() ?? "");
      return { value, label };
    })
    .filter((stat) => stat.value && stat.label);

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    intro: String(formData.get("intro") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    gallery: gallery.length > 0 ? gallery : null,
    client: String(formData.get("client") ?? "").trim(),
    industry: String(formData.get("industry") ?? "").trim(),
    services: String(formData.get("services") ?? "").trim(),
    launch: String(formData.get("launch") ?? "").trim(),
    platform: String(formData.get("platform") ?? "").trim(),
    challenge: String(formData.get("challenge") ?? "").trim(),
    solution,
    stats: stats.length > 0 ? stats : null,
  };
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await verifySession();
  const row = parseProjectForm(formData);

  if (!row.slug || !row.title) {
    return { error: "Slug och titel krävs." };
  }
  if (!row.image) {
    return { error: "En huvudbild krävs." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("projects").insert(row);

  if (error) {
    return { error: `Kunde inte skapa projektet: ${error.message}` };
  }

  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/projekt");
  revalidatePath(`/projekt/${row.slug}`);
  redirect("/admin/projekt");
}

export async function updateProject(
  slug: string,
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await verifySession();
  const row = parseProjectForm(formData);

  if (!row.title) {
    return { error: "Titel krävs." };
  }
  if (!row.image) {
    return { error: "En huvudbild krävs." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("projects").update(row).eq("slug", slug);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/projekt");
  revalidatePath(`/projekt/${slug}`);
  redirect("/admin/projekt");
}

export async function deleteProject(slug: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("projects").delete().eq("slug", slug);
  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/projekt");
  revalidatePath(`/projekt/${slug}`);
  redirect("/admin/projekt");
}
