# Projektbrief: Servicekoll

## 1. Översikt

Bygg en generell demo/MVP för ett service- och underhållssystem direkt i den befintliga webbplatsen för Lindqvist Holmgren.

Produkten ska hjälpa företag att hålla koll på **objekt som behöver återkommande service, underhåll, kontroll eller besiktning**.

Det ska fungera för två huvudsakliga användningsfall:

1. **Företag som servar sina kunders objekt**

   * bilverkstad
   * bilåterförsäljare
   * värmepumpsföretag
   * ventilation
   * kylteknik
   * portar
   * hissar
   * brandskydd
   * maskinservice
   * kaffemaskiner
   * entreprenadmaskiner
   * andra serviceföretag

2. **Företag som vill hålla koll på sin egen utrustning**

   * fordon
   * maskiner
   * truckar
   * kompressorer
   * brandsläckare
   * värmepumpar
   * ventilation
   * annan utrustning med återkommande service eller kontroll

Kärnan ska därför vara helt generell:

**Organization → Customer → Asset → Service → Reminder**

Ett `asset` kan vara en bil, värmepump, truck, maskin, ventilationsaggregat eller vad som helst.

Produkten ska initialt främst fungera som en **interaktiv säljdemo och lead magnet**, men arkitekturen ska utformas så att den senare kan utvecklas till en fristående SaaS-produkt utan större omskrivning.

---

# 2. Befintlig teknisk miljö

Projektet ligger idag i Lindqvist Holmgrens befintliga webbprojekt.

Stack:

* Next.js 16.3
* App Router
* React 19.2
* TypeScript 5
* Tailwind CSS 4
* Supabase

  * PostgreSQL
  * Auth
  * Storage
  * `@supabase/supabase-js`
  * `@supabase/ssr`
* Tiptap
* Lucide React
* ESLint 9

Servicekoll ska tills vidare byggas i **samma repository och samma Next.js-applikation**.

Det ska dock behandlas som en separat produktmodul.

Undvik hårda beroenden till Lindqvist Holmgrens marketing-site.

---

# 3. Övergripande mål

MVP:n ska göra det möjligt att demonstrera följande flöde:

**Lägg till/importera kunder och objekt → ange serviceintervall → systemet visar vad som snart behöver service → påminnelser planeras → service registreras → nästa servicedatum räknas fram.**

En potentiell kund ska kunna förstå produktens värde inom någon minut.

Produkten ska framför allt besvara:

> Vad behöver service snart?

och, för serviceföretag:

> Vilka kunder behöver vi kontakta för att få tillbaka dem på service?

---

# 4. Integration med Lindqvist Holmgrens vanliga webb

Produkten ska ha två tydligt separerade delar.

## 4.1 Marketing-/presentationssida

Exempelroute:

`/losningar/servicekoll`

alternativt:

`/demos/servicekoll`

Denna sida använder Lindqvist Holmgrens vanliga:

* navigation
* header
* footer
* typografi
* visuella identitet

Syftet är att sälja in lösningen.

Exempel på innehåll:

### Servicekoll

**Håll koll på vad som behöver service – innan det blir för sent.**

Samla kunder, fordon, maskiner och utrustning på ett ställe. Se kommande service, automatisera påminnelser och registrera historik.

CTA:

**Testa demon**

→ `/demo/servicekoll`

Sektionen kan också visa användningsområden:

* Bil & verkstad
* Värmepumpar
* Ventilation
* Maskiner
* Företagets egen utrustning

---

# 5. Själva demon

Route:

`/demo/servicekoll`

Demon ska kännas som en separat SaaS-applikation.

Den ska **inte** använda den vanliga marketing-navigationen eller footern.

Använd istället en egen app-layout:

```text
┌────────────────────────────────────────────┐
│ Servicekoll                Demo / Företag  │
├──────────────┬─────────────────────────────┤
│ Dashboard    │                             │
│ Kunder       │                             │
│ Objekt       │         CONTENT             │
│ Service      │                             │
│ Påminnelser  │                             │
│ Importera    │                             │
│ Inställningar│                             │
└──────────────┴─────────────────────────────┘
```

