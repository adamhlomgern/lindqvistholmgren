import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { insertMaterialFile } from "@/lib/actions/material";
import type { MaterialDeliveryStatus, MaterialVisibility } from "@/lib/types";

// A Route Handler, not a Server Action — Server Actions in this app default
// to a 1MB request-body cap (next.config.ts never raises
// experimental.serverActions.bodySizeLimit), which would silently reject
// most real material uploads. Route Handlers aren't subject to that cap,
// same reason /api/admin/upload (the article image uploader) uses one.
//
// Also the upload endpoint for a project's own files (ProjectFileUploadForm)
// — an optional projectId tags the inserted material_items row so it shows
// up in both the project's file list and the customer's material library,
// instead of the two living in separate tables.
type UploadResult = { filename: string; ok: boolean; error?: string };

export async function POST(request: NextRequest) {
  await verifySession();

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "");
  const projectId = String(formData.get("projectId") ?? "") || null;
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
    const result = await insertMaterialFile(supabase, {
      customerId,
      projectId,
      folderId,
      file,
      visibility,
      deliveryStatus,
      position: nextPosition,
    });

    if (result.error) {
      results.push({ filename: file.name, ok: false, error: result.error });
      continue;
    }

    nextPosition += 1;
    results.push({ filename: file.name, ok: true });
  }

  revalidatePath(`/admin/kunder/${customerId}/material`, "layout");
  revalidatePath(`/admin/kunder/${customerId}/kundvy/material`, "layout");
  revalidatePath("/kund/material", "layout");
  if (projectId) revalidatePath(`/admin/projekt/${projectId}`);

  return NextResponse.json({ results });
}
