"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PrepperAssignee, PrepperItemType, PrepperPurchaseStatus } from "@/lib/types";

function notebookPath(notebookId: string) {
  return `/admin/appar/prepper/${notebookId}`;
}

async function nextPosition(
  supabase: ReturnType<typeof createServiceRoleClient>,
  table: string,
  column: string,
  value: string,
) {
  const { data } = await supabase
    .from(table)
    .select("position")
    .eq(column, value)
    .order("position", { ascending: false })
    .limit(1);
  return (data?.[0]?.position ?? -1) + 1;
}

// --- Notebooks ---

export async function createNotebook(name: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("prepper_notebooks")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);
  const position = (data?.[0]?.position ?? -1) + 1;

  await supabase.from("prepper_notebooks").insert({ name, position, created_by: user.id });

  revalidatePath("/admin/appar/prepper");
}

export async function renameNotebook(id: string, name: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_notebooks").update({ name, updated_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/appar/prepper");
  revalidatePath(notebookPath(id));
}

export async function updateNotebookAppearance(id: string, icon: string, color: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("prepper_notebooks")
    .update({ icon, color, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/appar/prepper");
  revalidatePath(notebookPath(id));
}

// --- Checklists ---

export async function createChecklist(notebookId: string, title: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "prepper_checklists", "notebook_id", notebookId);

  const { data } = await supabase
    .from("prepper_checklists")
    .insert({ notebook_id: notebookId, title, position, created_by: user.id })
    .select("id, title")
    .single();

  revalidatePath(notebookPath(notebookId));
  return data;
}

export async function renameChecklist(id: string, notebookId: string, title: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_checklists").update({ title, updated_at: new Date().toISOString() }).eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function updateChecklistAppearance(id: string, notebookId: string, icon: string, color: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("prepper_checklists")
    .update({ icon, color, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

// --- Sections ---

export async function createSection(checklistId: string, notebookId: string, title: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "prepper_sections", "checklist_id", checklistId);

  const { data } = await supabase
    .from("prepper_sections")
    .insert({ checklist_id: checklistId, title, position, created_by: user.id })
    .select("id, title")
    .single();

  revalidatePath(notebookPath(notebookId));
  return data;
}

export async function renameSection(id: string, notebookId: string, title: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_sections").update({ title, updated_at: new Date().toISOString() }).eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function updateSectionAppearance(id: string, notebookId: string, icon: string, color: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("prepper_sections")
    .update({ icon, color, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function deleteSection(id: string, notebookId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_sections").delete().eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function reorderSections(notebookId: string, orderedIds: string[]) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("prepper_sections").update({ position: index }).eq("id", id)),
  );

  revalidatePath(notebookPath(notebookId));
}

// --- Items ---

export async function createItem(sectionId: string, notebookId: string, title: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "prepper_items", "section_id", sectionId);

  const { data } = await supabase
    .from("prepper_items")
    .insert({ section_id: sectionId, title, position, created_by: user.id })
    .select("id, title")
    .single();

  revalidatePath(notebookPath(notebookId));
  return data;
}

export async function updateItem(
  id: string,
  notebookId: string,
  fields: {
    title?: string;
    note?: string;
    type?: PrepperItemType;
    dueDate?: string | null;
    priority?: boolean;
    purchaseStatus?: PrepperPurchaseStatus | null;
    estimatedPrice?: number | null;
    actualPrice?: number | null;
    link?: string | null;
    imageUrl?: string | null;
    assignee?: PrepperAssignee | null;
    tags?: string[] | null;
  },
) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();

  const update: Record<string, unknown> = { updated_by: user.id, updated_at: new Date().toISOString() };
  if (fields.title !== undefined) update.title = fields.title;
  if (fields.note !== undefined) update.note = fields.note;
  if (fields.type !== undefined) update.type = fields.type;
  if (fields.dueDate !== undefined) update.due_date = fields.dueDate;
  if (fields.priority !== undefined) update.priority = fields.priority;
  if (fields.purchaseStatus !== undefined) update.purchase_status = fields.purchaseStatus;
  if (fields.estimatedPrice !== undefined) update.estimated_price = fields.estimatedPrice;
  if (fields.actualPrice !== undefined) update.actual_price = fields.actualPrice;
  if (fields.link !== undefined) update.link = fields.link;
  if (fields.imageUrl !== undefined) update.image_url = fields.imageUrl;
  if (fields.assignee !== undefined) update.assignee = fields.assignee;
  if (fields.tags !== undefined) update.tags = fields.tags;

  await supabase.from("prepper_items").update(update).eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function toggleItem(id: string, notebookId: string, completed: boolean) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();
  await supabase
    .from("prepper_items")
    .update({
      completed,
      updated_by: user.id,
      updated_at: now,
      completed_by: completed ? user.id : null,
      completed_at: completed ? now : null,
    })
    .eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function deleteItem(id: string, notebookId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_items").delete().eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function reorderItems(notebookId: string, orderedIds: string[]) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("prepper_items").update({ position: index }).eq("id", id)),
  );

  revalidatePath(notebookPath(notebookId));
}

// --- Subtasks ---

export async function createSubtask(itemId: string, notebookId: string, title: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "prepper_subtasks", "item_id", itemId);

  const { data } = await supabase
    .from("prepper_subtasks")
    .insert({ item_id: itemId, title, position, created_by: user.id })
    .select("id, title")
    .single();

  revalidatePath(notebookPath(notebookId));
  return data;
}

export async function toggleSubtask(id: string, notebookId: string, completed: boolean) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();
  await supabase
    .from("prepper_subtasks")
    .update({
      completed,
      updated_at: now,
      completed_by: completed ? user.id : null,
      completed_at: completed ? now : null,
    })
    .eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function deleteSubtask(id: string, notebookId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("prepper_subtasks").delete().eq("id", id);

  revalidatePath(notebookPath(notebookId));
}

export async function reorderSubtasks(notebookId: string, orderedIds: string[]) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("prepper_subtasks").update({ position: index }).eq("id", id)),
  );

  revalidatePath(notebookPath(notebookId));
}
