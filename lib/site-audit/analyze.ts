import { detectTech, platformOf, versionBelow, type Tech } from "./tech";

// Hemsidekollens analys. Ren funktion utan nätverk: allt som hämtats
// (startsidan, svarshuvuden, robots.txt, sitemap, 404-test, http-test)
// skickas in, och ut kommer betyg per kategori, ~40 kontroller med
// förklaring och konkreta åtgärder anpassade efter plattformen.

export type CheckStatus = "good" | "warn" | "bad";
export type CategoryId = "speed" | "seo" | "mobile" | "security" | "trust" | "access";
export type Impact = "hög" | "medel" | "låg";
export type Effort = "snabbfix" | "medel" | "större";

export type AuditCheck = {
  id: string;
  category: CategoryId;
  label: string;
  status: CheckStatus;
  // Vad vi hittade, på en rad eller två.
  detail: string;
  // Kort mätvärde att visa bredvid rubriken, t.ex. "1,2 s" eller "48 tecken".
  value?: string;
  why: string;
  fix: string[];
  impact: Impact;
  effort: Effort;
  weight: number;
};

export type AuditCategory = { id: CategoryId; label: string; score: number; issues: number };

export type AuditFacts = {
  title: string;
  description: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  favicon: string | null;
  h1: string | null;
  lang: string | null;
  words: number;
  images: number;
  links: number;
  scripts: number;
  stylesheets: number;
  thirdParties: string[];
  redirects: string[];
  sitemapUrls: number | null;
};

export type AuditResult = {
  url: string;
  host: string;
  score: number;
  summary: string;
  responseMs: number;
  ttfbMs: number;
  sizeKb: number;
  platform: string | null;
  categories: AuditCategory[];
  checks: AuditCheck[];
  tech: Tech[];
  facts: AuditFacts;
  checkedAt: string;
};

export type PageInput = {
  html: string;
  url: URL;
  ttfbMs: number;
  totalMs: number;
  redirects: string[];
  headers: Record<string, string>;
  robots: { found: boolean; blocksAll: boolean; sitemaps: string[] } | null;
  sitemap: { found: boolean; urls: number; isIndex: boolean } | null;
  notFoundStatus: number | null;
  httpToHttps: boolean | null;
  now?: Date;
};

export const categoryMeta: Record<CategoryId, { label: string; weight: number }> = {
  speed: { label: "Hastighet", weight: 1.2 },
  seo: { label: "Google", weight: 1.2 },
  mobile: { label: "Mobil", weight: 1 },
  trust: { label: "Förtroende & kontakt", weight: 1.2 },
  security: { label: "Säkerhet", weight: 1 },
  access: { label: "Tillgänglighet", weight: 0.6 },
};

const impactWeight: Record<Impact, number> = { hög: 3, medel: 2, låg: 1 };

// ---- små hjälpare -------------------------------------------------------

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1]?.trim() ?? null;

function metaContent(html: string, key: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const n = (attr(tag, "name") ?? attr(tag, "property") ?? "").toLowerCase();
    if (n === key) return attr(tag, "content");
  }
  return null;
}

function linkHref(html: string, rel: RegExp) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (rel.test(attr(tag, "rel") ?? "")) return attr(tag, "href");
  }
  return null;
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const secs = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
const abs = (href: string | null, base: URL) => {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
};
const baseDomain = (host: string) => host.replace(/^www\./, "").split(".").slice(-2).join(".");

// Plattformsanpassad text: { WordPress: "...", default: "..." }.
type PerPlatform = Partial<Record<string, string>> & { default: string };
const per = (platform: string | null, texts: PerPlatform) => (platform && texts[platform]) || texts.default;

// ---- analysen ------------------------------------------------------------

