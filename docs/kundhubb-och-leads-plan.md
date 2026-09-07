# Lindqvist / Holmgren — kundhubb och leadgenerering

Status: Planerad. Ingen funktionalitet är implementerad genom detta dokument.
Datum: 2026-09-07.
Arbetsbranch: `plan/kundhubb-och-leads`.

## 1. Mål och riktning

Utveckla hemsidan till en sammanhängande upplevelse där besökaren kan upptäcka möjligheter, konkretisera sitt behov och bli kund. Efter projektstart fortsätter samarbetet i en personlig kundportal. Efter lansering används samma portal för material, support och vidareutveckling.

Tre delar ska hänga ihop:

| Del | Syfte |
| --- | --- |
| Publik hubb | Visa vad vi kan lösa, låta besökaren prova och fånga relevanta förfrågningar. |
| Kundportal | Samla nästa steg, filer, godkännanden och kontakt med Ada och Malin. |
| Admin | Hålla ihop leads, kunder, leveranser, support och uppföljning. |

Det särskiljande konceptet är en provbar kundportal, en personlig plan före köp och en fortsatt arbetsyta efter lansering. Kunden ska uppleva ett personligt samarbete med tydlig struktur.

## 2. Nuläge och utgångspunkter

En översiktlig läsning av repot visar byggstenar för:

- Kunder och kundkopplade projekt.
- Projektstatus, översikt, interna anteckningar och deadline.
- Checklistor, filer och aktivitetslogg.
- Förfrågningar med kategorier, budget, tidsram och beskrivning.
- Inkorg, fakturor och relaterad administration.

Relevanta filer:

- `components/admin/ProjectWorkspace.tsx`
- `lib/types/index.ts`
- `app/api/projektforfragan/route.ts`
- `lib/auth/dal.ts`
- `lib/supabase/server.ts`

Detta är inte en fullständig kod- eller säkerhetsgranskning. Kontrollera aktuell implementation och databas innan arbete påbörjas. Återanvänd befintliga funktioner där de passar.

Den lästa sessionskontrollen verifierar inloggning men innehåller ingen rollkontroll. Kundinloggning kräver verifierad åtskillnad mellan admin och kund samt åtkomstkontroll för företag, projekt och filer. En dold meny är inte en behörighetskontroll.

## 3. Produktprinciper

- Kunden ska direkt förstå vad vi gör, vad kunden behöver göra och vad som händer sedan.
- Samla information en gång och låt den följa med från förfrågan till projekt.
- Utforskning och publik demo ska fungera utan konto.
- Visa relevanta moduler utifrån kundens faktiska uppdrag.
- Skilj internt arbetsmaterial från sådant som uttryckligen delas med kunden.
- Bevara versioner, beslut och kopplingen mellan återkoppling och leverans.
- Prioritera mobil användning, tydliga texter, tillgänglighet och snabb laddning.
- Använd riktiga utfall i rapporter; märk exempel och uppskattningar tydligt.
- Undvik att bygga ett komplett affärssystem i första versionen.

## 4. Publik hubb: ”Utveckla ert företag”

En särskild sida där besökaren börjar med ett behov:

- Få fler förfrågningar.
- Minska administrationen.
- Se mer professionell ut.
- Samla kunder, bokningar eller beställningar.
- Bygga en idé.
- Få hjälp att välja var man ska börja.

Varje väg visar relevanta lösningar, kundcase och interaktiva exempel. Besökaren ska kunna prova ett konkret flöde och förstå vad det gör för verksamheten.

### ”Er plan”

Besökaren samlar intressanta lösningar i ett underlag som innehåller mål, önskemål, ett möjligt första steg och frågor att diskutera. Kontaktuppgifter efterfrågas när personen vill skicka underlaget eller spara det för fortsatt kontakt.

Underlaget följer med till förfrågan, lead, kund och projekt. Behåll en snabb kontaktväg för den som bara vill ställa en fråga.

### Publik kundportaldemo

En tydligt fiktiv kund med ett exempelprojekt. Besökaren får prova att öppna en design, lämna feedback, godkänna en leverans, hitta varumärkesmaterial och skicka ett låtsasärende.

Demon använder isolerade exempeldata och får aldrig skapa riktiga kundärenden, skicka mejl eller påverka kundprojekt. Länka till den från startsida, relevanta case och offertprocess.

## 5. Kundportal

