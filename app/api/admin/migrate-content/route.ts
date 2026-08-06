import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

// One-time migration of the old hardcoded lib/data/projects.ts + lib/data/articles.ts
// content into Supabase. Delete this route after running it once.

const projectRows = [
  {
    slug: "dp-rorservice",
    title: "DP Rörservice",
    category: "Webb, rebranding, design",
    summary:
      "Ny webbplats för en pålitlig VVS-firma i Mellerud, byggd för att omvandla besökare till kunder.",
    intro:
      'DP Rörservice hade ingen webbnärvaro som speglade kvaliteten på deras arbete. Vi gav dem en ny, snabb webbplats med tydlig struktur och en egen "Installerat & Klart"-lösning, så att fler besökare hittar rätt tjänst och blir kunder.',
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
      'Som en del av projektet tog vi fram en komplett "Installerat & Klart"-lösning där kunder enkelt kan se priser, välja tjänst och skicka en förfrågan direkt online.',
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
    summary:
      "Från nystartat företag till professionellt varumärke — webb, branding och trycksaker för Leta Bygg & Städ.",
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

const articleRows = [
  {
    slug: "sa-mycket-bor-en-foretagswebbplats-kosta",
    title: "Så mycket bör en företagswebbplats kosta?",
    excerpt:
      "Prislappen för en ny hemsida kan variera enormt. Här är vad som faktiskt påverkar kostnaden — och hur ni undviker att betala för mycket eller för lite.",
    category: "Webb",
    tags: ["prissättning", "budget", "webbplats"],
    icon: "wallet",
    date: "2026-01-15",
    read_time: "5 min läsning",
    content: [
      "En av de vanligaste frågorna vi får är hur mycket en ny hemsida ska kosta. Ärligt svar: det beror på — men det går att bryta ner i några tydliga delar så ni vet vad ni faktiskt betalar för.",
      "Omfattning. En enkel presentationssajt med några sidor kostar betydligt mindre än en lösning med bokningssystem, medlemsinloggning eller e-handel. Var tydliga med vad ni faktiskt behöver innan ni ber om offert.",
      "Design vs mall. Skräddarsydd design tar längre tid att ta fram än att utgå från en färdig mall, men ger er något som är unikt för just ert varumärke — och lättare att särskilja er från konkurrenter som använder samma mallar.",
      "Innehåll och texter. Om byrån ska skriva texterna åt er tar det tid och kostar därefter. Har ni redan bra underlag går processen snabbare och billigare.",
      "Teknisk komplexitet. Integrationer mot bokningssystem, betallösningar eller andra system höjer både tid och pris — men kan också spara er enormt mycket manuellt arbete i längden.",
      "Vad som händer efter lansering. Glöm inte drift, underhåll och eventuella löpande kostnader för hosting, licenser och support — det är lika viktigt som själva byggkostnaden.",
      "Det viktigaste är inte att hitta det billigaste alternativet, utan att förstå vad ni betalar för och varför. En seriös partner förklarar gärna det utan att krångla till det.",
    ],
  },
  {
    slug: "5-saker-innan-ni-valjer-wordpress",
    title: "5 saker att tänka på innan ni väljer WordPress",
    excerpt:
      "WordPress driver en stor del av världens webbplatser — men det är inte alltid rätt val. Här är vad ni bör fundera på innan ni bestämmer er.",
    category: "WordPress",
    tags: ["wordpress", "cms", "plattformsval"],
    icon: "layers",
    date: "2026-02-10",
    read_time: "4 min läsning",
    content: [
      "WordPress är ett av de mest använda systemen för att bygga webbplatser, och av goda skäl. Men precis som med alla plattformsval finns det saker värda att tänka igenom innan ni sätter igång.",
      "1. Vem ska uppdatera sidan? WordPress är starkt just för att ni själva kan redigera innehåll utan att kunna koda. Om ni vill ha full kontroll över texter och bilder är det en stor fördel.",
      "2. Vilka funktioner behöver ni? Med rätt tillägg kan WordPress hantera det mesta — bokning, medlemskap, e-handel via WooCommerce. Men fler tillägg betyder också fler saker som kan behöva underhållas.",
      "3. Säkerhet och uppdateringar. Som ett av världens mest använda system är WordPress också ett vanligt mål för attacker. Regelbundna uppdateringar och bra hosting är inte valfritt, det är nödvändigt.",
      "4. Prestanda. Ett tungt bygge med för många tillägg kan bli långsamt om det inte optimeras. Rätt uppsatt är WordPress dock snabbt och pålitligt.",
      "5. Långsiktig plan. Fungerar plattformen om ni växer, byter riktning eller vill lägga till nya funktioner om några år? Bygg med det i åtanke redan från start.",
      "WordPress är rätt val för många småföretag — men det är värt att ta ett aktivt beslut snarare än att välja det bara för att det är vanligast.",
    ],
  },
  {
    slug: "varfor-anvandarupplevelsen-avgor-konvertering",
    title: "Varför användarupplevelsen avgör om besökare blir kunder",
    excerpt:
      "Snygg design räcker inte om besökaren inte hittar det de letar efter. Så påverkar UX er konvertering i praktiken.",
    category: "UX",
    tags: ["ux", "konvertering", "användbarhet"],
    icon: "mouse-pointer-click",
    date: "2026-03-05",
    read_time: "4 min läsning",
    content: [
      "Många tänker på hemsidor i termer av hur de ser ut. Minst lika viktigt är hur de känns att använda — det är det UX (User Experience) handlar om.",
      "Tydlig struktur. Besökare ska förstå var de är och vart de kan gå på några sekunder. Otydlig navigering skapar friktion, och friktion kostar kunder.",
      "Snabbhet. En sida som tar för lång tid att ladda eller känns trög att klicka runt i får besökare att lämna innan de ens sett vad ni erbjuder.",
      "Tydliga vägar till handling. Vill ni att besökaren ska ringa, boka eller köpa? Gör det uppenbart vad nästa steg är, på varje sida.",
      "Mobilupplevelse. De flesta besökare kommer via mobilen. En upplevelse som bara är testad på desktop missar majoriteten av trafiken.",
      "Konsekvens. Färger, knappar och mönster som beter sig likadant genom hela sajten gör att besökare snabbt lär sig hur den fungerar — vilket bygger förtroende.",
      "God UX syns sällan direkt, men märks tydligt i statistiken: lägre avvisningsfrekvens, fler förfrågningar och besökare som stannar längre.",
    ],
  },
  {
    slug: "statisk-webbplats-eller-cms",
    title: "Statisk webbplats eller CMS — vad passar ert företag?",
    excerpt:
      "Ska innehållet vara hårdkodat eller redigerbart via ett admin-system? Här är skillnaden, och när ni bör välja vad.",
    category: "Utveckling",
    tags: ["cms", "prestanda", "plattformsval"],
    icon: "git-compare",
    date: "2026-03-22",
    read_time: "4 min läsning",
    content: [
      "En återkommande fråga i uppstarten av ett projekt är om webbplatsen ska byggas statiskt eller med ett CMS (innehållshanteringssystem). Båda har sina styrkor.",
      "Statisk webbplats. Innehållet byggs in direkt i koden. Det ger extremt snabba laddtider och hög säkerhet, men kräver utvecklarhjälp för att ändra text eller bilder.",
      "CMS-lösning. System som WordPress ger er själva möjlighet att uppdatera innehåll, lägga till sidor och byta bilder utan att koda. Flexibelt, men med lite mer att underhålla.",
      "När passar statiskt bäst? Om innehållet sällan ändras och prestanda är avgörande — till exempel en enklare kampanjsida eller presentationssajt.",
      "När passar ett CMS bäst? Om ni regelbundet publicerar nytt innehåll, som artiklar, erbjudanden eller produkter, och vill kunna göra det själva.",
      "Det finns även mellanting, som headless CMS-lösningar, där ni får både redigeringsmöjligheter och hög prestanda — men med högre teknisk komplexitet.",
      "Rätt val handlar inte om vad som är populärast, utan om hur ni faktiskt kommer använda webbplatsen dag till dag.",
    ],
  },
  {
    slug: "sa-bygger-ni-en-grafisk-profil-som-haller",
    title: "Så bygger ni en grafisk profil som håller i längden",
    excerpt: "En bra grafisk profil är mer än en fin logotyp. Så tar ni fram en identitet som växer med företaget.",
    category: "Design",
    tags: ["grafisk-profil", "varumärke", "logotyp"],
    icon: "palette",
    date: "2026-04-18",
    read_time: "5 min läsning",
    content: [
      "En grafisk profil är summan av hur ert varumärke ser ut och känns — logotyp, färger, typografi och bildspråk. Görs den rätt håller den i många år.",
      'Börja med varumärket, inte logotypen. Vad ska företaget stå för? Vilka känslor ska det väcka? En logotyp som byggs på en tydlig grund blir starkare än en som bara ska "se snygg ut".',
      "Färger som fungerar överallt. Tänk igenom hur färgerna fungerar i tryck, på skärm, på fordon och på arbetskläder — inte bara på en digital skärm.",
      "Typografi som går att läsa. Snygga typsnitt som är svåra att läsa i mindre storlekar skapar problem i praktiken, särskilt i trycksaker och på mobil.",
      "Riktlinjer, inte bara filer. En bra profil innehåller tydliga riktlinjer för hur logotypen får användas, vilka färgkombinationer som fungerar och vad som bör undvikas.",
      "Bygg för framtiden. En profil som är för trendig riskerar att kännas daterad om några år. Sikta på tidlöst snarare än det som är hippast just nu.",
      "En genomtänkt grafisk profil sparar er tid och pengar i längden — ni slipper göra om jobbet varje gång ni tar fram nytt material.",
    ],
  },
  {
    slug: "sokordsanalys-for-nyborjare",
    title: "Sökordsanalys för nybörjare: så hittar ni rätt sökord",
    excerpt:
      "Rätt sökord gör skillnaden mellan att synas för rätt kunder eller att bli osynliga i mängden. Så kommer ni igång.",
    category: "SEO",
    tags: ["sökordsanalys", "seo", "innehåll"],
    icon: "search",
    date: "2026-05-09",
    read_time: "4 min läsning",
    content: [
      "Sökordsanalys handlar om att ta reda på vad era potentiella kunder faktiskt söker efter — och sedan bygga innehåll utifrån det, istället för att gissa.",
      'Tänk som kunden, inte som företaget. Ni kanske säger "badrumsrenovering" internt, men kunder kan lika gärna söka på "renovera badrum pris" eller "badrumsfirma nära mig".',
      "Långsvansade sökord. Längre, mer specifika sökfraser har ofta lägre konkurrens och högre köpintention än korta, generella ord — och är enklare att ranka för som mindre företag.",
      "Lokal koppling. Lägg till ort eller region i relevant innehåll om era kunder är lokala. Det gör stor skillnad för vilka sökningar ni faktiskt syns i.",
      "Använd gratisverktyg. Google Search Console och Google:s egna sökförslag ger gratis insikt i vad folk faktiskt söker på, utan dyra verktyg.",
      "Skriv för människor, optimera för sökmotorer. Bra innehåll som faktiskt svarar på frågan vinner i längden — sökord ska stötta texten, inte styra den helt.",
      "Sökordsanalys är inget man gör en gång — det är en pågående process som blir bättre ju mer ni lär er om hur era kunder faktiskt söker.",
    ],
  },
  {
    slug: "tecken-pa-att-din-hemsida-kostar-dig-kunder",
    title: "5 tecken på att din hemsida kostar dig kunder",
    excerpt:
      "Många småföretag förlorar kunder utan att ens veta om det. Här är fem vanliga varningstecken — och vad ni kan göra åt dem.",
    category: "Webb",
    tags: ["konvertering", "webbplats", "ux"],
    icon: "triangle-alert",
    date: "2026-06-12",
    read_time: "4 min läsning",
    content: [
      "Er hemsida är ofta det första en potentiell kund möter av ert företag — långt innan de ringer eller besöker er. Om det första intrycket haltar tappar ni kunder ni aldrig ens visste fanns.",
      "1. Långa laddtider. Besökare väntar inte. Tar det för lång tid innan sidan visas hinner de lämna innan de ens sett vad ni erbjuder.",
      "2. Dålig mobilanpassning. De flesta hittar er via mobilen. Är sidan svår att navigera, för liten text eller trasig layout på mobil förlorar ni dem direkt.",
      "3. Otydligt vad ni faktiskt erbjuder. Besökare ska på några sekunder förstå vad ni gör och för vem. Är budskapet otydligt går de vidare till en konkurrent.",
      "4. Föråldrad design. Rätt eller fel — en daterad hemsida får besökare att ifrågasätta om företaget bakom är lika daterat.",
      "5. Svårt att hitta kontaktuppgifter. Om det tar mer än några sekunder att hitta telefonnummer, e-post eller ett kontaktformulär har ni redan tappat en del av besökarna.",
      "Känner ni igen något av detta är ni inte ensamma — det är några av de vanligaste anledningarna till att vi kontaktas. Hör gärna av er så tittar vi tillsammans på vad som går att förbättra.",
    ],
  },
  {
    slug: "grunderna-for-en-e-handel-som-konverterar",
    title: "Grunderna för en e-handel som faktiskt konverterar",
    excerpt: "Trafik räcker inte om besökarna inte handlar. Så bygger ni en e-handel som omvandlar besök till försäljning.",
    category: "E-handel",
    tags: ["e-handel", "konvertering", "produktsidor"],
    icon: "shopping-cart",
    date: "2026-06-25",
    read_time: "5 min läsning",
    content: [
      "Att driva trafik till en e-handel är bara halva jobbet — resten handlar om att göra det så enkelt som möjligt att faktiskt handla.",
      "Tydliga produktsidor. Bra bilder, tydliga beskrivningar och synlig information om pris, frakt och leveranstid gör att kunder känner sig trygga i sitt köp.",
      "Enkel kassa. Varje extra steg i kassan är en chans för kunden att hoppa av. Minimera antal klick och erbjud gärna köp som gäst, utan tvingande kontoskapande.",
      "Tydliga fraktvillkor. Oväntade fraktkostnader i sista steget är en av de vanligaste anledningarna till att kunder överger sin varukorg.",
      "Förtroendesignaler. Recensioner, tydliga kontaktuppgifter och en professionell design signalerar att det är ett seriöst företag att handla från.",
      "Mobilanpassning. En stor del av e-handel sker via mobilen — är kassan krånglig att fylla i på en liten skärm tappar ni försäljning direkt.",
      "Små förbättringar i varje steg av köpresan adderar upp till en betydligt högre konverteringsgrad över tid.",
    ],
  },
  {
    slug: "sa-valjer-du-ratt-digital-partner",
    title: "Så väljer du rätt digital partner för ditt företag",
    excerpt: "Att anlita en byrå är ett förtroende. Här är vad ni bör tänka på innan ni bestämmer er.",
    category: "Rådgivning",
    tags: ["byråval", "samarbete", "rådgivning"],
    icon: "handshake",
    date: "2026-07-03",
    read_time: "5 min läsning",
    content: [
      "Det finns gott om byråer och frilansare att välja mellan, och det kan vara svårt att veta vad som faktiskt spelar roll. Här är några saker värda att tänka på innan ni skriver under.",
      "Vem pratar ni med? Ta reda på om ni kommer prata direkt med den som faktiskt gör jobbet, eller om det finns projektledare och säljare i vägen som gör kommunikationen längre och dyrare.",
      "Titta på tidigare arbete. Be om exempel på liknande projekt. Det säger ofta mer om kvalitet och stil än vad ett säljsamtal gör.",
      "Fråga om processen. En seriös partner kan förklara hur ett projekt går till, från första mötet till lansering, utan luddiga svar.",
      "Var tydlig med budget tidigt. Bra samarbeten bygger på ärlighet om vad som är möjligt inom er budget — inte på att pressa in allt i ett för lågt pris.",
      "Lita på magkänslan. Om kommunikationen känns trög eller otydlig redan innan ni skrivit avtal är det sällan bättre senare i projektet.",
      "I slutändan handlar det om förtroende — att veta att någon bryr sig lika mycket om resultatet som ni gör.",
    ],
  },
  {
    slug: "varfor-lokal-seo-spelar-roll",
    title: "Varför lokal SEO spelar roll för småföretag i Värmland",
    excerpt: "Om era kunder är lokala ska er sökmotoroptimering också vara det. Så funkar lokal SEO i praktiken.",
    category: "SEO",
    tags: ["lokal-seo", "seo", "google-business"],
    icon: "map-pin",
    date: "2026-07-28",
    read_time: "4 min läsning",
    content: [
      'Söker någon efter "VVS Karlstad" eller "städfirma Värmland" vill ni synas — inte konkurrenten i en annan del av landet. Det är precis vad lokal SEO handlar om.',
      "Google Business-profil. Det enskilt viktigaste steget för lokala företag. En komplett och uppdaterad profil med rätt kategori, öppettider och bilder gör stor skillnad för synlighet i Google Maps och lokala sökresultat.",
      'Lokala nyckelord. Istället för att bara optimera för "badrumsrenovering" bör innehållet även prata om "badrumsrenovering i Karlstad" — det matchar bättre mot hur människor faktiskt söker.',
      "Recensioner. Fler positiva recensioner på Google stärker både förtroende hos besökare och er placering i sökresultaten.",
      "Lokala omnämnanden. Länkar och omnämnanden från andra lokala aktörer, branschsajter och kataloger signalerar till Google att ni är en relevant, etablerad aktör i regionen.",
      "Lokal SEO är sällan en engångsinsats utan något som byggs upp över tid — men för ett litet företag med lokala kunder är det ofta den mest lönsamma marknadsföringen som finns.",
    ],
  },
  {
    slug: "sa-satter-ni-en-marknadsforingsbudget-som-fungerar",
    title: "Så sätter ni en marknadsföringsbudget som faktiskt fungerar",
    excerpt: "Att gissa sig fram till en marknadsföringsbudget är ett dyrt sätt att lära sig. Så tänker ni istället.",
    category: "Marknadsföring",
    tags: ["marknadsföring", "budget", "strategi"],
    icon: "piggy-bank",
    date: "2026-08-01",
    read_time: "5 min läsning",
    content: [
      "Många småföretag sätter sin marknadsföringsbudget utifrån vad som blir över, snarare än vad som faktiskt behövs för att nå målen. Det brukar bli dyrt i längden.",
      "Utgå från mål, inte kanaler. Bestäm först vad ni vill uppnå — fler förfrågningar, mer varumärkeskännedom, fler återkommande kunder — innan ni väljer var pengarna ska läggas.",
      "Räkna på kundvärde. Vad är en ny kund värd för er över tid? Det ger en realistisk bild av hur mycket ni har råd att investera för att få in en ny kund.",
      "Testa i mindre skala först. Innan ni satsar en stor summa på en kanal, testa i liten skala och mät resultatet innan ni skalar upp.",
      "Blanda kort och lång sikt. Betald annonsering ger snabbare resultat men kräver löpande investering. SEO och innehåll tar längre tid men bygger värde som stannar kvar.",
      "Mät och justera. En budget är aldrig statisk — följ upp vad som faktiskt ger resultat och flytta pengar dit, snarare än att låsa fast er vid en plan i förväg.",
      "En genomtänkt budget handlar mindre om hur mycket ni spenderar, och mer om att spendera på rätt saker.",
    ],
  },
];

function toHtml(paragraphs: string[]) {
  return paragraphs
    .map((paragraph) => `<p>${paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
}

export async function POST() {
  await verifySession();

  const supabase = createServiceRoleClient();

  const { error: projectsError } = await supabase
    .from("projects")
    .upsert(projectRows, { onConflict: "slug" });

  const { error: articlesError } = await supabase.from("articles").upsert(
    articleRows.map((article) => ({ ...article, content: toHtml(article.content) })),
    { onConflict: "slug" },
  );

  if (projectsError || articlesError) {
    return NextResponse.json({ projectsError, articlesError }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    projects: projectRows.length,
    articles: articleRows.length,
  });
}
