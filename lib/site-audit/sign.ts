import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuditResult } from "@/lib/site-audit/audit";

// Resultatet från Hemsidekollen signeras på servern. När besökaren sedan ber
// om PDF-rapporten skickar webbläsaren tillbaka resultatet + token, och vi
// mejlar bara ut innehåll som vår egen server faktiskt har tagit fram — så
// att ingen kan använda vår mejlserver för att skicka valfri text.

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = process.env.AUDIT_SIGNING_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("AUDIT_SIGNING_SECRET saknas");
  return value;
}

function mac(issuedAt: number, result: AuditResult) {
  return createHmac("sha256", secret()).update(`hemsidekollen.${issuedAt}.${JSON.stringify(result)}`).digest("base64url");
}

export function signAudit(result: AuditResult): string {
  const issuedAt = Date.now();
  return `${issuedAt}.${mac(issuedAt, result)}`;
}

export function verifyAudit(result: AuditResult, token: unknown): boolean {
  if (typeof token !== "string") return false;
  const [issued, signature] = token.split(".");
  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || !signature || Date.now() - issuedAt > MAX_AGE_MS) return false;
  const expected = Buffer.from(mac(issuedAt, result));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
