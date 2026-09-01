import type { EmailAttachment, ProjectFile } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "attachments";
// Long enough to cover one admin session viewing the page; regenerated on
// every request since files.ts is deliberately uncached.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type StoredFileRow = {
  id: string;
  filename: string;
  content_type: string | null;
  size: number | null;
  storage_path: string;
  created_at: string;
};

type EmailAttachmentRow = StoredFileRow & { email_id: string };
type ProjectFileRow = StoredFileRow & { project_id: string };

function toEmailAttachment(row: EmailAttachmentRow): EmailAttachment {
  return {
    id: row.id,
    emailId: row.email_id,
    filename: row.filename,
    contentType: row.content_type ?? undefined,
    size: row.size ?? undefined,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

function toProjectFile(row: ProjectFileRow): ProjectFile {
  return {
    id: row.id,
    projectId: row.project_id,
    filename: row.filename,
    contentType: row.content_type ?? undefined,
    size: row.size ?? undefined,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

async function withSignedUrls<T extends { storagePath: string }>(
  supabase: ReturnType<typeof createServiceRoleClient>,
  files: T[],
) {
  return Promise.all(
    files.map(async (file) => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(file.storagePath, SIGNED_URL_TTL_SECONDS);
      return { ...file, url: data?.signedUrl ?? null };
    }),
  );
}

// Deliberately uncached: signed URLs expire, and attachments/files can be
// added or removed at any time — this should always reflect current state.
export async function getEmailAttachments(emailId: string): Promise<(EmailAttachment & { url: string | null })[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("email_attachments")
    .select("*")
    .eq("email_id", emailId)
    .order("created_at");

  if (error) {
    console.error("[getEmailAttachments] Supabase-fråga misslyckades", error);
    return [];
  }

  return withSignedUrls(supabase, (data ?? []).map(toEmailAttachment));
}

export async function getProjectFiles(projectId: string): Promise<(ProjectFile & { url: string | null })[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");

  if (error) {
    console.error("[getProjectFiles] Supabase-fråga misslyckades", error);
    return [];
  }

  return withSignedUrls(supabase, (data ?? []).map(toProjectFile));
}

// Bulk count for list views — avoids an N+1 of one getEmailAttachments call
// (and its signed-URL round trips) per row just to show a paperclip badge.
export async function getEmailAttachmentCounts(emailIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (emailIds.length === 0) return counts;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("email_attachments").select("email_id").in("email_id", emailIds);

  if (error) {
    console.error("[getEmailAttachmentCounts] Supabase-fråga misslyckades", error);
    return counts;
  }

  for (const row of data ?? []) {
    counts.set(row.email_id, (counts.get(row.email_id) ?? 0) + 1);
  }
  return counts;
}

// Storage objects aren't cleaned up by Postgres FK cascades — callers that
// delete an email or a project must remove the underlying files themselves,
// before the DB rows disappear, or the paths are lost for good.
export async function deleteStoredFiles(paths: string[]) {
  if (paths.length === 0) return;
  const supabase = createServiceRoleClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error("[deleteStoredFiles] Kunde inte radera filer från storage", error);
}