Föreslagen navigation: Översikt, Projekt, Filer, Meddelanden och Hjälp. Avtal, fakturor, varumärke och resultat tillkommer när de är relevanta.

### Startsida: ”Vad händer nu?”

| Yta | Innehåll |
| --- | --- |
| Behöver din återkoppling | Förslag att granska, frågor att besvara och material att lämna. |
| Det här arbetar vi med | Kort kundanpassad status och ansvarig person. |
| Nästa milstolpe | Nästa leverans eller möte med datum. |
| Senaste uppdateringen | Personlig status, gärna med förhandsvisning eller kort video. |
| Snabbåtkomst | Aktuellt projekt, viktiga filer och kontakt. |

När kunden inte behöver göra något ska det framgå. Använd företagsnamn, logotyp och visuella förhandsvisningar för att göra arbetsytan personlig.

### Filer och material

- Uppladdning, förhandsvisning och nedladdning.
- Tydlig uppdelning mellan referenser, arbetsmaterial och leveranser.
- Explicit synlighet: internt eller delat med kund.
- Versioner och märkning av senast godkända leverans.
- Begripliga användningsområden, exempelvis ”För tryck” och ”För sociala medier”.
- Sökning och filtrering när materialmängden motiverar det.

### Godkännanden

Varje granskningspunkt visar förslaget, exakt version, vad kunden ska bedöma och önskat återkopplingsdatum. Kunden kan godkänna eller begära ändringar.

Beslutet sparar person, tidpunkt och version. En ny version behöver ett nytt beslut; ett tidigare godkännande får inte automatiskt gälla nytt innehåll.

Önskemål utanför uppdraget hanteras som tillägg med omfattning, pris och påverkan på tidsplanen. Kunden tar ställning innan arbetet startar.

### Efter lansering

Portalen kan fortsätta samla:

- Logotyper, färger, typsnittsinformation och mallar.
- Webbplatslänkar och kundspecifika instruktioner.
- Leveransarkiv, avtal och fakturor.
- Support och ändringsbeställningar.
- Prioriterad lista över framtida förbättringar.
- Relevanta resultat med vår kommentar om nästa steg.

## 6. Support och kundupplevelse

En tydlig ingång: ”Vad behöver du hjälp med?” med val för fel, ändring eller fråga.

Kunden kan bifoga skärmbild och länk. Ärendet kopplas till rätt företag och projekt/tjänst. Visa att det är mottaget, vem som ansvarar, nästa steg, eventuell väntan på kund och om arbete behöver prissättas.

Börja med trådar i portalen och mejlnotiser med direktlänkar. Överväg senare att låta mejlsvar hamna i samma tråd. Anpassa svarsförväntningar till faktisk bemanning.

Kundspecifika guider och korta videogenomgångar placeras nära relevant funktion eller leverans.

## 7. Admin och leadflöde

Admin ska prioritera sådant som kräver handling:

- Nya förfrågningar utan svar.
- Uppföljningar som förfaller.
- Projekt som väntar på oss respektive kunden.
- Leveranser som ska skickas för granskning.
- Supportärenden som behöver åtgärdas.
- Kunder som ska följas upp efter lansering.

Föreslagna leadstatusar: Ny förfrågan, Kontakt etablerad, Behov klarlagt, Offert skickad, Vunnen och Förlorad.

Varje aktivt lead har ansvarig, nästa steg och datum. När uppdraget vinns skapas eller kopplas kund och projekt utan att underlaget tappas eller dupliceras.

Admin och kundportal delar grunddata men har olika vyer och behörigheter. Lägg till en förhandsgranskning av kundens vy för att kontrollera vad som publicerats.

## 8. Automationer

| Händelse | Föreslagen effekt |
| --- | --- |
| Förfrågan skickas | Spara underlaget och skapa uppföljning hos oss. |
| Projekt startas | Förbered kundinbjudan och materialchecklista. |
| Förslag publiceras | Meddela rätt kontaktperson och visa granskningsuppgift. |
| Ändringar begärs | Koppla återkopplingen till leveransen och arbetslistan. |
| Projekt lanseras | Samla leveranser och förbered uppföljning. |
| Supportfråga kommer in | Koppla till kund och ansvarig. |

Skilj interna utkast från händelser som faktiskt skickar kundmeddelanden. Undvik dubbla utskick, stoppa inaktuella påminnelser och visa misslyckade leveranser för admin.

