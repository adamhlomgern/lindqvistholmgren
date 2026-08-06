import type { Project } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

type ProjectRow = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  intro: string;
  image: string;
  gallery: string[] | null;
  client: string;
  industry: string;
  services: string;
  launch: string;
  platform: string;
  challenge: string;
  solution: string[];
  stats: { value: string; label: string }[] | null;
};

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    intro: row.intro,
    image: row.image,
    gallery: row.gallery ?? undefined,
    client: row.client,
    industry: row.industry,
    services: row.services,
    launch: row.launch,
    platform: row.platform,
    challenge: row.challenge,
    solution: row.solution,
    stats: row.stats ?? undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getProjects] Supabase-fråga misslyckades", error);
    return [];
  }

  return (data as ProjectRow[]).map(toProject);
}

export async function getProjectCategories(): Promise<string[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("projects").select("category");

  if (error) {
    console.error("[getProjectCategories] Supabase-fråga misslyckades", error);
    return [];
  }

  const unique = new Set((data as { category: string }[]).map((row) => row.category).filter(Boolean));
  return Array.from(unique).sort((a, b) => a.localeCompare(b, "sv"));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[getProjectBySlug] Supabase-fråga misslyckades", error);
    return null;
  }

  return data ? toProject(data as ProjectRow) : null;
}
