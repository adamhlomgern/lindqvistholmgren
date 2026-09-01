import { createServiceRoleClient } from "@/lib/supabase/server";

export type ActivityItem = {
  id: string;
  label: string;
  timestamp: string;
  href: string;
};

// Deliberately uncached and merged in JS from three small tables — this
// feeds a live admin overview, not a report, and at this business's volume
// there's never enough rows across inquiries/invoices/articles to justify a
// SQL union.
export async function getRecentActivity(limit = 6): Promise<ActivityItem[]> {
  const supabase = createServiceRoleClient();

  const [inquiriesRes, invoicesRes, articlesRes] = await Promise.all([
    supabase
      .from("projektforfragningar")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("invoices")
      .select("id, invoice_number, status, sent_at, updated_at, customer:customers(name)")
      .neq("status", "utkast")
      .order("updated_at", { ascending: false })
      .limit(limit),
    supabase.from("articles").select("slug, title, date").order("date", { ascending: false }).limit(limit),
  ]);

  if (inquiriesRes.error) console.error("[getRecentActivity] förfrågningar", inquiriesRes.error);
  if (invoicesRes.error) console.error("[getRecentActivity] fakturor", invoicesRes.error);
  if (articlesRes.error) console.error("[getRecentActivity] artiklar", articlesRes.error);

  const items: ActivityItem[] = [];

  for (const row of inquiriesRes.data ?? []) {
    items.push({
      id: `inquiry-${row.id}`,
      label: `Ny förfrågan från ${row.name}`,
      timestamp: row.created_at,
      href: "/admin/forfragningar",
    });
  }

  for (const row of invoicesRes.data ?? []) {
    const customerName = (row as unknown as { customer: { name: string } | null }).customer?.name ?? "okänd kund";
    const isPaid = row.status === "betald";
    items.push({
      id: `invoice-${row.id}`,
      label: isPaid
        ? `Faktura #${row.invoice_number} betald av ${customerName}`
        : `Faktura #${row.invoice_number} skickad till ${customerName}`,
      timestamp: (isPaid ? row.updated_at : (row.sent_at ?? row.updated_at)) as string,
      href: `/admin/fakturor/${row.id}`,
    });
  }

  for (const row of articlesRes.data ?? []) {
    items.push({
      id: `article-${row.slug}`,
      label: `Artikel "${row.title}" publicerad`,
      timestamp: row.date,
      href: "/admin/artiklar",
    });
  }

  return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}
