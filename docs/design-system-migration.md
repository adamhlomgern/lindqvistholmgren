# Migrering till det ljusa designsystemet

Branch: `claude/hopeful-brown-wvkdjt`. Inget av detta går live förrän branchen mergas.
Referens: `/designsystem` (utkast 03) och tokens i `app/globals.css`.

## Audit (utgångsläge)

- ~400 `.tsx`-filer, ~32 000 rader under `app/`, `components/`, `lib/`, `features/`.
- Hela sajten, admin, kundportalen och kundportal-demot använder samma mörka vokabulär:
  `bone` (text, ~1 000 ställen), `stone` (dämpad text, ~580), `emerald` (accent, ~320),
  `charcoal` (djupare yta / text på knappar, ~115), `forest` (bakgrund, ~30), `olive`.
- Kategorifärger (`emerald, moss, peach, lavender, coral, sky, rose`) i `lib/design/accents.ts`,
  pastell som är gjord för mörk bakgrund – för ljus på vitt.
- Prepper har ett eget tokenlager (`--color-prepper-*`) och eget typsnitt (Manrope).
- Typsnitt: Space Grotesk (rubriker) + Geist (brödtext).
- `GlassCard` är byggd för mörkt (halvgenomskinlig charcoal + glöd).
- Produktdemona Bokad, Forma, Mumsa och Servicekoll har egna, separata designsystem
  och ingår **inte** (de ska gå att lyfta ut som egna produkter). Kundportal-demot
  ingår, eftersom det visar kundportalen.
- Utanför scope: e-postmallar (`lib/email`) och faktura-PDF (`lib/pdf`).

## Strategi

1. Lägg in semantiska tokens globalt (canvas, surface, fg, fg-muted, line, primary …)
   plus kompletterande färgskalor för kategorier och status.
2. Codemod: byt gamla tokens mot semantiska (`text-bone` → `text-fg`,
   `text-stone` → `text-fg-muted`, `bg-emerald` → `bg-primary` osv.).
3. Gå igenom alla delar för hand: djup, hover, typografi, kontrast.
4. Skärmdumpa varje publik sida + kundportal-demot och kontrollera.

## Checklista

### Grund
- [x] Kompletterande skalor (amber, red, blue, teal, rose) + kategorifärger
- [x] Statusfärger: success, warning, danger, info
- [x] Gamla tokens mappade till ljusa värden som skyddsnät
- [x] Poppins för rubriker sajtbrett (`font-display`), Geist för text
- [x] `globals.css`: body, artikeltypografi, scrollbar, fokusring
- [x] Codemod över app/, components/, lib/, kundportal-demot

### UI-komponenter (`components/ui`)
- [x] Button (primär, sekundär, ghost) med tydliga hovers
- [x] GlassCard → vit yta med kant, skugga och lyft vid hover
- [x] Card, Section (tones), Eyebrow, Tag, AccentBadge
- [x] PageHero, Breadcrumbs, Container
- [x] Select, SlideOver, ConfirmDialog (vita ytor, mörk scrim)

### Publika sajten
- [x] Header + MobileMenu
- [x] Footer
- [x] Startsidan: Hero, LogoCarousel, Stats, Services, FeaturedWork, Process,
      Testimonials, AboutTeaser, Faq, CtaBanner
- [x] Tjänster + tjänstesidor (ServiceHero, ValueProps)
- [x] Projekt / case + galleri + lightbox
- [x] Artiklar: lista, filter, artikelsida, kategoripills
- [x] Om oss, Kontakt, Starta ett projekt (formulär), demos-översikt
- [x] Juridiska sidor, cookiebanner
- [x] OG-bilder

### Kundportal
- [x] Inloggning, glömt lösenord, välkommen
- [x] Layout + sidomeny
- [x] Översikt, projekt, material, meddelanden, godkännanden
- [x] Kundportal-demot (`/demo/kundportal`)

### Admin
- [x] Inloggning, layout + sidomeny
- [x] Översikt, kunder, projekt, fakturor, förfrågningar, inkorg
- [x] Artiklar (editor, förhandsgranskning), kategorier, taggar, portfolio
- [x] Menyer, dialoger, select, lightbox

### Prepper
- [x] Tokens mappade till nya paletten, typsnitt

### Kontroll
- [x] Lint (0 fel) + typkontroll + produktionsbuild
- [x] Skärmdumpar desktop + mobil: startsida, tjänster, projekt, artiklar, om oss,
      kontakt, demos, juridik, 404, cookiebanner, projektmodal, inloggning,
      admin (översikt, kunder, projekt, fakturor, inkorg + detaljsidor), Prepper,
      kundportalen och kundportal-demot
- [x] Inga kvarvarande gamla tokens (`bone`, `stone`, `forest`, `charcoal`, `olive`)
      utanför produktdemona

## Bra att veta

- **Semantiska tokens först.** Skriv `text-fg`, `text-fg-muted`, `bg-surface`,
  `border-line`, `bg-primary` osv. Använd råa skalsteg (`pine-700`, `lilac-200`)
  bara för medvetna färgaccenter.
- **Tones byter färg på allt i en sektion:** `tone-light`, `tone-subtle`, `tone-pine`,
  `tone-lilac` (eller `<Section tone="…">`). En komponent behöver aldrig en egen mörk variant.
- **Djup:** `shadow-card` (vilande kort), `shadow-raised` (hover/lyft), `shadow-pop`
  (menyer, dialoger). `GlassCard` heter kvar men är nu ett vitt kort.
- **Kategorier:** `CategoryPill` + `pillClasses` i `lib/design/accents.ts`. Accentnamnen
  (`emerald`, `peach` …) är oförändrade eftersom de ligger sparade i databasen.
- **Logotyper:** `*-on-light.svg` är de mörka varianterna för ljus bakgrund. Originalen
  (vit + mint) används på mörkt, t.ex. i footern. Kundlogotyperna i karusellen är ljusa
  PNG:er som färgas mörka med CSS-filter.
- **Ej ändrat:** e-postmallar och faktura-PDF har egna färger, och produktdemona
  Bokad, Forma, Mumsa och Servicekoll har sina egna designsystem.
