import type { Customer } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type CustomerRow = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  org_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    postalCode: row.postal_code ?? undefined,
    city: row.city ?? undefined,
    orgNumber: row.org_number ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Deliberately uncached: this is a live internal tool, not cached public
// content — edits should show up immediately.
export async function getCustomers(): Promise<Customer[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("customers").select("*").order("name");

  if (error) {
    console.error("[getCustomers] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toCustomer);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[getCustomerById] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toCustomer(data) : null;
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    console.error("[getCustomerByEmail] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toCustomer(data) : null;
}

export async function getCustomersCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getCustomersCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}
