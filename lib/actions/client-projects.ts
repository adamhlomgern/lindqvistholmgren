"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { insertMaterialFile } from "@/lib/actions/material";
import { logProjectActivity } from "@/lib/data/client-projects";
import type { AwaitingCustomerType, ClientProjectStatus } from "@/lib/types";

export type ClientProjectFormState = { error?: string } | undefined;

const statusLabels: Record<ClientProjectStatus, string> = {
  planerat: "Planerat",
  pagaende: "Pågående",
  vantar_pa_kund: "Väntar på kund",
  pausat: "Pausat",
  klar: "Klart",
};

const VALID_STATUSES = Object.keys(statusLabels) as ClientProjectStatus[];
const VALID_AWAITING_TYPES: AwaitingCustomerType[] = ["material", "message", "project"];

// "Uppstart, Designarbete, Din återkoppling" -> ["Uppstart", "Designarbete", "Din återkoppling"].
// Empty input means no phase indicator for this project.
function parsePhaseLabels(raw: FormDataEntryValue | null): string[] | null {
  if (typeof raw !== "string") return null;
  const labels = raw
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
  return labels.length > 0 ? labels : null;
}

// Grunduppgifter only — title, customer, assignee, deadline, the internal
// overview/notes. The customer-facing fields (status update, phase, next
// milestone, what's awaiting the customer) are a separate concern, edited
// inline on the project page via updateCustomerView/parseCustomerViewForm
// below, not through this form — see CustomerViewCard.
function parseClientProjectForm(formData: FormData) {
  const statusRaw = String(formData.get("status") ?? "");
  const status = VALID_STATUSES.includes(statusRaw as ClientProjectStatus)
    ? (statusRaw as ClientProjectStatus)
    : undefined;

  return {
    title: String(formData.get("title") ?? "").trim(),
    customer_id: String(formData.get("customerId") ?? "").trim() || null,
    assignee_entity_id: String(formData.get("assigneeEntityId") ?? "").trim() || null,
    deadline: String(formData.get("deadline") ?? "").trim() || null,
    overview: String(formData.get("overview") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    ...(status ? { status } : {}),
  };
}

function parseCustomerViewForm(formData: FormData) {
  const phaseLabels = parsePhaseLabels(formData.get("phaseLabels"));
  const phaseCurrentRaw = Number(formData.get("phaseCurrent"));
  const phaseCurrent = phaseLabels && Number.isInteger(phaseCurrentRaw) ? Math.min(Math.max(phaseCurrentRaw, 0), phaseLabels.length - 1) : null;

  const awaitingCustomerLabel = String(formData.get("awaitingCustomerLabel") ?? "").trim() || null;
  const awaitingTypeRaw = String(formData.get("awaitingCustomerType") ?? "");
  const awaitingCustomerType = awaitingCustomerLabel
    ? VALID_AWAITING_TYPES.includes(awaitingTypeRaw as AwaitingCustomerType)
      ? awaitingTypeRaw
      : "project"
    : null;

  return {
    customer_update: String(formData.get("customerUpdate") ?? "").trim() || null,
    next_milestone_label: String(formData.get("nextMilestoneLabel") ?? "").trim() || null,
    next_milestone_date: String(formData.get("nextMilestoneDate") ?? "").trim() || null,
    next_milestone_delivered: formData.get("nextMilestoneDelivered") === "on",
    phase_labels: phaseLabels,
    phase_current: phaseCurrent,
    awaiting_customer_label: awaitingCustomerLabel,
    awaiting_customer_type: awaitingCustomerType,
    awaiting_customer_due: String(formData.get("awaitingCustomerDue") ?? "").trim() || null,
  };
}

// The "Att göra" list at creation is posted as a JSON array of plain labels
// in a hidden field — the project doesn't have an id yet, so items can't be
// inserted one at a time the way the checklist widget does post-creation.
function parseTasksField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export async function createClientProject(
  _prevState: ClientProjectFormState,
  formData: FormData,
): Promise<ClientProjectFormState> {
  await verifySession();
  const row = parseClientProjectForm(formData);

  if (!row.title) {
    return { error: "Titel krävs." };
  }
  if (!row.customer_id) {
    return { error: "Kund krävs." };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("client_projects").insert(row).select("id").single();

  if (error) {
    return { error: `Kunde inte skapa projektet: ${error.message}` };
  }

  const projectId = data.id as string;

  const tasks = parseTasksField(formData.get("tasks"));
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const tasksInsert =
    tasks.length > 0
      ? supabase
          .from("project_checklist_items")
          .insert(tasks.map((label, position) => ({ project_id: projectId, label, position })))
      : Promise.resolve();

  // Sequential, not Promise.all — each insertMaterialFile computes its own
  // storage path from a fresh crypto.randomUUID(), but position needs to
  // increment locally to avoid every file in the batch racing to read the
  // same "next position" and landing on the same number.
  async function storeFiles() {
    const { data: positionRow } = await supabase
      .from("material_items")
      .select("position")
      .eq("customer_id", row.customer_id)
      .is("folder_id", null)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    let position = (positionRow?.position ?? -1) + 1;

    for (const file of files) {
      const result = await insertMaterialFile(supabase, {
        customerId: row.customer_id!,
        projectId,
        folderId: null,
        file,
        visibility: "internal",
        deliveryStatus: "draft",
        position: position++,
      });
      if (result.error) console.error("[createClientProject] Kunde inte spara bifogad fil", result.error);
    }
  }

  await Promise.all([tasksInsert, storeFiles()]);

  await logProjectActivity(projectId, "Projektet skapades");

  revalidatePath("/admin/projekt");
  redirect(`/admin/projekt/${projectId}`);
}

export async function updateClientProject(
  id: string,
  _prevState: ClientProjectFormState,
  formData: FormData,
): Promise<ClientProjectFormState> {
  await verifySession();
  const row = parseClientProjectForm(formData);

  if (!row.title) {
    return { error: "Titel krävs." };
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("client_projects")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  await logProjectActivity(id, "Projektinfo uppdaterades");

  revalidatePath("/admin/projekt");
  revalidatePath(`/admin/projekt/${id}`);
  redirect(`/admin/projekt/${id}`);
}

// Separate from updateClientProject — this is the inline "Kundvy" card on
// the project page, edited without leaving the page (no redirect), so the
// customer-facing fields don't have to live in the same big form as the
// internal grunduppgifter. See parseCustomerViewForm's comment.
export async function updateCustomerView(
  id: string,
  _prevState: ClientProjectFormState,
  formData: FormData,
): Promise<ClientProjectFormState> {
  await verifySession();
  const row = parseCustomerViewForm(formData);

  const supabase = createServiceRoleClient();

  // customer_update_at should only move when the customer-facing text
  // actually changes, not on every save of this card (phase, milestone,
  // ...) — otherwise "senast uppdaterat" in the kundportal would be
  // meaningless. Cheapest way to know that without threading extra state
  // through the form is to read the current value back first.
  const { data: existing } = await supabase
    .from("client_projects")
    .select("customer_update")
    .eq("id", id)
    .maybeSingle();
  const customerUpdateChanged = (existing?.customer_update ?? null) !== row.customer_update;

  const { error } = await supabase
    .from("client_projects")
    .update({
      ...row,
      ...(customerUpdateChanged
        ? { customer_update_at: row.customer_update ? new Date().toISOString() : null }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  await logProjectActivity(id, "Kundvyn uppdaterades");

  revalidatePath("/admin/projekt");
  revalidatePath(`/admin/projekt/${id}`);
  revalidatePath("/kund/projekt", "layout");
}

export async function setClientProjectStatus(id: string, status: ClientProjectStatus) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("client_projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  await logProjectActivity(id, `Status ändrades till ${statusLabels[status]}`);

  revalidatePath("/admin/projekt");
  revalidatePath(`/admin/projekt/${id}`);
}

export async function setProjectDeadline(id: string, deadline: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const trimmed = deadline.trim() || null;
  await supabase
    .from("client_projects")
    .update({ deadline: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id);

  await logProjectActivity(id, trimmed ? "Deadline uppdaterades" : "Deadline togs bort");

  revalidatePath("/admin/projekt");
  revalidatePath(`/admin/projekt/${id}`);
}

export async function setProjectAssignee(id: string, assigneeEntityId: string, assigneeName: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const trimmed = assigneeEntityId.trim() || null;
  await supabase
    .from("client_projects")
    .update({ assignee_entity_id: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id);

  await logProjectActivity(id, trimmed ? `Ansvarig ändrades till ${assigneeName}` : "Ansvarig togs bort");

  revalidatePath(`/admin/projekt/${id}`);
}

export async function deleteClientProject(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();

  const { data: files } = await supabase
    .from("material_items")
    .select("storage_path")
    .eq("project_id", id)
    .not("storage_path", "is", null);
  await deleteStoredFiles((files ?? []).map((row) => row.storage_path));
  await supabase.from("material_items").delete().eq("project_id", id);

  await supabase.from("client_projects").delete().eq("id", id);

  revalidatePath("/admin/projekt");
  redirect("/admin/projekt");
}
