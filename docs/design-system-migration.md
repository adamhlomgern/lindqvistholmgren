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
- [ ] Kompletterande skalor (amber, red, blue, teal, rose) + kategorifärger
- [ ] Statusfärger: success, warning, danger, info
- [ ] Gamla tokens mappade till ljusa värden som skyddsnät
- [ ] Poppins för rubriker sajtbrett (`font-display`), Geist för text
- [ ] `globals.css`: body, artikeltypografi, scrollbar, fokusring
- [ ] Codemod över app/, components/, lib/, kundportal-demot

### UI-komponenter (`components/ui`)
- [ ] Button (primär, sekundär, ghost) med tydliga hovers
- [ ] GlassCard → vit yta med kant, skugga och lyft vid hover
- [ ] Card, Section (tones), Eyebrow, Tag, AccentBadge
- [ ] PageHero, Breadcrumbs, Container
- [ ] Select, SlideOver, ConfirmDialog (vita ytor, mörk scrim)

### Publika sajten
- [ ] Header + MobileMenu
- [ ] Footer
- [ ] Startsidan: Hero, LogoCarousel, Stats, Services, FeaturedWork, Process,
      Testimonials, AboutTeaser, Faq, CtaBanner
- [ ] Tjänster + tjänstesidor (ServiceHero, ValueProps)
- [ ] Projekt / case + galleri + lightbox
- [ ] Artiklar: lista, filter, artikelsida, kategoripills
- [ ] Om oss, Kontakt, Starta ett projekt (formulär), demos-översikt
- [ ] Juridiska sidor, cookiebanner
- [ ] OG-bilder

### Kundportal
- [ ] Inloggning, glömt lösenord, välkommen
- [ ] Layout + sidomeny
- [ ] Översikt, projekt, material, meddelanden, godkännanden
- [ ] Kundportal-demot (`/demo/kundportal`)

### Admin
- [ ] Inloggning, layout + sidomeny
- [ ] Översikt, kunder, projekt, fakturor, förfrågningar, inkorg
- [ ] Artiklar (editor, förhandsgranskning), kategorier, taggar, portfolio
- [ ] Menyer, dialoger, select, lightbox

### Prepper
- [ ] Tokens mappade till nya paletten, typsnitt

### Kontroll
- [ ] Lint + build
- [ ] Skärmdumpar desktop + mobil
- [ ] Inga kvarvarande gamla tokens
