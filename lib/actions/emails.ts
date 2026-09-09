"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";

// Postgres cascades email_attachments rows away with the email, but the
// actual files in Storage aren't touched by that FK — clean them up first,
// while we still know their paths.
async function deleteAttachmentFilesForEmails(supabase: ReturnType<typeof createServiceRoleClient>, emailIds: string[]) {
  if (emailIds.length === 0) return;
  const { data } = await supabase.from("email_attachments").select("storage_path").in("email_id", emailIds);
  await deleteStoredFiles((data ?? []).map((row) => row.storage_path));
}

export async function matchEmailToCustomer(emailId: string, customerId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("emails").update({ customer_id: customerId }).eq("id", emailId);

  revalidatePath("/admin/inkorg");
  revalidatePath(`/admin/kunder/${customerId}`);
}

// No redirect here: this is called both from the inbox list (which just
// needs the removed row to disappear in place via revalidatePath) and from
// an email's detail page. Redirecting unconditionally used to force a full
// navigation back to /admin/inkorg even from the list — the exact page
// you're already on — which is a slow no-op round trip through the whole
// route tree for no benefit. The detail page now navigates away itself,
// client-side, once this resolves (see DeleteEmailButton's redirectTo prop).
export async function deleteEmail(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await deleteAttachmentFilesForEmails(supabase, [id]);
  await supabase.from("emails").delete().eq("id", id);

  revalidatePath("/admin/inkorg");
}

// Same reasoning as deleteEmail above — no redirect here, see
// BlockSenderButton's redirectTo prop for the detail-page navigation.
export async function blockSender(email: string) {
  await verifySession();
  const supabase = createServiceRoleClient();

  await supabase.from("blocked_senders").upsert({ email }, { onConflict: "email" });
  // Also clear out anything already synced from this sender — blocking
  // implies "I don't want to see their mail", not just "stop future mail".
  const { data: existing } = await supabase.from("emails").select("id").ilike("from_address", email);
  await deleteAttachmentFilesForEmails(
    supabase,
    (existing ?? []).map((row) => row.id),
  );
  await supabase.from("emails").delete().ilike("from_address", email);

  revalidatePath("/admin/inkorg");
}

export async function unblockSender(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("blocked_senders").delete().eq("id", id);

  revalidatePath("/admin/inkorg");
}
