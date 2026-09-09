"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type CustomerFormState = { error?: string; success?: boolean } | undefined;

// Deliberately excludes "notes" — that field is edited separately via
// setCustomerNotes (see CustomerNotesCard), so this form can never
// accidentally wipe it by submitting without a notes input.
function parseCustomerForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    postal_code: String(formData.get("postalCode") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    org_number: String(formData.get("orgNumber") ?? "").trim() || null,
  };
}

export async function createCustomer(
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  await verifySession();
  const row = parseCustomerForm(formData);

  if (!row.name) {
    return { error: "Namn krävs." };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("customers").insert(row).select("id").single();

  if (error) {
    return { error: `Kunde inte skapa kunden: ${error.message}` };
  }

  revalidatePath("/admin/kunder");
  redirect(`/admin/kunder/${data.id}`);
}

// No redirect: this now runs inside a slide-over panel that can be opened
// from any of the customer's tabs, not just the overview — redirecting to
// the overview on every save would yank you off whichever tab you were
// actually looking at. The panel closes itself client-side when it sees
// `success` (see CustomerForm's onSaved).
export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  await verifySession();
  const row = parseCustomerForm(formData);

  if (!row.name) {
    return { error: "Namn krävs." };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("customers")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  revalidatePath("/admin/kunder");
  revalidatePath("/admin/kunder/[id]", "layout");
  return { success: true };
}

export async function setCustomerNotes(id: string, notes: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("customers")
    .update({ notes: notes.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/kunder/[id]", "layout");
}

export async function deleteCustomer(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    // Postgres foreign_key_violation — the customer still has invoices
    // (invoices.customer_id is ON DELETE RESTRICT on purpose).
    if (error.code === "23503") {
      redirect(`/admin/kunder/${id}?error=has_invoices`);
    }
    redirect(`/admin/kunder/${id}?error=unknown`);
  }

  revalidatePath("/admin/kunder");
  redirect("/admin/kunder");
}