Desktop:

* sidebar

Mobil:

* drawer/bottom navigation eller motsvarande responsiv lösning

Appen får gärna visuellt kännas relaterad till Lindqvist Holmgren men ska inte vara beroende av deras huvudsakliga webbdesign.

---

# 6. Route-struktur

Förslag:

```text
app/

  (marketing)/
    ...
    demos/
      servicekoll/
        page.tsx

  (service-app)/
    demo/
      servicekoll/
        layout.tsx
        page.tsx

        customers/
          page.tsx

        assets/
          page.tsx
          [id]/
            page.tsx

        service/
          page.tsx

        reminders/
          page.tsx

        import/
          page.tsx

        settings/
          page.tsx
```

Alternativt kan produktmodulen isoleras ytterligare:

```text
src/
  features/
    service-platform/
      components/
      actions/
      queries/
      types/
      schemas/
      utils/
      config/
```

Det är önskvärt.

---

# 7. Viktig arkitekturprincip

All produktlogik ska vara generell.

Använd INTE namn som:

```text
Vehicle
CarOwner
CarService
HeatPumpCustomer
```

Använd:

```text
Customer
Asset
ServiceEvent
ServicePlan
Reminder
Organization
```

Branschspecifika benämningar ska ligga i presentationslagret.

Exempel:

I bil-demo kan:

`Asset`

visas som:

**Fordon**

I en värmepumpsdemo:

**Anläggningar**

I intern företagsdemo:

**Utrustning**

Men underliggande datamodell och komponentlogik ska vara densamma.

---

# 8. Multi-tenant från början

Även demon bör modelleras som en multi-tenant-produkt.

Grundmodell:

```text
organization
    ↓
customers
    ↓
assets
    ↓
service_events
    ↓
reminders
```

Alla relevanta tabeller ska ha:

```text
organization_id
```

Det gör att samma framtida applikation kan innehålla många företag utan separata installationer.

---

# 9. Datamodell

MVP-datamodell:

## organizations

```text
id
name
slug
created_at
```

Eventuellt senare:

```text
logo_url
primary_color
industry
settings
```

---

## organization_users

För framtida auth/multi-user.

```text
organization_id
user_id
role
```

Roller behöver inte vara avancerade i MVP.

Exempel:

```text
owner
admin
member
```

---

## customers

En extern kund vars objekt organisationen servar.

```text
id
organization_id
name
company_name nullable
phone nullable
email nullable
external_id nullable
notes nullable
created_at
updated_at
```

Customer ska vara valfri för ett asset.

---

## assets

Det viktigaste objektet i systemet.

```text
id
organization_id
customer_id nullable

name
category
identifier nullable

status

last_service_date nullable
next_service_date nullable
service_interval_months nullable

notes nullable

created_at
updated_at
```

Exempel:

```text
name = "Kia EV3"
category = "vehicle"
identifier = "ABC123"
```

eller:

```text
name = "IVT Geo 512"
category = "heat_pump"
identifier = "SN-183829"
```

eller:

```text
name = "Atlas Copco GA11"
category = "compressor"
identifier = "KOMP-03"
```

### Viktigt

`customer_id` ska vara nullable.

Om:

```text
customer_id != null
```

är det ett kundobjekt.

Om:

```text
customer_id == null
```

är det organisationens eget objekt.

Det gör att samma produkt stödjer både serviceföretag och intern underhållsplanering.

---

## service_events

Historik över utförd service.

```text
id
organization_id
asset_id

performed_at
service_type nullable
notes nullable

next_service_date nullable

created_at
```

När en ny service registreras ska assetets:

```text
last_service_date
next_service_date
```

kunna uppdateras.

---

## reminders

```text
id
organization_id
asset_id

channel
scheduled_at
status
sent_at nullable

created_at
```

Channels:

```text
email
sms
internal
```

Statuses:

```text
scheduled
sent
cancelled
failed
```

I MVP behöver SMS och email inte nödvändigtvis skickas på riktigt.

De kan simuleras visuellt.

---

# 10. Dashboard

Dashboarden är den viktigaste delen av demon.

