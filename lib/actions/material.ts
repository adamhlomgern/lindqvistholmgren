"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles } from "@/lib/data/files";
import { encryptText } from "@/lib/crypto/secrets";
import { resolveAdminDisplayName } from "@/lib/format";
import type { MaterialDeliveryStatus, MaterialVisibility } from "@/lib/types";

export type MaterialFormState = { error?: string } | undefined;

function revalidateMaterial(customerId: string) {
  revalidatePath(`/admin/kunder/${customerId}/material`, "layout");
  revalidatePath(`/admin/kunder/${customerId}/kundvy/material`, "layout");
  revalidatePath("/kund/material", "layout");
}

async function nextPosition(
  supabase: ReturnType<typeof createServiceRoleClient>,
  table: "material_folders" | "material_items",
  column: "parent_folder_id" | "folder_id",
  value: string | null,
) {
  let query = supabase.from(table).select("position").order("position", { ascending: false }).limit(1);
  query = value ? query.eq(column, value) : query.is(column, null);
  const { data } = await query.maybeSingle();
  return (data?.position ?? -1) + 1;
}

async function getDescendantFolderIds(customerId: string, folderId: string): Promise<string[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("material_folders").select("id, parent_folder_id").eq("customer_id", customerId);
  const childrenOf = new Map<string, string[]>();
  for (const row of data ?? []) {
    const parentId = row.parent_folder_id as string | null;
    if (!parentId) continue;
    childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), row.id as string]);
  }
  const result: string[] = [];
  function walk(id: string) {
    for (const childId of childrenOf.get(id) ?? []) {
      result.push(childId);
      walk(childId);
    }
  }
  walk(folderId);
  return result;
}

export async function createFolder(
  customerId: string,
  parentFolderId: string | null,
  _prevState: MaterialFormState,
  formData: FormData,
): Promise<MaterialFormState> {
  await verifySession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Namn krävs." };

  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "material_folders", "parent_folder_id", parentFolderId);
  const { error } = await supabase
    .from("material_folders")
    .insert({ customer_id: customerId, parent_folder_id: parentFolderId, name, description, position });

  if (error) return { error: `Kunde inte skapa mappen: ${error.message}` };
  revalidateMaterial(customerId);
}

