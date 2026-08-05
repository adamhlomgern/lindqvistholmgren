import { NextRequest, NextResponse } from "next/server";
import type { ProjectInquiry } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

const VALID_CATEGORIES = [
  "grafisk-design",
  "tryck",
  "forpackning",
  "webb",
  "app-utveckling",
  "marknadsforing",
  "vet-inte",
];

const VALID_BUDGETS = ["under-15k", "15k-50k", "50k-150k", "over-150k", "vet-inte"];

const VALID_TIMELINES = ["asap", "1-3-manader", "3-6-manader", "utforskar"];

function isValidInquiry(body: unknown): body is ProjectInquiry {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  return (
    Array.isArray(b.categories) &&
    b.categories.length > 0 &&
    b.categories.every((c) => VALID_CATEGORIES.includes(c as string)) &&
    typeof b.budget === "string" &&
    VALID_BUDGETS.includes(b.budget) &&
    typeof b.timeline === "string" &&
    VALID_TIMELINES.includes(b.timeline) &&
    typeof b.description === "string" &&
    b.description.trim().length >= 20 &&
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    /\S+@\S+\.\S+/.test(b.email)
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON" }, { status: 400 });
  }

  if (!isValidInquiry(body)) {
    return NextResponse.json({ error: "Ofullständig eller ogiltig förfrågan" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

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