Den ska omedelbart visa produktens värde.

Överst KPI-cards:

### Aktiva objekt

`1 284`

### Service inom 30 dagar

`47`

### Försenade

`12`

### Planerade påminnelser

`31`

Under dessa:

## Behöver åtgärd

Tabell/lista:

| Objekt         | Kund/ägare    | Nästa service | Status     |
| -------------- | ------------- | ------------- | ---------- |
| Kia EV3 ABC123 | Anna Karlsson | 24 aug        | Om 5 dagar |
| IVT Geo 512    | Svensson AB   | 27 aug        | Om 8 dagar |
| Kompressor 03  | Internt       | 10 aug        | Försenad   |

Prioritera:

1. Försenade
2. Service mycket snart
3. Kommande service

Använd tydliga statusindikatorer.

---

# 11. Kunder

Route:

`/demo/servicekoll/customers`

Visa lista med:

* namn
* företag
* telefon
* email
* antal objekt
* antal objekt med kommande service

Actions:

**Lägg till kund**

Kundsida kan visa:

```text
Karlsson Bygg AB

Kontakt
Anna Karlsson
070...
anna@...

Objekt
3 st

- Kia EV3
- Atlas Copco kompressor
- Truck 2
```

MVP behöver inte ha avancerat CRM.

---

# 12. Objekt

Route:

`/demo/servicekoll/assets`

Lista över alla objekt.

Filter:

* Alla
* Kundobjekt
* Egna objekt
* Service snart
* Försenade

Möjliga kategorier:

```text
vehicle
machine
heat_pump
ventilation
fire_safety
compressor
other
```

Men systemet ska tillåta custom/other.

---

# 13. Objektdetalj

Exempel:

## Kia EV3

**ABC123**

Kund:
Anna Karlsson

Senaste service:
4 september 2025

Nästa service:
4 september 2026

Serviceintervall:
12 månader

Status:
**Service inom 16 dagar**

### Servicehistorik

2025-09-04
Årlig service

2024-09-11
Årlig service

### Påminnelser

✓ 60 dagar – Email – skickad

✓ 30 dagar – Email – skickad

● 14 dagar – SMS – planerad

### Actions

**Registrera service**

**Redigera objekt**

**Planera påminnelse**

---

# 14. Registrera service

Ett enkelt modal/form-flöde.

Fields:

```text
Datum
Typ av service
Anteckningar
Nästa service
```

Om asset har:

```text
service_interval_months = 12
```

kan systemet föreslå:

```text
nästa service = performed_at + 12 månader
```

Användaren ska kunna ändra datumet manuellt.

När service sparas:

* skapa `service_event`
* uppdatera `last_service_date`
* uppdatera `next_service_date`
* gamla framtida reminders kan avbrytas
* nya reminders kan skapas senare

---

# 15. Lägg till objekt

Användaren ska kunna skapa objekt från scratch.

Form:

### Objekt

Namn

Kategori

Identifierare

Exempel-placeholder:

> Registreringsnummer, serienummer eller internt ID

### Ägare

Radio/select:

**Kund**

eller

**Eget objekt**

Om kund:

välj befintlig kund eller:

**+ Skapa ny kund**

### Service

Senaste service

Nästa service

Serviceintervall

Exempel:

`12 månader`

---

# 16. CSV-import

CSV-import ska finnas redan i MVP eftersom den gör produkten betydligt mer realistisk och minskar onboardingfriktion.

Route:

`/demo/servicekoll/import`

Flow:

## Steg 1

Upload CSV.

Exempel:

```csv
customer,phone,email,asset,type,identifier,last_service,next_service
Anna Karlsson,0701234567,anna@example.se,Kia EV3,vehicle,ABC123,2025-09-04,2026-09-04
```

## Steg 2 – Mapping

Systemet läser headers.

Användaren mappar:

```text
Kund → customer
Telefon → phone
Email → email
Objekt → asset
Typ → type
Identifierare → identifier
Senaste service → last_service
Nästa service → next_service
```

Försök automatiskt föreslå mapping baserat på kolumnnamn.

## Steg 3 – Preview

