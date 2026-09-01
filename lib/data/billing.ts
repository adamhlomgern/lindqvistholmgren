import type { BillingEntity, BankAccount } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type BillingEntityRow = {
  id: string;
  name: string;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  org_number: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  vat_number: string | null;
  f_skatt: boolean;
  payment_terms: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

type BankAccountRow = {
  id: string;
  label: string;
  kontonummer: string;
  bank: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export function toBillingEntity(row: BillingEntityRow): BillingEntity {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? undefined,
    postalCode: row.postal_code ?? undefined,
    city: row.city ?? undefined,
    orgNumber: row.org_number ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    vatNumber: row.vat_number ?? undefined,
    fSkatt: row.f_skatt,
    paymentTerms: row.payment_terms ?? undefined,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toBankAccount(row: BankAccountRow): BankAccount {
  return {
    id: row.id,
    label: row.label,
    kontonummer: row.kontonummer,
    bank: row.bank ?? undefined,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Deliberately uncached: this is a live internal tool, not cached public
// content — edits should show up immediately.
export async function getBillingEntities(): Promise<BillingEntity[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("billing_entities").select("*").order("name");

  if (error) {
    console.error("[getBillingEntities] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toBillingEntity);
}

export async function getBillingEntityById(id: string): Promise<BillingEntity | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("billing_entities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getBillingEntityById] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toBillingEntity(data) : null;
}

export async function getDefaultBillingEntity(): Promise<BillingEntity | null> {
  const entities = await getBillingEntities();
  return entities.find((entity) => entity.isDefault) ?? entities[0] ?? null;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("bank_accounts").select("*").order("label");

  if (error) {
    console.error("[getBankAccounts] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toBankAccount);
}

export async function getBankAccountById(id: string): Promise<BankAccount | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("bank_accounts").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[getBankAccountById] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toBankAccount(data) : null;
}

export async function getDefaultBankAccount(): Promise<BankAccount | null> {
  const accounts = await getBankAccounts();
  return accounts.find((account) => account.isDefault) ?? accounts[0] ?? null;
}
