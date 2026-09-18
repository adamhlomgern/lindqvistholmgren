-- Prepper — Fas 3: task-typer & rik metadata på moment
--
-- Kör detta manuellt i Supabase SQL-editorn (samma mönster som tidigare
-- Prepper-scheman — projektet har ingen lokal migrationskedja).
--
-- type: task | purchase | event | note (begränsas på appnivå, inte i databasen)
-- purchase_status: need | ordered | bought — bara relevant när type = 'purchase'
-- assignee: ada | malin | both
-- image_url: en länk till en bild, inte filuppladdning (ingen Storage-bucket
-- behövs för den här fasen)

alter table prepper_items
  add column type text not null default 'task',
  add column due_date date,
  add column priority boolean not null default false,
  add column purchase_status text,
  add column estimated_price numeric,
  add column actual_price numeric,
  add column link text,
  add column image_url text,
  add column assignee text,
  add column tags text[];
