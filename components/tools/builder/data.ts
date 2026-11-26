import {
  Bath,
  Briefcase,
  Calculator,
  ChefHat,
  Coffee,
  Flower2,
  Gift,
  Hammer,
  Home,
  LineChart,
  Paintbrush,
  Palette as PaletteIcon,
  Ruler,
  Scissors,
  ShoppingBag,
  Sparkles,
  Truck,
  UtensilsCrossed,
  Users,
  Wine,
  type LucideIcon,
} from "lucide-react";

// Innehåll till Sajtbyggarens förhandsvisning. Allt är påhittat men skrivet
// som en riktig sajt i respektive bransch. {ort} byts mot vald ort.

export type IndustryId = "hantverk" | "restaurang" | "salong" | "konsult" | "butik";
export type WidgetKind = "quote" | "menu" | "booking" | "meeting" | "shop";

export type Industry = {
  label: string;
  icon: LucideIcon;
  defaultName: string;
  eyebrow: string;
  headline: string;
  lead: string;
  cta: string;
  cta2: string;
  nav: string[];
  rating: string;
  reviewCount: number;
  stats: { value: string; label: string }[];
  servicesTitle: string;
  services: { icon: LucideIcon; title: string; text: string; price?: string }[];
  widget: WidgetKind;
  widgetTitle: string;
  reviews: { name: string; text: string }[];
  aboutTitle: string;
  about: string;
  team: { name: string; role: string }[];
  faq: { q: string; a: string }[];
  hours: [string, string][];
  address: string;
  badge: [string, string];
  feature: string;
  demo: { slug: string; name: string; text: string };
};

