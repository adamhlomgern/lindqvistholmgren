-- Adds read/unread tracking to the email inbox — there was previously no
-- concept of "has an admin opened this mail" at all, which is exactly what
-- made the inbox badge confusing (nothing distinguished an opened mail from
-- an unopened one). Run this once in the Supabase SQL editor. Safe to run
-- more than once.

alter table emails
  add column if not exists read_at timestamptz;

-- Backfill: mark every mail that already existed before this migration as
-- read, so the new badge doesn't suddenly claim every past mail is unread
-- the moment this runs. Only mail synced after this point starts unread.
update emails set read_at = created_at where read_at is null;
