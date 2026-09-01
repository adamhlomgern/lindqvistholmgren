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
export async function getInvoices(billingEntityId?: string): Promise<InvoiceWithCustomer[]> {
  const supabase = createServiceRoleClient();
  // Sorted by creation time, not invoice_number — each firma now has its
  // own independent number sequence, so #2601 isn't a meaningful sort key
  // across firms once more than one exists.
  let query = supabase
    .from("invoices")
    .select("*, customer:customers(*)")
    .order("created_at", { ascending: false });

  if (billingEntityId) {
    query = query.eq("billing_entity_id", billingEntityId);
  }

  const { data, error } = await query;

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
    .order("created_at", { ascending: false });

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

export type InvoiceStats = {
  outstandingAmount: number;
  outstandingCount: number;
  overdueAmount: number;
  overdueCount: number;
  paidThisYear: number;
  invoicedThisYear: number;
  draftCount: number;
};

const emptyStats: InvoiceStats = {
  outstandingAmount: 0,
  outstandingCount: 0,
  overdueAmount: 0,
  overdueCount: 0,
  paidThisYear: 0,
  invoicedThisYear: 0,
  draftCount: 0,
};

// Aggregated in JS rather than via SQL grouping — at the scale of a
// one/two-person consultancy's invoice volume this is a handful of rows,
// not worth a database function for.
export async function getInvoiceStats(): Promise<InvoiceStats> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("invoices").select("status, total, issued_date, due_date");

  if (error) {
    console.error("[getInvoiceStats] Supabase-fråga misslyckades", error);
    return emptyStats;
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();
  const stats = { ...emptyStats };

  for (const row of data ?? []) {
    const issuedYear = row.issued_date ? Number(row.issued_date.slice(0, 4)) : null;

    if (row.status === "skickad") {
      stats.outstandingAmount += row.total;
      stats.outstandingCount += 1;
      if (row.due_date && row.due_date < today) {
        stats.overdueAmount += row.total;
        stats.overdueCount += 1;
      }
    }
    if (row.status === "betald" && issuedYear === currentYear) {
      stats.paidThisYear += row.total;
    }
    if (row.status !== "utkast" && issuedYear === currentYear) {
      stats.invoicedThisYear += row.total;
    }
    if (row.status === "utkast") {
      stats.draftCount += 1;
    }
  }

  return stats;
}

export type EntityRevenue = { entityId: string; entityName: string; total: number };

export async function getRevenueByEntity(): Promise<EntityRevenue[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("billing_entity_id, total, billing_entity:billing_entities(name)")
    .neq("status", "utkast");

  if (error) {
    console.error("[getRevenueByEntity] Supabase-fråga misslyckades", error);
    return [];
  }

  const totals = new Map<string, EntityRevenue>();
  for (const row of data ?? []) {
    const entityName =
      (row as unknown as { billing_entity: { name: string } | null }).billing_entity?.name ?? "Okänd firma";
    const current = totals.get(row.billing_entity_id) ?? {
      entityId: row.billing_entity_id,
      entityName,
      total: 0,
    };
    current.total += row.total;
    totals.set(row.billing_entity_id, current);
  }

  return Array.from(totals.values()).sort((a, b) => b.total - a.total);
}

export type MonthlyRevenue = { month: string; label: string; total: number };

export async function getMonthlyRevenue(months = 6): Promise<MonthlyRevenue[]> {
  const supabase = createServiceRoleClient();
  const start = new Date();
  start.setDate(1);
  start.setMonth(start.getMonth() - (months - 1));
  const startIso = start.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("invoices")
    .select("total, issued_date")
    .neq("status", "utkast")
    .gte("issued_date", startIso);

  if (error) {
    console.error("[getMonthlyRevenue] Supabase-fråga misslyckades", error);
    return [];
  }

  const buckets = new Map<string, number>();
  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0);
  }

  for (const row of data ?? []) {
    if (!row.issued_date) continue;
    const key = row.issued_date.slice(0, 7);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + row.total);
    }
  }

  return Array.from(buckets.entries()).map(([key, total]) => {
    const [year, month] = key.split("-").map(Number);
    const label = new Intl.DateTimeFormat("sv-SE", { month: "short" }).format(new Date(year, month - 1, 1));
    return { month: key, label, total };
  });
}
