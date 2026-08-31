import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { LegalSections, type LegalSection } from "@/components/legal/LegalSections";

export const metadata: Metadata = {
  title: "Allmänna villkor",
  description:
    "Villkoren som gäller när Lindqvist / Holmgren tar sig an ett kunduppdrag — offert, betalning, leverans, rättigheter och ansvar.",
  alternates: {
    canonical: "/allmanna-villkor",
  },
};

const sections: LegalSection[] = [
  {
    title: "Vem villkoren gäller för",
    body: [
      "Dessa villkor gäller mellan Lindqvist / Holmgren, Karlstad, och den kund (företag eller organisation) som anlitar oss för ett uppdrag inom webb, design, marknadsföring eller närliggande tjänster. Villkoren är utformade för avtal mellan näringsidkare (B2B) och gäller inte vid köp av privatpersoner.",
    ],
  },
  {
    title: "Avtal och offert",
    body: [
      "Ett avtal anses ingånget när kunden skriftligen eller muntligen accepterar en offert eller projektbeskrivning, betalar en faktura kopplad till uppdraget, eller på annat tydligt sätt instruerar oss att påbörja arbetet.",
      "Varje uppdrag utgår från en offert eller projektbeskrivning där omfattning, pris och tidsram framgår. Offerten är giltig i 30 dagar om inget annat anges.",
      "Vid motstridighet mellan offerten eller projektbeskrivningen och dessa allmänna villkor har offerten eller projektbeskrivningen företräde.",
    ],
  },
  {
    title: "Leverans, granskning och godkännande",
    body: [
      "Kunden ska granska leveransen och meddela eventuella konkreta fel eller avvikelser från avtalad omfattning inom 10 arbetsdagar från leverans. Lämnas inga sådana synpunkter inom denna tid anses leveransen godkänd.",
      "Mindre fel eller avvikelser som inte väsentligen påverkar leveransens huvudsakliga funktion eller användbarhet ger inte kunden rätt att hålla inne hela eller en oproportionerligt stor del av betalningen.",
    ],
  },
  {
    title: "Reklamation",
    body: [
      "Fel som kunden vill göra gällande ska reklameras skriftligen utan oskäligt dröjsmål efter att felet upptäckts eller borde ha upptäckts, med en tillräckligt tydlig beskrivning för att vi ska kunna undersöka det.",
      "Som fel räknas inte ny funktionalitet, ändrade önskemål, ändringar som kunden eller tredje part gjort själva, problem hos hosting, API:er eller plugins, förändringar i webbläsare eller andra tredjepartstjänster efter leverans, eller sådant som avviker från kundens förväntningar men följer den avtalade specifikationen.",
    ],
  },
  {
    title: "Ändringar och revideringsrundor",
    body: [
      "Arbete som ligger utanför den ursprungliga offerten — nya funktioner, ändrad omfattning, extra revideringsrundor — offereras separat och påverkar leveranstid. Vi kontaktar alltid kunden och stämmer av innan tilläggsarbete påbörjas och faktureras.",
      "En revideringsrunda avser ett samlat tillfälle då kunden lämnar synpunkter på en levererad version. Synpunkter som lämnas vid flera separata tillfällen kan behandlas som separata revideringsrundor.",
    ],
  },
  {
    title: "Priser och betalning",
    body: [
      "Priser anges exklusive moms om inget annat framgår. Beroende på uppdragets storlek fakturerar vi antingen ett fast pris i en eller flera delbetalningar, eller löpande på timmar enligt offerten.",
      "Betalningsvillkor beslutas från fall till fall utifrån kund och uppdrag, och anges på respektive faktura — vi tillämpar inget generellt antal dagar för alla kunder. Som norm tar vi betalt helt eller delvis i förskott innan arbetet påbörjas, särskilt för nya kunder eller större uppdrag. Omfattningen av förskottsbetalningen framgår av offerten.",
      "Om kunden anser att en faktura är felaktig ska detta meddelas skriftligen utan oskäligt dröjsmål, med angivande av vilken del som bestrids och på vilken grund. Den del av fakturan som inte är föremål för en konkret invändning ska betalas enligt ordinarie betalningsvillkor.",
      "Vid försenad betalning har vi rätt att omedelbart pausa pågående arbete, support, publicering och andra ännu inte fullgjorda prestationer till dess full betalning skett. En sådan paus innebär att tidigare angiven leveranstid upphör att gälla — ny tidsplan bestäms utifrån vår tillgänglighet vid den tidpunkten.",
      "Vid försenad betalning har vi även rätt till dröjsmålsränta enligt räntelagen samt påminnelseavgift, förseningsersättning och övriga ersättningsgilla indrivningskostnader enligt vid var tid gällande lag.",
    ],
  },
  {
    title: "Kundens medverkan, slutkontroll och stillastående projekt",
    body: [
      "För att kunna hålla en satt tidsplan behöver vi rätt underlag i tid — text, bilder, inloggningsuppgifter, godkännanden och liknande. Lämnar kunden inte efterfrågat material, besked eller godkännande inom 10 arbetsdagar har vi rätt att pausa projektet och omplanera återstående arbete efter vår tillgänglighet.",
      "Står projektet stilla på grund av kunden i mer än 30 dagar har vi rätt att fakturera utfört arbete och uppnådda milstolpar samt avsluta eller arkivera projektet. Återupptagande därefter sker enligt ny tidsplan och kan medföra en återstartsavgift om detta meddelas kunden i förväg.",
      "Kunden ansvarar för att före publicering kontrollera och godkänna innehåll såsom priser, kontaktuppgifter, juridiska texter, produktinformation, stavning och andra verksamhetsspecifika uppgifter.",
    ],
  },
  {
    title: "Immateriella rättigheter och portfolio",
    body: [
      "När uppdraget är fullt betalt övergår de ekonomiska rättigheterna till sådant upphovsrättsligt skyddat material som skapats specifikt och exklusivt för kunden inom ramen för uppdraget — design, texter och kod som skrivits för projektet — om inget annat framgår av offerten. Överlåtelsen omfattar inte våra befintliga eller generella komponenter, bibliotek, ramverk, kodmoduler, arbetsmetoder, mallar, designprinciper, verktyg, know-how eller annat material som inte skapats exklusivt för kunden.",
      "Färdiga filer, källkod, inloggningsuppgifter och publicering eller överlämning sker först när uppdraget är fullt betalt. Fram tills dess får levererat material — inklusive utkast, förhandsversioner och arbetsmaterial — inte användas, publiceras, kopieras eller spridas av kunden.",
      "Vid utebliven betalning har vi rätt att hålla inne leverans och, i den utsträckning tjänsten eller materialet tillhandahålls genom system, hosting eller andra resurser som vi kontrollerar, tillfälligt begränsa eller stänga av tillgången till den obetalda leveransen till dess betalning skett.",
      "Vi har rätt att, efter att arbetet offentliggjorts av kunden, visa den offentliga leveransen samt kundens namn och varumärke som referens i portfolio, på vår webbplats, i sociala medier och i försäljningsmaterial, om kunden inte skriftligen meddelat annat. Konfidentiell information omfattas aldrig av denna rätt.",
    ],
  },
  {
    title: "Kundens material och ansvar gentemot tredje part",
    body: [
      "Kunden ansvarar för att material som kunden tillhandahåller — texter, bilder, logotyper, varumärken, personuppgifter och annat innehåll — får användas för det avsedda ändamålet och inte gör intrång i tredje mans rättigheter.",
      "Kunden ansvarar för krav från tredje man som uppkommer till följd av material eller instruktioner som kunden tillhandahållit, i den mån kravet inte beror på vårt agerande utanför kundens instruktioner.",
    ],
  },
  {
    title: "Tredjepartslicenser och tredjepartsförändringar",
    body: [
      "Vissa delar av en leverans kan bygga på tredjepartsprodukter — typsnitt, bildbyråmaterial, plugins, hosting eller andra tjänster. Dessa omfattas av respektive leverantörs egna licensvillkor, och eventuella löpande kostnader (t.ex. hosting eller licenser) står kunden själv för om inget annat avtalats.",
      "Vi ansvarar inte för fel eller funktionsförändringar som orsakas av förändringar, begränsningar, avbrott eller uppdateringar hos tredjepartsplattformar, API:er, programvara, plugins, hostingtjänster, webbläsare eller andra externa system efter leverans. Anpassningar som krävs till följd av sådana förändringar utgör tilläggsarbete om inget annat avtalats.",
    ],
  },
  {
    title: "Marknadsförings- och SEO-tjänster",
    body: [
      "Vid marknadsförings-, SEO- och annonseringstjänster ansvarar vi för att utföra avtalade insatser professionellt, men garanterar inte ett visst ekonomiskt resultat, antal leads, försäljning, konverteringsgrad, sökordsposition eller motsvarande, om inte en uttrycklig resultatgaranti anges i offerten.",
    ],
  },
  {
    title: "Sekretess och underleverantörer",
    body: [
      "Vi behandlar information vi får ta del av i ett uppdrag konfidentiellt och delar den inte med utomstående, förutom när det krävs för att genomföra uppdraget.",
      "Vi har rätt att anlita underleverantörer för att genomföra hela eller delar av uppdraget, och ansvarar för deras arbete gentemot kunden i den omfattning som följer av avtalet. Underleverantörer är bundna av motsvarande sekretess.",
    ],
  },
  {
    title: "Personuppgifter",
    body: [
      "Om vi behandlar personuppgifter för kundens räkning i sådan omfattning att vi är personuppgiftsbiträde ska ett separat personuppgiftsbiträdesavtal ingås när detta krävs enligt tillämplig dataskyddslagstiftning.",
    ],
  },
  {
    title: "Ansvar och ansvarsbegränsning",
    body: [
      "Vi utför uppdraget med den omsorg som kan förväntas av en professionell leverantör. Vårt ansvar för eventuell skada är begränsat till vad som fakturerats för det aktuella uppdraget, och omfattar inte indirekta skador såsom utebliven vinst eller förlorad data. Vid löpande uppdrag, till exempel löpande SEO- eller supportavtal, begränsas ansvaret istället till vad som fakturerats för den berörda tjänsten under de senaste tolv månaderna.",
      "Kunden ska vidta skäliga åtgärder för att begränsa sin skada. Vi ansvarar inte för förlust eller skada som beror på kunden, tredje man, kundens egna system eller förändringar som gjorts av någon annan efter leverans.",
    ],
  },
  {
    title: "Backup och drift efter överlämning",
    body: [
      "Om löpande backup eller förvaltning inte uttryckligen ingår i uppdraget ansvarar kunden, efter överlämnande, själv för säkerhetskopiering, drift, uppdateringar och säkerhet.",
    ],
  },
  {
    title: "Force majeure",
    body: [
      "Vi ansvarar inte för förseningar eller brister som beror på omständigheter utanför vår kontroll — till exempel driftstörningar hos tredjepartsleverantörer, myndighetsbeslut eller andra force majeure-händelser.",
    ],
  },
  {
    title: "Uppsägning, avbeställning och hävning",
    body: [
      "Kunden har rätt att avbeställa ett pågående uppdrag genom skriftligt meddelande. Vid avbeställning ska kunden betala för arbete som utförts fram till avbeställningen samt för beställda eller på annat sätt bindande kostnader som inte kan avbokas. För större fastprisprojekt kan offerten ange att vissa startavgifter eller milstolpar är icke återbetalningsbara, eftersom vi då reserverat kapacitet för uppdraget.",
      "Vi har rätt att säga upp eller häva uppdraget med omedelbar verkan vid väsentligt avtalsbrott från kunden — exempelvis väsentligt försenad betalning, upprepad utebliven medverkan, olagliga instruktioner eller andra förhållanden som gör att uppdraget inte skäligen kan fortsätta. Om avtalsbrottet kan rättas till ska kunden normalt ges skälig tid att göra detta innan avtalet hävs.",
    ],
  },
  {
    title: "Tvist och tillämplig lag",
    body: [
      "Svensk lag gäller för dessa villkor. Tvist som inte kan lösas i samförstånd avgörs i första hand av allmän domstol med Värmlands tingsrätt som första instans.",
    ],
  },
  {
    title: "Ändringar av dessa villkor",
    body: [
      "Avtalet består av accepterad offert eller projektbeskrivning, dessa allmänna villkor samt andra handlingar som uttryckligen införlivats i avtalet. Ändringar eller tillägg till ett ingånget avtal ska dokumenteras skriftligen för att vara bindande.",
      "Vi kan uppdatera dessa villkor löpande. Ändringar gäller för nya uppdrag från och med publiceringsdatumet — pågående uppdrag följer de villkor som gällde vid avtalets ingående.",
    ],
  },
  {
    title: "Kontakt",
    body: ["Frågor om dessa villkor skickas till info@lindqvistholmgren.se."],
  },
];

export default function AllmannaVillkorPage() {
  return (
    <>
      <PageHero
        icon={ScrollText}
        eyebrow="Allmänna villkor"
        title="Villkor för våra kunduppdrag"
        description="Så här jobbar vi tillsammans, från offert till leverans — offert, betalning, rättigheter och ansvar. Senast uppdaterad 31 augusti 2026."
      />
      <LegalSections sections={sections} />
    </>
  );
}
