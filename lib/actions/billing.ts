"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type BillingFormState = { error?: string } | undefined;

function parseBillingEntityForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim() || null,
    postal_code: String(formData.get("postalCode") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    org_number: String(formData.get("orgNumber") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    vat_number: String(formData.get("vatNumber") ?? "").trim() || null,
    f_skatt: formData.get("fSkatt") === "on",
    payment_terms: String(formData.get("paymentTerms") ?? "").trim() || null,
    is_default: formData.get("isDefault") === "on",
  };
}

export async function createBillingEntity(
  _prevState: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  await verifySession();
  const row = parseBillingEntityForm(formData);

  if (!row.name) {
    return { error: "Namn krävs." };
  }

  const supabase = createServiceRoleClient();
  if (row.is_default) {
    await supabase.from("billing_entities").update({ is_default: false }).eq("is_default", true);
  }

  const { error } = await supabase.from("billing_entities").insert(row);
  if (error) {
    return { error: `Kunde inte skapa firman: ${error.message}` };
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}

export async function updateBillingEntity(
  id: string,
  _prevState: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  await verifySession();
  const row = parseBillingEntityForm(formData);

  if (!row.name) {
    return { error: "Namn krävs." };
  }

  const supabase = createServiceRoleClient();
  if (row.is_default) {
    await supabase.from("billing_entities").update({ is_default: false }).eq("is_default", true);
  }

  const { error } = await supabase
    .from("billing_entities")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}

export async function deleteBillingEntity(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("billing_entities").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      redirect("/admin/installningar?error=billing_entity_in_use");
    }
    redirect("/admin/installningar?error=unknown");
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}

function parseBankAccountForm(formData: FormData) {
  return {
    label: String(formData.get("label") ?? "").trim(),
    kontonummer: String(formData.get("kontonummer") ?? "").trim(),
    bank: String(formData.get("bank") ?? "").trim() || null,
    is_default: formData.get("isDefault") === "on",
  };
}

export async function createBankAccount(
  _prevState: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  await verifySession();
  const row = parseBankAccountForm(formData);

  if (!row.label || !row.kontonummer) {
    return { error: "Namn och kontonummer krävs." };
  }

  const supabase = createServiceRoleClient();
  if (row.is_default) {
    await supabase.from("bank_accounts").update({ is_default: false }).eq("is_default", true);
  }

  const { error } = await supabase.from("bank_accounts").insert(row);
  if (error) {
    return { error: `Kunde inte skapa bankkontot: ${error.message}` };
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}

export async function updateBankAccount(
  id: string,
  _prevState: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  await verifySession();
  const row = parseBankAccountForm(formData);

  if (!row.label || !row.kontonummer) {
    return { error: "Namn och kontonummer krävs." };
  }

  const supabase = createServiceRoleClient();
  if (row.is_default) {
    await supabase.from("bank_accounts").update({ is_default: false }).eq("is_default", true);
  }

  const { error } = await supabase
    .from("bank_accounts")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: `Kunde inte spara ändringarna: ${error.message}` };
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}

export async function deleteBankAccount(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("bank_accounts").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      redirect("/admin/installningar?error=bank_account_in_use");
    }
    redirect("/admin/installningar?error=unknown");
  }

  revalidatePath("/admin/installningar");
  redirect("/admin/installningar");
}
