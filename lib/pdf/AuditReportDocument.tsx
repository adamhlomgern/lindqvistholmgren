import fs from "fs";
import path from "path";
import { Circle, Document, Font, Image, Link, Page, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import { actionPlan, type AuditCheck, type AuditResult } from "@/lib/site-audit/analyze";
import type { GoogleResult, MetricStatus } from "@/lib/site-audit/pagespeed";
import { contactInfo } from "@/lib/data/site-info";

// PDF-rapporten från Hemsidekollen, i sajtens formspråk: Poppins i rubriker,
// Geist i brödtext, mörkgrönt och lila. Typsnitt och logga läses från
// lib/pdf (inkluderas i serverfunktionen via outputFileTracingIncludes).

const dir = path.join(process.cwd(), "lib/pdf");
const read = (file: string) => {
  const full = path.join(dir, file);
  return fs.existsSync(full) ? fs.readFileSync(full) : null;
};
const dataUri = (file: string) => {
  const buf = read(file);
  return buf ? `data:font/ttf;base64,${buf.toString("base64")}` : undefined;
};

const geist = { 400: dataUri("fonts/Geist-Regular.ttf"), 500: dataUri("fonts/Geist-Medium.ttf"), 700: dataUri("fonts/Geist-Bold.ttf") };
const poppins = { 500: dataUri("fonts/Poppins-500.ttf"), 600: dataUri("fonts/Poppins-600.ttf"), 700: dataUri("fonts/Poppins-700.ttf") };
if (geist[400] && geist[500] && geist[700]) {
  Font.register({ family: "Geist", fonts: [{ src: geist[400], fontWeight: 400 }, { src: geist[500], fontWeight: 500 }, { src: geist[700], fontWeight: 700 }] });
}
if (poppins[500] && poppins[600] && poppins[700]) {
  Font.register({ family: "Poppins", fonts: [{ src: poppins[500], fontWeight: 500 }, { src: poppins[600], fontWeight: 600 }, { src: poppins[700], fontWeight: 700 }] });
}
// Ingen avstavning: svenska ord ska inte brytas med bindestreck.
Font.registerHyphenationCallback((word) => [word]);

const body = geist[400] ? "Geist" : "Helvetica";
const display = poppins[600] ? "Poppins" : body;

const logoDark = read("assets/logo-on-dark.png");


const c = {
  ink: "#121614",
  muted: "#59615c",
  subtle: "#8a918d",
  line: "#e3e7e3",
  sunken: "#f4f6f3",
  pine: "#0b5b41",
  pineDeep: "#06301f",
  pineSoft: "#e1f3e9",
  pineText: "#cfe6da",
  lilac: "#e9dcf7",
  lilacSoft: "#f6f0fc",
  plum: "#5b3a83",
  amber: "#8a5200",
  amberSoft: "#feecd5",
  red: "#a3171b",
  redSoft: "#ffe7e4",
};

const tone = (score: number) =>
  score >= 80 ? { color: "#2f9a6c", text: c.pine, label: "Bra grund" } : score >= 55 ? { color: "#e39a1f", text: c.amber, label: "Går att förbättra" } : { color: "#e0453f", text: c.red, label: "Mycket att vinna" };

const statusStyle: Record<AuditCheck["status"], { fg: string; bg: string; label: string }> = {
  good: { fg: c.pine, bg: c.pineSoft, label: "Bra" },
  warn: { fg: c.amber, bg: c.amberSoft, label: "Förbättra" },
  bad: { fg: c.red, bg: c.redSoft, label: "Åtgärda" },
};
const metricColor: Record<MetricStatus, string> = { good: c.pine, warn: c.amber, bad: c.red };
const impactLabel = { hög: "Stor effekt", medel: "Märkbar effekt", låg: "Liten effekt" } as const;
const effortLabel = { snabbfix: "Snabbfix", medel: "Några timmar", större: "Större jobb" } as const;

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingHorizontal: 40, paddingBottom: 56, fontFamily: body, fontSize: 9.5, color: c.ink, lineHeight: 1.45 },
  h1: { fontFamily: display, fontWeight: 700, fontSize: 26, lineHeight: 1.15, letterSpacing: -0.6 },
  h2: { fontFamily: display, fontWeight: 600, fontSize: 17, lineHeight: 1.2, letterSpacing: -0.3, marginBottom: 4 },
  h3: { fontFamily: display, fontWeight: 600, fontSize: 11.5, lineHeight: 1.25 },
  eyebrow: { fontSize: 7.5, fontWeight: 700, color: c.subtle, textTransform: "uppercase", letterSpacing: 1 },
  muted: { color: c.muted },
  footer: { position: "absolute", bottom: 22, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: c.subtle },
});