Visa exempel på 5–10 rader.

Visa:

```text
128 objekt hittade
117 kunder identifierade
4 rader behöver granskas
```

## Steg 4

**Importera**

Importen skapar customers + assets.

Avancerad deduplicering är inte nödvändig i första demo-versionen.

---

# 17. Demo-data

Produkten ska kunna köras utan att besökaren behöver skapa eget konto eller egen data.

Det ska finnas färdig seed-data.

Idealt ska olika presets kunna användas.

Exempel:

```text
/demo/servicekoll?industry=automotive
```

Seed/presentation:

* bilar
* registreringsnummer
* bilkunder

```text
/demo/servicekoll?industry=heatpump
```

Seed/presentation:

* värmepumpar
* anläggningar
* privat-/företagskunder

```text
/demo/servicekoll?industry=equipment
```

Seed/presentation:

* företagets egna maskiner
* truckar
* fordon
* utrustning

````

Det behöver inte initialt skapas nya databasrader varje gång.

Demo-dataset kan vara:

- statiskt
- seedat i databas
- eller genererat

Välj den enklaste robusta lösningen.

---

# 18. Demo-mode

Det ska tydligt framgå att användaren befinner sig i en demo.

Exempel topbar:

> **Servicekoll – Demo**

Eventuellt:

**Återställ demo**

Om användaren ändrar demo-data bör det finnas ett enkelt sätt att återställa den.

Undvik att offentliga användare kan förstöra ett gemensamt persistent dataset.

Bra alternativ:

- statiskt demo-state
- per-session state
- separat demo organization per session
- resets

Välj efter komplexitet.

För första MVP:n är per-session/local state acceptabelt om det dramatiskt förenklar bygget.

---

# 19. First-run UX

På första besöket kan användaren få välja:

## Vad vill du hålla koll på?

### Mina kunders objekt

> Jag utför service åt kunder och vill hålla koll på när det är dags att kontakta dem igen.

CTA:

**Visa serviceföretagsdemo**

### Företagets egna objekt

> Jag vill hålla koll på våra fordon, maskiner och utrustning.

CTA:

**Visa underhålls-demo**

Alternativ:

**Visa exempeldata direkt**

---

# 20. Påminnelser

MVP:n ska demonstrera påminnelsefunktionen utan krav på riktig SMS-integration.

Exempelregel:

```text
60 dagar innan → Email
30 dagar innan → Email
14 dagar innan → SMS
7 dagar innan → SMS
````

UI ska kunna visa:

> SMS planerat 21 augusti

och:

> Email skickat 4 augusti

Det är tillräckligt för demo.

Den underliggande modellen ska dock göra det möjligt att senare ansluta:

* Resend
* Twilio
* annan SMS-provider
* cron jobs
* Supabase Edge Functions

---

# 21. Vad MVP:n INTE ska innehålla

Bygg inte detta ännu:

* Nextlane/Kobra-integration
* Fortnox
* externa DMS-integrationer
* faktisk SMS-sändning om det bromsar utvecklingen
* avancerad email automation
* avancerad kalenderbokning
* kundportal för slutkund
* betalningar
* garantihantering
* fordonsregister
* miltalsbaserade serviceplaner
* AI
* avancerat CRM
* avancerade behörigheter
* avancerade rapporter
* native mobile app

Målet är en säljklar demo, inte ett komplett affärssystem.

---

# 22. Framtida integrationer

Arkitekturen ska dock möjliggöra framtida datakällor.

Tänk:

```text
External systems
       ↓
 Integration adapters
       ↓
 Normalized Servicekoll model
       ↓
 Customers / Assets / Service Events
       ↓
 Reminder engine