export const industries: Record<IndustryId, Industry> = {
  hantverk: {
    label: "Hantverkare",
    icon: Hammer,
    defaultName: "Berg Bygg & Snickeri",
    eyebrow: "Snickare i {ort}",
    headline: "Kök, badrum och tillbyggnader med fast pris.",
    lead: "Vi har byggt och renoverat i {ort} sedan 2009. Ni får en fast offert efter ett gratis hembesök, och vi sköter ROT-avdraget.",
    cta: "Begär offert",
    cta2: "Se våra projekt",
    nav: ["Tjänster", "Projekt", "Om oss", "Kontakt"],
    rating: "4,9",
    reviewCount: 127,
    stats: [
      { value: "600+", label: "Projekt" },
      { value: "15 år", label: "I branschen" },
      { value: "5 år", label: "Garanti" },
    ],
    servicesTitle: "Det här hjälper vi till med",
    services: [
      { icon: Home, title: "Köksrenovering", text: "Från ritning till sista lister, med ett team hela vägen.", price: "Fast pris" },
      { icon: Bath, title: "Badrum", text: "Våtrumscertifierade enligt Säker Vatten.", price: "Fast pris" },
      { icon: Ruler, title: "Tillbyggnader", text: "Attefall, altaner och uterum, med bygglovet ordnat.", price: "Offert" },
      { icon: Paintbrush, title: "Målning & golv", text: "Snabbt, rent och med skyddade ytor.", price: "Från 450 kr/m²" },
    ],
    widget: "quote",
    widgetTitle: "Få en offert inom 24 timmar",
    reviews: [
      { name: "Karin L.", text: "Nytt kök på tre veckor, precis som utlovat. Städat varje kväll!" },
      { name: "Johan & Sara", text: "Tydlig offert, inga överraskningar. Badrummet blev drömmen." },
      { name: "Per N.", text: "Hjälpte oss med bygglov och allt. Rekommenderas varmt." },
    ],
    aboutTitle: "Ett lokalt snickeri med stolthet i hantverket",
    about: "Vi är tolv snickare och hantverkare med egen verkstad i {ort}. Vi tar hellre färre jobb och gör dem ordentligt.",
    team: [
      { name: "Anders Berg", role: "Grundare & snickare" },
      { name: "Lina Berg", role: "Projektledare" },
    ],
    faq: [
      { q: "Hur snabbt kan ni börja?", a: "Oftast inom 3–5 veckor. Mindre jobb ibland redan veckan efter." },
      { q: "Sköter ni ROT-avdraget?", a: "Ja, vi drar av det direkt på fakturan och rapporterar till Skatteverket." },
      { q: "Kostar hembesöket något?", a: "Nej, hembesök och offert är alltid gratis." },
    ],
    hours: [
      ["Mån–fre", "07–16"],
      ["Lör–sön", "Stängt"],
    ],
    address: "Verkstadsgatan 4, {ort}",
    badge: ["Gratis hembesök", "Svar inom en dag"],
    feature: "Offertformulär som går direkt till er mejl",
    demo: { slug: "servicekoll", name: "Servicekoll", text: "Kundregister med påminnelser, bokningar och sms." },
  },
  restaurang: {
    label: "Restaurang & café",
    icon: UtensilsCrossed,
    defaultName: "Trattoria Lunda",
    eyebrow: "Italienskt mitt i {ort}",
    headline: "Handgjord pasta och pizza från vedugn.",
    lead: "Lunch vardagar 11–14 och middag sju dagar i veckan. Beställ hämtmat direkt här, utan provision till någon app.",
    cta: "Beställ hämtmat",
    cta2: "Boka bord",
    nav: ["Meny", "Boka bord", "Catering", "Hitta hit"],
    rating: "4,8",
    reviewCount: 412,
    stats: [
      { value: "11–22", label: "Öppet idag" },
      { value: "15 min", label: "Hämtmat" },
      { value: "100 %", label: "Från grunden" },
    ],
    servicesTitle: "Mer än en restaurang",
    services: [
      { icon: ChefHat, title: "Dagens lunch", text: "Två rätter att välja på, sallad och kaffe ingår.", price: "135 kr" },
      { icon: Wine, title: "Middag", text: "À la carte och vin från små italienska gårdar.", price: "Från 189 kr" },
      { icon: Users, title: "Sällskap", text: "Privat rum för upp till 24 gäster.", price: "Boka" },
      { icon: Truck, title: "Catering", text: "Buffé och plock för 10–200 gäster.", price: "Offert" },
    ],
    widget: "menu",
    widgetTitle: "Beställ hämtmat",
    reviews: [
      { name: "Emma S.", text: "Bästa carbonaran i stan, och hämtmaten var klar på 12 minuter." },
      { name: "Daniel K.", text: "Mysigt, personligt och grym pizza. Vi kommer tillbaka!" },
      { name: "Maria H.", text: "Beställde catering till 40 pers. Allt var perfekt." },
    ],
    aboutTitle: "Familjens recept sedan 1987",
    about: "Nonna Lucias recept, råvaror från Italien och lokala gårdar runt {ort}. Pastan gör vi varje morgon.",
    team: [
      { name: "Marco Lunda", role: "Kock & ägare" },
      { name: "Giulia Lunda", role: "Restaurangchef" },
    ],
    faq: [
      { q: "Har ni glutenfritt?", a: "Ja, glutenfri pasta och pizzabotten finns till alla rätter." },
      { q: "Kan man boka bord online?", a: "Ja, direkt här på sajten. Vi bekräftar med sms." },
      { q: "Levererar ni?", a: "Hämtmat och catering. Hemleverans inom 3 km på helger." },
    ],
    hours: [
      ["Mån–fre", "11–22"],
      ["Lör–sön", "12–23"],
    ],
    address: "Torggatan 12, {ort}",
    badge: ["Öppet idag", "11–22"],
    feature: "Egen beställning och bordsbokning, utan provision",
    demo: { slug: "mumsa", name: "Mumsa", text: "Beställ som kund och följ ordern i köket." },
  },
  salong: {
    label: "Frisör & skönhet",
    icon: Scissors,
    defaultName: "Studio Lin",
    eyebrow: "Frisör i {ort}",
    headline: "Klippning och färg som håller länge.",
    lead: "Boka online dygnet runt. Välj frisör, behandling och en tid som passar, så får ni en påminnelse dagen innan.",
    cta: "Boka tid",
    cta2: "Se priser",
    nav: ["Behandlingar", "Frisörer", "Priser", "Presentkort"],
    rating: "5,0",
    reviewCount: 238,
    stats: [
      { value: "I morgon", label: "Nästa lediga tid" },
      { value: "6", label: "Frisörer" },
      { value: "Svanen", label: "Märkta produkter" },
    ],
    servicesTitle: "Behandlingar",
    services: [
      { icon: Scissors, title: "Klippning", text: "Konsultation, tvätt och styling.", price: "från 595 kr" },
      { icon: PaletteIcon, title: "Färg & slingor", text: "Balayage, toning och helfärg.", price: "från 1 295 kr" },
      { icon: Sparkles, title: "Bryn & fransar", text: "Form, färg och lash lift.", price: "från 395 kr" },
      { icon: Gift, title: "Presentkort", text: "Valfritt belopp, skickas direkt.", price: "Köp online" },
    ],
    widget: "booking",
    widgetTitle: "Boka en tid",
    reviews: [
      { name: "Hanna B.", text: "Äntligen en frisör som lyssnar. Färgen är perfekt." },
      { name: "Sofia E.", text: "Så smidigt att boka online, och påminnelsen räddade mig!" },
      { name: "Linnea A.", text: "Mysig salong och duktiga frisörer. 10/10." },
    ],
    aboutTitle: "En salong där ni får ta tid",
    about: "Sex frisörer, kaffe från rosteriet runt hörnet och produkter som är snälla mot både hår och natur. Mitt i {ort}.",
    team: [
      { name: "Lin Ek", role: "Ägare & frisör" },
      { name: "Moa Ström", role: "Färgspecialist" },
    ],
    faq: [
      { q: "Kan jag avboka?", a: "Ja, kostnadsfritt fram till 24 timmar innan." },
      { q: "Har ni drop-in?", a: "Ibland på vardagar. Kolla lediga tider i bokningen." },
      { q: "Vilka produkter använder ni?", a: "Svanenmärkta och veganska produkter." },
    ],
    hours: [
      ["Mån–fre", "09–19"],
      ["Lördag", "10–15"],
    ],
    address: "Drottninggatan 8, {ort}",
    badge: ["Nästa lediga tid", "I morgon 09:30"],
    feature: "Onlinebokning med sms-påminnelse",
    demo: { slug: "bokad", name: "Bokad", text: "Boka en tid som kund och se salongens kalender." },
  },
  konsult: {
    label: "Konsult & byrå",
    icon: Briefcase,
    defaultName: "Norrsken Redovisning",
    eyebrow: "Redovisningsbyrå i {ort}",
    headline: "Ekonomin under kontroll, varje månad.",
    lead: "Bokföring, löner och bokslut för små och medelstora företag. Fast månadspris och en egen kontaktperson.",
    cta: "Boka ett samtal",
    cta2: "Våra tjänster",
    nav: ["Tjänster", "Priser", "Kunder", "Om oss"],
    rating: "4,9",
    reviewCount: 86,
    stats: [
      { value: "80+", label: "Kundföretag" },
      { value: "Auktoriserade", label: "Redovisningskonsulter" },
      { value: "24 h", label: "Svarstid" },
    ],
    servicesTitle: "Så hjälper vi er",
    services: [
      { icon: Calculator, title: "Löpande bokföring", text: "Vi bokför, stämmer av och håller koll på momsen.", price: "från 1 900 kr/mån" },
      { icon: Users, title: "Löner", text: "Lönebesked, skatter och arbetsgivardeklaration.", price: "från 145 kr/lön" },
      { icon: LineChart, title: "Bokslut & deklaration", text: "Årsbokslut, årsredovisning och deklaration.", price: "Fast pris" },
      { icon: Briefcase, title: "Rådgivning", text: "Budget, prognoser och bolagsfrågor.", price: "1 100 kr/h" },
    ],
    widget: "meeting",
    widgetTitle: "Boka ett kostnadsfritt samtal",
    reviews: [
      { name: "Erik, Bygg AB", text: "Vi slapp alla pärmar. Allt är digitalt och de svarar alltid snabbt." },
      { name: "Anna, Café Ro", text: "Fast pris gjorde det enkelt att budgetera. Superproffsiga." },
      { name: "Lars, Konsult", text: "Bästa beslutet när firman växte. Rekommenderas!" },
    ],
    aboutTitle: "Personlig byrå, digitala verktyg",
    about: "Vi är åtta auktoriserade konsulter i {ort}. Ni får en egen kontaktperson och en kundportal för alla underlag.",
    team: [
      { name: "Sara Norr", role: "Auktoriserad redovisningskonsult" },
      { name: "Oskar Lind", role: "Lönekonsult" },
    ],
    faq: [
      { q: "Hur lämnar jag underlag?", a: "Fota kvittot i appen eller ladda upp i kundportalen." },
      { q: "Kan jag byta från en annan byrå?", a: "Ja, vi sköter flytten av alla underlag åt er." },
      { q: "Vad ingår i fast pris?", a: "Allt löpande arbete enligt avtalet. Inga timmar som tickar." },
    ],
    hours: [
      ["Mån–tor", "08–17"],
      ["Fredag", "08–15"],
    ],
    address: "Kungsgatan 21, {ort}",
    badge: ["Fast pris", "från 1 900 kr/mån"],
    feature: "Kundportal för underlag och meddelanden",
    demo: { slug: "kundportal", name: "Kundportalen", text: "Kunden godkänner, hittar filer och skriver till er." },
  },
  butik: {
    label: "Butik & webbshop",
    icon: ShoppingBag,
    defaultName: "Lera & Lin",
    eyebrow: "Handgjort i {ort}",
    headline: "Keramik och textil, gjort för hand.",
    lead: "Små serier från vår ateljé. Fri frakt över 500 kr, 30 dagars öppet köp och leverans på 1–2 dagar.",
    cta: "Handla nu",
    cta2: "Nyheter",
    nav: ["Nyheter", "Keramik", "Textil", "Ateljén"],
    rating: "4,9",
    reviewCount: 1203,
    stats: [
      { value: "Fri frakt", label: "Över 500 kr" },
      { value: "1–2 dagar", label: "Leverans" },
      { value: "30 dagar", label: "Öppet köp" },
    ],
    servicesTitle: "Varför handla hos oss",
    services: [
      { icon: Flower2, title: "Handgjort", text: "Varje del drejas och glaseras i vår ateljé.", price: "" },
      { icon: Truck, title: "Snabb leverans", text: "Skickas inom 24 timmar, spårbart.", price: "" },
      { icon: Gift, title: "Presentinslagning", text: "Gratis, med handskrivet kort.", price: "" },
      { icon: Coffee, title: "Butik & ateljé", text: "Besök oss och se hur det görs.", price: "" },
    ],
    widget: "shop",
    widgetTitle: "Populärt just nu",
    reviews: [
      { name: "Ida M.", text: "Ännu finare i verkligheten. Och så fint förpackat!" },
      { name: "Fredrik T.", text: "Snabb leverans och personligt bemötande. Köper igen." },
      { name: "Elin R.", text: "Mina favoritkoppar. Tål diskmaskin också!" },
    ],
    aboutTitle: "En liten ateljé med stora drömmar",
    about: "Allt började med en drejskiva i källaren. Idag dreja vi i en gammal snickarverkstad i {ort} och skickar till hela Sverige.",
    team: [
      { name: "Lina Lera", role: "Keramiker" },
      { name: "Linn Väv", role: "Textilformgivare" },
    ],
    faq: [
      { q: "Tål keramiken diskmaskin?", a: "Ja, allt utom de handmålade serierna." },
      { q: "Hur lång är leveranstiden?", a: "1–2 vardagar inom Sverige." },
      { q: "Kan jag returnera?", a: "Ja, 30 dagars öppet köp med fri retur." },
    ],
    hours: [
      ["Ons–fre", "11–18"],
      ["Lördag", "11–15"],
    ],
    address: "Ateljévägen 3, {ort}",
    badge: ["Fri frakt", "över 500 kr"],
    feature: "Webbshop med Klarna, Swish och lagerkoll",
    demo: { slug: "forma", name: "Forma", text: "Kunden bygger sin produkt och ser priset direkt." },
  },
};

