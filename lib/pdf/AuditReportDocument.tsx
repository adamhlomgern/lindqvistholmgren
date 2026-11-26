import fs from "fs";
import path from "path";
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AuditCheck, AuditResult } from "@/lib/site-audit/audit";
import { contactInfo } from "@/lib/data/site-info";

// PDF-rapporten från Hemsidekollen. Samma typsnitt som fakturan (Geist,
// inbäddat som data-URI eftersom react-pdf hämtar typsnitt via fetch).
const fontsDir = path.join(process.cwd(), "lib/pdf/fonts");
const font = (file: string) => {
  const full = path.join(fontsDir, file);
  return fs.existsSync(full) ? `data:font/ttf;base64,${fs.readFileSync(full).toString("base64")}` : undefined;
};
const regular = font("Geist-Regular.ttf");
const medium = font("Geist-Medium.ttf");
const bold = font("Geist-Bold.ttf");
if (regular && medium && bold) {
  Font.register({
    family: "Geist",
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: medium, fontWeight: 500 },
      { src: bold, fontWeight: 700 },
    ],
  });
}
const family = regular ? "Geist" : "Helvetica";

const logoPath = path.join(process.cwd(), "public/images/lindqvist-holmgren/lindqvist-holmgren-favicon.png");
const logo = fs.existsSync(logoPath) ? { data: fs.readFileSync(logoPath), format: "png" as const } : undefined;

const c = {
  ink: "#151a17",
  muted: "#5b625e",
  subtle: "#8a918d",
  line: "#e4e7e4",
  sunken: "#f5f6f4",
  pine: "#026a49",
  pineSoft: "#e1f3e9",
  pineDark: "#063d2b",
  amber: "#804b01",
  amberSoft: "#feead7",
  red: "#a71116",
  redSoft: "#ffe8e5",
  lilac: "#e9dcf7",
};

const statusStyle: Record<AuditCheck["status"], { fg: string; bg: string; label: string }> = {
  good: { fg: c.pine, bg: c.pineSoft, label: "Bra" },
  warn: { fg: c.amber, bg: c.amberSoft, label: "Förbättra" },
  bad: { fg: c.red, bg: c.redSoft, label: "Åtgärda" },
};

function scoreTone(score: number) {
  if (score >= 80) return { color: c.pine, label: "Bra grund" };
  if (score >= 55) return { color: c.amber, label: "Går att förbättra" };
  return { color: c.red, label: "Mycket att vinna" };
}

const s = StyleSheet.create({
  page: { padding: 40, paddingBottom: 60, fontFamily: family, fontSize: 10, color: c.ink, lineHeight: 1.45 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center" },
  logo: { width: 26, height: 26, borderRadius: 6, marginRight: 8 },
  brandText: { fontSize: 11, fontWeight: 700 },
  meta: { fontSize: 9, color: c.subtle },
  hero: { marginTop: 22, flexDirection: "row", alignItems: "center", backgroundColor: c.sunken, borderRadius: 14, padding: 22 },
  scoreBox: { width: 96, height: 96, borderRadius: 48, borderWidth: 7, alignItems: "center", justifyContent: "center", marginRight: 22 },
  score: { fontSize: 30, fontWeight: 700, lineHeight: 1 },
  scoreOf: { fontSize: 8, color: c.muted, marginTop: 2 },
  eyebrow: { fontSize: 8.5, color: c.muted, textTransform: "uppercase", letterSpacing: 0.8 },
  host: { fontSize: 20, fontWeight: 700, marginTop: 4, lineHeight: 1.2 },
  verdict: { fontSize: 11, fontWeight: 500, marginTop: 4, lineHeight: 1.2 },
  summary: { fontSize: 9.5, color: c.muted, marginTop: 6, maxWidth: 300 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginTop: 22, marginBottom: 8 },
  priority: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: c.line },
  priorityNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: c.ink, alignItems: "center", justifyContent: "center", marginRight: 10, marginTop: 1 },
  priorityNumText: { color: "#fff", fontSize: 8.5, fontWeight: 700, lineHeight: 1 },
  groupTitle: { fontSize: 8.5, fontWeight: 700, color: c.subtle, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 12, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 5.5, borderBottomWidth: 1, borderBottomColor: c.line },
  pill: { width: 58, fontSize: 7.5, fontWeight: 700, textAlign: "center", paddingVertical: 2.5, borderRadius: 8, marginRight: 12, marginTop: 1, lineHeight: 1.2 },
  label: { fontWeight: 500, fontSize: 10 },
  detail: { color: c.muted, fontSize: 9, marginTop: 1 },
  cta: { marginTop: 20, backgroundColor: c.pineDark, borderRadius: 14, padding: 22, color: "#fff" },
  ctaTitle: { fontSize: 15, fontWeight: 700 },
  ctaText: { fontSize: 10, color: "#cfe3d9", marginTop: 6, maxWidth: 380 },
  ctaLink: { marginTop: 12, fontSize: 10, fontWeight: 700, color: c.lilac, textDecoration: "none" },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: c.subtle },
});

