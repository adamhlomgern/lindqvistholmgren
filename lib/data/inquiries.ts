import type { ProjectInquiry } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type Inquiry = ProjectInquiry & { id: string; createdAt: string };

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("projektforfragningar")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getInquiries] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    categories: row.categories,
    budget: row.budget,
    timeline: row.timeline,
    description: row.description,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
  }));
}
