import { createHmac, timingSafeEqual } from "node:crypto";

// Resultat från Hemsidekollen (vår egen analys och Googles mätning) signeras
// på servern. När besökaren ber om PDF-rapporten skickar webbläsaren tillbaka
// resultaten + token, och vi mejlar bara ut innehåll som vår egen server
// faktiskt har tagit fram — ingen kan använda vår mejlserver för egen text.

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = process.env.AUDIT_SIGNING_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("AUDIT_SIGNING_SECRET saknas");
  return value;
}

function mac(kind: string, issuedAt: number, data: unknown) {
  return createHmac("sha256", secret()).update(`hemsidekollen.${kind}.${issuedAt}.${JSON.stringify(data)}`).digest("base64url");
}

export function sign(kind: "audit" | "google", data: unknown): string {
  const issuedAt = Date.now();
  return `${issuedAt}.${mac(kind, issuedAt, data)}`;
}

export function verify(kind: "audit" | "google", data: unknown, token: unknown): boolean {
  if (typeof token !== "string") return false;
  const [issued, signature] = token.split(".");
  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || !signature || Date.now() - issuedAt > MAX_AGE_MS) return false;
  const expected = Buffer.from(mac(kind, issuedAt, data));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
