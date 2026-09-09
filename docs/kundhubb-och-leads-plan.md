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

- [x] Läs aktuell kod, AGENTS.md och databasstruktur.
- [x] Inventera vad som redan finns för kund, projekt, filer, inkorg och fakturor.
- [x] Bestäm första pilotkund och konkret projektflöde.
- [x] Bestäm roller och vilka personer som får granska/godkänna.
- [x] Bestäm vilka uppgifter och filer som får delas med kund.
- [ ] Skissa mobil och desktop för kundöversikt, projekt och granskning.
- [x] Dokumentera schemaändringar och migrationsordning.

#### Kartläggning: befintlig kod (2026-09-07)

- Fungerande admin-kärna finns redan: `Customer`, `ClientProject` (status planerat/pågående/väntar_på_kund/pausat/klar), `ProjectChecklistItem`, `ProjectActivityEntry`, `ProjectFile`, `Email`/inkorg, `Invoice`+rader, `BillingEntity` (`lib/types/index.ts`, `lib/data/*`, `lib/actions/*`).
- Tabeller (via `lib/data/*`): `customers`, `client_projects`, `project_checklist_items`, `project_activity`, `project_files`, `email_attachments`, `emails`, `blocked_senders`, `billing_entities`, `invoices`, `invoice_items`.
- Filer ligger i en privat Supabase-storage-bucket (`attachments`) med signerade URL:er (1 timmes TTL) — bra grund, men `project_files` saknar helt en synlighetsflagga.
- `client_projects.overview`/`notes` är odifferentierat internt fält, ingen kundvänd statusmotsvarighet finns.
- Bekräftat säkerhetsgap: `verifySession()` (`lib/auth/dal.ts`) kontrollerar bara att någon är inloggad, ingen rollkontroll. `createServiceRoleClient()` (`lib/supabase/server.ts`) används i 35 filer och kringgår RLS helt. `lib/actions/auth.ts` har ingen självregistrering — alla nuvarande Supabase-auth-users är i praktiken personal, tillsatta manuellt.
- Stack: Next 16.3.0 (den icke-standardversion AGENTS.md pekar på), `@supabase/supabase-js` 2.112, `@supabase/ssr` 0.12.

#### Beslut

- **Pilotkund:** en ny/kommande kund, inte en befintlig migrerad kund. Portalen designas kring ett nytt projekt från start snarare än att retroaktivt anpassas efter ett pågående arbetssätt.
- **Roller:** endast två roller i v1 — admin (Ada/Malin, ser allt) och kund (en kontaktperson per företag ser sitt eget företags projekt). Flera kundkontakter med olika behörighet skjuts till en senare etapp.
- **Delning:** opt-in per objekt. Allt är internt som standard; admin måste aktivt markera en fil eller statusuppdatering som synlig för kund. Gäller både `project_files` och statusytan i portalen (ingen automatisk exponering av `overview`/`notes`).

#### Schemaändringar och migrationsordning (Etapp 1)

Roller hålls utanför databasschemat: befintliga adminkonton får `app_metadata.role = "admin"` satt via service-role (kräver ingen DDL, men måste göras innan rollkontroll slås på, annars låses personalen ute). `app_metadata` är inte redigerbart av användaren själv, till skillnad från `user_metadata`.

Ordning för migrationerna:

1. Sätt `app_metadata.role = "admin"` på alla befintliga Supabase auth-users (engångsjobb, inte en tabellmigration).
2. Ny tabell `customer_members`: `id`, `user_id` (FK `auth.users`), `customer_id` (FK `customers`), `invited_at`, `accepted_at`, `revoked_at`, `created_at`. Kopplar en inloggad kundkontakt till exakt ett kundföretag.
3. `alter table project_files add column visible_to_customer boolean not null default false`.
4. `alter table client_projects add column customer_update text, add column customer_update_at timestamptz, add column next_milestone_label text, add column next_milestone_date date` — separata kundvända fält, skilda från interna `overview`/`notes`.
5. Ny tabell `project_approvals`: `id`, `project_id`, `file_id` (nullable), `title`, `version_label`, `requested_at`, `due_at`, `status` (`pending`/`approved`/`changes_requested`), `decided_at`, `decided_by` (FK `auth.users`), `decision_note`.
6. Ny tabell `project_messages`: `id`, `project_id`, `author_user_id`, `author_role` (`admin`/`kund`), `body`, `created_at`.

