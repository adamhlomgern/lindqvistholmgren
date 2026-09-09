import type {
  AwaitingCustomerType,
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
  customer_update: string | null;
  customer_update_at: string | null;
  next_milestone_label: string | null;
  next_milestone_date: string | null;
  next_milestone_delivered: boolean | null;
  phase_labels: string[] | null;
  phase_current: number | null;
  awaiting_customer_label: string | null;
  awaiting_customer_type: string | null;
  awaiting_customer_due: string | null;
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
    customerUpdate: row.customer_update ?? undefined,
    customerUpdateAt: row.customer_update_at ?? undefined,
    nextMilestoneLabel: row.next_milestone_label ?? undefined,
    nextMilestoneDate: row.next_milestone_date ?? undefined,
    nextMilestoneDelivered: row.next_milestone_delivered ?? false,
    phaseLabels: row.phase_labels && row.phase_labels.length > 0 ? row.phase_labels : undefined,
    phaseCurrent: row.phase_current ?? undefined,
    awaitingCustomerLabel: row.awaiting_customer_label ?? undefined,
    awaitingCustomerType: (row.awaiting_customer_type as AwaitingCustomerType | null) ?? undefined,
    awaitingCustomerDue: row.awaiting_customer_due ?? undefined,
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

// Same shape as getClientProjects (with checklist summary) but scoped to one
// customer — used by the customer workspace's "Projekt" tab so it can reuse
// the exact same project-row rendering as the main Projekt list.
export async function getClientProjectListItemsByCustomerId(customerId: string): Promise<ClientProjectListItem[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("client_projects")
    .select(withListSelect)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getClientProjectListItemsByCustomerId] Supabase-fråga misslyckades", error);
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

export type CustomerProjectSummary = {
  activeCount: number;
  waitingOnCustomer: boolean;
  nextMilestone: { label: string; date?: string } | undefined;
};

// One query for every customer's active-project count, "waiting on
// customer" flag and closest upcoming milestone — the Kunder list page's
// "Pågående" and "Nästa steg" columns, computed for every row at once
// instead of one query per customer.
export async function getCustomerProjectSummaries(): Promise<Map<string, CustomerProjectSummary>> {
  const summaries = new Map<string, CustomerProjectSummary>();
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("client_projects")
    .select("customer_id, status, next_milestone_label, next_milestone_date")
    .neq("status", "klar")
    .not("customer_id", "is", null);

  if (error) {
    console.error("[getCustomerProjectSummaries] Supabase-fråga misslyckades", error);
    return summaries;
  }

  for (const row of data ?? []) {
    const customerId = row.customer_id as string;
    const existing = summaries.get(customerId) ?? { activeCount: 0, waitingOnCustomer: false, nextMilestone: undefined };
    existing.activeCount += 1;
    if (row.status === "vantar_pa_kund") existing.waitingOnCustomer = true;
    if (row.next_milestone_date) {
      if (!existing.nextMilestone?.date || row.next_milestone_date < existing.nextMilestone.date) {
        existing.nextMilestone = { label: row.next_milestone_label ?? "", date: row.next_milestone_date };
      }
    } else if (row.next_milestone_label && !existing.nextMilestone) {
      existing.nextMilestone = { label: row.next_milestone_label, date: undefined };
    }
    summaries.set(customerId, existing);
  }

  return summaries;
}

// Used by the customer portal overview — every row a given customer is
// allowed to see, regardless of status (finished projects still show up in
// their history, just sorted last).
export async function getClientProjectsByCustomerId(customerId: string): Promise<ClientProjectWithCustomer[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("client_projects")
    .select(withRelationsSelect)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getClientProjectsByCustomerId] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map((row) =>
    withRelations(row as unknown as ClientProjectRow & { customer: CustomerRow | null; assignee: BillingEntityRow | null }),
  );
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
