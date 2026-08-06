import { NextRequest, NextResponse } from "next/server";
import type { ProjectInquiry } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { projectBudgets, projectCategories, projectTimelines } from "@/lib/constants";
import { isRateLimited } from "@/lib/rate-limit";

function isValidInquiry(body: unknown): body is ProjectInquiry {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  return (
    Array.isArray(b.categories) &&
    b.categories.length > 0 &&
    b.categories.every((c) => projectCategories.includes(c as ProjectInquiry["categories"][number])) &&
    typeof b.budget === "string" &&
    projectBudgets.includes(b.budget as ProjectInquiry["budget"]) &&
    typeof b.timeline === "string" &&
    projectTimelines.includes(b.timeline as ProjectInquiry["timeline"]) &&
    typeof b.description === "string" &&
    b.description.trim().length >= 20 &&
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    /\S+@\S+\.\S+/.test(b.email)
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "För många förfrågningar, försök igen senare" }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON" }, { status: 400 });
  }

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // autofill every input trip it — respond as if it succeeded so they
  // don't learn to avoid the field, but skip the actual write.
  if (typeof body === "object" && body !== null && "website" in body) {
    const honeypot = String((body as Record<string, unknown>).website ?? "").trim();
    if (honeypot !== "") {
      return NextResponse.json({ ok: true });
    }
  }

  if (!isValidInquiry(body)) {
    return NextResponse.json({ error: "Ofullständig eller ogiltig förfrågan" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { count } = await supabase
    .from("projektforfragningar")
    .select("*", { count: "exact", head: true })
    .eq("email", body.email)
    .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

  if (count !== null && count >= 3) {
    return NextResponse.json({ error: "För många förfrågningar, försök igen senare" }, { status: 429 });
  }

  const { error } = await supabase.from("projektforfragningar").insert({
    categories: body.categories,
    budget: body.budget,
    timeline: body.timeline,
    description: body.description,
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
  });

  if (error) {
    console.error("[projektförfrågan] Supabase insert misslyckades", error);
    return NextResponse.json({ error: "Kunde inte spara förfrågan" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