export async function renameFolder(customerId: string, folderId: string, name: string, description: string) {
  await verifySession();
  const trimmedName = name.trim();
  if (!trimmedName) return { error: "Namn krävs." };

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("material_folders")
    .update({ name: trimmedName, description: description.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", folderId);

  if (error) return { error: `Kunde inte spara: ${error.message}` };
  revalidateMaterial(customerId);
}

// Storage objects aren't cleaned up by cascading FK deletes — every file
// under this folder (and every descendant folder) has to be removed from
// storage before the DB rows disappear.
export async function deleteFolder(customerId: string, folderId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();

  const descendantIds = await getDescendantFolderIds(customerId, folderId);
  const { data: fileRows } = await supabase
    .from("material_items")
    .select("storage_path")
    .in("folder_id", [folderId, ...descendantIds])
    .eq("type", "file")
    .not("storage_path", "is", null);

  await deleteStoredFiles((fileRows ?? []).map((row) => row.storage_path as string));
  await supabase.from("material_folders").delete().eq("id", folderId);

  revalidateMaterial(customerId);
}

export async function createInstruction(
  customerId: string,
  folderId: string | null,
  _prevState: MaterialFormState,
  formData: FormData,
): Promise<MaterialFormState> {
  await verifySession();
  const title = String(formData.get("title") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const visibility = String(formData.get("visibility") ?? "internal") as MaterialVisibility;
  const deliveryStatus = String(formData.get("deliveryStatus") ?? "draft") as MaterialDeliveryStatus;
  const pinned = formData.get("pinned") === "on";

  if (!title) return { error: "Titel krävs." };
  if (!bodyHtml) return { error: "Skriv innehållet i instruktionen." };

  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "material_items", "folder_id", folderId);
  const { error } = await supabase.from("material_items").insert({
    customer_id: customerId,
    folder_id: folderId,
    type: "instruction",
    title,
    body_html: bodyHtml,
    description: description ? encryptText(description) : null,
    visibility,
    delivery_status: deliveryStatus,
    pinned,
    position,
  });

  if (error) return { error: `Kunde inte spara instruktionen: ${error.message}` };
  revalidateMaterial(customerId);
}

export async function createLink(
  customerId: string,
  folderId: string | null,
  _prevState: MaterialFormState,
  formData: FormData,
): Promise<MaterialFormState> {
  await verifySession();
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const visibility = String(formData.get("visibility") ?? "internal") as MaterialVisibility;
  const deliveryStatus = String(formData.get("deliveryStatus") ?? "draft") as MaterialDeliveryStatus;
  const pinned = formData.get("pinned") === "on";

  if (!title) return { error: "Titel krävs." };
  if (!url) return { error: "Länk krävs." };

  const supabase = createServiceRoleClient();
  const position = await nextPosition(supabase, "material_items", "folder_id", folderId);
  const { error } = await supabase.from("material_items").insert({
    customer_id: customerId,
    folder_id: folderId,
    type: "link",
    title,
    url,
    description: description ? encryptText(description) : null,
    visibility,
    delivery_status: deliveryStatus,
    pinned,
    position,
  });

  if (error) return { error: `Kunde inte spara länken: ${error.message}` };
  revalidateMaterial(customerId);
}

export async function deleteMaterialItem(customerId: string, itemId: string, storagePath: string | null) {
  await verifySession();
  const supabase = createServiceRoleClient();

  if (storagePath) await deleteStoredFiles([storagePath]);
  await supabase.from("material_items").delete().eq("id", itemId);

  revalidateMaterial(customerId);
}

// One action for the "Move to…" dialog — handles items and folders in the
// same call so multi-selecting a mix of both still resolves in one action.
export async function moveMaterialItems(
  customerId: string,
  itemIds: string[],
  folderIds: string[],
  targetFolderId: string | null,
) {
  await verifySession();
  const supabase = createServiceRoleClient();

  if (folderIds.length > 0) {
    // A folder can't move into itself or its own descendant — that would
    // orphan it from the tree (or, worse, create a cycle).
    for (const folderId of folderIds) {
      if (targetFolderId === folderId) return { error: "En mapp kan inte flyttas in i sig själv." };
      const descendantIds = await getDescendantFolderIds(customerId, folderId);
      if (targetFolderId && descendantIds.includes(targetFolderId)) {
        return { error: "En mapp kan inte flyttas in i en av sina egna undermappar." };
      }
    }
    const folderPosition = await nextPosition(supabase, "material_folders", "parent_folder_id", targetFolderId);
    await supabase
      .from("material_folders")
      .update({ parent_folder_id: targetFolderId, position: folderPosition, updated_at: new Date().toISOString() })
      .in("id", folderIds);
  }

  if (itemIds.length > 0) {
    const itemPosition = await nextPosition(supabase, "material_items", "folder_id", targetFolderId);
    await supabase
      .from("material_items")
      .update({ folder_id: targetFolderId, position: itemPosition, updated_at: new Date().toISOString() })
      .in("id", itemIds);
  }

  revalidateMaterial(customerId);
}

export async function setMaterialItemVisibility(customerId: string, itemId: string, visibility: MaterialVisibility) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("material_items")
    .update({ visibility, updated_at: new Date().toISOString() })
    .eq("id", itemId);

  revalidateMaterial(customerId);
}

export async function setMaterialItemDeliveryStatus(
  customerId: string,
  itemId: string,
  deliveryStatus: MaterialDeliveryStatus,
) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase
    .from("material_items")
    .update({ delivery_status: deliveryStatus, updated_at: new Date().toISOString() })
    .eq("id", itemId);

  revalidateMaterial(customerId);
}

export async function togglePinned(customerId: string, itemId: string, pinned: boolean) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("material_items").update({ pinned, updated_at: new Date().toISOString() }).eq("id", itemId);

  revalidateMaterial(customerId);
}

// Posts one consolidated chat message about a folder instead of a
// notification per uploaded file — an explicit, deliberate admin action.
export async function notifyCustomerAboutFolder(customerId: string, folderId: string, folderName: string) {
  const { user } = await verifySession();
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("customer_messages").insert({
    customer_id: customerId,
    author_role: "admin",
    author_label: resolveAdminDisplayName(user),
    body: `Nytt material är klart att titta på: "${folderName}" — /kund/material/${folderId}`,
  });
  if (error) return { error: "Kunde inte skicka meddelandet." };

  revalidatePath("/kund/meddelanden");
  revalidatePath(`/admin/kunder/${customerId}`, "layout");
}