function Ring({ score, size, light = false }: { score: number; size: number; light?: boolean }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const t = tone(score);
  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <Svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        <Circle cx="50" cy="50" r={r} stroke={light ? "#ffffff" : c.line} strokeOpacity={light ? 0.18 : 1} strokeWidth={9} fill="none" />
        <Circle
          cx="50"
          cy="50"
          r={r}
          stroke={t.color}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(circ * score) / 100} ${circ}`}
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <View style={{ position: "absolute", top: 0, left: 0, width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: display, fontWeight: 700, fontSize: size * 0.3, color: light ? "#fff" : t.text, lineHeight: 1 }}>{score}</Text>
        <Text style={{ fontSize: Math.max(6.5, size * 0.075), color: light ? c.pineText : c.muted, marginTop: 2 }}>av 100</Text>
      </View>
    </View>
  );
}

function Bar({ value, color, track = c.line, height = 4 }: { value: number; color: string; track?: string; height?: number }) {
  return (
    <View style={{ height, backgroundColor: track, borderRadius: height / 2 }}>
      <View style={{ height, width: `${Math.max(2, value)}%`, backgroundColor: color, borderRadius: height / 2 }} />
    </View>
  );
}

function Pill({ status }: { status: AuditCheck["status"] }) {
  const st = statusStyle[status];
  return <Text style={{ alignSelf: "flex-start", width: 54, fontSize: 7, fontWeight: 700, textAlign: "center", paddingVertical: 2.5, borderRadius: 7, color: st.fg, backgroundColor: st.bg, marginRight: 10, marginTop: 1 }}>{st.label}</Text>;
}

function Tag({ children, bg, fg }: { children: string; bg: string; fg: string }) {
  return <Text style={{ fontSize: 7, fontWeight: 700, color: fg, backgroundColor: bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginRight: 4 }}>{children}</Text>;
}

function Footer({ host }: { host: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>Hemsidekollen · {host} · lindqvistholmgren.se</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

export function AuditReportDocument({ result, google, date }: { result: AuditResult; google?: GoogleResult | null; date: Date }) {
  const t = tone(result.score);
  const { quickWins, rest } = actionPlan(result);
  const issues = result.checks.filter((x) => x.status !== "good").length;
  const dateText = date.toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document title={`Hemsidekollen – ${result.host}`} author="Lindqvist / Holmgren" subject="Genomgång av hemsida" creator="lindqvistholmgren.se">
      {/* ---- Sida 1: betyget ---- */}
      <Page size="A4" style={s.page}>
        <View style={{ backgroundColor: c.pineDeep, borderRadius: 16, padding: 26, color: "#fff" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image har ingen alt */}
            {logoDark ? <Image src={{ data: logoDark, format: "png" }} style={{ height: 22 }} /> : <Text style={{ fontFamily: display, fontWeight: 700 }}>Lindqvist / Holmgren</Text>}
            <Text style={{ fontSize: 8, color: c.pineText }}>Hemsidekollen · {dateText}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 26 }}>
            <Ring score={result.score} size={108} light />
            <View style={{ marginLeft: 22, flex: 1 }}>
              <Text style={{ fontSize: 8.5, color: c.pineText }}>Rapport för</Text>
              <Text style={[s.h1, { color: "#fff" }]}>{result.host}</Text>
              <Text style={{ marginTop: 6, alignSelf: "flex-start", backgroundColor: "#fff", color: t.text, fontWeight: 700, fontSize: 9, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 9 }}>{t.label}</Text>
              <Text style={{ marginTop: 8, color: c.pineText, fontSize: 9.5 }}>
                {result.checks.length} kontroller, {issues} att förbättra. {result.summary}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 22, marginHorizontal: -4 }}>
            {result.categories.map((cat) => (
              <View key={cat.id} style={{ width: "33.33%", padding: 4 }}>
                <View style={{ backgroundColor: "#ffffff14", borderRadius: 10, padding: 10 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 8.5, color: "#fff", fontWeight: 500 }}>{cat.label}</Text>
                    <Text style={{ fontFamily: display, fontWeight: 600, fontSize: 15, color: "#fff", lineHeight: 1 }}>{cat.score}</Text>
                  </View>
                  <View style={{ marginTop: 7 }}>
                    <Bar value={cat.score} color={tone(cat.score).color} track="#ffffff26" />
                  </View>
                  <Text style={{ fontSize: 7, color: c.pineText, marginTop: 5 }}>{cat.issues === 0 ? "Inget att anmärka" : `${cat.issues} att förbättra`}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 14, borderWidth: 1, borderColor: c.line, borderRadius: 12 }}>
          {[
            ["Serverns svar", `${(result.ttfbMs / 1000).toFixed(1).replace(".", ",")} s`],
            ["Sidans kod", `${result.sizeKb} kB`],
            ["Ord", String(result.facts.words)],
            ["Bilder", String(result.facts.images)],
            ["Skript", String(result.facts.scripts)],
            ["Byggd med", result.platform ?? "Okänt"],
          ].map(([label, value], i) => (
            <View key={label} style={{ flex: 1, padding: 9, borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
              <Text style={{ fontSize: 7, color: c.muted }}>{label}</Text>
              <Text style={{ fontFamily: display, fontWeight: 600, fontSize: 11, marginTop: 2 }}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", marginTop: 18 }}>
          <View style={{ flex: 1, marginRight: 8, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 14 }}>
            <Text style={s.eyebrow}>Det viktigaste i korthet</Text>
            {actionPlan(result).ranked.slice(0, 4).map((x, i) => (
              <View key={x.id} style={{ flexDirection: "row", marginTop: 8 }}>
                <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 13, color: "#c9b2e8", width: 18, lineHeight: 1.1 }}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 500 }}>{x.label}</Text>
                  <Text style={[s.muted, { fontSize: 8 }]}>{x.detail}</Text>
                </View>
              </View>
            ))}
            {issues === 0 && <Text style={{ marginTop: 8 }}>Inget att anmärka på. Snyggt!</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 8, backgroundColor: c.pineSoft, borderRadius: 12, padding: 14 }}>
            <Text style={[s.eyebrow, { color: c.pine }]}>Det här gör ni bra</Text>
            {result.checks
              .filter((x) => x.status === "good")
              .sort((a, b) => b.weight - a.weight)
              .slice(0, 6)
              .map((x) => (
                <View key={x.id} style={{ flexDirection: "row", marginTop: 7 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.pine, marginTop: 3.5, marginRight: 7 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 500 }}>{x.label}</Text>
                    <Text style={[s.muted, { fontSize: 8 }]}>{x.detail}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
        <Footer host={result.host} />
      </Page>

      {google && (
        <Page size="A4" style={s.page}>
          <Text style={s.eyebrow}>Googles egen mätning</Text>
          <Text style={s.h2}>Så upplevs sajten i en mobil</Text>
          <Text style={[s.muted, { marginBottom: 14 }]}>
            Google laddar sajten i en simulerad mobil över 4G och mäter samma saker som påverkar placeringen i sökresultaten.
          </Text>
          <View style={{ flexDirection: "row" }}>
            {google.screenshot && (
              <View style={{ width: 150, marginRight: 20, backgroundColor: c.ink, borderRadius: 20, padding: 6 }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image har ingen alt */}
                <Image src={google.screenshot} style={{ width: "100%", borderRadius: 15 }} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ring score={google.performance} size={74} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={s.h3}>Prestanda {google.performance} av 100</Text>
                  <Text style={[s.muted, { fontSize: 8.5 }]}>90+ är bra, 50–89 går att förbättra, under 50 är långsamt.</Text>
                </View>
              </View>
              <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", marginHorizontal: -3 }}>
                {google.metrics.map((m) => (
                  <View key={m.id} style={{ width: "50%", padding: 3 }}>
                    <View style={{ backgroundColor: c.sunken, borderRadius: 8, padding: 8 }}>
                      <Text style={{ fontSize: 7.5, color: c.muted }}>{m.label}</Text>
                      <Text style={{ fontFamily: display, fontWeight: 600, fontSize: 13, lineHeight: 1.25, marginTop: 2, color: metricColor[m.status] }}>{m.value}</Text>
                      <Text style={{ fontSize: 7, lineHeight: 1.35, color: c.subtle, marginTop: 3 }}>{m.hint}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          {google.filmstrip.length > 0 && (
            <View style={{ marginTop: 18 }} wrap={false}>
              <Text style={s.h3}>Så växer sidan fram</Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                {google.filmstrip.map((f, i) => (
                  <View key={i} style={{ marginRight: 8, alignItems: "center" }}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image har ingen alt */}
                    <Image src={f.data} style={{ height: 120, borderRadius: 6, borderWidth: 1, borderColor: c.line }} />
                    <Text style={{ fontSize: 7.5, color: c.muted, marginTop: 3 }}>{(f.ms / 1000).toFixed(1).replace(".", ",")} s</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View style={{ flexDirection: "row", marginTop: 18 }} wrap={false}>
            <View style={{ flex: 1, marginRight: 8, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12 }}>
              <Text style={s.h3}>Störst vinst enligt Google</Text>
              {google.opportunities.length === 0 && <Text style={[s.muted, { marginTop: 4 }]}>Inget stort att vinna. Bra!</Text>}
              {google.opportunities.map((o, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                  <Text style={{ fontSize: 8.5, flex: 1 }}>
                    {i + 1}. {o.title}
                  </Text>
                  {o.saving && <Text style={{ fontSize: 8, color: c.pine, marginLeft: 6 }}>{o.saving}</Text>}
                </View>
              ))}
            </View>
            <View style={{ flex: 1, marginLeft: 8, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12 }}>
              <Text style={s.h3}>Riktiga besökare</Text>
              {google.field ? (
                <>
                  <Text style={[s.muted, { fontSize: 8, marginTop: 2 }]}>Chrome-användare senaste 28 dagarna ({google.field.scope}).</Text>
                  {google.field.metrics.map((m) => (
                    <View key={m.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                      <Text style={{ fontSize: 8.5 }}>{m.label}</Text>
                      <Text style={{ fontSize: 8.5, fontWeight: 700, color: metricColor[m.status] }}>{m.value}</Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={[s.muted, { fontSize: 8.5, marginTop: 4 }]}>För få besökare för att Google ska visa data från riktiga användare. Mätningen är en simulering.</Text>
              )}
            </View>
          </View>
          <Footer host={result.host} />
        </Page>
      )}

      {/* ---- Åtgärdsplan ---- */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Er åtgärdsplan</Text>
        <Text style={s.h2}>Gör det här först</Text>
        <Text style={[s.muted, { marginBottom: 12 }]}>Sorterat efter effekt i förhållande till insats. De första punkterna är ofta gjorda på en eftermiddag.</Text>
        {quickWins.length === 0 && rest.length === 0 && <Text>Inget att anmärka på. Snyggt!</Text>}
        {quickWins.map((x, i) => (
          <View key={x.id} wrap={false} style={{ flexDirection: "row", borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: "#c9b2e8", width: 30, lineHeight: 1 }}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Tag bg={x.impact === "hög" ? c.pineSoft : c.sunken} fg={x.impact === "hög" ? c.pine : c.muted}>{impactLabel[x.impact]}</Tag>
                <Tag bg={c.lilac} fg={c.plum}>{effortLabel[x.effort]}</Tag>
              </View>
              <Text style={s.h3}>{x.label}</Text>
              <Text style={[s.muted, { marginTop: 2 }]}>{x.detail}</Text>
              {x.fix.map((step, n) => (
                <View key={n} style={{ flexDirection: "row", marginTop: 3 }}>
                  <Text style={{ width: 12, color: c.plum, fontWeight: 700 }}>{n + 1}.</Text>
                  <Text style={{ flex: 1 }}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        {rest.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[s.h3, { marginBottom: 6 }]}>Därefter</Text>
            {rest.slice(0, 12).map((x) => (
              <View key={x.id} wrap={false} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: c.line }}>
                <Pill status={x.status} />
                <Text style={{ flex: 1, fontWeight: 500 }}>{x.label}</Text>
                <Text style={{ fontSize: 7.5, color: c.muted, width: 70 }}>{impactLabel[x.impact]}</Text>
                <Text style={{ fontSize: 7.5, color: c.plum, width: 60, textAlign: "right" }}>{effortLabel[x.effort]}</Text>
              </View>
            ))}
            {rest.length > 12 && <Text style={[s.muted, { marginTop: 6, fontSize: 8.5 }]}>+ {rest.length - 12} mindre punkter, se detaljerna längre fram.</Text>}
          </View>
        )}
        <Footer host={result.host} />
      </Page>

      {/* ---- Alla kontroller ---- */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Detaljerna</Text>
        <Text style={[s.h2, { marginBottom: 10 }]}>Alla {result.checks.length} kontroller</Text>
        {result.categories.map((cat) => {
          const checks = result.checks
            .filter((x) => x.category === cat.id)
            .sort((a, b) => ({ bad: 0, warn: 1, good: 2 })[a.status] - ({ bad: 0, warn: 1, good: 2 })[b.status]);
          return (
            <View key={cat.id} style={{ marginBottom: 14 }}>
              <View wrap={false} style={{ flexDirection: "row", alignItems: "center", backgroundColor: c.sunken, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 }}>
                <Text style={[s.h3, { flex: 1 }]}>{cat.label}</Text>
                <View style={{ width: 80, marginRight: 10 }}>
                  <Bar value={cat.score} color={tone(cat.score).color} />
                </View>
                <Text style={{ fontFamily: display, fontWeight: 600, fontSize: 13, color: tone(cat.score).text }}>{cat.score}</Text>
              </View>
              {checks.map((x) => (
                <View key={x.id} wrap={false} style={{ flexDirection: "row", paddingVertical: 6, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: c.line }}>
                  <Pill status={x.status} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontWeight: 500 }}>{x.label}</Text>
                      {x.value && <Text style={{ fontSize: 7.5, color: c.muted }}>{x.value}</Text>}
                    </View>
                    <Text style={[s.muted, { fontSize: 8.5, marginTop: 1 }]}>{x.detail}</Text>
                    {x.status !== "good" && (
                      <View style={{ marginTop: 4, backgroundColor: c.lilacSoft, borderRadius: 6, padding: 7 }}>
                        <Text style={{ fontSize: 8, color: c.muted }}>
                          <Text style={{ fontWeight: 700, color: c.ink }}>Varför: </Text>
                          {x.why}
                        </Text>
                        {x.fix.map((step, n) => (
                          <View key={n} style={{ flexDirection: "row", marginTop: 2 }}>
                            <Text style={{ width: 11, fontSize: 8, color: c.plum, fontWeight: 700 }}>{n + 1}.</Text>
                            <Text style={{ flex: 1, fontSize: 8 }}>{step}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {result.tech.length > 0 && (
          <View wrap={false} style={{ marginTop: 6 }}>
            <Text style={[s.h3, { marginBottom: 6 }]}>Det här kör sajten på</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {result.tech.map((x) => (
                <Text key={x.name} style={{ fontSize: 8, backgroundColor: c.sunken, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginRight: 4, marginBottom: 4 }}>
                  {x.name}
                  {x.version ? ` ${x.version}` : ""} · {x.kind.toLowerCase()}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View wrap={false} style={{ marginTop: 18, backgroundColor: c.pineDeep, borderRadius: 16, padding: 22, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={[s.h2, { color: "#fff" }]}>Vill ni ha hjälp att fixa det här?</Text>
            <Text style={{ color: c.pineText, marginTop: 4 }}>
              Vi är Ada och Malin. Vi bygger hemsidor och system för företag och hjälper gärna till. Boka en gratis genomgång av{" "}
              {result.host} så berättar vi vad som ger mest effekt först.
            </Text>
            <Link src="https://lindqvistholmgren.se/kontakt" style={{ marginTop: 10, color: c.lilac, fontWeight: 700, textDecoration: "none" }}>
              Boka en genomgång: lindqvistholmgren.se/kontakt
            </Link>
            <Text style={{ color: c.pineText, marginTop: 3 }}>{contactInfo.email}</Text>
          </View>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image har ingen alt */}
          {logoDark && <Image src={{ data: logoDark, format: "png" }} style={{ height: 26, marginLeft: 16 }} />}
        </View>
        <Text style={{ marginTop: 10, fontSize: 7.5, color: c.subtle }}>
          Hemsidekollen granskar startsidan automatiskt. Den ersätter inte en riktig genomgång, men visar var det oftast finns mest att vinna.
        </Text>
        <Footer host={result.host} />
      </Page>
    </Document>
  );
}