export function analyzePage(input: PageInput): AuditResult {
  const { html, url, headers } = input;
  const now = input.now ?? new Date();
  const tech = detectTech(html, headers);
  const platform = platformOf(tech);
  const kinds = (kind: Tech["kind"]) => tech.filter((t) => t.kind === kind);

  const head = html.match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? "";
  const body = html.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? html;
  const visible = stripTags(body.replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " "));
  const words = visible ? visible.split(" ").filter((w) => /[a-zåäöéü]{2,}/i.test(w)).length : 0;

  const sizeKb = Math.round(Buffer.byteLength(html) / 1024);
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = decode(metaContent(html, "description") ?? "").trim();
  const viewport = metaContent(html, "viewport") ?? "";
  const robotsMeta = `${metaContent(html, "robots") ?? ""} ${headers["x-robots-tag"] ?? ""}`.toLowerCase();
  const ogTitle = metaContent(html, "og:title");
  const ogDescription = metaContent(html, "og:description");
  const ogImage = abs(metaContent(html, "og:image") ?? metaContent(html, "twitter:image"), url);
  const lang = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  const favicon = abs(linkHref(html, /(^|\s)(shortcut )?icon(\s|$)/i), url) ?? abs("/favicon.ico", url);
  const hasFaviconTag = Boolean(linkHref(html, /icon/i));
  const touchIcon = Boolean(linkHref(html, /apple-touch-icon/i));
  const manifest = Boolean(linkHref(html, /manifest/i));
  const canonical = abs(linkHref(html, /^canonical$/i), url);
  const generator = metaContent(html, "generator");

  const h1Tags = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? [];
  const h1 = h1Tags[0] ? stripTags(h1Tags[0]) : null;
  const h2s = (html.match(/<h2\b/gi) ?? []).length;

  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const imgsWithAlt = imgs.filter((t) => (attr(t, "alt") ?? "").length > 0).length;
  const imgSrcs = imgs.map((t) => attr(t, "src") ?? attr(t, "data-src") ?? "");
  const modernImgs = imgSrcs.filter((s) => /\.(webp|avif)(\?|$)|format=(webp|avif)|\/_next\/image|wixstatic.*\/v1\//i.test(s)).length + (html.match(/<source\b[^>]*type=["']image\/(webp|avif)/gi) ?? []).length;
  const lazyImgs = imgs.filter((t) => /loading\s*=\s*["']lazy|data-src|lazyload/i.test(t)).length;

  const scriptTags = html.match(/<script\b[^>]*>/gi) ?? [];
  const externalScripts = scriptTags.filter((t) => attr(t, "src"));
  const headScripts = (head.match(/<script\b[^>]*>/gi) ?? []).filter((t) => attr(t, "src") && !/\b(async|defer)\b|type=["']module/i.test(t));
  const stylesheets = (html.match(/<link\b[^>]*>/gi) ?? []).filter((t) => /stylesheet/i.test(attr(t, "rel") ?? ""));
  const headStylesheets = (head.match(/<link\b[^>]*>/gi) ?? []).filter((t) => /stylesheet/i.test(attr(t, "rel") ?? "") && !/media=["']print/i.test(t));
  const blocking = headScripts.length + headStylesheets.length;

  const ownDomain = baseDomain(url.hostname);
  const resourceHosts = new Set<string>();
  for (const m of html.matchAll(/<(?:script|link|img|iframe|source)\b[^>]*\b(?:src|href)\s*=\s*["'](https?:)?\/\/([^/"'?#]+)/gi)) {
    const h = m[2].toLowerCase();
    if (baseDomain(h) !== ownDomain) resourceHosts.add(h);
  }
  const thirdParties = [...resourceHosts].sort();

  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const internalLinks = anchors.filter(([, a]) => {
    const href = attr(a, "href") ?? "";
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return false;
    try {
      return baseDomain(new URL(href, url).hostname) === ownDomain;
    } catch {
      return false;
    }
  }).length;
  const emptyLinks = anchors.filter(([, a, inner]) => !stripTags(inner) && !attr(a, "aria-label") && !attr(a, "title") && !/<img\b[^>]*alt=["'][^"']+/i.test(inner)).length;

  const actionText = /\b(kontakta|boka|offert|beställ|köp|handla|ring|mejla|maila|starta|prova|kom igång|begär|anmäl|förfrågan|book|contact|buy|shop now|get started)\b/i;
  const ctas = [...anchors.map(([, , inner]) => stripTags(inner)), ...[...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)].map((m) => stripTags(m[1]))].filter(
    (t) => t.length > 1 && t.length < 50 && actionText.test(t),
  ).length;

  const hasTel = /href\s*=\s*["']tel:/i.test(html);
  const hasMail = /href\s*=\s*["']mailto:/i.test(html);
  const hasForm = /<form\b/i.test(html);
  const socials = ["facebook.com", "instagram.com", "linkedin.com", "tiktok.com", "youtube.com"].filter((d) => new RegExp(`href=["'][^"']*${d.replace(".", "\\.")}`, "i").test(html));
  const hasReviews = /omdöme|recension|kunderna säger|våra kunder säger|betyg|stjärnor|aggregaterating|"review"|trustpilot|reco\.se|testimonial/i.test(html);
  const hasCompanyInfo = /org\.?\s*nr|organisationsnummer|\b\d{6}-\d{4}\b/i.test(visible) || /\b\d{3}\s?\d{2}\s+[A-ZÅÄÖ][a-zåäö]+/.test(visible);
  const hasPrivacy = /integritet|personuppgift|privacy|gdpr|dataskydd/i.test(anchors.map(([, a, inner]) => `${attr(a, "href") ?? ""} ${stripTags(inner)}`).join(" "));

  const schemaTypes = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) =>
    [...m[1].matchAll(/"@type"\s*:\s*(?:\[\s*)?"([^"]+)"/g)].map((t) => t[1]),
  );
  const localSchema = schemaTypes.some((t) => /LocalBusiness|Organization|Store|Restaurant|Dentist|Plumber|Electrician|HairSalon|BeautySalon|AutoRepair|HomeAndConstructionBusiness|ProfessionalService|Corporation|MedicalBusiness|LegalService|AccountingService|HealthAndBeautyBusiness|FoodEstablishment/i.test(t));

  const years = [...visible.matchAll(/(?:©|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})/gi)].map((m) => Number(m[1]));
  const copyrightYear = years.length ? Math.max(...years) : null;

  const https = url.protocol === "https:";
  const mixed = https ? (html.match(/<(?:script|img|iframe|source|link)\b[^>]*\b(?:src|href)\s*=\s*["']http:\/\//gi) ?? []).filter((t) => !/<link\b(?![^>]*stylesheet)/i.test(t) || /<link\b[^>]*stylesheet/i.test(t)).length : 0;

  const secHeaders = [
    ["Strict-Transport-Security", "strict-transport-security"],
    ["X-Content-Type-Options", "x-content-type-options"],
    ["Skydd mot inbäddning", headers["x-frame-options"] ? "x-frame-options" : /frame-ancestors/i.test(headers["content-security-policy"] ?? "") ? "content-security-policy" : "x-frame-options"],
    ["Referrer-Policy", "referrer-policy"],
    ["Content-Security-Policy", "content-security-policy"],
  ] as const;
  const presentSec = secHeaders.filter(([, h]) => headers[h]).map(([n]) => n);

  const exposed = [generator && /\d/.test(generator) ? generator : null, /\/\d/.test(headers["server"] ?? "") ? headers["server"] : null, headers["x-powered-by"] && /\d/.test(headers["x-powered-by"]) ? headers["x-powered-by"] : null].filter(Boolean) as string[];
  const jquery = tech.find((t) => t.name === "jQuery");
  const php = tech.find((t) => t.name === "PHP");
  const wp = tech.find((t) => t.name === "WordPress");

  const tracking = [...kinds("Analys"), ...kinds("Marknadsföring")].filter((t) => !["Plausible", "Vercel Analytics", "Matomo"].includes(t.name));
  const consent = kinds("Samtycke")[0] ?? null;
  const analytics = kinds("Analys");

  const googleFonts = html.match(/fonts\.googleapis\.com\/css2?\?[^"']*/gi) ?? [];
  const fontsNoSwap = googleFonts.some((u) => !/display=(swap|optional|fallback)/i.test(u));

  const checks: (AuditCheck | null)[] = [];
  const add = (c: Omit<AuditCheck, "weight" | "fix"> & { fix?: string[] }) =>
    checks.push({ ...c, fix: c.status === "good" ? [] : (c.fix ?? []), weight: impactWeight[c.impact] });

  // ---- Hastighet ----
  add({
    id: "ttfb",
    category: "speed",
    label: "Serverns svarstid",
    value: secs(input.ttfbMs),
    status: input.ttfbMs < 600 ? "good" : input.ttfbMs < 1500 ? "warn" : "bad",
    detail:
      input.ttfbMs < 600
        ? `Servern började svara efter ${secs(input.ttfbMs)}. Snabbt.`
        : `Servern tog ${secs(input.ttfbMs)} innan den ens började skicka sidan. Under 0,6 s är bra.`,
    why: "Innan något alls syns i webbläsaren måste servern svara. En seg server gör hela sajten seg, oavsett hur lätt sidan är. Google mäter också detta.",
    fix: [
      per(platform, {
        WordPress: "Installera ett cache-tillägg (t.ex. WP Rocket eller LiteSpeed Cache) så att sidan inte byggs om vid varje besök.",
        default: "Slå på sidcache hos ert webbhotell eller i er plattform, så att sidan inte byggs om vid varje besök.",
      }),
      "Lägg sajten bakom ett CDN (t.ex. Cloudflare) så att den skickas från en server nära besökaren.",
      "Är webbhotellet billigt och delat kan ett byte till ett snabbare ge mest effekt av allt.",
    ],
    impact: "hög",
    effort: "medel",
  });
  if (input.redirects.length > 0)
    add({
      id: "redirects",
      category: "speed",
      label: "Omdirigeringar",
      value: `${input.redirects.length} st`,
      status: input.redirects.length <= 1 ? "good" : "warn",
      detail:
        input.redirects.length <= 1
          ? `Adressen skickas vidare en gång (${input.redirects[0]} → ${url.toString()}). Helt okej.`
          : `Adressen skickas vidare ${input.redirects.length} gånger innan sidan kommer fram. Varje steg tar tid.`,
      why: "Varje omdirigering är en extra resa till servern, ofta 0,1–0,3 s i mobilen.",
      fix: ["Peka länkar och annonser direkt mot den slutliga adressen.", "Gör om omdirigeringskedjan till ett enda steg (t.ex. http://ertforetag.se direkt till https://www.ertforetag.se)."],
      impact: "låg",
      effort: "snabbfix",
    });
  add({
    id: "size",
    category: "speed",
    label: "Sidans storlek",
    value: `${sizeKb} kB`,
    status: sizeKb < 150 ? "good" : sizeKb < 500 ? "warn" : "bad",
    detail: sizeKb < 150 ? `Startsidans kod är ${sizeKb} kB. Lätt och bra.` : `Startsidans kod är ${sizeKb} kB innan bilder och skript. Det är tungt.`,
    why: "En tung sida tar längre tid att hämta, särskilt på mobilnät. Stor HTML beror ofta på sidbyggare som lägger in mycket onödig kod.",
    fix: [
      per(platform, {
        WordPress: "Sidbyggare som Elementor, Divi och WPBakery ger tung kod. Rensa bort sektioner och tillägg som inte används.",
        default: "Ta bort dolda sektioner och inbäddad kod som inte används.",
      }),
      "Flytta stora inbäddade texter och skript till egna filer.",
    ],
    impact: "medel",
    effort: "medel",
  });
  add({
    id: "scripts",
    category: "speed",
    label: "Skript som laddas",
    value: `${externalScripts.length} st`,
    status: externalScripts.length <= 10 ? "good" : externalScripts.length <= 20 ? "warn" : "bad",
    detail:
      externalScripts.length <= 10
        ? `${externalScripts.length} externa skript. Rimligt.`
        : `${externalScripts.length} externa skript laddas på startsidan. Varje tillägg, widget och spårningskod kostar tid.`,
    why: "Skript måste hämtas och köras innan sidan blir användbar. Många skript är den vanligaste orsaken till att en sajt känns seg i mobilen.",
    fix: [
      per(platform, {
        WordPress: "Gå igenom era tillägg och avaktivera de som inte används. Varje tillägg lägger ofta till egna skript på alla sidor.",
        default: "Gå igenom widgets, tillägg och spårningskoder och ta bort det ni inte använder.",
      }),
      "Samla spårningskoder i Google Tag Manager i stället för att lägga in dem en och en.",
    ],
    impact: "medel",
    effort: "medel",
  });
  add({
    id: "blocking",
    category: "speed",
    label: "Saker som blockerar visningen",
    value: `${blocking} st`,
    status: blocking <= 3 ? "good" : blocking <= 7 ? "warn" : "bad",
    detail:
      blocking <= 3
        ? "Få filer behöver laddas innan sidan kan visas."
        : `${headStylesheets.length} stilmallar och ${headScripts.length} skript måste laddas klart innan något visas.`,
    why: "Filer i sidhuvudet som inte är markerade som async/defer stoppar webbläsaren från att visa sidan. Besökaren ser en vit skärm under tiden.",
    fix: [
      'Lägg till "defer" på skript som inte behövs direkt.',
      per(platform, {
        WordPress: "Ett optimeringstillägg (t.ex. WP Rocket, Perfmatters eller Autoptimize) kan skjuta upp skript och slå ihop stilmallar.",
        default: "Slå ihop stilmallar och skjut upp det som inte behövs för det första man ser.",
      }),
    ],
    impact: "medel",
    effort: "medel",
  });
  add({
    id: "compression",
    category: "speed",
    label: "Komprimering",
    value: headers["content-encoding"] ?? "ingen",
    status: /gzip|br|zstd/i.test(headers["content-encoding"] ?? "") ? "good" : "warn",
    detail: /gzip|br|zstd/i.test(headers["content-encoding"] ?? "")
      ? `Sidan skickas komprimerad (${headers["content-encoding"]}).`
      : "Sidan skickas okomprimerad. Komprimerad blir den ofta 70–80 % mindre.",
    why: "Komprimering är gratis fart. Webbläsaren packar upp sidan på ett ögonblick.",
    fix: [
      per(platform, {
        WordPress: "Slå på gzip/Brotli i ert cache-tillägg eller be webbhotellet aktivera det.",
        default: "Be webbhotellet slå på gzip eller Brotli. Det är oftast en inställning.",
      }),
    ],
    impact: "medel",
    effort: "snabbfix",
  });
  if (imgs.length >= 3)
    add({
      id: "imageformat",
      category: "speed",
      label: "Moderna bildformat",
      value: `${modernImgs}/${imgs.length}`,
      status: modernImgs / imgs.length >= 0.6 ? "good" : modernImgs > 0 ? "warn" : "bad",
      detail:
        modernImgs / imgs.length >= 0.6
          ? "De flesta bilder levereras i WebP eller AVIF."
          : `${imgs.length - Math.min(modernImgs, imgs.length)} av ${imgs.length} bilder verkar vara JPG eller PNG. WebP/AVIF är ofta 30–50 % mindre.`,
      why: "Bilder är oftast det tyngsta på en sida. Rätt format gör sidan märkbart snabbare utan att bilderna ser sämre ut.",
      fix: [
        per(platform, {
          WordPress: "Installera ett bildtillägg (t.ex. ShortPixel, Imagify eller EWWW) som gör om bilderna till WebP automatiskt.",
          Shopify: "Shopify levererar WebP automatiskt om bilderna laddas via deras bild-CDN. Kontrollera att temat använder image_url-filtret.",
          default: "Gör om bilderna till WebP innan uppladdning, eller använd en tjänst som gör det automatiskt.",
        }),
        "Ladda inte upp större bilder än de visas. En bild som visas 800 px bred behöver inte vara 4000 px.",
      ],
      impact: "medel",
      effort: "snabbfix",
    });
  if (imgs.length >= 5)
    add({
      id: "lazy",
      category: "speed",
      label: "Bilder laddas vid behov",
      value: `${lazyImgs}/${imgs.length}`,
      status: lazyImgs / imgs.length >= 0.4 ? "good" : "warn",
      detail:
        lazyImgs / imgs.length >= 0.4
          ? "Bilder längre ner laddas först när besökaren scrollar dit."
          : `Bara ${lazyImgs} av ${imgs.length} bilder laddas vid behov. Resten hämtas direkt, även de man aldrig scrollar till.`,
      why: "Med lazy loading hämtas bara de bilder som syns, så det första intrycket kommer snabbare.",
      fix: ['Lägg till loading="lazy" på bilder som inte syns direkt (men inte på den stora bilden högst upp).'],
      impact: "låg",
      effort: "snabbfix",
    });
  if (thirdParties.length > 0)
    add({
      id: "thirdparty",
      category: "speed",
      label: "Externa tjänster",
      value: `${thirdParties.length} st`,
      status: thirdParties.length <= 5 ? "good" : thirdParties.length <= 10 ? "warn" : "bad",
      detail:
        thirdParties.length <= 5
          ? `Sidan hämtar saker från ${thirdParties.length} externa domäner.`
          : `Sidan hämtar saker från ${thirdParties.length} olika externa domäner. Varje ny domän kostar en uppkoppling.`,
      why: "Varje extern tjänst (typsnitt, widgets, spårning) kräver en ny uppkoppling och gör sajten beroende av andras servrar.",
      fix: ["Ta bort tjänster som inte används.", "Ladda typsnitt från egen server i stället för från en extern tjänst."],
      impact: "låg",
      effort: "medel",
    });
  if (googleFonts.length > 0)
    add({
      id: "fonts",
      category: "speed",
      label: "Typsnitt",
      status: fontsNoSwap ? "warn" : "good",
      detail: fontsNoSwap ? "Google Fonts laddas utan display=swap, så text kan vara osynlig tills typsnittet laddat." : "Typsnitten laddas så att texten syns direkt.",
      why: "Utan rätt inställning visar vissa webbläsare ingen text alls medan typsnittet hämtas.",
      fix: ['Lägg till "&display=swap" i länken till Google Fonts.', "Ännu bättre: lägg typsnittet på er egen server."],
      impact: "låg",
      effort: "snabbfix",
    });

  // ---- Google ----
  const noindex = /noindex/.test(robotsMeta);
  add({
    id: "indexable",
    category: "seo",
    label: "Google får visa sidan",
    status: noindex || input.robots?.blocksAll ? "bad" : "good",
    detail: noindex
      ? "Sidan är märkt med noindex. Google kommer inte att visa den i sökresultaten."
      : input.robots?.blocksAll
        ? "robots.txt stänger ute alla sökmotorer från hela sajten."
        : "Inget hindrar Google från att visa sidan.",
    why: "Det här är den viktigaste kontrollen. Är sidan blockerad syns den inte på Google alls, hur bra den än är.",
    fix: [
      per(platform, {
        WordPress: 'I WordPress: Inställningar → Läsa → avmarkera "Be sökmotorer att inte indexera webbplatsen".',
        Wix: "I Wix: Inställningar → SEO → slå på att sajten ska synas för sökmotorer.",
        default: 'Ta bort "noindex" från sidan och "Disallow: /" från robots.txt.',
      }),
      "Be sedan Google indexera om sidan via Google Search Console.",
    ],
    impact: "hög",
    effort: "snabbfix",
  });
  add({
    id: "title",
    category: "seo",
    label: "Sidtitel",
    value: title ? `${title.length} tecken` : "saknas",
    status: title.length >= 25 && title.length <= 65 ? "good" : title ? "warn" : "bad",
    detail: !title
      ? "Startsidan saknar titel. Det är den blå rubriken Google visar i sökresultatet."
      : title.length < 25
        ? `"${title}" är kort. Beskriv vad ni gör och var.`
        : title.length > 65
          ? `Titeln är ${title.length} tecken och klipps av i sökresultatet.`
          : `"${title}" har en bra längd.`,
    why: "Titeln är det första folk läser på Google och påverkar både placering och hur många som klickar.",
    fix: [
      "Skriv 40–60 tecken med vad ni gör, var och ert namn. Till exempel: \"Elektriker i Karlstad – snabb hjälp | Elfirman\".",
      per(platform, {
        WordPress: "Med Yoast SEO eller Rank Math ändrar ni titeln längst ner på varje sida.",
        Wix: "I Wix: Sidmeny → SEO-grunder → Titeltagg.",
        Squarespace: "I Squarespace: Sidinställningar → SEO.",
        Shopify: "I Shopify: Onlinebutik → Inställningar → Titel och metabeskrivning.",
        default: "Titeln ändras oftast under sidans SEO-inställningar.",
      }),
    ],
    impact: "hög",
    effort: "snabbfix",
  });
  add({
    id: "description",
    category: "seo",
    label: "Beskrivning i sökresultat",
    value: description ? `${description.length} tecken` : "saknas",
    status: description.length >= 70 && description.length <= 165 ? "good" : description ? "warn" : "bad",
    detail: !description
      ? "Sidan saknar beskrivning, så Google väljer en textbit själv. Sällan den bästa."
      : description.length < 70
        ? "Beskrivningen är kort och säljer inte så mycket."
        : description.length > 165
          ? `Beskrivningen är ${description.length} tecken och klipps av.`
          : "Beskrivningen har en bra längd.",
    why: "Beskrivningen är er lilla annons på Google. En tydlig text med en uppmaning får fler att klicka på just er.",
    fix: [
      'Skriv 120–155 tecken: vad ni erbjuder, varför välja er och en uppmaning. Till exempel "Fast pris och svar samma dag. Ring oss!".',
      per(platform, {
        WordPress: "Fyll i metabeskrivningen i Yoast SEO eller Rank Math.",
        Wix: "I Wix: Sidmeny → SEO-grunder → Metabeskrivning.",
        default: "Fyll i metabeskrivningen i sidans SEO-inställningar.",
      }),
    ],
    impact: "medel",
    effort: "snabbfix",
  });
  add({
    id: "h1",
    category: "seo",
    label: "Huvudrubrik",
    value: `${h1Tags.length} st`,
    status: h1Tags.length === 1 ? "good" : h1Tags.length === 0 ? "bad" : "warn",
    detail:
      h1Tags.length === 1
        ? `Huvudrubriken är "${(h1 ?? "").slice(0, 80)}".`
        : h1Tags.length === 0
          ? "Sidan saknar huvudrubrik (h1)."
          : `Sidan har ${h1Tags.length} huvudrubriker. En räcker och är tydligare.`,
    why: "Huvudrubriken talar om för både besökare och Google vad sidan handlar om.",
    fix: ["Ha exakt en h1 per sida, gärna med det viktigaste sökordet (t.ex. \"Rörmokare i Karlstad\").", "Gör övriga rubriker till h2 och h3."],
    impact: "medel",
    effort: "snabbfix",
  });
  add({
    id: "headings",
    category: "seo",
    label: "Underrubriker",
    value: `${h2s} st`,
    status: h2s >= 2 ? "good" : "warn",
    detail: h2s >= 2 ? `Sidan har ${h2s} underrubriker som delar upp innehållet.` : "Sidan har nästan inga underrubriker (h2).",
    why: "Underrubriker gör sidan lätt att skumma och hjälper Google att förstå vilka tjänster ni erbjuder.",
    fix: ["Dela upp texten med en h2 per tjänst eller ämne, t.ex. \"Badrumsrenovering\" och \"Köksrenovering\"."],
    impact: "låg",
    effort: "snabbfix",
  });
  add({
    id: "content",
    category: "seo",
    label: "Mängd text",
    value: `${words} ord`,
    status: words >= 300 ? "good" : words >= 120 ? "warn" : "bad",
    detail: words >= 300 ? `Startsidan har ungefär ${words} ord.` : `Startsidan har bara runt ${words} ord. Google har svårt att förstå vad ni erbjuder.`,
    why: "Google rankar sidor som svarar på det folk söker efter. För lite text ger för lite att gå på.",
    fix: ["Beskriv era tjänster, vilka ni hjälper och var ni finns. 300–600 ord på startsidan är en bra nivå.", "Svara på vanliga frågor direkt på sidan."],
    impact: "medel",
    effort: "medel",
  });
  add({
    id: "canonical",
    category: "seo",
    label: "Kanonisk adress",
    status: !canonical ? "warn" : baseDomain(new URL(canonical).hostname) !== ownDomain ? "bad" : "good",
    detail: !canonical
      ? "Sidan anger ingen kanonisk adress."
      : baseDomain(new URL(canonical).hostname) !== ownDomain
        ? `Den kanoniska adressen pekar på en annan domän (${new URL(canonical).hostname}). Då kan Google strunta i er sida.`
        : "Sidan anger sin kanoniska adress.",
    why: "Samma sida kan nås via flera adresser (med/utan www, med parametrar). Den kanoniska adressen säger åt Google vilken som gäller, så att rankingen inte delas upp.",
    fix: [
      per(platform, {
        WordPress: "Yoast SEO och Rank Math lägger till kanonisk adress automatiskt när de är aktiverade.",
        default: 'Lägg till <link rel="canonical" href="https://er-adress.se/"> i sidhuvudet.',
      }),
    ],
    impact: "låg",
    effort: "snabbfix",
  });
  if (input.robots || input.sitemap)
    add({
      id: "sitemap",
      category: "seo",
      label: "Sitemap och robots.txt",
      value: input.sitemap?.found ? `${input.sitemap.urls} ${input.sitemap.isIndex ? "delkartor" : "sidor"}` : "saknas",
      status: input.sitemap?.found && input.robots?.found ? "good" : input.sitemap?.found || input.robots?.found ? "warn" : "bad",
      detail: input.sitemap?.found
        ? `Sitemap finns${input.sitemap.isIndex ? ` med ${input.sitemap.urls} delkartor` : ` med ${input.sitemap.urls} sidor`}.${input.robots?.found ? "" : " Men robots.txt saknas."}${input.robots?.found && input.robots.sitemaps.length === 0 ? " robots.txt pekar inte ut den." : ""}`
        : `Ingen sitemap hittades${input.robots?.found ? "" : " och ingen robots.txt"}.`,
      why: "En sitemap är en lista över alla era sidor. Den gör att Google hittar nya sidor snabbare och inte missar någon.",
      fix: [
        per(platform, {
          WordPress: "WordPress skapar /wp-sitemap.xml automatiskt. Yoast eller Rank Math gör en bättre variant.",
          Wix: "Wix skapar sitemap automatiskt när sajten är publicerad och kopplad till en domän.",
          default: "Skapa en sitemap.xml och lägg till raden \"Sitemap: https://er-adress.se/sitemap.xml\" i robots.txt.",
        }),
        "Skicka in sitemapen i Google Search Console.",
      ],
      impact: "medel",
      effort: "snabbfix",
    });
  add({
    id: "schema",
    category: "seo",
    label: "Strukturerad data",
    value: schemaTypes.length ? schemaTypes.slice(0, 2).join(", ") : "saknas",
    status: localSchema ? "good" : "warn",
    detail: localSchema
      ? `Sidan beskriver företaget för Google (${[...new Set(schemaTypes)].slice(0, 3).join(", ")}).`
      : schemaTypes.length
        ? `Sidan har strukturerad data (${[...new Set(schemaTypes)].slice(0, 3).join(", ")}) men inget som beskriver själva företaget.`
        : "Ingen strukturerad data hittades.",
    why: "Med strukturerad data (LocalBusiness) kan Google visa adress, öppettider, telefon och betyg direkt i sökresultatet.",
    fix: [
      per(platform, {
        WordPress: "Rank Math och Yoast SEO kan lägga till LocalBusiness-data under Lokal SEO.",
        default: "Lägg till LocalBusiness i JSON-LD med namn, adress, telefon, öppettider och logga.",
      }),
      "Testa resultatet i Googles verktyg Rich Results Test.",
    ],
    impact: "medel",
    effort: "snabbfix",
  });
  add({
    id: "internal",
    category: "seo",
    label: "Interna länkar",
    value: `${internalLinks} st`,
    status: internalLinks >= 8 ? "good" : internalLinks >= 3 ? "warn" : "bad",
    detail: internalLinks >= 8 ? `Startsidan länkar till ${internalLinks} egna sidor.` : `Startsidan länkar bara till ${internalLinks} egna sidor.`,
    why: "Länkar från startsidan visar Google vilka sidor som är viktiga och hjälper besökare vidare.",
    fix: ["Länka till varje tjänst från startsidan, gärna med beskrivande länktext som \"Läs om badrumsrenovering\"."],
    impact: "låg",
    effort: "snabbfix",
  });
  if (input.notFoundStatus !== null)
    add({
      id: "notfound",
      category: "seo",
      label: "Sidor som inte finns",
      value: `svarar ${input.notFoundStatus}`,
      status: input.notFoundStatus === 404 || input.notFoundStatus === 410 ? "good" : "warn",
      detail:
        input.notFoundStatus === 404 || input.notFoundStatus === 410
          ? "En adress som inte finns ger korrekt 404-svar."
          : `En påhittad adress svarade med ${input.notFoundStatus} i stället för 404. Google kan då tro att trasiga sidor är riktiga.`,
      why: "Sajter som svarar \"allt ok\" på sidor som inte finns får dubbletter och skräpsidor i Google.",
      fix: ["Se till att sidor som inte finns svarar med statuskod 404 och visar en hjälpsam felsida med länkar vidare."],
      impact: "låg",
      effort: "medel",
    });

  // ---- Mobil ----
  const mobileOk = /width\s*=\s*device-width/i.test(viewport);
  add({
    id: "viewport",
    category: "mobile",
    label: "Mobilanpassad",
    status: mobileOk ? "good" : "bad",
    detail: mobileOk ? "Sajten är inställd för att visas rätt i mobilen." : "Sajten saknar mobilinställningen och visas troligen förminskad i mobilen.",
    why: "Över hälften av alla besök sker i mobilen, och Google rankar sajter efter hur de fungerar där.",
    fix: ['Lägg till <meta name="viewport" content="width=device-width, initial-scale=1"> i sidhuvudet.', "Saknas det helt är sajten troligen inte responsiv. Då är en ny sajt oftast bästa vägen."],
    impact: "hög",
    effort: mobileOk ? "snabbfix" : "större",
  });
  const zoomBlocked = /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport);
  if (mobileOk)
    add({
      id: "zoom",
      category: "mobile",
      label: "Går att zooma",
      status: zoomBlocked ? "warn" : "good",
      detail: zoomBlocked ? "Sajten hindrar besökare från att zooma i mobilen." : "Besökare kan zooma om texten är för liten.",
      why: "Att stänga av zoom gör sajten svår att läsa för många, särskilt äldre besökare.",
      fix: ['Ta bort "user-scalable=no" och "maximum-scale=1" från viewport-inställningen.'],
      impact: "låg",
      effort: "snabbfix",
    });
  add({
    id: "tapcall",
    category: "mobile",
    label: "Ring med ett tryck",
    status: hasTel ? "good" : "warn",
    detail: hasTel ? "Telefonnumret går att trycka på för att ringa." : "Vi hittar inget klickbart telefonnummer.",
    why: "I mobilen vill många ringa direkt. Ett nummer man måste memorera eller kopiera tappar samtal.",
    fix: ['Gör numret till en länk: <a href="tel:+46701234567">070-123 45 67</a>.', "Lägg det synligt i sidhuvudet i mobilen."],
    impact: "medel",
    effort: "snabbfix",
  });
  add({
    id: "homescreen",
    category: "mobile",
    label: "Ikon för hemskärmen",
    status: touchIcon || manifest ? "good" : "warn",
    detail: touchIcon || manifest ? "Sajten har en ikon för när den sparas på hemskärmen." : "Ingen ikon för hemskärmen. Sparas sajten i mobilen visas en suddig skärmdump.",
    why: "En liten detalj, men den gör att sajten ser proffsig ut i mobilen och i delningar.",
    fix: ['Lägg till en 180×180 px apple-touch-icon och en webbmanifest-fil med er logga.'],
    impact: "låg",
    effort: "snabbfix",
  });

  // ---- Förtroende & kontakt ----
  const contactWays = [hasTel && "klickbart nummer", hasMail && "mejllänk", hasForm && "formulär"].filter(Boolean) as string[];
  add({
    id: "contact",
    category: "trust",
    label: "Lätt att kontakta",
    value: `${contactWays.length} av 3`,
    status: contactWays.length >= 2 ? "good" : contactWays.length === 1 ? "warn" : "bad",
    detail: contactWays.length ? `Startsidan har ${contactWays.join(", ")}.` : "Inget klickbart nummer, ingen mejllänk och inget formulär på startsidan.",
    why: "Folk väljer det sätt som passar dem. Varje kontaktväg som saknas tappar några av dem som var redo att höra av sig.",
    fix: ["Visa telefon och e-post i sidhuvudet eller sidfoten på alla sidor.", "Lägg ett kort formulär (namn, kontakt, meddelande) på startsidan."],
    impact: "hög",
    effort: "snabbfix",
  });
  add({
    id: "cta",
    category: "trust",
    label: "Tydliga knappar",
    value: `${ctas} st`,
    status: ctas >= 2 ? "good" : ctas === 1 ? "warn" : "bad",
    detail: ctas >= 2 ? `Vi hittar ${ctas} knappar eller länkar som uppmanar till handling (boka, kontakta, offert …).` : ctas === 1 ? "Bara en knapp uppmanar besökaren att göra något." : "Inga knappar som uppmanar besökaren att boka, ringa eller be om offert.",
    why: "Besökare som inte vet vad nästa steg är gör ingenting. En tydlig knapp högst upp är ofta den enklaste vinsten av alla.",
    fix: ['Lägg en tydlig knapp högst upp, t.ex. "Begär offert" eller "Boka tid".', "Upprepa den efter varje sektion och längst ner på sidan."],
    impact: "hög",
    effort: "snabbfix",
  });
  add({
    id: "reviews",
    category: "trust",
    label: "Omdömen och kundcitat",
    status: hasReviews ? "good" : "warn",
    detail: hasReviews ? "Startsidan visar omdömen eller betyg." : "Vi hittar inga omdömen, betyg eller kundcitat på startsidan.",
    why: "Vad andra kunder säger väger tyngre än vad ni säger om er själva. Omdömen är ett av de starkaste sätten att få fler att höra av sig.",
    fix: ["Visa 2–3 korta kundcitat med namn och företag på startsidan.", "Har ni betyg på Google, visa snittbetyget och antal omdömen."],
    impact: "medel",
    effort: "snabbfix",
  });
  add({
    id: "company",
    category: "trust",
    label: "Vilka ni är",
    status: hasCompanyInfo ? "good" : "warn",
    detail: hasCompanyInfo ? "Adress eller organisationsnummer syns på sidan." : "Vi hittar varken adress eller organisationsnummer på startsidan.",
    why: "Seriösa uppgifter som adress och org.nr gör det tryggt att anlita er, och adressen hjälper lokal synlighet på Google.",
    fix: ["Lägg företagsnamn, adress, org.nr och telefon i sidfoten."],
    impact: "låg",
    effort: "snabbfix",
  });
  if (copyrightYear)
    add({
      id: "fresh",
      category: "trust",
      label: "Ser uppdaterad ut",
      value: `© ${copyrightYear}`,
      status: copyrightYear >= now.getFullYear() - 1 ? "good" : "warn",
      detail:
        copyrightYear >= now.getFullYear() - 1
          ? `Årtalet i sidfoten (${copyrightYear}) är aktuellt.`
          : `Sidfoten säger © ${copyrightYear}. Det får sajten att se övergiven ut, även om ni är igång.`,
      why: "Besökare letar efter tecken på att företaget är aktivt. Ett gammalt årtal väcker frågan om ni ens finns kvar.",
      fix: ["Uppdatera årtalet, eller låt det uppdateras automatiskt.", "Visa gärna något aktuellt på startsidan: senaste projekt, nyhet eller säsongserbjudande."],
      impact: "låg",
      effort: "snabbfix",
    });
  add({
    id: "privacy",
    category: "trust",
    label: "Integritetspolicy",
    status: hasPrivacy ? "good" : hasForm || tracking.length ? "warn" : "good",
    detail: hasPrivacy ? "Det finns en länk till integritetspolicy." : hasForm || tracking.length ? "Ni samlar in uppgifter (formulär eller spårning) men vi hittar ingen integritetspolicy." : "Ingen integritetspolicy hittades, men vi ser inte heller någon insamling av uppgifter.",
    why: "Enligt GDPR ska ni berätta hur ni hanterar personuppgifter. Den visar också att ni är ett seriöst företag.",
    fix: ["Skapa en sida om hur ni hanterar personuppgifter och länka till den i sidfoten och vid formulär."],
    impact: "medel",
    effort: "snabbfix",
  });
  if (tracking.length)
    add({
      id: "consent",
      category: "trust",
      label: "Samtycke till cookies",
      value: consent ? consent.name : "hittas inte",
      status: consent ? "good" : "bad",
      detail: consent
        ? `${tracking.map((t) => t.name).join(", ")} används, och ${consent.name} hanterar samtycket.`
        : `Sajten använder ${tracking.map((t) => t.name).join(", ")}, men vi hittar inget verktyg för cookie-samtycke.`,
      why: "Spårning för statistik och annonser kräver besökarens samtycke enligt lag. Saknas det riskerar ni anmärkning, och mätdatan blir ändå osäker.",
      fix: [
        per(platform, {
          WordPress: "Installera ett samtyckestillägg, t.ex. Complianz eller CookieYes, och koppla det till era spårningskoder.",
          Wix: "Slå på Wix cookie-banner under Inställningar → Integritet och cookies.",
          Shopify: "Slå på Shopifys samtyckesbanner under Inställningar → Kundintegritet.",
          default: "Lägg till ett samtyckesverktyg (t.ex. Cookiebot eller CookieYes) som stoppar spårning tills besökaren godkänt.",
        }),
      ],
      impact: "hög",
      effort: "snabbfix",
    });
  add({
    id: "analytics",
    category: "trust",
    label: "Besöksstatistik",
    value: analytics[0]?.name ?? "saknas",
    status: analytics.length ? "good" : "warn",
    detail: analytics.length ? `Ni mäter besök med ${analytics.map((a) => a.name).join(", ")}.` : "Vi hittar ingen besöksstatistik. Då vet ni inte hur många som besöker sajten eller vad de gör.",
    why: "Utan siffror är det omöjligt att veta om sajten ger kunder, och vad som borde förbättras.",
    fix: ["Lägg till Google Analytics 4, eller ett integritetsvänligt alternativ som Plausible som inte kräver cookie-samtycke."],
    impact: "låg",
    effort: "snabbfix",
  });
  add({
    id: "social",
    category: "trust",
    label: "Delningsbild",
    status: ogImage ? "good" : "warn",
    detail: ogImage ? "Sidan har en bild som visas när länken delas." : "Ingen delningsbild. Delas sajten på Facebook, LinkedIn eller i sms visas ingen bild, eller en slumpvis.",
    why: "En länk med snygg bild får betydligt fler klick när den delas.",
    fix: [
      per(platform, {
        WordPress: "Ladda upp en delningsbild under Sociala medier i Yoast SEO eller Rank Math.",
        default: 'Lägg till en og:image (1200×630 px) med er logga eller en bild från verksamheten.',
      }),
    ],
    impact: "låg",
    effort: "snabbfix",
  });

  // ---- Säkerhet ----
  add({
    id: "https",
    category: "security",
    label: "Säker anslutning (HTTPS)",
    status: https ? "good" : "bad",
    detail: https ? "Sajten använder HTTPS." : "Sajten saknar HTTPS. Webbläsaren visar \"Inte säker\" bredvid adressen.",
    why: "Utan HTTPS varnar webbläsaren besökarna, formulärdata skickas oskyddat och Google rankar sajten lägre.",
    fix: ["Slå på ett gratis SSL-certifikat (Let's Encrypt) hos ert webbhotell. Det är oftast en knapp."],
    impact: "hög",
    effort: "snabbfix",
  });
  if (https && input.httpToHttps !== null)
    add({
      id: "httpredirect",
      category: "security",
      label: "http skickas till https",
      status: input.httpToHttps ? "good" : "bad",
      detail: input.httpToHttps ? "Den som skriver http:// skickas automatiskt till den säkra versionen." : "Sajten går att nå oskyddat via http://, utan att skickas vidare till https.",
      why: "Annars kan gamla länkar och bokmärken leda till den osäkra versionen.",
      fix: [
        per(platform, {
          WordPress: "Slå på \"Tvinga HTTPS\" hos webbhotellet eller använd tillägget Really Simple SSL.",
          default: "Lägg in en permanent omdirigering (301) från http till https hos webbhotellet.",
        }),
      ],
      impact: "medel",
      effort: "snabbfix",
    });
  if (https)
    add({
      id: "mixed",
      category: "security",
      label: "Blandat innehåll",
      value: `${mixed} st`,
      status: mixed === 0 ? "good" : "warn",
      detail: mixed === 0 ? "Allt innehåll laddas säkert." : `${mixed} ${mixed === 1 ? "fil laddas" : "filer laddas"} via osäker http://. Webbläsaren kan blockera ${mixed === 1 ? "den" : "dem"}.`,
      why: "Osäkra filer på en säker sida gör att hänglåset försvinner och att bilder eller skript ibland inte visas alls.",
      fix: ["Byt http:// mot https:// i länkarna till bilder och filer.", per(platform, { WordPress: "Tillägget Better Search Replace kan byta alla adresser i databasen på en gång.", default: "Sök igenom innehållet efter http:// och byt." })],
      impact: "medel",
      effort: "snabbfix",
    });
  add({
    id: "secheaders",
    category: "security",
    label: "Säkerhetsinställningar",
    value: `${presentSec.length} av ${secHeaders.length}`,
    status: presentSec.length >= 3 ? "good" : presentSec.length >= 1 ? "warn" : "bad",
    detail: presentSec.length
      ? `Sajten skickar ${presentSec.join(", ")}. ${presentSec.length < secHeaders.length ? `Saknas: ${secHeaders.filter(([n]) => !presentSec.includes(n)).map(([n]) => n).join(", ")}.` : ""}`
      : "Sajten skickar inga av de vanliga säkerhetsinställningarna (HSTS, X-Content-Type-Options m.fl.).",
    why: "De här inställningarna skyddar mot vanliga attacker, som att någon bäddar in er sajt i en falsk sida eller lurar webbläsaren att köra skadlig kod.",
    fix: [
      per(platform, {
        WordPress: "Tillägget Headers Security Advanced & HSTS WP lägger till dem, eller be webbhotellet.",
        default: "Be webbhotellet eller er utvecklare lägga till HSTS, X-Content-Type-Options, X-Frame-Options och Referrer-Policy.",
      }),
      "Har ni Cloudflare kan flera slås på under SSL/TLS och Security.",
    ],
    impact: "låg",
    effort: "snabbfix",
  });
  const outdated: string[] = [];
  if (jquery?.version && versionBelow(jquery.version, "3.5")) outdated.push(`jQuery ${jquery.version} (kända säkerhetshål före 3.5)`);
  if (php?.version && versionBelow(php.version, "8.2")) outdated.push(`PHP ${php.version} (får inte längre säkerhetsuppdateringar)`);
  if (wp?.version && versionBelow(wp.version, "6.0")) outdated.push(`WordPress ${wp.version}`);
  add({
    id: "outdated",
    category: "security",
    label: "Gammal programvara",
    status: outdated.length ? "bad" : "good",
    value: outdated.length ? `${outdated.length} st` : undefined,
    detail: outdated.length ? `Vi ser ${outdated.join(", ")}.` : "Vi ser ingen programvara som är känt föråldrad.",
    why: "Gammal programvara är den vanligaste vägen in för hackare. Sajter med kända säkerhetshål angrips automatiskt av robotar.",
    fix: [
      per(platform, {
        WordPress: "Uppdatera WordPress, tema och tillägg. Ta backup först.",
        default: "Uppdatera plattform och bibliotek till senaste versionen.",
      }),
      "Be webbhotellet byta till en PHP-version som fortfarande får uppdateringar (8.2 eller senare).",
    ],
    impact: "hög",
    effort: "medel",
  });
  add({
    id: "exposed",
    category: "security",
    label: "Visar versionsnummer",
    status: exposed.length ? "warn" : "good",
    detail: exposed.length ? `Sajten berättar öppet vilka versioner den kör: ${exposed.join(", ")}.` : "Sajten avslöjar inga versionsnummer.",
    why: "Versionsnummer gör det lätt för robotar att hitta sajter med kända säkerhetshål.",
    fix: [
      per(platform, {
        WordPress: "Ta bort generator-taggen med ett säkerhetstillägg (t.ex. Wordfence eller Solid Security).",
        default: "Dölj versionsnummer i server-huvuden och generator-taggen.",
      }),
    ],
    impact: "låg",
    effort: "snabbfix",
  });

  // ---- Tillgänglighet ----
  add({
    id: "lang",
    category: "access",
    label: "Språk angivet",
    value: lang ?? "saknas",
    status: lang ? "good" : "warn",
    detail: lang ? `Sidan anger språket (${lang}).` : "Sidan anger inte vilket språk den är skriven på.",
    why: "Skärmläsare behöver veta språket för att läsa upp texten med rätt uttal. Det hjälper också Google.",
    fix: ['Lägg till lang="sv" på <html>-taggen.'],
    impact: "låg",
    effort: "snabbfix",
  });
  if (imgs.length)
    add({
      id: "alt",
      category: "access",
      label: "Bildtexter (alt)",
      value: `${imgsWithAlt}/${imgs.length}`,
      status: imgsWithAlt / imgs.length >= 0.8 ? "good" : imgsWithAlt / imgs.length >= 0.4 ? "warn" : "bad",
      detail: `${imgsWithAlt} av ${imgs.length} bilder har en beskrivande text.`,
      why: "Bildtexter läses upp för synskadade och hjälper Google att förstå bilderna, så de syns i bildsök.",
      fix: [
        per(platform, {
          WordPress: "Fyll i \"Alternativ text\" på varje bild i mediebiblioteket.",
          default: "Beskriv vad bilden visar, t.ex. \"Nyrenoverat badrum med grått kakel\".",
        }),
      ],
      impact: "låg",
      effort: "snabbfix",
    });
  const inputs = (html.match(/<(input|select|textarea)\b[^>]*>/gi) ?? []).filter((t) => !/type=["']?(hidden|submit|button|image|reset)/i.test(t));
  if (inputs.length) {
    const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map((m) => m[1]));
    const labelled = inputs.filter((t) => (attr(t, "id") && labelFor.has(attr(t, "id")!)) || attr(t, "aria-label") || attr(t, "aria-labelledby") || attr(t, "title")).length;
    add({
      id: "labels",
      category: "access",
      label: "Formulärfält med etikett",
      value: `${labelled}/${inputs.length}`,
      status: labelled === inputs.length ? "good" : labelled / inputs.length >= 0.5 ? "warn" : "bad",
      detail: labelled === inputs.length ? "Alla formulärfält har en etikett." : `${inputs.length - labelled} av ${inputs.length} formulärfält saknar etikett (bara platshållartext räknas inte).`,
      why: "Utan etikett vet inte skärmläsare vad fältet är till för, och platshållartexten försvinner när man börjar skriva.",
      fix: ["Ge varje fält en synlig <label>, eller åtminstone aria-label."],
      impact: "låg",
      effort: "snabbfix",
    });
  }
  add({
    id: "emptylinks",
    category: "access",
    label: "Länkar med text",
    value: `${emptyLinks} utan`,
    status: emptyLinks === 0 ? "good" : emptyLinks <= 3 ? "warn" : "bad",
    detail: emptyLinks === 0 ? "Alla länkar har en text eller beskrivning." : `${emptyLinks} länkar saknar text, t.ex. ikoner för sociala medier.`,
    why: "En skärmläsare läser bara \"länk\" om länken saknar text, och besökaren vet inte vart den leder.",
    fix: ['Ge ikonlänkar en aria-label, t.ex. aria-label="Vår Facebook-sida".'],
    impact: "låg",
    effort: "snabbfix",
  });

  void socials; // används i facts nedan
  void hasFaviconTag;

  // ---- betyg ----
  const list = checks.filter(Boolean) as AuditCheck[];
  const scoreOf = (cs: AuditCheck[]) => {
    const max = cs.reduce((s, c) => s + c.weight, 0);
    const got = cs.reduce((s, c) => s + c.weight * (c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
    return max ? Math.round((got / max) * 100) : 100;
  };
  const categories: AuditCategory[] = (Object.keys(categoryMeta) as CategoryId[]).map((id) => {
    const cs = list.filter((c) => c.category === id);
    return { id, label: categoryMeta[id].label, score: scoreOf(cs), issues: cs.filter((c) => c.status !== "good").length };
  });
  const totalWeight = categories.reduce((s, c) => s + categoryMeta[c.id].weight, 0);
  let score = Math.round(categories.reduce((s, c) => s + c.score * categoryMeta[c.id].weight, 0) / totalWeight);
  // En blockerad sajt kan inte få bra betyg, hur fin den än är.
  if (list.some((c) => c.id === "indexable" && c.status === "bad")) score = Math.min(score, 40);

  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const summary =
    best.score - worst.score < 10
      ? `Jämn nivå över alla delar.${score >= 80 ? " Bra jobbat!" : ""}`
      : `Starkast inom ${best.label.toLowerCase()} (${best.score}). Mest att vinna inom ${worst.label.toLowerCase()} (${worst.score}).`;

  return {
    url: url.toString(),
    host: url.hostname.replace(/^www\./, ""),
    score,
    summary,
    responseMs: input.totalMs,
    ttfbMs: input.ttfbMs,
    sizeKb,
    platform,
    categories,
    checks: list,
    tech,
    facts: {
      title,
      description,
      ogTitle: ogTitle ? decode(ogTitle) : null,
      ogDescription: ogDescription ? decode(ogDescription) : null,
      ogImage,
      favicon,
      h1,
      lang,
      words,
      images: imgs.length,
      links: anchors.length,
      scripts: externalScripts.length,
      stylesheets: stylesheets.length,
      thirdParties,
      redirects: input.redirects,
      sitemapUrls: input.sitemap?.found ? input.sitemap.urls : null,
    },
    checkedAt: now.toISOString(),
  };
}

// Åtgärdsplan: snabba vinster (stor effekt, liten insats) och sedan resten
// efter effekt. Används av både webbsidan och PDF:en.
const effortCost: Record<Effort, number> = { snabbfix: 1, medel: 2, större: 3 };
export function actionPlan(result: AuditResult) {
  const open = result.checks.filter((c) => c.status !== "good");
  const priority = (c: AuditCheck) => (impactWeight[c.impact] * (c.status === "bad" ? 1.5 : 1)) / effortCost[c.effort];
  const ranked = [...open].sort((a, b) => priority(b) - priority(a));
  const quickWins = ranked.filter((c) => c.effort === "snabbfix" && c.impact !== "låg").slice(0, 5);
  const rest = ranked.filter((c) => !quickWins.includes(c));
  return { quickWins, rest, ranked };
}
