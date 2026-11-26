// Googles egen mätning via PageSpeed Insights (Lighthouse i en simulerad
// mobil + riktiga besökardata från Chrome när sajten har tillräckligt med
// trafik). Svaret är stort; vi plockar ut det rapporten behöver.
//
// Nyckel: PAGESPEED_API_KEY (gratis i Google Cloud). Utan nyckel fungerar
// det ibland, men Google stryper nyckellösa anrop hårt.

export type MetricStatus = "good" | "warn" | "bad";
export type GoogleMetric = { id: string; label: string; value: string; status: MetricStatus; hint: string };
export type GoogleResult = {
  performance: number;
  metrics: GoogleMetric[];
  screenshot: string | null;
  filmstrip: { ms: number; data: string }[];
  opportunities: { title: string; saving: string | null }[];
  field: { scope: "sidan" | "hela sajten"; overall: MetricStatus | null; metrics: GoogleMetric[] } | null;
};

export class GoogleError extends Error {}

// Gränser enligt Googles Core Web Vitals (mobil).
const labMetrics: { id: string; label: string; good: number; poor: number; unit: "ms" | "cls"; hint: string }[] = [
  { id: "largest-contentful-paint", label: "Största innehållet syns", good: 2500, poor: 4000, unit: "ms", hint: "När den största bilden eller rubriken syns (LCP). Under 2,5 s är bra." },
  { id: "first-contentful-paint", label: "Första innehållet syns", good: 1800, poor: 3000, unit: "ms", hint: "När något alls dyker upp på skärmen (FCP). Under 1,8 s är bra." },
  { id: "total-blocking-time", label: "Tid sidan är låst", good: 200, poor: 600, unit: "ms", hint: "Hur länge sidan inte svarar på tryck medan skript körs (TBT). Under 0,2 s är bra." },
  { id: "cumulative-layout-shift", label: "Hoppande innehåll", good: 0.1, poor: 0.25, unit: "cls", hint: "Hur mycket saker flyttar sig medan sidan laddar (CLS). Under 0,1 är bra." },
  { id: "speed-index", label: "Upplevd laddtid", good: 3400, poor: 5800, unit: "ms", hint: "Hur snabbt sidan ser färdig ut (Speed Index). Under 3,4 s är bra." },
];

const fieldMetrics: { key: string; label: string; unit: "ms" | "cls"; hint: string }[] = [
  { key: "LARGEST_CONTENTFUL_PAINT_MS", label: "Största innehållet syns", unit: "ms", hint: "LCP hos riktiga besökare (75:e percentilen)." },
  { key: "INTERACTION_TO_NEXT_PAINT", label: "Svar på tryck och klick", unit: "ms", hint: "INP: hur snabbt sidan reagerar när man trycker. Under 0,2 s är bra." },
  { key: "CUMULATIVE_LAYOUT_SHIFT_SCORE", label: "Hoppande innehåll", unit: "cls", hint: "CLS hos riktiga besökare." },
  { key: "FIRST_CONTENTFUL_PAINT_MS", label: "Första innehållet syns", unit: "ms", hint: "FCP hos riktiga besökare." },
  { key: "EXPERIMENTAL_TIME_TO_FIRST_BYTE", label: "Serverns svarstid", unit: "ms", hint: "TTFB hos riktiga besökare." },
];

const fmt = (value: number, unit: "ms" | "cls") =>
  unit === "cls" ? value.toFixed(2).replace(".", ",") : value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1).replace(".", ",")} s`;

const fieldStatus = (category: string | undefined): MetricStatus | null =>
  category === "FAST" ? "good" : category === "AVERAGE" ? "warn" : category === "SLOW" ? "bad" : null;

const clean = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`/g, "").trim();