export const menu = {
  Pizza: [
    { name: "Margherita", text: "San Marzano, fior di latte, basilika", price: 135 },
    { name: "Diavola", text: "Nduja, salami, honung", price: 159 },
    { name: "Tartufo", text: "Tryffelkräm, svamp, parmesan", price: 179 },
  ],
  Pasta: [
    { name: "Carbonara", text: "Guanciale, pecorino, äggula", price: 169 },
    { name: "Cacio e pepe", text: "Pecorino, svartpeppar", price: 149 },
    { name: "Ragù", text: "Sex timmars köttfärssås, pappardelle", price: 175 },
  ],
  Dessert: [
    { name: "Tiramisu", text: "Nonnas recept", price: 89 },
    { name: "Panna cotta", text: "Hallon och citron", price: 79 },
  ],
} as const;

export const products = [
  { name: "Skål Tö", price: 249, shape: "bowl" },
  { name: "Vas Ö", price: 420, shape: "vase" },
  { name: "Kopp Morgon", price: 189, shape: "cup" },
  { name: "Linneduk", price: 590, shape: "cloth" },
] as const;

export const palettes = [
  { id: "skog", label: "Skog", primary: "#1f5f4a" },
  { id: "lila", label: "Lila", primary: "#6b3fa0" },
  { id: "hav", label: "Hav", primary: "#1d5c9c" },
  { id: "terrakotta", label: "Terrakotta", primary: "#b4512d" },
  { id: "rosa", label: "Rosa", primary: "#b83a6b" },
  { id: "kol", label: "Kol", primary: "#1c1c1e" },
] as const;

