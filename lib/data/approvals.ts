import type { ApprovalStatus, MaterialItem, ProjectApproval } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getMaterialItemById } from "@/lib/data/material";

type ProjectApprovalRow = {
  id: string;
  customer_id: string;
  project_id: string;
  material_item_id: string;
  title: string;
  version_label: string | null;
  message: string | null;
  status: ApprovalStatus;
  due_at: string | null;
  requested_at: string;
  decided_at: string | null;
  decided_by_label: string | null;
  decision_note: string | null;
  created_at: string;
  updated_at: string;
};

function toProjectApproval(row: ProjectApprovalRow): ProjectApproval {
  return {
    id: row.id,
    customerId: row.customer_id,
    projectId: row.project_id,
    materialItemId: row.material_item_id,
    title: row.title,
    versionLabel: row.version_label ?? undefined,
    message: row.message ?? undefined,
    status: row.status,
    dueAt: row.due_at ?? undefined,
    requestedAt: row.requested_at,
    decidedAt: row.decided_at ?? undefined,
    decidedByLabel: row.decided_by_label ?? undefined,
    decisionNote: row.decision_note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Deliberately uncached: status changes (decisions) must always read fresh.
export async function getProjectApprovals(projectId: string): Promise<ProjectApproval[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("project_approvals")
    .select("*")
    .eq("project_id", projectId)
    .order("requested_at", { ascending: false });

  if (error) {
    console.error("[getProjectApprovals] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toProjectApproval);
}

export type ProjectApprovalWithItem = ProjectApproval & { materialItem: MaterialItem & { downloadUrl: string | null } };

export async function getApprovalWithItem(approvalId: string): Promise<ProjectApprovalWithItem | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("project_approvals").select("*").eq("id", approvalId).maybeSingle();

  if (error) {
    console.error("[getApprovalWithItem] Supabase-fråga misslyckades", error);
    return null;
  }
  if (!data) return null;

  const approval = toProjectApproval(data);
  const materialItem = await getMaterialItemById(approval.materialItemId);
  if (!materialItem) return null;

  return { ...approval, materialItem };
}

// Feeds the overview's action-items merge — every project this customer has
// with an outstanding decision.
export async function getPendingApprovalsByCustomerId(customerId: string): Promise<ProjectApproval[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("project_approvals")
    .select("*")
    .eq("customer_id", customerId)
    .eq("status", "pending")
    .order("requested_at", { ascending: false });

  if (error) {
    console.error("[getPendingApprovalsByCustomerId] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toProjectApproval);
}
