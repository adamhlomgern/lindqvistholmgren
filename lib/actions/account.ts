"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createAuthClient } from "@/lib/supabase/auth";

export type AccountFormState = { error?: string; success?: boolean } | undefined;

// Uses the session-bound auth client (not the service-role client) so this
// only ever updates the currently logged-in admin's own user_metadata —
// there's no other admin's account it could reach even if customerId-style
// scoping were forgotten.
export async function updateDisplayName(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  await verifySession();
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.updateUser({ data: { display_name: displayName || null } });

  if (error) {
    return { error: "Kunde inte spara visningsnamnet." };
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}
