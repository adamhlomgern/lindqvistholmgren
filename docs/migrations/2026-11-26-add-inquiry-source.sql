-- Sparar var en projektförfrågan kom ifrån: vilken knapp eller vilket verktyg
-- (source, t.ex. "hero", "hemsidekollen", "sajtbyggaren") och från vilken sida
-- (page, t.ex. "/tjanster/webb"). Visas i Admin → Förfrågningar.
-- Kör en gång i Supabase SQL-editorn. Säker att köra flera gånger.
-- Sajten fungerar även innan den körts; då sparas förfrågan utan källa.

alter table projektforfragningar
  add column if not exists source text,
  add column if not exists page text;
