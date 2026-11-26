import { NextRequest, NextResponse } from "next/server";
import { AuditError, auditSite } from "@/lib/site-audit/audit";
import { isRateLimited } from "@/lib/rate-limit";

// POST { url } -> AuditResult. Används av Hemsidekollen (components/tools).
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`hemsidekollen:${ip}`)) {
    return NextResponse.json({ error: "Ni har kollat många sajter på kort tid. Vänta en stund och försök igen." }, { status: 429 });
  }

  let url: unknown;
  try {
    ({ url } = await request.json());
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }
  if (typeof url !== "string" || url.length > 300) {
    return NextResponse.json({ error: "Skriv in en adress, till exempel ertforetag.se." }, { status: 400 });
  }

  try {
    const result = await auditSite(url);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuditError) return NextResponse.json({ error: error.message }, { status: 422 });
    console.error("[hemsidekollen] Oväntat fel", error);
    return NextResponse.json({ error: "Något gick fel när vi kollade sajten. Försök igen." }, { status: 500 });
  }
}
