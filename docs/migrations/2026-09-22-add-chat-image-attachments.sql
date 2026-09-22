-- Adds image-attachment support to the customer↔admin portal chat
-- (customer_messages) — previously the table only had a text body, so a
-- message could never carry an image. Run this once in the Supabase SQL
-- editor. Safe to run more than once.

alter table customer_messages
  add column if not exists attachment_storage_path text,
  add column if not exists attachment_filename text,
  add column if not exists attachment_content_type text,
  add column if not exists attachment_size integer;

-- body stays whatever type/constraints it already has — an image-only
-- message is sent with body = '' (empty string), never null, so no existing
-- NOT NULL constraint on body needs to change.