export const fonts = [
  { id: "modern", label: "Modern", heading: "var(--font-heading), Poppins, sans-serif", body: "var(--font-sans), system-ui, sans-serif", radius: 16 },
  { id: "skarp", label: "Skarp", heading: "var(--font-sans), system-ui, sans-serif", body: "var(--font-sans), system-ui, sans-serif", radius: 4 },
  { id: "klassisk", label: "Klassisk", heading: "Georgia, 'Times New Roman', serif", body: "var(--font-sans), system-ui, sans-serif", radius: 10 },
  { id: "lekfull", label: "Lekfull", heading: "var(--font-heading), Poppins, sans-serif", body: "var(--font-sans), system-ui, sans-serif", radius: 28 },
] as const;

export const heroLayouts = [
  { id: "delad", label: "Text + bild" },
  { id: "centrerad", label: "Centrerad" },
  { id: "mork", label: "Mörk helbild" },
] as const;

export const sectionOptions = [
  { id: "tjanster", label: "Tjänster" },
  { id: "widget", label: "Bokning/beställning" },
  { id: "omdomen", label: "Omdömen" },
  { id: "om", label: "Om oss" },
  { id: "faq", label: "Vanliga frågor" },
  { id: "kontakt", label: "Kontakt & karta" },
] as const;

export type SectionId = (typeof sectionOptions)[number]["id"];
export type FontId = (typeof fonts)[number]["id"];
export type HeroId = (typeof heroLayouts)[number]["id"];

// Färgskala från en enda färg: mjuk bakgrund, mörk text och mellanton.
function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map((x) => x + x).join("") : v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (rgb: number[]) => `#${rgb.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("")}`;
const mix = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t);

export function scale(primary: string) {
  const p = hexToRgb(/^#[0-9a-f]{6}$/i.test(primary) ? primary : "#1f5f4a");
  return {
    primary: toHex(p),
    soft: toHex(mix(p, [255, 255, 255], 0.9)),
    softer: toHex(mix(p, [255, 255, 255], 0.95)),
    mid: toHex(mix(p, [255, 255, 255], 0.55)),
    deep: toHex(mix(p, [0, 0, 0], 0.45)),
    ink: toHex(mix(p, [12, 14, 13], 0.85)),
  };
}
export type Scale = ReturnType<typeof scale>;
