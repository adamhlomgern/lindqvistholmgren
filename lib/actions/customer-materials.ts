"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { encryptText } from "@/lib/crypto/secrets";

export type CustomerMaterialFormState = { error?: string } | undefined;

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const BUCKET = "attachments";

// Admin-only: the customer side is read-only for materials (logos, files,
// credentials notes) — the agency uploads/writes these, the customer just
// picks them up. Title plus either a file or a note (or both) is required,
// so an item is never blank.
export async function addCustomerMaterial(
  customerId: string,
  _prevState: CustomerMaterialFormState,
  formData: FormData,
): Promise<CustomerMaterialFormState> {
  await verifySession();

  const title = String(formData.get("title") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;
  const fileEntry = formData.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (!title) {
    return { error: "Titel krävs." };
  }
  if (!note && !file) {
    return { error: "Lägg till en fil eller en text." };
  }
  if (file && file.size > MAX_FILE_SIZE) {
    return { error: `${file.name} är för stor (max 20 MB).` };
  }

  const supabase = createServiceRoleClient();
  let storagePath: string | null = null;

  if (file) {
    storagePath = `customer/${customerId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: file.type || undefined,
    });
    if (uploadError) {
      return { error: `Kunde inte ladda upp ${file.name}: ${uploadError.message}` };
    }
  }

  const { error: insertError } = await supabase.from("customer_materials").insert({
    customer_id: customerId,
    title,
    note: note ? encryptText(note) : null,
    filename: file?.name ?? null,
    content_type: file?.type || null,
    size: file?.size ?? null,
    storage_path: storagePath,
  });

  if (insertError) {
    if (storagePath) await deleteStoredFiles([storagePath]);
    return { error: `Kunde inte spara: ${insertError.message}` };
  }

  revalidatePath(`/admin/kunder/${customerId}`);
  revalidatePath("/kund/material");
}

export async function deleteCustomerMaterial(customerId: string, materialId: string, storagePath: string | null) {
  await verifySession();
  const supabase = createServiceRoleClient();

  if (storagePath) await deleteStoredFiles([storagePath]);
  await supabase.from("customer_materials").delete().eq("id", materialId);

  revalidatePath(`/admin/kunder/${customerId}`);
  revalidatePath("/kund/material");
}