```

Exempel framtida adapters:

```text
CsvAdapter
NextlaneAdapter
FortnoxAdapter
GenericApiAdapter
```

Resten av produkten ska inte behöva veta var informationen kom ifrån.

Undvik därför att bygga API-specifik logik direkt i UI-komponenterna.

---

# 23. External IDs

För framtida integrationer bör modeller som Customer och Asset kunna få:

```text
external_source nullable
external_id nullable
```

Exempel:

```text
external_source = "nextlane"
external_id = "928173"
```

Det möjliggör framtida synkning utan att bygga om datamodellen.

---

# 24. Framtida SaaS-separation

En viktig kravbild är att Servicekoll senare ska kunna flyttas ut från `lindqvistholmgren.se` till exempelvis:

```text
servicekoll.se
```

eller:

```text
app.servicekoll.se
```

med så lite arbete som möjligt.

Därför:

## Produktkomponenter

Placera produktens komponenter isolerat:

```text
features/service-platform/
```

och inte bland vanliga marketing-components.

## Produktlogik

All business logic ska ligga i produktmodulen.

Exempel:

```text
features/service-platform/
  components/
  data/
  schemas/
  queries/
  mutations/
  services/
  utils/
  types/
```

## Branding

Hårdkoda inte:

```text
"Lindqvist Holmgren"
```

överallt.

Skapa config:

```ts
const servicePlatformConfig = {
  name: "Servicekoll",
  demoMode: true,
}
```

Branding ska senare enkelt kunna bytas.

## Routes

Produktens interna länkar ska helst byggas genom helpers/config snarare än spridda absoluta strings.

## Database

Produktens tabeller ska vara tydligt separerade från Lindqvist Holmgrens CMS-tabeller.

---

# 25. Supabase

Använd befintligt Supabase-projekt initialt.

Det finns ingen anledning att skapa separat backend bara för demon.

Produktens tabeller ska dock vara tydligt grupperade/prefixade eller på annat sätt separerade från CMS-data.

Exempel:

```text
service_organizations
service_customers
service_assets
service_events
service_reminders
```

eller använd ett separat PostgreSQL-schema om det passar den befintliga arkitekturen bättre.

Välj den lösning som passar projektets nuvarande Supabase-setup bäst.

---

# 26. Auth

Offentlig demo ska helst kunna användas utan login.

MVP:

```text
Besökare
→ öppnar demo
→ testar med exempeldata
```

Senare kan CTA finnas:

> Testa med egen data

Då kan Supabase Auth användas och organisation skapas.

Auth-flödet ska därför inte byggas djupt in i demo-komponenterna.

Komponenterna bör kunna fungera med ett givet:

```text
organizationId
```

eller demo-context.

---

# 27. Design

Appen ska kännas:

* modern
* enkel
* professionell
* B2B SaaS
* tydlig snarare än flashy

Prioritera:

* mycket bra informationshierarki
* tydliga statusar
* snabba tabeller/listor
* tydliga CTA
* bra empty states
* responsive design

Använd Lucide för ikoner.

Tailwind för styling.

Återanvänd gärna design tokens från Lindqvist Holmgren där det är lämpligt, men produktens UI ska inte vara beroende av webbplatsens specifika sections/layout.

---

# 28. Viktiga statusar

Assets bör kunna kategoriseras dynamiskt utifrån nästa service.

Exempel:

```text
overdue
due_soon
upcoming
ok
no_service_date
```

Förslag:

**Försenad**
next_service_date < idag

**Snart**
0–30 dagar

**Kommande**
31–90 dagar

**OK**

> 90 dagar

Detta ska helst beräknas snarare än sparas redundant i databasen.

---

# 29. Search och filter

MVP ska gärna ha grundläggande sökning.

Kunder:

```text
search by name/company/email/phone
```

Assets:

```text
search by name/identifier/customer
```

Filter:

```text
status
category
ownership
```

Undvik avancerad facetterad sökning i första versionen.

---

# 30. Empty states

Empty states ska hjälpa användaren framåt.

Exempel Kunder:

> Inga kunder ännu

**Lägg till kund**

**Importera CSV**

Objekt:

> Inga objekt ännu

**Lägg till objekt**

Dashboard:

> Lägg till dina första objekt för att börja hålla koll på kommande service.

---

# 31. Lead generation

Eftersom detta primärt är en lead magnet ska produkten ha en diskret men tydlig väg tillbaka till Lindqvist Holmgren.

Exempel i topbar/sidebar:

> Vill ni ha detta för ert företag?

**Prata med oss**

eller:

> Anpassa Servicekoll till ert företag

CTA till kontaktformulär.

Eventuellt passera med context:

```text
?interest=servicekoll
```

så Lindqvist Holmgren vet vilken demo leadet kommer från.

Undvik aggressiva popups.

---

# 32. Branschspecifika demos

Arkitekturen bör tillåta config:

```ts
const industryPresets = {
  automotive: {
    assetLabel: "Fordon",
    assetPlural: "Fordon",
    identifierLabel: "Registreringsnummer",
  },

  heatpump: {
    assetLabel: "Anläggning",
    assetPlural: "Anläggningar",
    identifierLabel: "Serienummer",
  },

  equipment: {
    assetLabel: "Utrustning",
    assetPlural: "Utrustning",
    identifierLabel: "ID / serienummer",
  },
}
```

Detta är presentationslogik.

Datamodellen fortsätter använda `asset`.

---

# 33. Exempel: bilfirma-demo

Preset:

```text
automotive
```

Dashboard:

> 1 284 aktiva fordon
> 47 service inom 30 dagar
> 12 försenade
> 31 planerade påminnelser

Asset:

```text
Kia EV3
ABC123
Anna Karlsson
```

Detta ska illustrera framtida användning för exempelvis bilverkstäder och återförsäljare utan att kräva Kobra-integration.

---

# 34. Exempel: serviceföretag

Preset:

```text
heatpump
```

Exempel:

```text
IVT Geo 512
Kund: Andersson Fastigheter
Senaste service: 2025-10-02
Nästa service: 2026-10-02
```

Serviceföretaget ser vilka kunder som snart ska kontaktas.

---

# 35. Exempel: internt underhåll

Preset:

```text
equipment
```

Exempel:

```text
Volvo EC220
Truck 02
Atlas Copco GA11
VW Transporter
Brandsläckare lager
```

Ingen external customer krävs.

Systemet används som internt service-/underhållsregister.

---

# 36. Definition av en lyckad MVP

MVP:n är klar när en besökare kan:

1. Öppna Servicekoll från Lindqvist Holmgrens webb.
2. Gå in i en fristående app-liknande demo.
3. Se färdig exempeldata.
4. Förstå vilka objekt som behöver service snart.
5. Navigera kunder.
6. Navigera objekt.
7. Öppna ett objekt och se servicehistorik.
8. Lägga till kund.
9. Lägga till objekt.
10. Registrera service.
11. Se nästa service uppdateras.
12. Se planerade påminnelser.
13. Importera en CSV med mapping/preview.
14. Förstå att samma system fungerar för flera branscher.
15. Klicka vidare till Lindqvist Holmgren för att fråga om en egen lösning.

MVP:n behöver **inte** faktiskt skicka SMS, integrera mot externa DMS-system eller fungera som komplett produktions-SaaS.

---

# 37. Prioriteringsordning

Implementera ungefär i följande ordning:

### Fas 1 – struktur

* produktmodul
* separat app-layout
* routing
* datamodell
* demo preset/config

### Fas 2 – kärnfunktioner

* dashboard
* customers
* assets
* asset detail
* create customer
* create asset

### Fas 3 – service

* service events
* register service
* nästa service
* statusberäkning

### Fas 4 – reminders

* reminder UI
* simulated reminders
* reminder timeline

### Fas 5 – import

* CSV upload
* parsing
* column mapping
* preview
* import

### Fas 6 – polish

* responsive
* loading states
* empty states
* demo reset
* industry presets
* CTA tillbaka till Lindqvist Holmgren

---

# 38. Viktigaste principen

**Bygg inte en bilportal, värmepumpsportal eller maskinportal.**

Bygg en generell serviceplattform där:

```text
Asset = vad som helst som behöver återkommande service
```

och låt branschspecifika presets ändra hur systemet presenteras.

På så sätt kan Lindqvist Holmgren sälja samma tekniska lösning till många olika branscher idag, samtidigt som produkten senare kan lyftas ut ur den befintliga webbplatsen och utvecklas till en egen SaaS med separat domän, branding, Supabase-projekt och repository.
