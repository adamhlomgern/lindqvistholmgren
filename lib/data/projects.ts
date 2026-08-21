import { unstable_cache } from "next/cache";
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

// See lib/data/articles.ts for why each cached fetcher throws instead of
// returning a fallback: a thrown error is never persisted to the cache, so
// a transient failure only affects the request that hit it.

const fetchProjectsCached = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`[getProjects] ${error.message}`);

    return (data as ProjectRow[]).map(toProject);
  },
  ["projects-list"],
  { tags: ["projects"], revalidate: 300 },
);

export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchProjectsCached();
  } catch (error) {
    console.error("[getProjects] Supabase-fråga misslyckades", error);
    return [];
  }
}

const fetchProjectsCountCached = unstable_cache(
  async (): Promise<number> => {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(`[getProjectsCount] ${error.message}`);

    return count ?? 0;
  },
  ["projects-count"],
  { tags: ["projects"], revalidate: 300 },
);

export async function getProjectsCount(): Promise<number> {
  try {
    return await fetchProjectsCountCached();
  } catch (error) {
    console.error("[getProjectsCount] Supabase-fråga misslyckades", error);
    return 0;
  }
}

const fetchProjectCategoriesCached = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("projects").select("category");

    if (error) throw new Error(`[getProjectCategories] ${error.message}`);

    const unique = new Set((data as { category: string }[]).map((row) => row.category).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "sv"));
  },
  ["projects-categories"],
  { tags: ["projects"], revalidate: 300 },
);

export async function getProjectCategories(): Promise<string[]> {
  try {
    return await fetchProjectCategoriesCached();
  } catch (error) {
    console.error("[getProjectCategories] Supabase-fråga misslyckades", error);
    return [];
  }
}

const fetchProjectBySlugCached = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();

    if (error) throw new Error(`[getProjectBySlug] ${error.message}`);

    return data ? toProject(data as ProjectRow) : null;
  },
  ["project-by-slug"],
  { tags: ["projects"], revalidate: 300 },
);

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await fetchProjectBySlugCached(slug);
  } catch (error) {
    console.error("[getProjectBySlug] Supabase-fråga misslyckades", error);
    return null;
  }
}