export function AuditReportDocument({ result, date }: { result: AuditResult; date: Date }) {
  const tone = scoreTone(result.score);
  const issues = result.checks
    .filter((check) => check.status !== "good")
    .sort((a, b) => b.weight - a.weight || (a.status === "bad" ? -1 : 1));
  const groups = [...new Set(result.checks.map((check) => check.group))];
  const good = result.checks.length - issues.length;

  return (
    <Document title={`Hemsidekollen – ${result.host}`} author="Lindqvist / Holmgren">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.brand}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image har ingen alt */}
            {logo && <Image src={logo} style={s.logo} />}
            <Text style={s.brandText}>Lindqvist / Holmgren</Text>
          </View>
          <Text style={s.meta}>Hemsidekollen · {date.toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" })}</Text>
        </View>

        <View style={s.hero}>
          <View style={[s.scoreBox, { borderColor: tone.color }]}>
            <Text style={[s.score, { color: tone.color }]}>{result.score}</Text>
            <Text style={s.scoreOf}>av 100</Text>
          </View>
          <View>
            <Text style={s.eyebrow}>Resultat för</Text>
            <Text style={s.host}>{result.host}</Text>
            <Text style={[s.verdict, { color: tone.color }]}>{tone.label}</Text>
            <Text style={s.summary}>
              {good} av {result.checks.length} kontroller ser bra ut.
              {issues.length > 0 ? ` ${issues.length} saker går att förbättra, det viktigaste först nedan.` : " Snyggt jobbat!"}
            </Text>
          </View>
        </View>

        {issues.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Börja med det här</Text>
            {issues.slice(0, 3).map((issue, index) => (
              <View key={issue.id} style={s.priority} wrap={false}>
                <View style={s.priorityNum}>
                  <Text style={s.priorityNumText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>{issue.label}</Text>
                  <Text style={s.detail}>{issue.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={s.sectionTitle}>Alla kontroller</Text>
        {groups.map((group) => (
          <View key={group}>
            <Text style={s.groupTitle}>{group}</Text>
            {result.checks
              .filter((check) => check.group === group)
              .map((check) => {
                const st = statusStyle[check.status];
                return (
                  <View key={check.id} style={s.row} wrap={false}>
                    <Text style={[s.pill, { color: st.fg, backgroundColor: st.bg }]}>{st.label}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.label}>{check.label}</Text>
                      <Text style={s.detail}>{check.detail}</Text>
                    </View>
                  </View>
                );
              })}
          </View>
        ))}

        <View style={s.cta} wrap={false}>
          <Text style={s.ctaTitle}>Vill ni ha hjälp att fixa det här?</Text>
          <Text style={s.ctaText}>
            Vi går gärna igenom {result.host} med er och berättar vad som ger mest effekt först. Gratis och utan krav.
            Svara på mejlet eller hör av er till {contactInfo.email}.
          </Text>
          <Link src="https://lindqvistholmgren.se/kontakt" style={s.ctaLink}>
            Boka en gratis genomgång → lindqvistholmgren.se/kontakt
          </Link>
        </View>

        <View style={s.footer} fixed>
          <Text>Snabbkoll av startsidan. Ett automatiskt test ersätter inte en riktig genomgång.</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
