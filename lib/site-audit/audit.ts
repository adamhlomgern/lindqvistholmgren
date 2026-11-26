import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Hemsidekollen: en snabb, ärlig genomgång av en publik hemsida. Servern
// hämtar startsidan (och robots.txt/sitemap.xml) och kontrollerar det som
// oftast skiljer en sajt som ger kunder från en som inte gör det.
//
// Säkerhet: vi hämtar en adress som besökaren skriver in, så allt som pekar
// mot interna nät (localhost, privata IP-intervall, metadata-tjänster)
// stoppas, även efter omdirigeringar. Svaret läses med tidsgräns och
// storleksgräns.

export type CheckStatus = "good" | "warn" | "bad";
export type AuditCheck = {
  id: string;
  group: "Hastighet" | "Google" | "Mobil" | "Förtroende" | "Innehåll";
  label: string;
  status: CheckStatus;
  detail: string;
  weight: number;
};
export type AuditResult = {
  url: string;
  host: string;
  score: number;
  responseMs: number;
  sizeKb: number;
  checks: AuditCheck[];
};

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

async function safeFetch(start: URL, timeoutMs = TIMEOUT_MS): Promise<{ response: Response; url: URL; ms: number; body: string }> {
  let current = start;
  const started = Date.now();
  for (let hop = 0; hop < 5; hop++) {
    await assertPublicHost(current.hostname);
    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      throw new AuditError("Sajten svarade inte inom rimlig tid, eller gick inte att nå.");
    }
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      const next = new URL(response.headers.get("location") as string, current);
      if (next.protocol !== "https:" && next.protocol !== "http:") throw new AuditError("Sajten skickar vidare till en adress vi inte kan kolla.");
      current = next;
      continue;
    }
    const body = await readLimited(response);
    return { response, url: current, ms: Date.now() - started, body };
  }
  throw new AuditError("Sajten skickar vidare för många gånger.");
}

async function exists(url: URL): Promise<boolean> {
  try {
    const { response } = await safeFetch(url, 4000);
    return response.ok;
  } catch {
    return false;
  }
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1]?.trim() ?? null;
const metaContent = (html: string, key: string) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const n = (attr(tag, "name") ?? attr(tag, "property") ?? "").toLowerCase();
    if (n === key) return attr(tag, "content");
  }
  return null;
};

export async function auditSite(input: string): Promise<AuditResult> {
  const startUrl = normalizeUrl(input);
  const { response, url, ms, body } = await safeFetch(startUrl);
  if (!response.ok) throw new AuditError(`Sajten svarade med fel (${response.status}). Kolla att adressen stämmer.`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("html")) throw new AuditError("Adressen leder inte till en vanlig webbsida.");

  const origin = new URL("/", url);
  const [hasRobots, hasSitemap] = await Promise.all([exists(new URL("/robots.txt", origin)), exists(new URL("/sitemap.xml", origin))]);
  return analyzeHtml({
    html: body,
    url,
    ms,
    compressed: /gzip|br|zstd/i.test(response.headers.get("content-encoding") ?? ""),
    hasRobots,
    hasSitemap,
  });
}

