import { NextRequest, NextResponse } from "next/server";
import { actionPlan, type AuditResult } from "@/lib/site-audit/analyze";
import type { GoogleResult } from "@/lib/site-audit/pagespeed";
import { verify } from "@/lib/site-audit/sign";
import { isRateLimited } from "@/lib/rate-limit";
import { renderAuditReportPdf } from "@/lib/pdf/render";
import { sendBrandedEmail } from "@/lib/email/send";
import { emailScoreCard } from "@/lib/email/template";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { contactInfo } from "@/lib/data/site-info";

export const maxDuration = 30;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

function isAuditResult(value: unknown): value is AuditResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.url === "string" && typeof v.host === "string" && typeof v.score === "number" && Array.isArray(v.checks) && Array.isArray(v.categories);
}

const scoreLabel = (score: number) => (score >= 80 ? "Bra grund" : score >= 55 ? "Går att förbättra" : "Mycket att vinna");

// Sparar mottagaren som ett lead (källa "hemsidekollen-rapport"). Faller
// tillbaka till en rad utan källa om migrationen för källa inte körts än.
async function saveLead(result: AuditResult, email: string, name: string) {
  const supabase = createServiceRoleClient();
  const top = actionPlan(result).ranked.slice(0, 3);
  const row = {
    categories: ["webb"],
    budget: "vet-inte",
    timeline: "utforskar",
    description: `Fick Hemsidekollens rapport mejlad för ${result.url} (${result.score}/100${result.platform ? `, ${result.platform}` : ""}).\n\nViktigast att förbättra:\n${
      top.map((i) => `- ${i.label}`).join("\n") || "Inga anmärkningar."
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

// POST { result, token, google?, googleToken?, email, name?, website } ->
// mejlar rapporten som PDF.
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
  if (!isAuditResult(body.result) || !verify("audit", body.result, body.token)) {
    return NextResponse.json({ error: "Resultatet har gått ut. Kör kollen igen och försök på nytt." }, { status: 400 });
  }
  const result = body.result;
  // Googles mätning är valfri; följer bara med om den är signerad av oss.
  const google = body.google && verify("google", body.google, body.googleToken) ? (body.google as GoogleResult) : null;

  let pdf: Buffer;
  try {
    pdf = await renderAuditReportPdf(result, google);
  } catch (error) {
    console.error("[hemsidekollen/rapport] PDF misslyckades", error);
    return NextResponse.json({ error: "Kunde inte skapa rapporten. Försök igen." }, { status: 500 });
  }

  const top = actionPlan(result).ranked.slice(0, 3);
  const host = escape(result.host);
  const issues = result.checks.filter((c) => c.status !== "good").length;
  try {
    await sendBrandedEmail({
      to: email,
      subject: `${result.host} fick ${result.score}/100 – er rapport från Hemsidekollen`,
      preheader: `${issues} saker att förbättra. Rapporten ligger bifogad som PDF.`,
      heading: "Här är er rapport",
      bodyHtml: `<p style="margin:0 0 16px;">Hej${name ? ` ${escape(name)}` : ""}! Tack för att ni körde Hemsidekollen. Hela rapporten ligger bifogad som PDF, med åtgärdsplan och steg-för-steg-förslag.</p>
${emailScoreCard({ score: result.score, label: scoreLabel(result.score), host, rows: top.map((t) => escape(t.label)) })}
<p style="margin:16px 0 0;">${google ? `Googles mätning i mobilen gav <strong>${google.performance}/100</strong> i prestanda. ` : ""}Vill ni att vi tittar på sajten på riktigt? Svara på det här mejlet eller boka en gratis genomgång, så berättar vi vad som ger mest effekt först.</p>`,
      text: `Här är er rapport från Hemsidekollen.\n\n${result.host}: ${result.score}/100 (${scoreLabel(result.score)}).\n\nViktigast att förbättra:\n${top.map((t) => `- ${t.label}`).join("\n")}\n\nHela rapporten ligger bifogad som PDF.\n\nVill ni ha en gratis genomgång? Svara på mejlet eller gå till https://lindqvistholmgren.se/kontakt\n\nAda & Malin, Lindqvist / Holmgren`,
      ctaLabel: "Boka en gratis genomgång",
      ctaUrl: "https://lindqvistholmgren.se/kontakt",
      footerHtml: `Ni fick det här mejlet för att ni bad om rapporten på lindqvistholmgren.se. Frågor? Svara bara på mejlet eller skriv till <a href="mailto:${contactInfo.email}" style="color:#5b3a83;">${contactInfo.email}</a>.`,
      replyTo: contactInfo.email,
      attachments: [{ filename: `Hemsidekollen-${result.host}.pdf`, content: pdf, contentType: "application/pdf" }],
    });
  } catch (error) {
    console.error("[hemsidekollen/rapport] Mejlet kunde inte skickas", error);
    return NextResponse.json({ error: "Vi kunde inte skicka mejlet just nu. Försök igen om en stund." }, { status: 502 });
  }

  await saveLead(result, email, name);
  return NextResponse.json({ ok: true });
}
