import type { ProjectInquiry } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type Inquiry = ProjectInquiry & { id: string; createdAt: string };

function toInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    categories: row.categories as Inquiry["categories"],
    budget: row.budget as Inquiry["budget"],
    timeline: row.timeline as Inquiry["timeline"],
    description: row.description as string,
    name: row.name as string,
    company: row.company as string,
    email: row.email as string,
    phone: row.phone as string,
  };
}

// Deliberately uncached: new leads should show up in the admin panel
// immediately rather than waiting out a cache window.
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

  return (data ?? []).map(toInquiry);
}

export async function getRecentInquiries(limit: number): Promise<Inquiry[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("projektforfragningar")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentInquiries] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data ?? []).map(toInquiry);
}

export async function getInquiriesCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("projektforfragningar")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getInquiriesCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}

export async function getRecentInquiriesCount(days: number): Promise<number> {
  const supabase = createServiceRoleClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { count, error } = await supabase
    .from("projektforfragningar")
    .select("*", { count: "exact", head: true })
    .gte("created_at", cutoff.toISOString());

  if (error) {
    console.error("[getRecentInquiriesCount] Supabase-fråga misslyckades", error);
    return 0;
  }

  return count ?? 0;
}
