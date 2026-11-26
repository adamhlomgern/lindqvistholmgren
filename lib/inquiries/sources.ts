// Var en förfrågan kom ifrån. `source` är knappens/verktygets namn (samma
// som trackingLocation i analytics) och `page` sökvägen den skickades från.
// Båda sparas på projektforfragningar så att admin ser vad som ger kunder.

const exact: Record<string, string> = {
  hero: "Heron",
  header: "Knappen i menyn",
  mobilmeny: "Mobilmenyn",
  "mobil-fast-knapp": "Fasta knappen i mobilen",
  "cta-banner": "Avslutande CTA",
  kundcitat: "Kundcitaten",
  "system-sektion": "System-sektionen",
  "tjanst-hero": "Tjänstesidans topp",
  "tjanst-undersida": "Tjänsteundersida",
  "artikel-slut": "Slutet av en artikel",
  "kontakt-guidad": "Kontaktsidan (guidad)",
  kontaktformular: "Kontaktformuläret",
  "starta-ett-projekt": "Starta ett projekt",
  "demo-kundportal": "Kundportal-demon",
  hemsidekollen: "Hemsidekollen",
  "hemsidekollen-rapport": "Hemsidekollen (rapport)",
  sajtbyggaren: "Sajtbyggaren",
};

const prefixes: [string, string][] = [
  ["upplagg-", "Upplägg-väljaren"],
  ["situation-", "SEO-väljaren"],
  ["artikel-", "Artikel"],
];

export function sourceLabel(source: string | null | undefined): string {
  if (!source) return "Okänd källa";
  if (exact[source]) return exact[source];
  const prefix = prefixes.find(([p]) => source.startsWith(p));
  return prefix ? prefix[1] : source;
}

// Grupp för statistiken i admin: verktygen räknas för sig, resten efter knapp.
export function sourceGroup(source: string | null | undefined): string {
  if (!source) return "Okänd källa";
  if (source.startsWith("hemsidekollen")) return "Hemsidekollen";
  return sourceLabel(source);
}

// Bara korta, ofarliga värden sparas.
export function cleanSource(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase().slice(0, 60);
  return /^[a-z0-9-]+$/.test(v) ? v : null;
}

export function cleanPage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, 200);
  return /^\/[\w\-/.%åäö]*$/i.test(v) ? v : null;
}
