import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "webb",
    title: "Webb",
    description: "Snabba, responsiva webbplatser byggda för att konvertera besökare till kunder.",
    intro:
      "En hemsida är ofta första intrycket kunder får av ert företag. Vi bygger snabba, moderna och lättnavigerade webbplatser som fungerar lika bra på mobilen som på datorn — och som är gjorda för att omvandla besökare till förfrågningar och kunder.",
    heroHeadline:
      "En hemsida ska göra jobbet med att sälja, inte bara se fin ut. Det handlar om resultat.",
    heroAccentWord: "resultat",
    features: [
      {
        icon: "layout-template",
        title: "Design utifrån ert varumärke",
        description:
          "Ingen färdig mall — vi bygger en hemsida som känns som ert företag, inte som tusen andra.",
      },
      {
        icon: "smartphone",
        title: "Snabb laddtid och mobilanpassning",
        description:
          "Sidan fungerar lika bra i mobilen som på datorn, med laddtider som inte skrämmer bort besökare.",
      },
      {
        icon: "search",
        title: "Sökmotoroptimerad grundstruktur",
        description:
          "Rätt teknisk grund från start, så ni slipper bygga om för att synas i Google senare.",
      },
      {
        icon: "file-text",
        title: "Enkel administration av innehåll",
        description: "Ni uppdaterar texter, bilder och sidor själva utan att kunna koda.",
      },
      {
        icon: "target",
        title: "Tydliga kontaktvägar och call-to-actions",
        description:
          "Genomtänkta vägar till kontakt genom hela sajten, så besökare faktiskt hör av sig.",
      },
    ],
    process: [
      {
        icon: "target",
        title: "Behovsanalys",
        description:
          "Vi lär känna er verksamhet, era kunder och vad hemsidan faktiskt ska åstadkomma.",
      },
      {
        icon: "layout-template",
        title: "Design & struktur",
        description:
          "Vi tar fram struktur och design utifrån varumärket och det besökare ska göra på sidan.",
      },
      {
        icon: "code-2",
        title: "Utveckling",
        description:
          "Sidan byggs med fokus på hastighet, mobilanpassning och en solid teknisk grund.",
      },
      {
        icon: "rocket",
        title: "Lansering & uppföljning",
        description: "Vi lanserar, testar och finns kvar som stöd efter lansering.",
      },
    ],
    faq: [
      {
        question: "Hur lång tid tar det att bygga en ny hemsida?",
        answer:
          "Oftast mellan 3–8 veckor beroende på omfattning. Ni får en tydlig tidsplan redan i uppstarten.",
      },
      {
        question: "Kan jag uppdatera hemsidan själv efteråt?",
        answer:
          "Ja, vi bygger med enkla adminverktyg så ni kan uppdatera texter, bilder och sidor utan att kunna koda.",
      },
      {
        question: "Vilken plattform bygger ni på?",
        answer:
          "Det varierar utifrån era behov — vi väljer den lösning som passar er bäst, inte den vi råkar gilla mest.",
      },
      {
        question: "Kan ni bygga vidare på min befintliga hemsida?",
        answer:
          "I vissa fall ja, men ofta är en ny teknisk grund mer lönsam i längden. Vi ger er ett ärligt svar utifrån ert läge.",
      },
      {
        question: "Ingår SEO när ni bygger en hemsida?",
        answer:
          "Ja, alla hemsidor vi bygger får en sökmotoroptimerad grundstruktur. Vill ni ha djupare SEO-arbete löpande erbjuder vi det som en egen tjänst.",
      },
    ],
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Sökmotoroptimering som gör att fler kunder hittar er på Google.",
    intro:
      "Att ha en fin hemsida räcker inte om ingen hittar den. Vi optimerar er webbplats tekniskt och innehållsmässigt så att ni syns högre upp i Google för de sökord som faktiskt ger kunder.",
    heroHeadline: "Synas på Google är ingen slump. Det är strategi.",
    heroAccentWord: "strategi",
    titleLower: "SEO",
    features: [
      {
        icon: "search",
        title: "Sökordsanalys som utgångspunkt",
        description:
          "Vi kartlägger vilka sökord som faktiskt driver kunder till er bransch, inte bara vilka som ger mest trafik.",
      },
      {
        icon: "gauge",
        title: "Teknisk SEO och sidhastighet",
        description:
          "Vi städar upp det som håller tillbaka rankingen: laddtider, struktur, mobilanpassning och crawlbarhet.",
      },
      {
        icon: "file-text",
        title: "Innehåll som rankar",
        description:
          "Befintliga och nya sidor optimeras utifrån vad besökaren faktiskt söker efter, inte bara nyckelordstäthet.",
      },
      {
        icon: "map-pin",
        title: "Lokal SEO för Karlstad och Värmland",
        description:
          "Google Business-profil, lokala sökord och citations som gör att ni syns när kunder söker i närheten.",
      },
      {
        icon: "line-chart",
        title: "Uppföljning och rapportering",
        description:
          "Tydlig, regelbunden rapportering så ni ser vad som faktiskt förbättras i sökresultaten över tid.",
      },
    ],
    process: [
      {
        icon: "search",
        title: "Nulägesanalys",
        description:
          "Vi går igenom hur ni syns idag — tekniskt, innehållsmässigt och jämfört med konkurrenter.",
      },
      {
        icon: "target",
        title: "Sökordsstrategi",
        description: "Vi identifierar sökorden som faktiskt ger kunder, inte bara trafik.",
      },
      {
        icon: "gauge",
        title: "Optimering",
        description: "Teknisk SEO, sidhastighet och innehåll optimeras utifrån strategin.",
      },
      {
        icon: "line-chart",
        title: "Uppföljning",
        description:
          "Vi mäter resultat löpande och justerar insatserna efter vad som faktiskt fungerar.",
      },
    ],
    faq: [
      {
        question: "Hur lång tid tar det innan SEO ger resultat?",
        answer:
          "Oftast börjar ni se förbättringar efter 2–4 månader, men SEO är ett långsiktigt arbete — de bästa resultaten byggs upp över 6–12 månader.",
      },
      {
        question: "Vad är skillnaden mellan SEO och Google Ads?",
        answer:
          "SEO handlar om att synas organiskt utan att betala per klick, medan Google Ads är betald annonsering som ger direkt synlighet. Många kombinerar båda.",
      },
      {
        question: "Behöver jag en ny hemsida för att SEO ska fungera?",
        answer:
          "Inte nödvändigtvis. Ofta räcker det med tekniska och innehållsmässiga förbättringar på er nuvarande sida, men i vissa fall är en ny grund det mest lönsamma valet.",
      },
      {
        question: "Jobbar ni med lokal SEO utanför Karlstad och Värmland?",
        answer:
          "Ja, vi jobbar med lokal SEO för företag i hela Sverige — Karlstad och Värmland är bara vår egen bas.",
      },
      {
        question: "Hur rapporterar ni resultat?",
        answer:
          "Ni får regelbunden, tydlig rapportering över synlighet, placeringar och trafik — inga svårtolkade rapporter fulla av jargong.",
      },
    ],
  },
  {
    slug: "design",
    title: "Design",
    description: "Visuell identitet och digital design som stärker ert varumärke.",
    intro:
      "En tydlig visuell identitet gör att ni känns igen och uppfattas som seriösa. Vi tar fram logotyper, färgpaletter och grafiska profiler som håller ihop hela ert varumärke — från hemsida till visitkort.",
    heroHeadline: "Ett starkt varumärke är ingen tillfällighet. Det handlar om identitet.",
    heroAccentWord: "identitet",
    features: [
      {
        icon: "pen-tool",
        title: "Logotyp och varumärkesidentitet",
        description: "En logotyp och identitet som känns rätt för er verksamhet och håller över tid.",
      },
      {
        icon: "palette-icon",
        title: "Grafisk profil och profilmaterial",
        description:
          "Färger, typsnitt och riktlinjer som gör att allt ni skickar ut känns som samma avsändare.",
      },
      {
        icon: "layout-template",
        title: "UX/UI-design för webb och app",
        description: "Genomtänkta gränssnitt som är enkla att förstå och trevliga att använda.",
      },
      {
        icon: "layers",
        title: "Enhetligt bildspråk och typografi",
        description: "Ett sammanhållet visuellt uttryck från hemsida till trycksaker.",
      },
    ],
    process: [
      {
        icon: "target",
        title: "Kartläggning",
        description: "Vi går igenom varumärket, målgruppen och vad identiteten ska förmedla.",
      },
      {
        icon: "pen-tool",
        title: "Konceptutveckling",
        description: "Vi tar fram flera visuella riktningar att utgå från innan vi går vidare.",
      },
      {
        icon: "palette-icon",
        title: "Design & profil",
        description:
          "Logotyp, färger, typografi och riktlinjer samlas i en komplett grafisk profil.",
      },
      {
        icon: "rocket",
        title: "Implementering",
        description:
          "Identiteten implementeras i allt från hemsida till trycksaker och sociala kanaler.",
      },
    ],
    faq: [
      {
        question: "Behöver jag en helt ny logotyp, eller kan ni bygga vidare på den jag har?",
        answer:
          "Båda delarna går bra — ibland räcker det med att förfina det som redan finns istället för att börja om helt.",
      },
      {
        question: "Vad ingår i en grafisk profil?",
        answer:
          "Logotyp, färgpalett, typografi och tydliga riktlinjer för hur allt ska användas, så att ni själva kan hålla det enhetligt framöver.",
      },
      {
        question: "Hur lång tid tar ett designprojekt?",
        answer: "Oftast 2–6 veckor beroende på omfattning, från första skiss till färdiga filer.",
      },
      {
        question: "Designar ni även för print, inte bara digitalt?",
        answer:
          "Ja, vi tar fram material för både digitala kanaler och trycksaker som visitkort, foldrar och skyltar.",
      },
      {
        question: "Kan ni hjälpa till med UX/UI för en app eller ett system, inte bara hemsidor?",
        answer:
          "Absolut, vi jobbar med gränssnitt för allt från hemsidor till webbappar och interna system.",
      },
    ],
  },
  {
    slug: "tillvaxt",
    title: "Tillväxt",
    description: "Strategier och marknadsföring som får ert företag att växa långsiktigt.",
    intro:
      "Att växa digitalt handlar om mer än en enskild kanal. Vi hjälper er sätta en tydlig tillväxtstrategi — från innehåll och annonsering till uppföljning — så att insatserna faktiskt leder någonstans.",
    heroHeadline: "Fler kanaler ger inte fler kunder — rätt riktning gör.",
    heroAccentWord: "riktning",
    features: [
      {
        icon: "target",
        title: "Tillväxtstrategi och marknadsplan",
        description: "En tydlig plan för vilka kanaler och insatser som faktiskt ger resultat för er.",
      },
      {
        icon: "megaphone",
        title: "Innehåll och annonsering",
        description: "Vi tar fram och driver innehåll och annonser som når rätt målgrupp.",
      },
      {
        icon: "bar-chart",
        title: "Uppföljning och analys",
        description: "Vi mäter vad som fungerar och justerar löpande utifrån faktiska resultat.",
      },
      {
        icon: "refresh-cw",
        title: "Kontinuerlig optimering",
        description: "Insatserna finslipas över tid istället för att sättas och glömmas.",
      },
    ],
    process: [
      {
        icon: "target",
        title: "Nulägesanalys",
        description: "Vi kartlägger var ni står idag och vilka kanaler som redan ger resultat.",
      },
      {
        icon: "bar-chart",
        title: "Strategi & prioritering",
        description:
          "Vi sätter en tydlig plan för vilka insatser som ger mest effekt för er budget.",
      },
      {
        icon: "megaphone",
        title: "Genomförande",
        description: "Innehåll och annonsering produceras och driftsätts enligt planen.",
      },
      {
        icon: "refresh-cw",
        title: "Uppföljning & optimering",
        description:
          "Vi mäter resultat och justerar insatserna löpande istället för att sätta och glömma.",
      },
    ],
    faq: [
      {
        question: "Hur vet ni vilka kanaler som passar oss?",
        answer:
          "Vi utgår från er målgrupp, bransch och budget — inte en generell mall som ska passa alla.",
      },
      {
        question: "Behöver vi ha en annonsbudget för att det ska fungera?",
        answer:
          "Inte nödvändigtvis, men annonsering kan snabba på resultaten avsevärt jämfört med enbart organiska insatser.",
      },
      {
        question: "Hur mäter ni om tillväxtarbetet faktiskt fungerar?",
        answer:
          "Vi sätter tydliga mål från start och rapporterar löpande mot dem, inte bara mot trafik i stort.",
      },
      {
        question: "Kan vi kombinera tillväxt med SEO eller webb?",
        answer:
          "Ja, många kunder kombinerar tjänsterna — tillväxt bygger ofta vidare på en stark teknisk och innehållsmässig grund.",
      },
    ],
  },
  {
    slug: "automation",
    title: "Automation",
    description: "Automatiserade flöden som sparar tid i vardagen.",
    intro:
      "Mycket av det ni gör manuellt idag går att automatisera — bokningar, uppföljningsmejl, orderhantering och mer. Vi bygger automatiserade flöden som sparar tid och minskar risken för mänskliga misstag.",
    heroHeadline: "Manuellt arbete äter upp tid ni inte har att ge bort.",
    heroAccentWord: "tid",
    features: [
      {
        icon: "mail",
        title: "Automatiserade e-postflöden",
        description: "Uppföljningsmejl och bekräftelser skickas automatiskt vid rätt tillfälle.",
      },
      {
        icon: "workflow",
        title: "Integrationer mellan system",
        description:
          "Vi kopplar ihop verktygen ni redan använder så information flödar utan manuellt jobb.",
      },
      {
        icon: "calendar-clock",
        title: "Bokning och orderhantering",
        description: "Bokningar och ordrar hanteras automatiskt istället för i kalendrar och mejltrådar.",
      },
      {
        icon: "zap",
        title: "Anpassade automationer efter era rutiner",
        description: "Vi bygger flöden utifrån hur ni faktiskt jobbar, inte en generisk mall.",
      },
    ],
    process: [
      {
        icon: "target",
        title: "Kartläggning",
        description:
          "Vi går igenom era rutiner och identifierar vad som tar onödigt mycket manuell tid.",
      },
      {
        icon: "workflow",
        title: "Flödesdesign",
        description: "Vi ritar upp hur automationen ska fungera innan något byggs.",
      },
      {
        icon: "zap",
        title: "Implementering",
        description: "Flödena byggs och kopplas ihop med de system ni redan använder.",
      },
      {
        icon: "refresh-cw",
        title: "Test & finjustering",
        description: "Vi testar flödena i skarpt läge och justerar tills allt fungerar smidigt.",
      },
    ],
    faq: [
      {
        question: "Vilka delar av verksamheten går att automatisera?",
        answer:
          "Ofta mer än man tror — bokningar, uppföljningsmejl, orderhantering och dataöverföring mellan system är vanliga exempel.",
      },
      {
        question: "Måste vi byta system för att kunna automatisera?",
        answer:
          "Nej, oftast kopplar vi ihop de system ni redan använder istället för att byta ut dem.",
      },
      {
        question: "Vad händer om något i flödet går fel?",
        answer:
          "Vi bygger in felhantering och finns kvar som stöd om något krånglar efter lansering.",
      },
      {
        question: "Är automation bara för större företag?",
        answer:
          "Nej, även små tidsbesparingar gör stor skillnad för ett litet företag med begränsad tid.",
      },
    ],
  },
  {
    slug: "support",
    title: "Support & underhåll",
    description: "Löpande support och underhåll så att sajten fortsätter fungera bra.",
    intro:
      "En lanserad hemsida är inte ett avslutat projekt. Vi finns kvar som stöd med uppdateringar, säkerhet och mindre vidareutveckling, så att ni slipper oroa er för att något går sönder eller blir omodernt.",
    heroHeadline: "En lanserad hemsida är inte färdig — den behöver trygghet över tid.",
    heroAccentWord: "trygghet",
    features: [
      {
        icon: "shield-check",
        title: "Löpande uppdateringar och säkerhet",
        description: "Vi håller sajten uppdaterad och säker så ni slipper tänka på det.",
      },
      {
        icon: "zap",
        title: "Snabb hjälp när något krånglar",
        description: "Kort svarstid när något går fel — ingen supportkö eller mellanhänder.",
      },
      {
        icon: "code-2",
        title: "Mindre ändringar och vidareutveckling",
        description: "Sajten fortsätter utvecklas i takt med att verksamheten gör det.",
      },
      {
        icon: "calendar-clock",
        title: "Regelbunden avstämning om vad som fungerar",
        description:
          "Vi hör av oss för att stämma av vad som fungerar bra och vad som kan förbättras.",
      },
    ],
    process: [
      {
        icon: "shield-check",
        title: "Genomgång",
        description:
          "Vi går igenom sajtens nuläge — säkerhet, uppdateringar och vad som kan behöva åtgärdas.",
      },
      {
        icon: "calendar-clock",
        title: "Löpande underhåll",
        description:
          "Uppdateringar, säkerhetskontroller och mindre justeringar sker regelbundet i bakgrunden.",
      },
      {
        icon: "zap",
        title: "Snabb hjälp",
        description: "Krånglar något får ni snabb hjälp utan supportkö eller mellanhänder.",
      },
      {
        icon: "refresh-cw",
        title: "Avstämning",
        description: "Vi stämmer av regelbundet vad som fungerar och vad som kan förbättras framåt.",
      },
    ],
    faq: [
      {
        question: "Vad ingår i löpande support?",
        answer:
          "Uppdateringar, säkerhetskontroller, mindre ändringar och snabb hjälp när något krånglar.",
      },
      {
        question: "Måste ni ha byggt hemsidan för att kunna sköta support på den?",
        answer: "Nej, vi tar gärna över support och underhåll även för sajter vi inte byggt själva.",
      },
      {
        question: "Hur snabbt får vi hjälp om något går sönder?",
        answer: "Vi siktar på att återkomma inom 24 timmar, ofta snabbare vid akuta problem.",
      },
      {
        question: "Är support ett löpande abonnemang eller köper vi det vid behov?",
        answer:
          "Båda delarna går bra — vissa kunder vill ha ett löpande avtal, andra hör av sig vid behov.",
      },
    ],
  },
];
