import { createServiceRoleClient } from "@/lib/supabase/server";

// Deliberately uncached, read fresh at sync time — mirrors getBlockedSenders.
export async function getDeletedMessageIds(): Promise<Set<string>> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("deleted_email_message_ids").select("message_id");

  if (error) {
    console.error("[getDeletedMessageIds] Supabase-fråga misslyckades", error);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.message_id as string));
}
