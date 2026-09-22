-- Merges the legacy `project_files` table into `material_items`, so a
-- project's files and the customer's material library are the same rows
-- instead of two separate, duplicated systems (see docs/kundhubb-och-leads-plan.md
-- line 234 — this was already flagged as the intended direction).
--
-- The app code no longer reads or writes `project_files` as of this change.
-- Run this once in the Supabase SQL editor before/after deploying the code
-- change — order doesn't matter, since the new code paths don't touch
-- `project_files` at all and the old ones are gone.
--
-- Safe to run more than once: the INSERT is keyed off project_files.id via
-- a NOT EXISTS guard, so re-running it won't create duplicates.

-- 1. Sanity check first: any project_files rows attached to a project with
--    no customer_id can't be migrated (material_items.customer_id is
--    required). Run this and look at the result before proceeding — if it
--    returns rows, decide by hand what to do with them (link the project to
--    a customer first, or leave those files behind in project_files/storage).
select pf.id, pf.filename, pf.project_id, cp.title as project_title
from project_files pf
join client_projects cp on cp.id = pf.project_id
where cp.customer_id is null;

-- 2. Migrate. Everything comes in as visibility='internal' (nothing in
--    project_files was ever customer-visible — there was no flag for it),
--    delivery_status='draft', folder_id null (customer's material root).
--    Position continues on from whatever's already in that customer's
--    root folder, ordered by original upload time, so migrated files don't
--    jump ahead of existing material.
with next_position as (
  select customer_id, coalesce(max(position), -1) + 1 as start_position
  from material_items
  where folder_id is null
  group by customer_id
),
ordered as (
  select
    pf.*,
    cp.customer_id as target_customer_id,
    row_number() over (partition by cp.customer_id order by pf.created_at) - 1 as rn
  from project_files pf
  join client_projects cp on cp.id = pf.project_id
  where cp.customer_id is not null
    and not exists (
      select 1 from material_items mi
      where mi.storage_path = pf.storage_path
    )
)
insert into material_items (
  customer_id, project_id, folder_id, type, title, filename, content_type,
  size, storage_path, visibility, delivery_status, pinned, position,
  created_at, updated_at
)
select
  o.target_customer_id,
  o.project_id,
  null,
  'file',
  o.filename,
  o.filename,
  o.content_type,
  o.size,
  o.storage_path,
  'internal',
  'draft',
  false,
  coalesce(np.start_position, 0) + o.rn,
  o.created_at,
  o.created_at
from ordered o
left join next_position np on np.customer_id = o.target_customer_id;

-- 3. Once you've spot-checked the migrated rows (project pages + the
--    customer's material library in admin), the old table is unused and
--    can be dropped. Left commented out deliberately — run it yourself
--    once you're confident, this script won't do it for you.
-- drop table project_files;
