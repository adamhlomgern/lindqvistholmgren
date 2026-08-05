import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "webb",
    title: "Webb",
    description: "Snabba, responsiva webbplatser byggda för att konvertera besökare till kunder.",
    intro:
      "En hemsida är ofta första intrycket kunder får av ert företag. Vi bygger snabba, moderna och lättnavigerade webbplatser som fungerar lika bra på mobilen som på datorn — och som är gjorda för att omvandla besökare till förfrågningar och kunder.",
    features: [
      "Skräddarsydd design utifrån ert varumärke",
      "Snabb laddtid och bra mobilanpassning",
      "Sökmotoroptimerad grundstruktur",
      "Enkel administration av innehåll",
      "Tydliga kontaktvägar och call-to-actions",
    ],
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Sökmotoroptimering som gör att fler kunder hittar er på Google.",
    intro:
      "Att ha en fin hemsida räcker inte om ingen hittar den. Vi optimerar er webbplats tekniskt och innehållsmässigt så att ni syns högre upp i Google för de sökord som faktiskt ger kunder.",
    features: [
      "Sökordsanalys och innehållsoptimering",
      "Teknisk SEO och sidhastighet",
      "Lokal SEO för Karlstad och Värmland",
      "Uppföljning och rapportering",
    ],
  },
  {
    slug: "design",
    title: "Design",
    description: "Visuell identitet och digital design som stärker ert varumärke.",
    intro:
      "En tydlig visuell identitet gör att ni känns igen och uppfattas som seriösa. Vi tar fram logotyper, färgpaletter och grafiska profiler som håller ihop hela ert varumärke — från hemsida till visitkort.",
    features: [
      "Logotyp och varumärkesidentitet",
      "Grafisk profil och profilmaterial",
      "UX/UI-design för webb och app",
      "Enhetligt bildspråk och typografi",
    ],
  },
  {
    slug: "tillvaxt",
    title: "Tillväxt",
    description: "Strategier och marknadsföring som får ert företag att växa långsiktigt.",
    intro:
      "Att växa digitalt handlar om mer än en enskild kanal. Vi hjälper er sätta en tydlig tillväxtstrategi — från innehåll och annonsering till uppföljning — så att insatserna faktiskt leder någonstans.",
    features: [
      "Tillväxtstrategi och marknadsplan",
      "Innehåll och annonsering",
      "Uppföljning och analys",
      "Kontinuerlig optimering",
    ],
  },
  {
    slug: "automation",
    title: "Automation",
    description: "Automatiserade flöden som sparar tid i vardagen.",
    intro:
      "Mycket av det ni gör manuellt idag går att automatisera — bokningar, uppföljningsmejl, orderhantering och mer. Vi bygger automatiserade flöden som sparar tid och minskar risken för mänskliga misstag.",
    features: [
      "Automatiserade e-postflöden",
      "Integrationer mellan system",
      "Bokning och orderhantering",
      "Anpassade automationer efter era rutiner",
    ],
  },
  {
    slug: "support",
    title: "Support & underhåll",
    description: "Löpande support och underhåll så att sajten fortsätter fungera bra.",
    intro:
      "En lanserad hemsida är inte ett avslutat projekt. Vi finns kvar som stöd med uppdateringar, säkerhet och mindre vidareutveckling, så att ni slipper oroa er för att något går sönder eller blir omodernt.",
    features: [
      "Löpande uppdateringar och säkerhet",
      "Snabb hjälp när något krånglar",
      "Mindre ändringar och vidareutveckling",
      "Regelbunden avstämning om vad som fungerar",
    ],
  },
];
