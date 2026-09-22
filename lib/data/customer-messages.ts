import type { CustomerMessage } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "attachments";
// Regenerated on every request since this file is deliberately uncached —
// same reasoning and TTL as lib/data/files.ts's withSignedUrls.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type CustomerMessageRow = {
  id: string;
  customer_id: string;
  author_role: "admin" | "customer";
  author_label: string;
  body: string;
  created_at: string;
  attachment_storage_path: string | null;
  attachment_filename: string | null;
  attachment_content_type: string | null;
  attachment_size: number | null;
};

function toCustomerMessage(row: CustomerMessageRow): CustomerMessage {
  return {
    id: row.id,
    customerId: row.customer_id,
    authorRole: row.author_role,
    authorLabel: row.author_label,
    body: row.body,
    createdAt: row.created_at,
    attachment: row.attachment_storage_path
      ? {
          storagePath: row.attachment_storage_path,
          filename: row.attachment_filename ?? "bild",
          contentType: row.attachment_content_type ?? undefined,
          size: row.attachment_size ?? undefined,
          url: null,
        }
      : undefined,
  };
}

async function withAttachmentUrls(
  supabase: ReturnType<typeof createServiceRoleClient>,
  messages: CustomerMessage[],
): Promise<CustomerMessage[]> {
  return Promise.all(
    messages.map(async (message) => {
      if (!message.attachment) return message;
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(message.attachment.storagePath, SIGNED_URL_TTL_SECONDS);
      return { ...message, attachment: { ...message.attachment, url: data?.signedUrl ?? null } };
    }),
  );
}

// Deliberately uncached and ordered oldest-first — a chat thread, not a feed.
export async function getCustomerMessages(customerId: string): Promise<CustomerMessage[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_messages")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getCustomerMessages] Supabase-fråga misslyckades", error);
    return [];
  }

  return withAttachmentUrls(supabase, (data ?? []).map(toCustomerMessage));
}

// Latest N messages, newest first — for the compact preview on the
// portal overview (getCustomerMessages is oldest-first, meant for the full
// chat thread instead).
export async function getLatestCustomerMessages(customerId: string, limit: number): Promise<CustomerMessage[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_messages")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getLatestCustomerMessages] Supabase-fråga misslyckades", error);
    return [];
  }

  return withAttachmentUrls(supabase, (data ?? []).map(toCustomerMessage));
}

// Actual unread count for the sidebar badge — every admin message newer
// than the customer's last_read_at (or all of them, if they've never read
// any yet).
export async function getUnreadMessageCount(customerId: string, lastReadAt: string | null): Promise<number> {
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("customer_messages")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customerId)
    .eq("author_role", "admin");
  if (lastReadAt) query = query.gt("created_at", lastReadAt);
  const { count, error } = await query;

  if (error) {
    console.error("[getUnreadMessageCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}


export type CustomerMessageThread = {
  customerId: string;
  customerName: string;
  latestMessage: CustomerMessage;
  messageCount: number;
};

// One row per customer with any chat activity, newest thread first — the
// admin-facing "Chatt" tab in Inkorg. Rows arrive newest-first from the
// query, so the first row seen for a given customer is always its latest
// message; later rows for the same customer only add to the count.
export async function getMessageThreadsForAdmin(): Promise<CustomerMessageThread[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_messages")
    .select("*, customer:customers(id, name, company)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getMessageThreadsForAdmin] Supabase-fråga misslyckades", error);
    return [];
  }

  const threads = new Map<string, CustomerMessageThread>();
  for (const row of (data ?? []) as (CustomerMessageRow & {
    customer: { id: string; name: string; company: string | null } | null;
  })[]) {
    const existing = threads.get(row.customer_id);
    if (existing) {
      existing.messageCount += 1;
      continue;
    }
    threads.set(row.customer_id, {
      customerId: row.customer_id,
      customerName: row.customer?.company || row.customer?.name || "Okänd kund",
      latestMessage: toCustomerMessage(row),
      messageCount: 1,
    });
  }

  const withUrls = await withAttachmentUrls(
    supabase,
    Array.from(threads.values()).map((thread) => thread.latestMessage),
  );
  return Array.from(threads.values()).map((thread, i) => ({ ...thread, latestMessage: withUrls[i] }));
}

// Cheap version of the same "latest message per customer" logic, used for
// the sidebar badge — that one runs on every single admin navigation (it's
// fetched in the root admin layout), so it skips the customer join and only
// pulls the two columns it actually needs instead of getMessageThreadsForAdmin's
// full rows.
export async function getWaitingChatThreadCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_messages")
    .select("customer_id, author_role")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getWaitingChatThreadCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  const seen = new Set<string>();
  let waiting = 0;
  for (const row of data ?? []) {
    if (seen.has(row.customer_id)) continue;
    seen.add(row.customer_id);
    if (row.author_role === "customer") waiting += 1;
  }
  return waiting;
}
