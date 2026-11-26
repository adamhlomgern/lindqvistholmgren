import { NextRequest, NextResponse } from "next/server";
import type { AuditResult } from "@/lib/site-audit/audit";
import { verifyAudit } from "@/lib/site-audit/sign";
import { isRateLimited } from "@/lib/rate-limit";
import { renderAuditReportPdf } from "@/lib/pdf/render";
import { sendBrandedEmail } from "@/lib/email/send";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { contactInfo } from "@/lib/data/site-info";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

function isAuditResult(value: unknown): value is AuditResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.url === "string" && typeof v.host === "string" && typeof v.score === "number" && Array.isArray(v.checks);
}

// Sparar mottagaren som ett lead (källa "hemsidekollen-rapport"). Faller
// tillbaka till en rad utan källa om migrationen för källa inte körts än.
async function saveLead(result: AuditResult, email: string, name: string) {
  const supabase = createServiceRoleClient();
  const issues = result.checks.filter((c) => c.status !== "good").sort((a, b) => b.weight - a.weight);
  const row = {
    categories: ["webb"],
    budget: "vet-inte",
    timeline: "utforskar",
    description: `Fick Hemsidekollens rapport mejlad för ${result.url} (${result.score}/100).\n\nViktigast att förbättra:\n${
      issues.slice(0, 3).map((i) => `- ${i.label}`).join("\n") || "Inga anmärkningar."
    }`,
    name: name || "Via Hemsidekollen",
    company: result.host,
    email,
    phone: "",
  };
  let { error } = await supabase.from("projektforfragningar").insert({ ...row, source: "hemsidekollen-rapport", page: "/verktyg" });
  if (error && (error.code === "PGRST204" || error.code === "42703")) {
    ({ error } = await supabase.from("projektforfragningar").insert(row));
  }
  if (error) console.error("[hemsidekollen/rapport] Kunde inte spara lead", error);
}

// POST { result, token, email, name?, website } -> mejlar rapporten som PDF.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`hemsidekollen-rapport:${ip}`)) {
    return NextResponse.json({ error: "Ni har bett om många rapporter på kort tid. Vänta en stund." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  // Honeypot: svara som om allt gick bra men skicka inget.
  if (typeof body.website === "string" && body.website.trim() !== "") return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Kontrollera e-postadressen." }, { status: 400 });
  }
  if (!isAuditResult(body.result) || !verifyAudit(body.result, body.token)) {
    return NextResponse.json({ error: "Resultatet har gått ut. Kör kollen igen och försök på nytt." }, { status: 400 });
  }
  const result = body.result;

  let pdf: Buffer;
  try {
    pdf = await renderAuditReportPdf(result);
  } catch (error) {
    console.error("[hemsidekollen/rapport] PDF misslyckades", error);
    return NextResponse.json({ error: "Kunde inte skapa rapporten. Försök igen." }, { status: 500 });
  }

  const host = escape(result.host);
  try {
    await sendBrandedEmail({
      to: email,
      subject: `Er rapport från Hemsidekollen: ${result.host} fick ${result.score}/100`,
      heading: `${host} fick ${result.score} av 100`,
      bodyHtml: `<p style="margin:0 0 12px;">Hej${name ? ` ${escape(name)}` : ""}!</p>
<p style="margin:0 0 12px;">Här är rapporten från Hemsidekollen. Den ligger bifogad som PDF, med det viktigaste att förbättra först.</p>
<p style="margin:0;">Vill ni att vi tittar på sajten på riktigt? Svara på det här mejlet eller boka en gratis genomgång, så berättar vi vad som ger mest effekt.</p>`,
      ctaLabel: "Boka en gratis genomgång",
      ctaUrl: "https://lindqvistholmgren.se/kontakt",
      footerHtml: `Ni fick det här mejlet för att ni bad om rapporten på lindqvistholmgren.se. Frågor? ${contactInfo.email}`,
      replyTo: contactInfo.email,
      attachments: [{ filename: `hemsidekollen-${result.host}.pdf`, content: pdf, contentType: "application/pdf" }],
    });
  } catch (error) {
    console.error("[hemsidekollen/rapport] Mejlet kunde inte skickas", error);
    return NextResponse.json({ error: "Vi kunde inte skicka mejlet just nu. Försök igen om en stund." }, { status: 502 });
  }

  await saveLead(result, email, name);
  return NextResponse.json({ ok: true });
}