Behörighetsmodell: koden använder `createServiceRoleClient()` överallt idag och har ingen RLS-vana att bygga vidare på. Istället för att införa ett andra klientmönster (RLS + kundscopead klient) parallellt med det befintliga, byggs en enda ny central kontrollpunkt: `requireCustomerAccess(userId, customerId)` i `lib/auth/`, som varje ny kundvänd data-/action-funktion måste anropa först. Det håller mönstret konsekvent med resten av kodbasen och gör det enkelt att grep-verifiera mot checklistan i avsnitt 11 (att inget kundvänt anrop saknar kontrollen).

Klart när första användarflödet och dess data-/behörighetsbehov är tydligt avgränsade.

### Etapp 1 — kundportalens kärna

- [x] Implementera och verifiera adminroll, kundmedlemskap och projektåtkomst. `requireCustomerAccess` är nu använd av kundens projektsida, översikt och inbjudningsflödet.
- [x] Bygg inbjudan, inloggning, utloggning och återkallad åtkomst. Verifierat 8 sep 2026: hela kedjan inbjudan → mejl → sätt lösenord → inloggad som rätt kund fungerar i praktiken (testkund "tesfirma"). Inkluderar även självbetjänad återställning av glömt lösenord.
- [x] Bygg kundöversikt med nästa steg, aktuell status och milstolpe. Ombyggd 9 sep 2026 efter genomgripande revidering (fasindikator, per-projekt-kort, konkret återkopplingsyta, tydlig nästa-milstolpe-status).
- [x] Visa kundens projekt med utvalt kundsynligt innehåll. `/kund/projekt` + `/kund/projekt/[id]`.
- [x] Lägg till kundsynlighet och skyddad åtkomst för filer. Löst via materialbiblioteket (`material_items.visibility`) istället för den ursprungligen planerade `project_files.visible_to_customer`-flaggan — samma syfte, större lösning; se separat plan nedan.
- [x] Stöd uppladdning, förhandsvisning och nedladdning. Byggt som del av materialbiblioteket — admin laddar upp/organiserar, kunden förhandsgranskar och laddar ner. Kunden kan inte själv ladda upp material (medvetet, biblioteket är admin-kurerat).
- [ ] Skapa versionsbundna granskningsbegäranden.
- [ ] Implementera godkänn eller begär ändringar med sparad beslutshistorik.
- [x] Lägg till projektanknutna meddelanden. Beslut 9 sep 2026: en tråd per kundföretag (befintlig `customer_messages`) räcker för v1 med pilotkunden snarare än en tråd per projekt — omvärderas om/när flera parallella projekt blir vanligt.
- [x] Lägg till adminförhandsgranskning av kundvyn. Byggt för Material och Meddelanden (`kundvy/material`, `kundvy/meddelanden`); Översikt/Projekt saknar ännu en motsvarande förhandsgranskning.
- [ ] Bygg mejlnotiser med direktlänk till rätt uppgift. Endast inbjudningsmejlet finns idag.
- [ ] Hantera tomma lägen, laddning, fel och utgångna länkar.
- [ ] Prova hela flödet på mobil med pilotkunden.

Klart när kunden själv kan hitta sitt projekt, lämna material, ge feedback och godkänna rätt version.

#### Etapp 1: teknisk nedbrytning

Skisser för kundöversikt, projektvy och godkännandeflöde (desktop + mobil) finns framtagna som referens för layout och innehåll. Nedan är byggordningen med konkreta filer, i linje med hur adminytan redan är strukturerad (`app/admin/(protected)/...`, `lib/data/*`, `lib/actions/*`).

##### 1.1 Roller och sessionshantering

Måste göras först, allt annat bygger på den.

- Engångsjobb: sätt `app_metadata.role = "admin"` på alla befintliga Supabase auth-users (service-role-anrop, görs en gång innan rollkontroll slås på).
- Migration: ny tabell `customer_members` (`user_id`, `customer_id`, `invited_at`, `accepted_at`, `revoked_at`).
- `lib/auth/customer.ts`: `verifyCustomerSession()` (samma mönster som `verifySession()` i `lib/auth/dal.ts`, men slår upp `customer_members`-raden för den inloggade användaren) och `requireCustomerAccess(customerId)` — anropas överst i varje ny kundvänd data-/action-funktion.
- Uppdatera `lib/auth/dal.ts`/adminroutes att kräva `app_metadata.role === "admin"`, inte bara inloggning.

