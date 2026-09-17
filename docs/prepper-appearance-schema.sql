-- Prepper — Fas 2: ikoner & kurerade accentfärger
--
-- Kör detta manuellt i Supabase SQL-editorn (samma mönster som
-- docs/prepper-app-schema.sql — projektet har ingen lokal migrationskedja).
--
-- icon: ett Lucide-komponentnamn (t.ex. "Baby", "Milk"), begränsat till den
-- kurerade listan i lib/design/prepperAccents.ts på appnivå, inte i databasen.
-- color: en av åtta kurerade nycklar (rose/clay/sage/oat/lavender/blue-grey/
-- burgundy/graphite), samma appnivå-begränsning.

alter table prepper_notebooks add column icon text, add column color text;
alter table prepper_checklists add column icon text, add column color text;
alter table prepper_sections add column icon text, add column color text;
