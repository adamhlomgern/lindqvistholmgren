-- Adds the feedback/approval distinction to project_approvals — the
-- audit's point 6 ("en logotypriktning är inte samma sak som att godkänna
-- slutleveransen"). Run this once in the Supabase SQL editor. Safe to run
-- more than once (IF NOT EXISTS / idempotent update).

alter table project_approvals
  add column if not exists kind text not null default 'approval'
  check (kind in ('feedback', 'approval'));

-- Existing rows already got 'approval' from the column default above —
-- this line is only here in case the default didn't apply for some reason
-- (e.g. the column already existed without one).
update project_approvals set kind = 'approval' where kind is null;