## 9. Teknisk grund att verifiera och komplettera

Föreslagna datakoncept; anpassa till befintligt schema:

| Koncept | Ansvar |
| --- | --- |
| Kundmedlemskap | Koppla inloggad person till rätt kundföretag och roll. |
| Projektåtkomst | Avgöra vilka projekt en kontaktperson får se. |
| Delat material | Synlighet, filmetadata och versionskoppling. |
| Godkännandebegäran och beslut | Leveransversion, granskare, status, person och tidpunkt. |
| Meddelandetråd och supportärende | Kund-/projektkoppling, ansvarig och status. |
| Lead och uppföljning | Källa, underlag, ansvarig, nästa steg och datum. |
| Tilläggsbeställning | Omfattning, pris, tidskonsekvens och kundbeslut. |

Alla läsningar och ändringar ska kontrollera relevant behörighet på serversidan. Kundåtkomst får inte ärva bred adminåtkomst. Granska användningen av service-role-klienten och verifiera databas- och filskydd.

Återanvänd UI där det är lämpligt, men låt kundvyn få ett eget enkelt informationsurval. Läs repots AGENTS.md och relevanta lokala Next.js-guider innan implementation.

## 10. Byggordning och checklista

Alla rutor nedan avser kommande arbete. Markera klart först när resultatet är verifierat.

### Etapp 0 — kartläggning och avgränsning

- [ ] Läs aktuell kod, AGENTS.md och databasstruktur.
- [ ] Inventera vad som redan finns för kund, projekt, filer, inkorg och fakturor.
- [ ] Bestäm första pilotkund och konkret projektflöde.
- [ ] Bestäm roller och vilka personer som får granska/godkänna.
- [ ] Bestäm vilka uppgifter och filer som får delas med kund.
- [ ] Skissa mobil och desktop för kundöversikt, projekt och granskning.
- [ ] Dokumentera schemaändringar och migrationsordning.

Klart när första användarflödet och dess data-/behörighetsbehov är tydligt avgränsade.

### Etapp 1 — kundportalens kärna

- [ ] Implementera och verifiera adminroll, kundmedlemskap och projektåtkomst.
- [ ] Bygg inbjudan, inloggning, utloggning och återkallad åtkomst.
- [ ] Bygg kundöversikt med nästa steg, aktuell status och milstolpe.
- [ ] Visa kundens projekt med utvalt kundsynligt innehåll.
- [ ] Lägg till kundsynlighet och skyddad åtkomst för filer.
- [ ] Stöd uppladdning, förhandsvisning och nedladdning.
- [ ] Skapa versionsbundna granskningsbegäranden.
- [ ] Implementera godkänn eller begär ändringar med sparad beslutshistorik.
- [ ] Lägg till projektanknutna meddelanden.
- [ ] Lägg till adminförhandsgranskning av kundvyn.
- [ ] Bygg mejlnotiser med direktlänk till rätt uppgift.
- [ ] Hantera tomma lägen, laddning, fel och utgångna länkar.
- [ ] Prova hela flödet på mobil med pilotkunden.

Klart när kunden själv kan hitta sitt projekt, lämna material, ge feedback och godkänna rätt version.

### Etapp 2 — publik demo som visar samarbetet

- [ ] Skapa fiktivt företag, projekt och material.
- [ ] Bygg ett kort guidat demoflöde.
- [ ] Låt besökaren prova feedback, godkännande och ett supportärende.
- [ ] Säkerställ att demon är isolerad från riktiga data och utskick.
- [ ] Lägg till tydlig väg från demo till förfrågan.
- [ ] Länka demon från startsidan och relevanta case.
- [ ] Kontrollera mobilupplevelse, tangentbord och laddningstid.

Klart när en ny besökare kan förstå och prova kundupplevelsen utan konto.

### Etapp 3 — publik hubb och ”Er plan”

- [ ] Bygg sidan ”Utveckla ert företag” med behovsbaserade ingångar.
- [ ] Koppla behov till relevanta lösningar, case och demos.
- [ ] Bygg sammanställningen ”Er plan”.
- [ ] Låt besökaren redigera val före inskick.
- [ ] Återanvänd förfrågningsflödet och komplettera dess underlag.
- [ ] Bevara snabb kontaktväg för enkla frågor.
- [ ] Visa tydlig bekräftelse och nästa steg efter inskick.
- [ ] Säkerställ att underlaget följer med till admin.

