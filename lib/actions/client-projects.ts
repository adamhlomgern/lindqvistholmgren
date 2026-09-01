"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { logProjectActivity } from "@/lib/data/client-projects";
import type { ClientProjectStatus } from "@/lib/types";

export type ClientProjectFormState = { error?: string } | undefined;

const statusLabels: Record<ClientProjectStatus, string> = {
  planerat: "Planerat",
  pagaende: "Pågående",
  vantar_pa_kund: "Väntar på kund",
  pausat: "Pausat",
  klar: "Klart",
};

function parseClientProjectForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    customer_id: String(formData.get("customerId") ?? "").trim() || null,
    assignee_entity_id: String(formData.get("assigneeEntityId") ?? "").trim() || null,
    deadline: String(formData.get("deadline") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
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

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("client_projects").insert(row).select("id").single();

  if (error) {
    return { error: `Kunde inte skapa projektet: ${error.message}` };
  }

  await logProjectActivity(data.id, "Projektet skapades");

  revalidatePath("/admin/projekt");
  redirect(`/admin/projekt/${data.id}`);
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

export async function setProjectNextStep(id: string, nextStep: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const trimmed = nextStep.trim() || null;
  await supabase
    .from("client_projects")
    .update({ next_step: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id);

  await logProjectActivity(id, trimmed ? "Nästa steg uppdaterades" : "Nästa steg togs bort");

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

  const { data: files } = await supabase.from("project_files").select("storage_path").eq("project_id", id);
  await deleteStoredFiles((files ?? []).map((row) => row.storage_path));

  await supabase.from("client_projects").delete().eq("id", id);

  revalidatePath("/admin/projekt");
  redirect("/admin/projekt");
}
