import { NextRequest, NextResponse } from "next/server";
import { AuditError, normalizeUrl } from "@/lib/site-audit/audit";
import { GoogleError, runPageSpeed } from "@/lib/site-audit/pagespeed";
import { isRateLimited } from "@/lib/rate-limit";
import { sign } from "@/lib/site-audit/sign";

// Google laddar sajten i en simulerad mobil; det tar ofta 15–40 sekunder.
export const maxDuration = 60;

// POST { url } -> { google: GoogleResult, token }. Körs efter vår egen
// analys så att rapporten syns direkt och Googles del fylls i när den är klar.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`hemsidekollen-google:${ip}`, 10)) {
    return NextResponse.json({ error: "Många mätningar på kort tid. Vänta en stund." }, { status: 429 });
  }
  let url: unknown;
  try {
    ({ url } = await request.json());
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }
  if (typeof url !== "string" || url.length > 300) return NextResponse.json({ error: "Ogiltig adress." }, { status: 400 });

  try {
    // Google hämtar sidan från sina egna servrar, men vi släpper bara igenom
    // vanliga publika adresser.
    const target = normalizeUrl(url).toString();
    const google = await runPageSpeed(target);
    return NextResponse.json({ google, token: sign("google", google) });
  } catch (error) {
    if (error instanceof GoogleError || error instanceof AuditError) return NextResponse.json({ error: error.message }, { status: 502 });
    console.error("[hemsidekollen/google] Oväntat fel", error);
    return NextResponse.json({ error: "Googles mätning gick inte att hämta just nu." }, { status: 500 });
  }
}
