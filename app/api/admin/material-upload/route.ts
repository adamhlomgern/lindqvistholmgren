import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteStoredFiles, sanitizeStorageFilename } from "@/lib/data/files";
import type { MaterialDeliveryStatus, MaterialVisibility } from "@/lib/types";

// A Route Handler, not a Server Action — Server Actions in this app default
// to a 1MB request-body cap (next.config.ts never raises
// experimental.serverActions.bodySizeLimit), which would silently reject
// most real material uploads. Route Handlers aren't subject to that cap,
// same reason /api/admin/upload (the article image uploader) uses one.
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const BUCKET = "attachments";

type UploadResult = { filename: string; ok: boolean; error?: string };

export async function POST(request: NextRequest) {
  await verifySession();

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "");
  const folderId = String(formData.get("folderId") ?? "") || null;
  const visibility = (String(formData.get("visibility") ?? "internal") as MaterialVisibility) ?? "internal";
  const deliveryStatus = (String(formData.get("deliveryStatus") ?? "draft") as MaterialDeliveryStatus) ?? "draft";
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!customerId) {
    return NextResponse.json({ error: "Ingen kund angiven." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "Inga filer valda." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  let positionQuery = supabase.from("material_items").select("position").order("position", { ascending: false }).limit(1);
  positionQuery = folderId ? positionQuery.eq("folder_id", folderId) : positionQuery.is("folder_id", null);
  const { data: positionRow } = await positionQuery.maybeSingle();
  let nextPosition = (positionRow?.position ?? -1) + 1;

  const results: UploadResult[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      results.push({ filename: file.name, ok: false, error: "För stor (max 20 MB)." });
      continue;
    }

    const storagePath = `material/${customerId}/${folderId ?? "root"}/${crypto.randomUUID()}-${sanitizeStorageFilename(file.name)}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: file.type || undefined,
    });
    if (uploadError) {
      results.push({ filename: file.name, ok: false, error: uploadError.message });
      continue;
    }

    const { error: insertError } = await supabase.from("material_items").insert({
      customer_id: customerId,
      folder_id: folderId,
      type: "file",
      title: file.name,
      filename: file.name,
      content_type: file.type || null,
      size: file.size,
      storage_path: storagePath,
      visibility,
      delivery_status: deliveryStatus,
      position: nextPosition,
    });

    if (insertError) {
      await deleteStoredFiles([storagePath]);
      results.push({ filename: file.name, ok: false, error: insertError.message });
      continue;
    }

    nextPosition += 1;
    results.push({ filename: file.name, ok: true });
  }

  revalidatePath(`/admin/kunder/${customerId}/material`, "layout");
  revalidatePath(`/admin/kunder/${customerId}/kundvy/material`, "layout");
  revalidatePath("/kund/material", "layout");

  return NextResponse.json({ results });
}
