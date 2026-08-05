import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "dp-rorservice",
    title: "DP Rörservice",
    category: "Webb, rebranding, design",
    summary:
      "Ny webbplats för en pålitlig VVS-firma i Mellerud, byggd för att omvandla besökare till kunder.",
    intro:
      "DP Rörservice hade ingen webbnärvaro som speglade kvaliteten på deras arbete. Vi gav dem en ny, snabb webbplats med tydlig struktur och en egen \"Installerat & Klart\"-lösning, så att fler besökare hittar rätt tjänst och blir kunder.",
    image: "/images/portfolio-images/dp-rorservice/dp-rorservice-thumbnail.png",
    gallery: [
      "/images/portfolio-images/dp-rorservice/dp-rorservice-01.png",
      "/images/portfolio-images/dp-rorservice/dp-rorservice-02.png",
      "/images/portfolio-images/dp-rorservice/dp-rorservice-03.png",
    ],
    client: "DP Rörservice",
    industry: "VVS",
    services: "Webbdesign, utveckling",
    launch: "Mars 2025",
    platform: "WordPress",
    challenge:
      "Den tidigare webbplatsen hade ingen tydlig struktur, vilket gjorde det svårt för besökare att förstå och hitta rätt bland företagets tjänster. DP Rörservice ville dessutom kunna sälja standardiserade VVS-installationer utan långa offertprocesser.",
    solution: [
      "Vi designade och utvecklade en ny webbplats med fokus på användarupplevelse, tydlig navigering och konvertering.",
      "Som en del av projektet tog vi fram en komplett \"Installerat & Klart\"-lösning där kunder enkelt kan se priser, välja tjänst och skicka en förfrågan direkt online.",
    ],
    stats: [
      { value: "+250%", label: "Fler organiska besökare" },
      { value: "+63%", label: "Fler förfrågningar via webbplatsen" },
      { value: "100%", label: "Mobilanpassad webbplats" },
      { value: "-45%", label: "Lägre avvisningsfrekvens" },
    ],
  },
  {
    slug: "varmlands-svets-montage",
    title: "Värmlands Svets & Montage",
    category: "Logotyp, branding",
    summary: "Ny grafisk identitet och logotyp för ett svets- och montageföretag i regionen.",
    intro:
      "Värmlands Svets & Montage saknade en enhetlig visuell identitet som kunde kommunicera kvalitet och lokal förankring. Vi tog fram en logotyp och grafisk profil som känns robust och professionell, och som fungerar lika bra på fordon och arbetskläder som i digitala kanaler.",
    image:
      "/images/portfolio-images/varmlands-svets-montage/varmlands-svets-montage-thumbnail.png",
    gallery: [
      "/images/portfolio-images/varmlands-svets-montage/varmlands-svets-montage-01.png",
      "/images/portfolio-images/varmlands-svets-montage/varmlands-svets-montage-visitkort.png",
      "/images/portfolio-images/varmlands-svets-montage/varmlands-svets-montage-vector.png",
    ],
    client: "Värmlands Svets & Montage",
    industry: "Industriservice",
    services: "Varumärkesutveckling",
    launch: "Oktober 2024",
    platform: "Adobe",
    challenge:
      "Företaget saknade en enhetlig identitet som kunde kommunicera kvalitet, erfarenhet och lokal förankring. Varumärket behövde kännas robust och pålitligt, samtidigt som det skulle sticka ut i en traditionell bransch.",
    solution: [
      "Vi tog fram en logotyp där företagets geografiska hemvist integreras direkt i formspråket genom silhuetten av Värmland.",
      "Tillsammans med en exklusiv färgpalett, typografi och tydliga proportioner skapade vi ett uttryck som känns både modernt och etablerat.",
    ],
    stats: [
      { value: "3+", label: "Logotypvarianter framtagna" },
      { value: "100%", label: "Anpassad identitet för verksamheten" },
      { value: "3", label: "Trycksaker producerade och levererade" },
      { value: "Redo", label: "För tryck, profilering och marknadsföring" },
    ],
  },
  {
    slug: "hemsem",
    title: "Hemsem",
    category: "Plattform, e-handel",
    summary: "En skräddarsydd kunskapsplattform, byggd från grunden med egen admin och e-handel.",
    intro:
      "Hemsem behövde en plattform som gick utöver vad färdiga mallar kunde erbjuda — en samlad lösning för kunskapsbank, community och e-handel. Vi byggde allt från grunden, med Stripe-integration och ett omfattande adminsystem för produkter, medlemmar och beställningar.",
    image: "/images/portfolio-images/hemsem/hemsem-thumbnail.png",
    gallery: [
      "/images/portfolio-images/hemsem/hemsem-dashboard.png",
      "/images/portfolio-images/hemsem/hemsem-community.png",
      "/images/portfolio-images/hemsem/hemsem-slides.png",
    ],
    client: "Hemsem",
    industry: "Hälsa & e-handel",
    services: "UX/UI, utveckling",
    launch: "Mars 2026",
    platform: "Skräddarsytt system & e-handel",
    challenge:
      "Hemsem behövde en skalbar digital plattform som kunde samla kunskap, community och e-handel i en och samma lösning. Utmaningen var att skapa en trygg och användarvänlig upplevelse för flera olika målgrupper, samtidigt som administration, innehållshantering och beställningsflöden behövde fungera sömlöst bakom kulisserna.",
    solution: [
      "Vi designade och utvecklade en skräddarsydd plattform med kunskapsbank, medlemscommunity, e-handel och administrativa verktyg. Plattformen ger användarna tillgång till relevant information, möjlighet att interagera med andra medlemmar samt beställa produkter genom ett integrerat köpsystem.",
      "Utöver den publika plattformen byggde vi ett omfattande administrationssystem för hantering av produkter, artiklar, medlemmar, beställningar och kommunikation. Lösningen integrerades med Stripe för betalningar och byggdes med fokus på skalbarhet, användarupplevelse och framtida vidareutveckling.",
    ],
    stats: [
      { value: "1", label: "Samlad digital plattform" },
      { value: "100%", label: "Byggd från grunden" },
      { value: "3", label: "Moduler: kunskap, community & handel" },
      { value: "24/7", label: "Tillgänglig för kunder online" },
    ],
  },
  {
    slug: "flackfri-flyttstad",
    title: "Fläckfri Flyttstäd",
    category: "Webb, branding",
    summary: "Nytt varumärke, webbplats och interaktiv prisgenerator för en flyttstädfirma i Göteborg.",
    intro:
      "Fläckfri Flyttstäd startade från grunden och behövde allt som krävs för att etablera sig på marknaden. Vi byggde logotyp, grafisk profil och en skräddarsydd webbplats — och programmerade en interaktiv prisgenerator som gör det enkelt för kunder att räkna ut pris innan de bokar.",
    image: "/images/portfolio-images/flackfri-flyttstad/flackfri-flyttstad-thumbnail.png",
    gallery: [
      "/images/portfolio-images/flackfri-flyttstad/flackfri-flyttstad-01.jpg",
      "/images/portfolio-images/flackfri-flyttstad/flackfri-flyttstad-visitkort.png",
    ],
    client: "Fläckfri Flyttstäd",
    industry: "Flytt & städ",
    services: "Webb, branding",
    launch: "Februari 2025",
    platform: "WordPress",
    challenge:
      "Fläckfri Flyttstäd saknade både identitet, webbplats och marknadsföringsmaterial. Utmaningen var att skapa ett trovärdigt varumärke som kunde konkurrera med etablerade aktörer, samtidigt som kundresan skulle vara så enkel som möjligt.",
    solution: [
      "Vi tog fram företagets logotyp och grafiska profil med fokus på renhet, tydlighet och igenkänning. Därefter designade och utvecklade vi en skräddarsydd WordPress-webbplats där besökaren snabbt förstår tjänsterna och kan komma i kontakt med företaget.",
      "Som en del av lösningen programmerade vi även en interaktiv prisgenerator för flyttstäd, som gör det möjligt för kunder att själva räkna ut ett uppskattat pris innan offertförfrågan skickas — vilket skapar en smidigare upplevelse och minskar administrationen.",
    ],
    stats: [
      { value: "1:a", label: "Interaktiv prisgenerator i branschen" },
      { value: "100%", label: "Ny digital närvaro från grunden" },
      { value: "5+", label: "Design- och utvecklingsleverabler" },
      { value: "24/7", label: "Möjlighet att beräkna pris online" },
    ],
  },
  {
    slug: "rb-svetsteknik",
    title: "RB Svetsteknik",
    category: "Webb, branding, trycksaker",
    summary: "Vidareutvecklad varumärkesidentitet och ny webbplats för ett svets- och stålkonstruktionsföretag.",
    intro:
      "RB Svetsteknik hade en logotyp men saknade både tydliga varumärkesriktlinjer och en digital närvaro. Vi vidareutvecklade identiteten till en komplett grafisk profil och byggde en ny webbplats som bättre speglar kompetensen inom svetsning och industriservice.",
    image: "/images/portfolio-images/rb-svetsteknik/rb-svetsteknik-thumbnail.png",
    gallery: [
      "/images/portfolio-images/rb-svetsteknik/rb-svetsteknik-01.png",
      "/images/portfolio-images/rb-svetsteknik/rb-svetsteknik-02.png",
      "/images/portfolio-images/rb-svetsteknik/rb-svetsteknik-03.png",
    ],
    client: "RB Svetsteknik",
    industry: "Svets & stålkonstruktion",
    services: "Varumärkesutveckling & webb",
    launch: "Augusti 2024",
    platform: "Hårdkodad",
    challenge:
      "Företaget hade en befintlig logotyp men saknade tydliga riktlinjer för hur varumärket skulle användas. Webbplats saknades helt och marknadsföringsmaterialet hade ingen enhetlig struktur — målet var ett professionellt uttryck som bättre speglar kompetensen inom svetsning, stålkonstruktion och industriservice.",
    solution: [
      "Vi vidareutvecklade den befintliga logotypen till en komplett grafisk identitet med typografi, färgpalett och visuella riktlinjer.",
      "Parallellt designade och utvecklade vi en ny webbplats med fokus på användarupplevelse, tydlig kommunikation och konvertering. Företagets befintliga bilder bearbetades och användes genomgående i marknadsföringsmaterial och webbdesign för ett mer sammanhållet helhetsintryck.",
    ],
    stats: [
      { value: "100%", label: "Mobilanpassad webbplats" },
      { value: "1", label: "Sammanhållen identitet för verksamheten" },
      { value: "5+", label: "Design- och utvecklingsleverabler" },
      { value: "Redo", label: "För digital marknadsföring och fortsatt tillväxt" },
    ],
  },
  {
    slug: "ojalas-fonsterputs",
    title: "Ojalas Fönsterputs",
    category: "Logotyp, branding, trycksaker",
    summary: "Ny visuell identitet, logotyp och trycksaker för ett nystartat fönsterputsföretag.",
    intro:
      "Som nystartat företag saknade Ojalas Fönsterputs en visuell identitet som kunde skapa förtroende. Vi tog fram en unik logotyp och grafisk profil, samt visitkort och flygblad, för en konsekvent upplevelse i alla kundmöten.",
    image: "/images/portfolio-images/ojalas-fonsterputs/ojalas-fonsterputs-thumbnail.png",
    gallery: [
      "/images/portfolio-images/ojalas-fonsterputs/ojalas-fonsterputs-logotyp.png",
      "/images/portfolio-images/ojalas-fonsterputs/ojalas-fonsterputs-flyers.png",
      "/images/portfolio-images/ojalas-fonsterputs/ojalas-fonsterputs-trycksaker.png",
    ],
    client: "Ojalas Fönsterputs",
    industry: "Fönsterputs",
    services: "Logotyp, branding, trycksaker",
    launch: "Augusti 2024",
    platform: "Adobe",
    challenge:
      "Som nystartat företag saknade Ojalas Fönsterputs en visuell identitet som kunde skapa förtroende och ge verksamheten ett professionellt uttryck. Varumärket behövde fungera lika bra på arbetskläder och fordon som på trycksaker och marknadsföringsmaterial.",
    solution: [
      "Vi tog fram en unik logotyp inspirerad av företagets kärnverksamhet och utvecklade en grafisk profil med tydliga färger, typografi och riktlinjer.",
      "Utöver logotypen producerade vi visitkort, flygblad och profilmaterial för att skapa en konsekvent upplevelse i alla kundmöten.",
    ],
    stats: [
      { value: "5+", label: "Designleverabler producerade" },
      { value: "100%", label: "Sammanhållen visuell identitet" },
      { value: "3", label: "Logotypvarianter för olika användningsområden" },
      { value: "Redo", label: "För tryck, profilering och marknadsföring" },
    ],
  },
  {
    slug: "leta-bygg-stad",
    title: "Leta Bygg & Städ",
    category: "Webb, branding, trycksaker",
    summary: "Från nystartat företag till professionellt varumärke — webb, branding och trycksaker för Leta Bygg & Städ.",
    intro:
      "Leta Bygg & Städ hade kompetensen och tjänsterna på plats, men saknade ett professionellt varumärke och verktygen för att synas. Vi byggde en grafisk profil, en modern webbplats och trycksaker som skapar förtroende hos nya kunder redan från dag ett.",
    image: "/images/portfolio-images/leta-bygg-stad/leta-bygg-stad-thumbnail.png",
    gallery: [
      "/images/portfolio-images/leta-bygg-stad/leta-bygg-stad-branding.png",
      "/images/portfolio-images/leta-bygg-stad/leta-bygg-stad-sammanfattning.png",
      "/images/portfolio-images/leta-bygg-stad/leta-bygg-stad-visitkort.png",
    ],
    client: "Leta Bygg & Städ",
    industry: "Städ och bygg",
    services: "Branding, webb",
    launch: "Oktober 2024",
    platform: "WordPress",
    challenge:
      "Leta Bygg & Städ stod inför en utmaning som många nystartade företag möter: kompetensen och tjänsterna fanns på plats, men det professionella varumärket och verktygen för att synas och skapa förtroende hos nya kunder saknades.",
    solution: [
      "Vi tog fram en tydlig grafisk profil som speglar företagets verksamhet och värderingar, och byggde därefter en modern webbplats med fokus på tydlighet, användarvänlighet och konvertering.",
      "För att stärka närvaron ytterligare producerade vi trycksaker och marknadsföringsmaterial, samt hjälpte till med innehåll och strategi för sociala medier.",
    ],
    stats: [
      { value: "+100%", label: "Professionell digital närvaro" },
      { value: "4", label: "Leverabler: webb, branding, trycksaker, marknadsföring" },
      { value: "1 vecka", label: "Från idé till lansering digitalt" },
      { value: "Redo", label: "Att ta emot kunder och förfrågningar" },
    ],
  },
];
