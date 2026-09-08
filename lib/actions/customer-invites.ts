"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendBrandedEmail } from "@/lib/email/send";

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

export type InviteCustomerState = { error?: string; success?: boolean } | undefined;

function isAlreadyRegisteredError(error: { code?: string; message: string } | null): boolean {
  if (!error) return false;
  return error.code === "email_exists" || error.code === "user_already_exists" || /already.*registered/i.test(error.message);
}

// Generates the action link ourselves and sends it through our own SMTP with
// our branded Swedish template, instead of Supabase's built-in invite email
// (which is English by default, needs its own dashboard template edit, and
// — the real reason — inviteUserByEmail/generateLink(type: "invite") both
// always try to CREATE a user, so they hard-fail with "already registered"
// on every resend to a contact who hasn't accepted yet. "recovery" acts on
// an existing user instead, so it works for the resend case too.
async function sendCustomerInvite(customerId: string, email: string): Promise<{ error?: string }> {
  const origin = (await headers()).get("origin") ?? FALLBACK_SITE_URL;
  const redirectTo = `${origin}/auth/confirm?next=/kund/valkommen`;
  const supabase = createServiceRoleClient();

  let link = await supabase.auth.admin.generateLink({ type: "invite", email, options: { redirectTo } });

  if (link.error && isAlreadyRegisteredError(link.error)) {
    link = await supabase.auth.admin.generateLink({ type: "recovery", email, options: { redirectTo } });
  }

  const actionLink = link.data?.properties?.action_link;
  if (link.error || !actionLink || !link.data?.user) {
    return { error: `Kunde inte skapa inbjudningslänk: ${link.error?.message ?? "okänt fel"}` };
  }

  try {
    await sendBrandedEmail({
      to: email,
      subject: "Ni är inbjudna till er kundportal – Lindqvist / Holmgren",
      heading: "Välkommen till kundportalen",
      bodyHtml:
        "Ni har bjudits in till vår kundportal, där ni kan följa ert projekt, dela filer och godkänna leveranser tillsammans med oss. Klicka nedan för att skapa ett lösenord och komma igång.",
      ctaLabel: "Skapa lösenord och logga in",
      ctaUrl: actionLink,
    });
  } catch (err) {
    return { error: `Länken skapades men mejlet kunde inte skickas: ${err instanceof Error ? err.message : String(err)}` };
  }

  // Re-inviting a previously revoked (or re-invited before accepting)
  // contact hits the (user_id, customer_id) unique constraint on a plain
  // insert — upsert so it resets to a fresh, non-revoked invite instead.
  const { error: memberError } = await supabase.from("customer_members").upsert(
    {
      user_id: link.data.user.id,
      customer_id: customerId,
      invited_at: new Date().toISOString(),
      accepted_at: null,
      revoked_at: null,
    },
    { onConflict: "user_id,customer_id" },
  );

  if (memberError) {
    return { error: `Mejlet skickades men kunde inte kopplas till kunden: ${memberError.message}` };
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
export async function resendCustomerInvite(customerId: string, email: string): Promise<{ error?: string }> {
  await verifySession();
  const result = await sendCustomerInvite(customerId, email);
  revalidatePath(`/admin/kunder/${customerId}`);
  return result;
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
