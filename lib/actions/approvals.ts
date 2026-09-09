"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { requireCustomerAccess } from "@/lib/auth/customer";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getActiveCustomerMemberEmails } from "@/lib/data/customer-members";
import { sendBrandedEmail } from "@/lib/email/send";
import type { ApprovalStatus } from "@/lib/types";

export type ApprovalFormState = { error?: string } | undefined;

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

function revalidateApproval(customerId: string, projectId: string, approvalId?: string) {
  revalidatePath(`/admin/projekt/${projectId}`);
  revalidatePath(`/admin/kunder/${customerId}`, "layout");
  revalidatePath("/kund", "layout");
  revalidatePath(`/kund/projekt/${projectId}`);
  if (approvalId) revalidatePath(`/kund/projekt/${projectId}/godkannande/${approvalId}`);
}

export async function createApprovalRequest(
  projectId: string,
  customerId: string,
  _prevState: ApprovalFormState,
  formData: FormData,
): Promise<ApprovalFormState> {
  await verifySession();

  const materialItemId = String(formData.get("materialItemId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const versionLabel = String(formData.get("versionLabel") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;
  const dueAt = String(formData.get("dueAt") ?? "").trim() || null;

  if (!materialItemId) return { error: "Välj vilket material begäran gäller." };
  if (!title) return { error: "Titel krävs." };

  const supabase = createServiceRoleClient();

  const { data: itemRow, error: itemError } = await supabase
    .from("material_items")
    .select("id, visibility")
    .eq("id", materialItemId)
    .maybeSingle();
  if (itemError || !itemRow) return { error: "Materialet kunde inte hittas." };

  // Sending something for review necessarily means the customer must be
  // able to see it — no separate access-bypass mechanism, the item itself
  // becomes shared.
  await supabase
    .from("material_items")
    .update({
      visibility: "shared",
      delivery_status: "review",
      updated_at: new Date().toISOString(),
    })
    .eq("id", materialItemId);

  const { data: approvalRow, error: insertError } = await supabase
    .from("project_approvals")
    .insert({
      customer_id: customerId,
      project_id: projectId,
      material_item_id: materialItemId,
      title,
      version_label: versionLabel,
      message,
      due_at: dueAt,
    })
    .select("id")
    .single();

  if (insertError || !approvalRow) return { error: `Kunde inte skapa begäran: ${insertError?.message}` };

  revalidateApproval(customerId, projectId, approvalRow.id as string);

  const recipients = await getActiveCustomerMemberEmails(customerId);
  if (recipients.length === 0) return;

  const project = await getClientProjectById(projectId);
  const origin = (await headers()).get("origin") ?? FALLBACK_SITE_URL;
  const ctaUrl = `${origin}/kund/projekt/${projectId}/godkannande/${approvalRow.id}`;

  try {
    await Promise.all(
      recipients.map((to) =>
        sendBrandedEmail({
          to,
          subject: `"${title}" är redo att granska – ${project?.title ?? "ert projekt"}`,
          heading: `${title} är redo`,
          bodyHtml:
            "Nu finns ett nytt förslag att titta på i kundhubben. Ta en titt och godkänn förslaget eller lämna feedback om du vill att vi ändrar något.",
          ctaLabel: "Visa förslaget",
          ctaUrl,
        }),
      ),
    );
  } catch (err) {
    return { error: `Begäran skapades men mejlet kunde inte skickas: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// Only ever removes a request that hasn't been decided yet — a wrong pick
// gets cancelled and redone, decision history is never deletable.
export async function cancelApprovalRequest(approvalId: string, projectId: string, customerId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("project_approvals").delete().eq("id", approvalId).eq("status", "pending");

  revalidateApproval(customerId, projectId, approvalId);
}

export async function decideApproval(
  approvalId: string,
  decision: Extract<ApprovalStatus, "approved" | "changes_requested">,
  _prevState: ApprovalFormState,
  formData: FormData,
): Promise<ApprovalFormState> {
  const note = String(formData.get("note") ?? "").trim();
  if (decision === "changes_requested" && !note) {
    return { error: "Beskriv vad som behöver ändras." };
  }

  const supabase = createServiceRoleClient();
  const { data: approvalRow, error: approvalError } = await supabase
    .from("project_approvals")
    .select("customer_id, project_id, material_item_id")
    .eq("id", approvalId)
    .maybeSingle();
  if (approvalError || !approvalRow) return { error: "Begäran kunde inte hittas." };

  const { customerId, projectId, materialItemId } = {
    customerId: approvalRow.customer_id as string,
    projectId: approvalRow.project_id as string,
    materialItemId: approvalRow.material_item_id as string,
  };

  const { user } = await requireCustomerAccess(customerId);

  const { data: updated, error: updateError } = await supabase
    .from("project_approvals")
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decided_by_label: user.email ?? null,
      decision_note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", approvalId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (updateError) return { error: `Kunde inte spara beslutet: ${updateError.message}` };
  if (!updated) return { error: "Den här förfrågan har redan besvarats." };

  if (decision === "approved") {
    await supabase
      .from("material_items")
      .update({ delivery_status: "final", updated_at: new Date().toISOString() })
      .eq("id", materialItemId);
  }

  revalidateApproval(customerId, projectId, approvalId);
}