Klart när besökaren kan skicka ett begripligt behovsunderlag utan att först behöva kunna våra tjänstenamn.

### Etapp 4 — sammanhängande försäljning och admin

- [ ] Inför leadstatus, ansvarig, nästa steg och uppföljningsdatum.
- [ ] Visa obesvarade förfrågningar och förfallna uppföljningar.
- [ ] Koppla vunnet lead till kund och projekt med bevarat underlag.
- [ ] Undvik dubbla kundkort och dubbla projekt vid upprepade åtgärder.
- [ ] Visa väntan på kund respektive väntan på oss.
- [ ] Lägg till återanvändbara checklistor för olika projekttyper.
- [ ] Implementera separat flöde för tilläggsbeställningar.
- [ ] Verifiera att interna anteckningar aldrig visas i kundvyn.

Klart när en förfrågan kan följas från första kontakt till leverans utan manuell återinmatning av samma underlag.

### Etapp 5 — support och fortsatt samarbete

- [ ] Bygg ärenden för fel, ändringar och frågor.
- [ ] Koppla ärenden till kund, projekt/tjänst och ansvarig.
- [ ] Visa status, nästa steg och eventuell prisbedömning för kund.
- [ ] Samla varumärkesmaterial och märk godkända leveranser.
- [ ] Visa relevanta avtal och fakturor med rätt åtkomst.
- [ ] Lägg till kundspecifika guider och genomgångar.
- [ ] Skapa en lista för framtida utvecklingsönskemål.
- [ ] Förbered uppföljning efter lansering.
- [ ] Utvärdera mejlsvar i portaltrådar först när kärnflödet fungerar.
- [ ] Utvärdera resultatmodul utifrån tillgängliga, relevanta data.

Klart när kunden kan fortsätta använda portalen för material, hjälp och nya önskemål efter lansering.

## 11. Verifiering inför kundåtkomst

- [ ] Kund A kan inte läsa eller ändra kund B:s projekt, filer, meddelanden eller fakturor, även via direktlänkar/API.
- [ ] Kundanvändare kan inte nå adminfunktioner eller anropa adminåtgärder.
- [ ] Återkallad åtkomst upphör att fungera.
- [ ] Interna anteckningar och arbetsfiler exponeras inte i kundsvar eller filåtkomst.
- [ ] Ett godkännande av version 1 godkänner aldrig version 2.
- [ ] Upprepade klick skapar inte dubbla beslut, projekt eller notifieringar.
- [ ] Misslyckad uppladdning eller notifiering visas och kan hanteras.
- [ ] Publik demo kan inte påverka riktiga kunddata.
- [ ] Kritiska kundflöden fungerar på mobil och med tangentbord.
- [ ] Pilotkundens återkoppling är åtgärdad innan bredare utrullning.

Skriv meningsfulla tester för behörighet, versionsbundna beslut och kritiska flöden. Följ repots bygg- och verifieringskrav.

## 12. Mätning och utvärdering

Följ hela resan och sätt baslinje före förändring:

- Andel relevanta besök som blir kvalificerade förfrågningar.
- Vilka ingångar och demos som leder till förfrågningar.
- Andel kvalificerade förfrågningar som blir vunna uppdrag.
- Tid till första svar och genomförd uppföljning.
- Tid till återkoppling/godkännande i projekt.
- Hur ofta vi behöver jaga material manuellt.
- Kundernas användning av filer och support efter lansering.

- [ ] Definiera vad en kvalificerad förfrågan betyder för oss.
- [ ] Dokumentera baslinje och mätperiod.
- [ ] Implementera nödvändiga mätpunkter enligt sajtens samtyckesval.
- [ ] Utvärdera pilot och justera innan nästa etapp.
- [ ] Prioritera fortsatt arbete utifrån faktisk nytta och användning.

## 13. Senare idéer, utanför första versionen

- Visuella kommentarer direkt på designytor.
- Fler kontaktpersoner med olika projektbehörigheter.
- Integrerade bokningar och fler externa system.
- Resultatöversikter för löpande marknadsföringsuppdrag.
- Mer avancerat sökbart materialbibliotek.
- Sparade planer som besökaren kan återkomma till.

Dessa är möjligheter, inte löften om omfattning. Första prioritet är ett fungerande samarbete från förfrågan till godkänd leverans.
