"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { logProjectActivity } from "@/lib/data/client-projects";

export type ProjectFileFormState = { error?: string } | undefined;

const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Shared by the standalone upload form (existing project) and project
// creation (files attached before the project row even had a page of its
// own) — kept as one function so the storage-path scheme and cleanup-on-
// failed-insert behavior can't drift between the two call sites.
export async function storeProjectFile(
  supabase: ReturnType<typeof createServiceRoleClient>,
  projectId: string,
  file: File,
): Promise<{ error?: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return { error: `${file.name} är för stor (max 20 MB).` };
  }

  const storagePath = `project/${projectId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("attachments").upload(storagePath, file, {
    contentType: file.type || undefined,
  });
  if (uploadError) {
    return { error: `Kunde inte ladda upp ${file.name}: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase.from("project_files").insert({
    project_id: projectId,
    filename: file.name,
    content_type: file.type || null,
    size: file.size,
    storage_path: storagePath,
  });
  if (insertError) {
    await deleteStoredFiles([storagePath]);
    return { error: `Kunde inte spara ${file.name}: ${insertError.message}` };
  }

  return {};
}

export async function uploadProjectFile(
  projectId: string,
  _prevState: ProjectFileFormState,
  formData: FormData,
): Promise<ProjectFileFormState> {
  await verifySession();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Ingen fil vald." };
  }

  const supabase = createServiceRoleClient();
  const result = await storeProjectFile(supabase, projectId, file);
  if (result.error) return result;

  await logProjectActivity(projectId, `Laddade upp filen "${file.name}"`);

  revalidatePath(`/admin/projekt/${projectId}`);
}

export async function deleteProjectFile(projectId: string, fileId: string, storagePath: string, filename: string) {
  await verifySession();
  const supabase = createServiceRoleClient();

  await deleteStoredFiles([storagePath]);
  await supabase.from("project_files").delete().eq("id", fileId);

  await logProjectActivity(projectId, `Tog bort filen "${filename}"`);

  revalidatePath(`/admin/projekt/${projectId}`);
}
