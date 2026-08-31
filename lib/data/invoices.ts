import type { Invoice, InvoiceItem, InvoiceWithCustomer, InvoiceWithItems } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { toCustomer, type CustomerRow } from "@/lib/data/customers";

type InvoiceRow = {
  id: string;
  invoice_number: number;
  customer_id: string;
  status: Invoice["status"];
  billing_entity_id: string;
  bank_account_id: string;
  payment_link: string | null;
  moms_rate: number;
  subtotal: number;
  vat_amount: number;
  total: number;
  notes: string | null;
  issued_date: string | null;
  due_date: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

type InvoiceItemRow = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  position: number;
};

function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    customerId: row.customer_id,
    status: row.status,
    billingEntityId: row.billing_entity_id,
    bankAccountId: row.bank_account_id,
    paymentLink: row.payment_link ?? undefined,
    momsRate: row.moms_rate,
    subtotal: row.subtotal,
    vatAmount: row.vat_amount,
    total: row.total,
    notes: row.notes ?? undefined,
    issuedDate: row.issued_date ?? undefined,
    dueDate: row.due_date ?? undefined,
    sentAt: row.sent_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toInvoiceItem(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    position: row.position,
  };
}

// Deliberately uncached: this is a live internal tool, not cached public
// content — status/edits should show up immediately.
export async function getInvoices(): Promise<InvoiceWithCustomer[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, customer:customers(*)")
    .order("invoice_number", { ascending: false });

  if (error) {
    console.error("[getInvoices] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...toInvoice(row),
    customer: toCustomer((row as unknown as { customer: CustomerRow }).customer),
  }));
}

export async function getInvoicesForCustomer(customerId: string): Promise<Invoice[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", customerId)
    .order("invoice_number", { ascending: false });

  if (error) {
    console.error("[getInvoicesForCustomer] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toInvoice);
}

export async function getInvoiceById(id: string): Promise<InvoiceWithItems | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, customer:customers(*), items:invoice_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getInvoiceById] Supabase-fråga misslyckades", error);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as InvoiceRow & { customer: CustomerRow; items: InvoiceItemRow[] };

  return {
    ...toInvoice(row),
    customer: toCustomer(row.customer),
    items: (row.items ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(toInvoiceItem),
  };
}

export async function getInvoicesCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getInvoicesCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}
