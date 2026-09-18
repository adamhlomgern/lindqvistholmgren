import type {
  PrepperChecklist,
  PrepperChecklistDetail,
  PrepperItem,
  PrepperNotebook,
  PrepperSection,
  PrepperSubtask,
} from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

type NotebookRow = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

function toNotebook(row: NotebookRow): PrepperNotebook {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    position: row.position,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type ChecklistRow = {
  id: string;
  notebook_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

function toChecklist(row: ChecklistRow): PrepperChecklist {
  return {
    id: row.id,
    notebookId: row.notebook_id,
    title: row.title,
    description: row.description ?? undefined,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    position: row.position,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getNotebooks(): Promise<PrepperNotebook[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("prepper_notebooks")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("[getNotebooks] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toNotebook);
}

export async function getNotebookById(notebookId: string): Promise<PrepperNotebook | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("prepper_notebooks")
    .select("*")
    .eq("id", notebookId)
    .maybeSingle();

  if (error) {
    console.error("[getNotebookById] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toNotebook(data) : null;
}

export type PrepperChecklistSummary = PrepperChecklist & { doneCount: number; totalCount: number };

// One query for the checklist rows, one for every item's completed flag
// (joined back to its checklist through section_id) — cheap enough for a
// notebook's checklist switcher, and avoids a per-checklist round trip.
export async function getChecklistsForNotebook(notebookId: string): Promise<PrepperChecklistSummary[]> {
  const supabase = createServiceRoleClient();
  const { data: checklistRows, error: checklistError } = await supabase
    .from("prepper_checklists")
    .select("*")
    .eq("notebook_id", notebookId)
    .order("position", { ascending: true });

  if (checklistError) {
    console.error("[getChecklistsForNotebook] Supabase-fråga misslyckades", checklistError);
    return [];
  }

  const checklists = (checklistRows ?? []).map(toChecklist);
  if (checklists.length === 0) return [];

  const { data: sectionRows, error: sectionError } = await supabase
    .from("prepper_sections")
    .select("id, checklist_id")
    .in(
      "checklist_id",
      checklists.map((c) => c.id),
    );

  if (sectionError) {
    console.error("[getChecklistsForNotebook] Kunde inte hämta sektioner", sectionError);
    return checklists.map((checklist) => ({ ...checklist, doneCount: 0, totalCount: 0 }));
  }

  const checklistIdBySectionId = new Map((sectionRows ?? []).map((row) => [row.id as string, row.checklist_id as string]));
  const sectionIds = Array.from(checklistIdBySectionId.keys());

  const { data: itemRows, error: itemError } = sectionIds.length
    ? await supabase.from("prepper_items").select("completed, section_id").in("section_id", sectionIds)
    : { data: [], error: null };

  if (itemError) {
    console.error("[getChecklistsForNotebook] Kunde inte hämta progress", itemError);
    return checklists.map((checklist) => ({ ...checklist, doneCount: 0, totalCount: 0 }));
  }

  const counts = new Map<string, { done: number; total: number }>();
  for (const row of itemRows ?? []) {
    const checklistId = checklistIdBySectionId.get(row.section_id as string);
    if (!checklistId) continue;
    const entry = counts.get(checklistId) ?? { done: 0, total: 0 };
    entry.total += 1;
    if (row.completed) entry.done += 1;
    counts.set(checklistId, entry);
  }

  return checklists.map((checklist) => {
    const entry = counts.get(checklist.id) ?? { done: 0, total: 0 };
    return { ...checklist, doneCount: entry.done, totalCount: entry.total };
  });
}

// The full tree for one checklist: sections -> items -> subtasks, three
// queries folded together in JS (simplest way to build a nested tree from
// PostgREST without relying on deep embedded-resource ordering guarantees).
export async function getChecklistDetail(checklistId: string): Promise<PrepperChecklistDetail | null> {
  const supabase = createServiceRoleClient();

  const [{ data: checklistRow, error: checklistError }, { data: sectionRows, error: sectionError }] =
    await Promise.all([
      supabase.from("prepper_checklists").select("*").eq("id", checklistId).maybeSingle(),
      supabase
        .from("prepper_sections")
        .select("*")
        .eq("checklist_id", checklistId)
        .order("position", { ascending: true }),
    ]);

  if (checklistError || !checklistRow) {
    if (checklistError) console.error("[getChecklistDetail] Supabase-fråga misslyckades", checklistError);
    return null;
  }
  if (sectionError) {
    console.error("[getChecklistDetail] Kunde inte hämta sektioner", sectionError);
    return null;
  }

  const sectionIds = (sectionRows ?? []).map((row) => row.id as string);

  const [{ data: itemRows, error: itemError }, subtasksBySectionResult] = await Promise.all([
    sectionIds.length
      ? supabase.from("prepper_items").select("*").in("section_id", sectionIds).order("position", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    (async () => {
      if (sectionIds.length === 0) return { data: [] as { item_id: string }[], error: null };
      const { data: items } = await supabase.from("prepper_items").select("id").in("section_id", sectionIds);
      const itemIds = (items ?? []).map((row) => row.id as string);
      if (itemIds.length === 0) return { data: [] as { item_id: string }[], error: null };
      return supabase
        .from("prepper_subtasks")
        .select("*")
        .in("item_id", itemIds)
        .order("position", { ascending: true });
    })(),
  ]);

  if (itemError) {
    console.error("[getChecklistDetail] Kunde inte hämta items", itemError);
    return null;
  }
  if (subtasksBySectionResult.error) {
    console.error("[getChecklistDetail] Kunde inte hämta subtasks", subtasksBySectionResult.error);
    return null;
  }

  const subtasksByItem = new Map<string, PrepperSubtask[]>();
  for (const row of subtasksBySectionResult.data ?? []) {
    const subtask: PrepperSubtask = {
      id: row.id,
      itemId: row.item_id,
      title: row.title,
      completed: row.completed,
      position: row.position,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedBy: row.completed_by ?? undefined,
      completedAt: row.completed_at ?? undefined,
    };
    const list = subtasksByItem.get(subtask.itemId) ?? [];
    list.push(subtask);
    subtasksByItem.set(subtask.itemId, list);
  }

  const itemsBySection = new Map<string, PrepperItem[]>();
  for (const row of itemRows ?? []) {
    const item: PrepperItem = {
      id: row.id,
      sectionId: row.section_id,
      title: row.title,
      note: row.note ?? undefined,
      completed: row.completed,
      position: row.position,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by ?? undefined,
      completedBy: row.completed_by ?? undefined,
      completedAt: row.completed_at ?? undefined,
      subtasks: subtasksByItem.get(row.id) ?? [],
      type: (row.type ?? "task") as PrepperItem["type"],
      dueDate: row.due_date ?? undefined,
      priority: row.priority ?? false,
      purchaseStatus: row.purchase_status ?? undefined,
      estimatedPrice: row.estimated_price ?? undefined,
      actualPrice: row.actual_price ?? undefined,
      link: row.link ?? undefined,
      imageUrl: row.image_url ?? undefined,
      assignee: row.assignee ?? undefined,
      tags: row.tags ?? undefined,
    };
    const list = itemsBySection.get(item.sectionId) ?? [];
    list.push(item);
    itemsBySection.set(item.sectionId, list);
  }

  const sections: PrepperSection[] = (sectionRows ?? []).map((row) => ({
    id: row.id,
    checklistId: row.checklist_id,
    title: row.title,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    position: row.position,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: itemsBySection.get(row.id) ?? [],
  }));

  return { ...toChecklist(checklistRow), sections };
}
