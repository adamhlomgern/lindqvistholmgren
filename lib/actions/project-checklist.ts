"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { logProjectActivity } from "@/lib/data/client-projects";

export async function addChecklistItem(projectId: string, label: string, position: number) {
  await verifySession();
  const trimmed = label.trim();
  if (!trimmed) return;

  const supabase = createServiceRoleClient();
  await Promise.all([
    supabase.from("project_checklist_items").insert({ project_id: projectId, label: trimmed, position }),
    logProjectActivity(projectId, `Lade till "${trimmed}" i att göra`),
  ]);

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
