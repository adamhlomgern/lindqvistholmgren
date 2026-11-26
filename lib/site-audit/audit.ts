import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { analyzePage, type AuditResult } from "@/lib/site-audit/analyze";

// Hemsidekollen: en snabb, ärlig genomgång av en publik hemsida. Servern
// hämtar startsidan (och robots.txt/sitemap.xml) och kontrollerar det som
// oftast skiljer en sajt som ger kunder från en som inte gör det.
//
// Säkerhet: vi hämtar en adress som besökaren skriver in, så allt som pekar
// mot interna nät (localhost, privata IP-intervall, metadata-tjänster)
// stoppas, även efter omdirigeringar. Svaret läses med tidsgräns och
// storleksgräns.

export type { AuditCheck, AuditResult, AuditCategory, CheckStatus, CategoryId } from "@/lib/site-audit/analyze";

export class AuditError extends Error {}

const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 9000;
const UA = "Mozilla/5.0 (compatible; Hemsidekollen/1.0; +https://lindqvistholmgren.se/verktyg)";

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::") return true;
    if (v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80")) return true;
    const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivateIp(mapped[1]) : false;
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export function normalizeUrl(input: string): URL {
  let raw = input.trim();
  if (!raw) throw new AuditError("Skriv in en adress, till exempel ertforetag.se.");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new AuditError("Det där ser inte ut som en webbadress.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new AuditError("Bara vanliga webbadresser går att kolla.");
  if (url.username || url.password) throw new AuditError("Adressen får inte innehålla inloggningsuppgifter.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new AuditError("Adressen kan inte ha en egen port.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || !host.includes(".")) {
    throw new AuditError("Adressen måste vara en publik hemsida.");
  }
  url.hash = "";
  return url;
}

async function assertPublicHost(hostname: string) {
  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new AuditError("Adressen måste vara en publik hemsida.");
    return;
  }
  let addresses: { address: string }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new AuditError("Vi hittar ingen hemsida på den adressen. Stämmer stavningen?");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new AuditError("Adressen måste vara en publik hemsida.");
  }
}

async function readLimited(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

type Fetched = { response: Response; url: URL; ttfbMs: number; ms: number; body: string; redirects: string[] };

async function safeFetch(start: URL, timeoutMs = TIMEOUT_MS, accept = "text/html,application/xhtml+xml"): Promise<Fetched> {
  let current = start;
  const started = Date.now();
  const redirects: string[] = [];
  for (let hop = 0; hop < 6; hop++) {
    await assertPublicHost(current.hostname);
    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        headers: { "user-agent": UA, accept },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      throw new AuditError("Sajten svarade inte inom rimlig tid, eller gick inte att nå.");
    }
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      const next = new URL(response.headers.get("location") as string, current);
      if (next.protocol !== "https:" && next.protocol !== "http:") throw new AuditError("Sajten skickar vidare till en adress vi inte kan kolla.");
      redirects.push(current.toString());
      current = next;
      continue;
    }
    const ttfbMs = Date.now() - started;
    const body = await readLimited(response);
    return { response, url: current, ttfbMs, ms: Date.now() - started, body, redirects };
  }
  throw new AuditError("Sajten skickar vidare för många gånger.");
}

async function tryFetch(url: URL, timeoutMs = 5000, accept?: string): Promise<Fetched | null> {
  try {
    return await safeFetch(url, timeoutMs, accept);
  } catch {
    return null;
  }
}

// robots.txt: finns den, stänger den ute alla (Disallow: / för *), och
// vilka sitemaps pekar den ut?
function parseRobots(text: string) {
  const sitemaps = [...text.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]);
  let blocksAll = false;
  let inStar = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const ua = line.match(/^user-agent\s*:\s*(.+)$/i);
    if (ua) {
      inStar = ua[1].trim() === "*";
      continue;
    }
    if (inStar && /^disallow\s*:\s*\/\s*$/i.test(line)) blocksAll = true;
  }
  return { sitemaps, blocksAll };
}

async function checkSitemap(origin: URL, fromRobots: string[]) {
  const candidates = [...fromRobots, "/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml"];
  for (const candidate of candidates.slice(0, 4)) {
    let url: URL;
    try {
      url = new URL(candidate, origin);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    const res = await tryFetch(url, 5000, "application/xml,text/xml,*/*");
    if (!res?.response.ok || !/<(urlset|sitemapindex)\b/i.test(res.body)) continue;
    const isIndex = /<sitemapindex\b/i.test(res.body);
    const urls = (res.body.match(isIndex ? /<sitemap>/gi : /<url>/gi) ?? []).length;
    return { found: true, urls, isIndex };
  }
  return { found: false, urls: 0, isIndex: false };
}

export async function auditSite(input: string): Promise<AuditResult> {
  const startUrl = normalizeUrl(input);
  const page = await safeFetch(startUrl);
  if (!page.response.ok) throw new AuditError(`Sajten svarade med fel (${page.response.status}). Kolla att adressen stämmer.`);
  const type = page.response.headers.get("content-type") ?? "";
  if (!type.includes("html")) throw new AuditError("Adressen leder inte till en vanlig webbsida.");

  const url = page.url;
  const origin = new URL("/", url);
  const headers: Record<string, string> = {};
  page.response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // Allt extra körs parallellt och får misslyckas utan att stoppa rapporten.
  const robotsReq = tryFetch(new URL("/robots.txt", origin), 4000, "text/plain,*/*");
  const notFoundReq = tryFetch(new URL(`/hemsidekollen-${Date.now().toString(36)}-finns-inte`, origin), 5000);
  const httpReq =
    url.protocol === "https:" ? tryFetch(new URL(`http://${url.host}/`), 5000) : Promise.resolve(null);

  const robotsRes = await robotsReq;
  const robots =
    robotsRes && robotsRes.response.ok && !/<html/i.test(robotsRes.body.slice(0, 500))
      ? { found: true, ...parseRobots(robotsRes.body) }
      : { found: false, blocksAll: false, sitemaps: [] as string[] };
  const [sitemap, notFound, http] = await Promise.all([checkSitemap(origin, robots.sitemaps), notFoundReq, httpReq]);

  return analyzePage({
    html: page.body,
    url,
    ttfbMs: page.ttfbMs,
    totalMs: page.ms,
    redirects: page.redirects,
    headers,
    robots,
    sitemap,
    notFoundStatus: notFound ? notFound.response.status : null,
    httpToHttps: http ? http.url.protocol === "https:" : null,
  });
}
