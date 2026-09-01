"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { logProjectActivity } from "@/lib/data/client-projects";

export async function addChecklistItem(projectId: string, label: string) {
  await verifySession();
  const trimmed = label.trim();
  if (!trimmed) return;

  const supabase = createServiceRoleClient();
  const { count } = await supabase
    .from("project_checklist_items")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  await supabase
    .from("project_checklist_items")
    .insert({ project_id: projectId, label: trimmed, position: count ?? 0 });

  await logProjectActivity(projectId, `Lade till "${trimmed}" i att göra`);

  revalidatePath(`/admin/projekt/${projectId}`);
}

export async function toggleChecklistItem(projectId: string, itemId: string, done: boolean) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("project_checklist_items").update({ done }).eq("id", itemId);

  revalidatePath(`/admin/projekt/${projectId}`);
}

export async function deleteChecklistItem(projectId: string, itemId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("project_checklist_items").delete().eq("id", itemId);

  revalidatePath(`/admin/projekt/${projectId}`);
}
