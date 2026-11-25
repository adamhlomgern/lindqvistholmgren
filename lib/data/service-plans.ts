// Innehåll till de interaktiva upplägg-komponenterna på tjänstesidorna
// (components/sections/SetupPlanner, SituationPicker, EngagementModels).
// SEO-undersidorna länkas härifrån i sitt sammanhang i stället för som en
// lång lista. Inga priser: varje projekt offereras för sig.

export type PaymentModel = { key: "engang" | "manad"; title: string; short: string; description: string };

export const paymentModels: PaymentModel[] = [
  {
    key: "engang",
    title: "Engångsprojekt",
    short: "Betala för bygget, äg allt",
    description:
      "Ni får en offert med pris och omfattning och betalar för projektet, gärna uppdelat i delbetalningar. När allt är betalt är det ert.",
  },
  {
    key: "manad",
    title: "Månadsavgift",
    short: "Ingen stor kostnad i början",
    description:
      "Bygget, drift och löpande ändringar delas upp i en fast månadsavgift. Vad som ingår och hur länge avtalet gäller står i offerten.",
  },
];

export type PlatformOption = { name: string; why: string; href: string; linkLabel: string };
export type BuildOption = {
  key: string;
  title: string;
  description: string;
  platforms: PlatformOption[];
  includes: string[];
};

export const webBuildOptions: BuildOption[] = [
  {
    key: "hemsida",
    title: "Hemsida",
    description: "För företag som vill synas och få fler förfrågningar.",
    platforms: [
      {
        name: "WordPress",
        why: "Ni uppdaterar texter och bilder själva i ett verktyg många redan kan.",
        href: "/tjanster/webb/wordpress-byra",
        linkLabel: "Om WordPress",
      },
      {
        name: "Egenbyggd sajt",
        why: "Så snabb som möjligt och helt efter er design, utan tillägg att hålla uppdaterade.",
        href: "/tjanster/webb/bygga-hemsida-foretag",
        linkLabel: "Om att bygga hemsida",
      },
    ],
    includes: [
      "Design utifrån ert varumärke",
      "Mobilanpassat och snabbt",
      "Grundläggande SEO från start",
      "Tydliga vägar att kontakta er",
    ],
  },
  {
    key: "webbshop",
    title: "Webbshop",
    description: "För er som vill sälja produkter på nätet.",
    platforms: [
      {
        name: "Shopify",
        why: "Allt på ett ställe för att sälja snabbt, med betalning och frakt inbyggt.",
        href: "/tjanster/webb/shopify-expert",
        linkLabel: "Om Shopify",
      },
      {
        name: "WooCommerce",
        why: "Webbshop i WordPress, när ni vill ha full kontroll och samma verktyg som för sajten.",
        href: "/tjanster/webb/woocommerce-utvecklare",
        linkLabel: "Om WooCommerce",
      },
    ],
    includes: [
      "Produkter, betalning och frakt",
      "Design som säljer i mobilen",
      "SEO för produktsidor",
      "Hjälp att komma igång och sälja",
    ],
  },
  {
    key: "system",
    title: "Bokning eller system",
    description: "För er som vill ersätta Excel, mejl och manuellt jobb.",
    platforms: [
      {
        name: "Skräddarsytt system",
        why: "Bokning, beställningar eller kundportal, byggt efter era rutiner.",
        href: "/tjanster/automation",
        linkLabel: "Om system & automation",
      },
      {
        name: "Utgå från en demo",
        why: "Klicka runt i system vi redan byggt och se vad som passar er.",
        href: "/demos",
        linkLabel: "Se våra demos",
      },
    ],
    includes: [
      "Kartläggning av hur ni jobbar idag",
      "Inloggning för er och era kunder",
      "Kopplingar till verktyg ni redan har",
      "Support efter lansering",
    ],
  },
];

export type Situation = { key: string; title: string; answer: string; href: string; linkLabel: string };

export const seoSituations: Situation[] = [
  {
    key: "inga-kunder",
    title: "Hemsidan ger inga kunder",
    answer:
      "Ofta syns sajten inte på det folk faktiskt söker på, eller så tappar den besökarna på vägen. Vi tittar på båda delarna.",
    href: "/tjanster/seo/hemsidan-ger-inga-kunder",
    linkLabel: "Varför hemsidan inte ger kunder",
  },
  {
    key: "syns-inte",
    title: "Vi syns inte på Google",
    answer:
      "Vi börjar med grunderna: att tekniken håller, att ni har rätt sökord och att Google förstår vad ni gör och var.",
    href: "/tjanster/seo/synas-pa-google",
    linkLabel: "Så syns ni på Google",
  },
  {
    key: "lokalt",
    title: "Vi vill synas i Värmland",
    answer:
      "Lokal SEO: en komplett Google-profil, lokala sökord och sidor för orterna ni jobbar i.",
    href: "/tjanster/seo/seo-byra-karlstad",
    linkLabel: "Lokal SEO i Karlstad",
  },
  {
    key: "webbshop",
    title: "Vi har en webbshop",
    answer:
      "Produkt- och kategorisidor som både rankar och säljer, plus teknisk SEO som e-handel ofta missar.",
    href: "/tjanster/seo/seo-for-e-handel",
    linkLabel: "SEO för e-handel",
  },
];
