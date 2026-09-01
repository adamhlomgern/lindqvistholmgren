import type { BlockedSender } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

type BlockedSenderRow = {
  id: string;
  email: string;
  created_at: string;
};

function toBlockedSender(row: BlockedSenderRow): BlockedSender {
  return { id: row.id, email: row.email, createdAt: row.created_at };
}

// Deliberately uncached: this is a live internal tool, not cached public
// content — edits should show up immediately.
export async function getBlockedSenders(): Promise<BlockedSender[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("blocked_senders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getBlockedSenders] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toBlockedSender);
}
