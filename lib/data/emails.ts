import type { Email } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

type EmailRow = {
  id: string;
  customer_id: string | null;
  message_id: string;
  from_address: string;
  from_name: string | null;
  to_address: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
  created_at: string;
};

function toEmail(row: EmailRow): Email {
  return {
    id: row.id,
    customerId: row.customer_id ?? undefined,
    messageId: row.message_id,
    fromAddress: row.from_address,
    fromName: row.from_name ?? undefined,
    toAddress: row.to_address ?? undefined,
    subject: row.subject ?? undefined,
    bodyText: row.body_text ?? undefined,
    bodyHtml: row.body_html ?? undefined,
    receivedAt: row.received_at,
    createdAt: row.created_at,
  };
}

// Deliberately uncached: this is a live internal tool, not cached public
// content — new mail should show up immediately.
export async function getRecentEmails(limit: number): Promise<Email[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentEmails] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toEmail);
}

export async function getEmailById(id: string): Promise<Email | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("emails").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[getEmailById] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toEmail(data) : null;
}

export async function getEmailsForCustomer(customerId: string): Promise<Email[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .eq("customer_id", customerId)
    .order("received_at", { ascending: false });

  if (error) {
    console.error("[getEmailsForCustomer] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toEmail);
}

export async function getEmailsCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase.from("emails").select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getEmailsCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}