##### 1.2 Inbjudan, inloggning, utloggning, återkallelse

- `lib/actions/customer-invites.ts`: `inviteCustomerContact(customerId, email)` (admin-action, `supabase.auth.admin.inviteUserByEmail` + insert i `customer_members`).
- `app/kund/login/page.tsx`, `lib/actions/customer-auth.ts` (separat från `lib/actions/auth.ts` — admin och kund ska inte dela inloggningsflöde även om båda går mot samma Supabase-auth).
- `app/kund/(protected)/layout.tsx` byggt på `verifyCustomerSession()`, mönster som `app/admin/(protected)/layout.tsx`.
- Admin-UI: "Bjud in kontaktperson" + "Återkalla åtkomst" på `app/admin/(protected)/kunder/[id]/page.tsx` (sätter/nollställer `revoked_at`).

##### 1.3 Kundöversikt

- Migration: `client_projects` får `customer_update`, `customer_update_at`, `next_milestone_label`, `next_milestone_date` (separata kundvända fält, `overview`/`notes` förblir interna).
- `lib/data/customer/overview.ts` + `app/kund/(protected)/page.tsx` + `components/customer/OverviewPage.tsx`.

##### 1.4 Projektvy

- `lib/data/customer/projects.ts` (anropar `requireCustomerAccess` internt) + `app/kund/(protected)/projekt/[id]/page.tsx` + `components/customer/ProjectView.tsx`.

##### 1.5 Filer: kundsynlighet, skydd, uppladdning

- Migration: `project_files` får `visible_to_customer boolean not null default false`.
- Admin: lägg till en "Visa för kund"-växel i `components/admin/ProjectFilesSection.tsx`.
- `lib/data/customer/files.ts`: samma signerade-URL-mönster som `lib/data/files.ts`, filtrerat på `visible_to_customer = true`.
- `lib/actions/customer/files.ts`: kunduppladdning till samma `attachments`-bucket, markerad `visible_to_customer = true` per default (kunden laddade själv upp den).

##### 1.6 Godkännanden

- Migration: ny tabell `project_approvals` (`project_id`, `file_id`, `title`, `version_label`, `requested_at`, `due_at`, `status`, `decided_at`, `decided_by`, `decision_note`).
- Admin: `lib/actions/approvals.ts` (`createApprovalRequest`) + UI i `ProjectWorkspace`.
- Kund: `lib/actions/customer/approvals.ts` (`decideApproval`, enforcar ett beslut per version — ny version = ny rad, aldrig uppdatering av en gammal) + `app/kund/(protected)/projekt/[id]/godkannande/[approvalId]/page.tsx` + `components/customer/ApprovalView.tsx`.

##### 1.7 Projektanknutna meddelanden

- Migration: ny tabell `project_messages` (`project_id`, `author_user_id`, `author_role`, `body`, `created_at`).
- `lib/data/customer/messages.ts` + `lib/actions/customer/messages.ts`, tråd per projekt, synlig både i `app/kund/(protected)/projekt/[id]/page.tsx` och admin-sidans `ProjectWorkspace`.

##### 1.8 Adminförhandsgranskning av kundvyn

- `app/admin/(protected)/projekt/[id]/kundvy/page.tsx`: återanvänder `components/customer/*` server-renderat med exakt samma frågor som kundens egen sida (fångar läckage genom att admin ser precis det kunden skulle se, inte en genväg via servicerollen).

##### 1.9 Mejlnotiser

- Utgående mejl finns redan (`lib/email/client.ts`, nodemailer/SMTP, används idag för fakturor i `lib/actions/invoices.ts`) — återanvänd samma transport, inte ett nytt system.
- Trigga vid: ny inbjudan, ny granskningsbegäran, nytt meddelande från admin. Varje mejl länkar direkt till rätt sida (`/kund/projekt/[id]/godkannande/[id]` etc.), inte bara till startsidan.

##### 1.10 Tomma lägen, fel, utgångna länkar

- `loading.tsx`/tomma-listor för varje ny kundroute; hantera utgången eller redan använd inbjudningslänk explicit i `app/kund/login`.
- Kontrollera aktuell Next.js-konvention för loading/error-boundaries i `node_modules/next/dist/docs/` innan implementation (se AGENTS.md).

##### 1.11 Mobil-QA med pilotkunden

Manuell genomgång av hela flödet på faktisk mobil, inte kod.

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