/* eslint-disable @typescript-eslint/no-explicit-any -- PageSpeed-svaret är stort och löst typat */
export function parsePageSpeed(json: any): GoogleResult {
  const lh = json?.lighthouseResult;
  if (!lh?.categories?.performance) throw new GoogleError("Google kunde inte mäta sajten.");
  const audits = lh.audits ?? {};

  const metrics: GoogleMetric[] = labMetrics
    .filter((m) => typeof audits[m.id]?.numericValue === "number")
    .map((m) => {
      const v = audits[m.id].numericValue as number;
      return { id: m.id, label: m.label, value: fmt(v, m.unit), status: v <= m.good ? "good" : v <= m.poor ? "warn" : "bad", hint: m.hint };
    });

  const screenshot = typeof audits["final-screenshot"]?.details?.data === "string" ? audits["final-screenshot"].details.data : null;
  const frames: any[] = audits["screenshot-thumbnails"]?.details?.items ?? [];
  // Sex jämnt fördelade bilder räcker för en filmremsa (Lighthouse ger ~10).
  const picks = frames.length > 6 ? [0, 1, 2, 3, 4, 5].map((k) => Math.round((k * (frames.length - 1)) / 5)) : frames.map((_, i) => i);
  const filmstrip = picks
    .map((i) => frames[i])
    .map((f) => ({ ms: Math.round(f.timing ?? 0), data: String(f.data) }))
    .filter((f) => f.data.startsWith("data:image/"));

  const refs: any[] = lh.categories.performance.auditRefs ?? [];
  const opportunities = refs
    .map((ref) => audits[ref.id])
    .filter((a) => a && typeof a.score === "number" && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "manual" && !labMetrics.some((m) => m.id === a.id))
    .map((a) => {
      const savingsMs = a.details?.overallSavingsMs ?? Math.max(0, ...Object.values((a.metricSavings ?? {}) as Record<string, number>).map(Number).filter(Number.isFinite));
      return { title: clean(String(a.title ?? "")), saving: savingsMs >= 100 ? `spara ~${fmt(savingsMs, "ms")}` : a.displayValue ? clean(String(a.displayValue)) : null, savingsMs };
    })
    .filter((o) => o.title)
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 6)
    .map(({ title, saving }) => ({ title, saving }));

  const exp = json.loadingExperience?.metrics && Object.keys(json.loadingExperience.metrics).length ? json.loadingExperience : json.originLoadingExperience;
  let field: GoogleResult["field"] = null;
  if (exp?.metrics && Object.keys(exp.metrics).length) {
    const fm: GoogleMetric[] = fieldMetrics
      .filter((m) => exp.metrics[m.key]?.percentile !== undefined)
      .map((m) => {
        const raw = Number(exp.metrics[m.key].percentile);
        const v = m.unit === "cls" ? raw / 100 : raw;
        return { id: m.key, label: m.label, value: fmt(v, m.unit), status: fieldStatus(exp.metrics[m.key].category) ?? "warn", hint: m.hint };
      });
    if (fm.length) field = { scope: exp === json.loadingExperience && !exp.origin_fallback ? "sidan" : "hela sajten", overall: fieldStatus(exp.overall_category), metrics: fm };
  }

  return { performance: Math.round((lh.categories.performance.score ?? 0) * 100), metrics, screenshot, filmstrip, opportunities, field };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function runPageSpeed(url: string): Promise<GoogleResult> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("locale", "sv");
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  let response: Response;
  try {
    response = await fetch(api, { signal: AbortSignal.timeout(55000), cache: "no-store" });
  } catch {
    throw new GoogleError("Googles mätning tog för lång tid. Försök igen om en stund.");
  }
  if (response.status === 429) throw new GoogleError("Google har fått för många mätningar just nu. Försök igen om en stund.");
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message = String(json?.error?.message ?? "");
    if (/FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|NO_FCP/i.test(message)) throw new GoogleError("Google kunde inte ladda sajten för att mäta den.");
    throw new GoogleError("Googles mätning gick inte att hämta just nu.");
  }
  return parsePageSpeed(json);
}
