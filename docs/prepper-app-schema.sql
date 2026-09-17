-- Prepper – privat checklist-app under /admin/appar/prepper
--
-- Kör detta manuellt i Supabase SQL-editorn (projektet har ingen lokal
-- migrationskedja eller supabase/-CLI-mapp — se docs/kundhubb-och-leads-plan.md
-- för samma mönster tidigare i projektet).
--
-- Medvetet ingen RLS: hela kodbasen läser/skriver via service-role-klienten
-- och gate:ar åtkomst i appliget via verifySession() (lib/auth/dal.ts), inte
-- via Postgres RLS-policyer (se lib/auth/customer.ts:6-11 för samma princip).
-- Notebooks/checklists/sections/items/subtasks delas mellan alla admins
-- (Ada + Malin) — inget separat workspace-koncept behövs.

create table prepper_notebooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  position integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prepper_checklists (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references prepper_notebooks(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prepper_sections (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references prepper_checklists(id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prepper_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references prepper_sections(id) on delete cascade,
  title text not null,
  note text,
  completed boolean not null default false,
  position integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  completed_by uuid references auth.users(id),
  completed_at timestamptz
);

create table prepper_subtasks (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references prepper_items(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_by uuid references auth.users(id),
  completed_at timestamptz
);

create index on prepper_checklists (notebook_id);
create index on prepper_sections (checklist_id);
create index on prepper_items (section_id);
create index on prepper_subtasks (item_id);
