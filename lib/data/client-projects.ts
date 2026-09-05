import type {
  ClientProject,
  ClientProjectListItem,
  ClientProjectWithCustomer,
  ProjectActivityEntry,
  ProjectChecklistItem,
} from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { toCustomer, type CustomerRow } from "@/lib/data/customers";
import { toBillingEntity, type BillingEntityRow } from "@/lib/data/billing";

type ClientProjectRow = {
  id: string;
  title: string;
  customer_id: string | null;
  status: ClientProject["status"];
  overview: string | null;
  notes: string | null;
  deadline: string | null;
  assignee_entity_id: string | null;
  created_at: string;
  updated_at: string;
};

function toClientProject(row: ClientProjectRow): ClientProject {
  return {
    id: row.id,
    title: row.title,
    customerId: row.customer_id ?? undefined,
    status: row.status,
    overview: row.overview ?? undefined,
    notes: row.notes ?? undefined,
    deadline: row.deadline ?? undefined,
    assigneeEntityId: row.assignee_entity_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function withRelations(
  row: ClientProjectRow & { customer: CustomerRow | null; assignee: BillingEntityRow | null },
): ClientProjectWithCustomer {
  return {
    ...toClientProject(row),
    customer: row.customer ? toCustomer(row.customer) : undefined,
    assignee: row.assignee ? toBillingEntity(row.assignee) : undefined,
  };
}

const withRelationsSelect = "*, customer:customers(*), assignee:billing_entities(*)";
const withListSelect = `${withRelationsSelect}, checklist:project_checklist_items(label, done, position)`;

type ChecklistSummaryRow = { label: string; done: boolean; position: number };

function withChecklistSummary(
  row: ClientProjectRow & {
    customer: CustomerRow | null;
    assignee: BillingEntityRow | null;
    checklist: ChecklistSummaryRow[] | null;
  },
): ClientProjectListItem {
  const checklist = [...(row.checklist ?? [])].sort((a, b) => a.position - b.position);
  return {
    ...withRelations(row),
    checklistDone: checklist.filter((item) => item.done).length,
    checklistTotal: checklist.length,
    nextTask: checklist.find((item) => !item.done)?.label,
  };
}

// Deliberately uncached: this is a live internal work tracker, not cached
// public content — status changes should show up immediately.
export async function getClientProjects(): Promise<ClientProjectListItem[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("client_projects")
    .select(withListSelect)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getClientProjects] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map((row) =>
    withChecklistSummary(
      row as unknown as ClientProjectRow & {
        customer: CustomerRow | null;
        assignee: BillingEntityRow | null;
        checklist: ChecklistSummaryRow[] | null;
      },
    ),
  );
}

export async function getClientProjectById(id: string): Promise<ClientProjectWithCustomer | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("client_projects")
    .select(withRelationsSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getClientProjectById] Supabase-fråga misslyckades", error);
    return null;
  }
  if (!data) return null;

  return withRelations(
    data as unknown as ClientProjectRow & { customer: CustomerRow | null; assignee: BillingEntityRow | null },
  );
}

// "Aktiva" = allt utom klarmarkerat, matchar badgen i sidebaren och
// Verksamhet-panelen på dashboarden.
export async function getActiveClientProjectsCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("client_projects")
    .select("*", { count: "exact", head: true })
    .neq("status", "klar");

  if (error) {
    console.error("[getActiveClientProjectsCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}

export async function getProjectsWaitingOnCustomerCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("client_projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "vantar_pa_kund");

  if (error) {
    console.error("[getProjectsWaitingOnCustomerCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}

type ChecklistItemRow = {
  id: string;
  project_id: string;
  label: string;
  done: boolean;
  position: number;
  created_at: string;
};

function toChecklistItem(row: ChecklistItemRow): ProjectChecklistItem {
  return {
    id: row.id,
    projectId: row.project_id,
    label: row.label,
    done: row.done,
    position: row.position,
    createdAt: row.created_at,
  };
}

export async function getProjectChecklistItems(projectId: string): Promise<ProjectChecklistItem[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("project_checklist_items")
    .select("*")
    .eq("project_id", projectId)
    .order("position");

  if (error) {
    console.error("[getProjectChecklistItems] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toChecklistItem);
}

type ActivityRow = { id: string; project_id: string; message: string; created_at: string };

function toActivityEntry(row: ActivityRow): ProjectActivityEntry {
  return { id: row.id, projectId: row.project_id, message: row.message, createdAt: row.created_at };
}

export async function getProjectActivity(projectId: string): Promise<ProjectActivityEntry[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("project_activity")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("[getProjectActivity] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toActivityEntry);
}

// Best-effort — a failed log write should never block the action that
// triggered it.
export async function logProjectActivity(projectId: string, message: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("project_activity").insert({ project_id: projectId, message });
  if (error) console.error("[logProjectActivity] Kunde inte logga aktivitet", error);
}