// Ren analys av en hämtad sida, utan nätverk (lätt att testa).
export function analyzeHtml({
  html,
  url,
  ms,
  compressed,
  hasRobots,
  hasSitemap,
}: {
  html: string;
  url: URL;
  ms: number;
  compressed: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
}): AuditResult {
  const sizeKb = Math.round(Buffer.byteLength(html) / 1024);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
  const description = metaContent(html, "description") ?? "";
  const viewport = metaContent(html, "viewport") ?? "";
  const ogImage = metaContent(html, "og:image");
  const lang = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  const h1s = (html.match(/<h1\b/gi) ?? []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const imgsWithAlt = imgs.filter((t) => (attr(t, "alt") ?? "").length > 0).length;
  const scripts = (html.match(/<script\b[^>]*\bsrc=/gi) ?? []).length;
  const hasTel = /href\s*=\s*["']tel:/i.test(html);
  const hasMail = /href\s*=\s*["']mailto:/i.test(html);
  const hasForm = /<form\b/i.test(html);
  const hasSchema = /application\/ld\+json/i.test(html);
  const hasFavicon = /<link\b[^>]*rel\s*=\s*["'][^"']*icon[^"']*["']/i.test(html);
  const https = url.protocol === "https:";

  const checks: AuditCheck[] = [
    {
      id: "speed",
      group: "Hastighet",
      label: "Svarstid",
      status: ms < 800 ? "good" : ms < 2000 ? "warn" : "bad",
      detail:
        ms < 800
          ? `Sajten svarade på ${(ms / 1000).toFixed(1).replace(".", ",")} s. Bra!`
          : `Sajten tog ${(ms / 1000).toFixed(1).replace(".", ",")} s att svara. Varje extra sekund får fler besökare att lämna, särskilt i mobilen.`,
      weight: 3,
    },
    {
      id: "size",
      group: "Hastighet",
      label: "Sidans storlek",
      status: sizeKb < 250 ? "good" : sizeKb < 700 ? "warn" : "bad",
      detail: sizeKb < 250 ? `Startsidans kod är ${sizeKb} kB, lagom.` : `Startsidans kod är ${sizeKb} kB. Det är tungt och gör sajten långsammare på mobilnät.`,
      weight: 1,
    },
    {
      id: "scripts",
      group: "Hastighet",
      label: "Antal skript",
      status: scripts <= 12 ? "good" : scripts <= 25 ? "warn" : "bad",
      detail: scripts <= 12 ? `${scripts} externa skript. Inga problem.` : `${scripts} externa skript laddas. Många tillägg och spårningskoder gör sajten seg.`,
      weight: 1,
    },
    {
      id: "compression",
      group: "Hastighet",
      label: "Komprimering",
      status: compressed ? "good" : "warn",
      detail: compressed ? "Sidan skickas komprimerad." : "Sidan skickas okomprimerad. Med komprimering laddar den snabbare.",
      weight: 1,
    },
    {
      id: "https",
      group: "Förtroende",
      label: "Säker anslutning (HTTPS)",
      status: https ? "good" : "bad",
      detail: https ? "Sajten använder HTTPS." : "Sajten saknar HTTPS. Webbläsare varnar då för att sidan inte är säker, och Google rankar den lägre.",
      weight: 3,
    },
    {
      id: "contact",
      group: "Förtroende",
      label: "Lätt att kontakta",
      status: (hasTel ? 1 : 0) + (hasMail ? 1 : 0) + (hasForm ? 1 : 0) >= 2 ? "good" : hasTel || hasMail || hasForm ? "warn" : "bad",
      detail:
        hasTel || hasMail || hasForm
          ? `Startsidan har ${[hasTel && "klickbart nummer", hasMail && "mejllänk", hasForm && "formulär"].filter(Boolean).join(", ")}.${hasTel && hasForm ? "" : " Fler vägar gör det lättare för fler att höra av sig."}`
          : "Vi hittar inget klickbart telefonnummer, ingen mejllänk och inget formulär på startsidan. Där tappar många sajter sina kunder.",
      weight: 3,
    },
    {
      id: "viewport",
      group: "Mobil",
      label: "Mobilanpassad",
      status: /width\s*=\s*device-width/i.test(viewport) ? "good" : "bad",
      detail: /width\s*=\s*device-width/i.test(viewport)
        ? "Sajten är byggd för att visas rätt i mobilen."
        : "Sajten saknar mobilinställningen. Den visas troligen pyttelitet i mobilen, där de flesta besökare finns.",
      weight: 3,
    },
    {
      id: "title",
      group: "Google",
      label: "Sidtitel",
      status: title.length >= 25 && title.length <= 65 ? "good" : title ? "warn" : "bad",
      detail: !title
        ? "Startsidan saknar titel. Det är det första Google visar i sökresultatet."
        : title.length < 25
          ? `Titeln "${title}" är kort. Skriv vad ni gör och var, så hittar fler er.`
          : title.length > 65
            ? `Titeln är ${title.length} tecken och klipps av hos Google.`
            : `"${title}" har en bra längd.`,
      weight: 2,
    },
    {
      id: "description",
      group: "Google",
      label: "Beskrivning i sökresultat",
      status: description.length >= 70 && description.length <= 170 ? "good" : description ? "warn" : "bad",
      detail: !description
        ? "Sidan saknar beskrivning, så Google väljer en text själv. Ofta inte den bästa."
        : description.length < 70
          ? "Beskrivningen är kort. En tydlig mening om vad ni erbjuder får fler att klicka."
          : description.length > 170
            ? "Beskrivningen är lång och klipps av i sökresultatet."
            : "Beskrivningen har en bra längd.",
      weight: 2,
    },
    {
      id: "h1",
      group: "Google",
      label: "Huvudrubrik",
      status: h1s === 1 ? "good" : h1s === 0 ? "bad" : "warn",
      detail: h1s === 1 ? "Sidan har en tydlig huvudrubrik." : h1s === 0 ? "Sidan saknar huvudrubrik (h1). Den hjälper både besökare och Google att förstå sidan." : `Sidan har ${h1s} huvudrubriker. En räcker och är tydligare.`,
      weight: 1,
    },
    {
      id: "sitemap",
      group: "Google",
      label: "Sitemap och robots.txt",
      status: hasSitemap && hasRobots ? "good" : hasSitemap || hasRobots ? "warn" : "bad",
      detail:
        hasSitemap && hasRobots
          ? "Både sitemap och robots.txt finns, så Google hittar alla sidor."
          : `${!hasSitemap ? "Ingen sitemap hittades. " : ""}${!hasRobots ? "Ingen robots.txt hittades. " : ""}De hjälper Google att hitta alla era sidor.`,
      weight: 1,
    },
    {
      id: "schema",
      group: "Google",
      label: "Strukturerad data",
      status: hasSchema ? "good" : "warn",
      detail: hasSchema ? "Sidan beskriver företaget för Google med strukturerad data." : "Ingen strukturerad data. Med den kan Google visa adress, öppettider och betyg direkt i sökresultatet.",
      weight: 1,
    },
    {
      id: "alt",
      group: "Innehåll",
      label: "Bildtexter (alt)",
      status: imgs.length === 0 || imgsWithAlt / imgs.length >= 0.8 ? "good" : imgsWithAlt / imgs.length >= 0.4 ? "warn" : "bad",
      detail:
        imgs.length === 0
          ? "Inga bilder på startsidan att kontrollera."
          : `${imgsWithAlt} av ${imgs.length} bilder har en beskrivande text. Den hjälper synskadade och Googles bildsök.`,
      weight: 1,
    },
    {
      id: "social",
      group: "Innehåll",
      label: "Delningsbild",
      status: ogImage ? "good" : "warn",
      detail: ogImage ? "Sidan har en bild som visas när den delas på Facebook eller LinkedIn." : "Ingen delningsbild. Delas sajten visas en tom eller slumpvis bild.",
      weight: 1,
    },
    {
      id: "lang",
      group: "Innehåll",
      label: "Språk och ikon",
      status: lang && hasFavicon ? "good" : "warn",
      detail: `${lang ? `Språket är angivet (${lang}).` : "Språket är inte angivet."} ${hasFavicon ? "Sajten har en ikon i webbläsarfliken." : "Ingen ikon i webbläsarfliken."}`,
      weight: 1,
    },
  ];

  const max = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.weight * (c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0), 0);

  return { url: url.toString(), host: url.hostname.replace(/^www\./, ""), score: Math.round((got / max) * 100), responseMs: ms, sizeKb, checks };
}
