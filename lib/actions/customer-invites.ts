"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

export type InviteCustomerState = { error?: string; success?: boolean } | undefined;

async function sendCustomerInvite(customerId: string, email: string): Promise<{ error?: string }> {
  const origin = (await headers()).get("origin") ?? FALLBACK_SITE_URL;
  const supabase = createServiceRoleClient();

  const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/kund/valkommen`,
  });

  if (inviteError) {
    return { error: `Kunde inte skicka inbjudan: ${inviteError.message}` };
  }

  // Re-inviting a previously revoked (or re-invited before accepting)
  // contact hits the (user_id, customer_id) unique constraint on a plain
  // insert — upsert so it resets to a fresh, non-revoked invite instead.
  const { error: memberError } = await supabase.from("customer_members").upsert(
    {
      user_id: invited.user.id,
      customer_id: customerId,
      invited_at: new Date().toISOString(),
      accepted_at: null,
      revoked_at: null,
    },
    { onConflict: "user_id,customer_id" },
  );

  if (memberError) {
    return { error: `Inbjudan skickades men kunde inte kopplas till kunden: ${memberError.message}` };
  }

  return {};
}

export async function inviteCustomerContact(
  customerId: string,
  _prevState: InviteCustomerState,
  formData: FormData,
): Promise<InviteCustomerState> {
  await verifySession();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "E-post krävs." };
  }

  const result = await sendCustomerInvite(customerId, email);
  if (result.error) {
    return { error: result.error };
  }

  revalidatePath(`/admin/kunder/${customerId}`);
  return { success: true };
}

// Same underlying invite, called directly (no form/prevState) for the
// "skicka igen" row action on a contact who never set a password —
// restoring access alone would be a dead end without a fresh link.
export async function resendCustomerInvite(customerId: string, email: string) {
  await verifySession();
  await sendCustomerInvite(customerId, email);
  revalidatePath(`/admin/kunder/${customerId}`);
}

export async function revokeCustomerAccess(customerId: string, membershipId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("customer_members")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", membershipId);

  revalidatePath(`/admin/kunder/${customerId}`);
}

export async function restoreCustomerAccess(customerId: string, membershipId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("customer_members").update({ revoked_at: null }).eq("id", membershipId);

  revalidatePath(`/admin/kunder/${customerId}`);
}

// Called from app/kund/valkommen once the invited contact has set a password
// for their new session — marks the invite as accepted for the admin UI.
// Not required for access itself (requireCustomerAccess only checks
// revoked_at), purely informational.
export async function acceptCustomerInvite() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const serviceClient = createServiceRoleClient();
  await serviceClient
    .from("customer_members")
    .update({ accepted_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("accepted_at", null);
}
