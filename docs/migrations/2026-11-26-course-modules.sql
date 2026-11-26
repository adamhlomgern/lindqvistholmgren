-- Kunskapsbanken: moduler (= artikelkategorier) får egen ordning, en kort
-- beskrivning och egen ordning på lektionerna. Redigeras i Admin → Kategorier.
-- Kör en gång i Supabase SQL-editorn. Säker att köra flera gånger.
-- Sajten fungerar även innan den körts (bokstavsordning och datumordning).

alter table article_categories
  add column if not exists position integer,
  add column if not exists description text,
  add column if not exists lesson_order text[];
