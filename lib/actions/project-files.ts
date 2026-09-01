"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { logProjectActivity } from "@/lib/data/client-projects";

export type ProjectFileFormState = { error?: string } | undefined;

const MAX_FILE_SIZE = 20 * 1024 * 1024;

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
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Filen är för stor (max 20 MB)." };
  }

  const supabase = createServiceRoleClient();
  const storagePath = `project/${projectId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("attachments").upload(storagePath, file, {
    contentType: file.type || undefined,
  });
  if (uploadError) {
    return { error: `Kunde inte ladda upp filen: ${uploadError.message}` };
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
    return { error: `Kunde inte spara filen: ${insertError.message}` };
  }

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
