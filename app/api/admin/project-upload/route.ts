import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { storeProjectFile } from "@/lib/actions/project-files";
import { logProjectActivity } from "@/lib/data/client-projects";

// A Route Handler, not a Server Action — Server Actions in this app default
// to a 1MB request-body cap (next.config.ts never raises
// experimental.serverActions.bodySizeLimit), which silently rejected
// ordinary attachments like a customer's logo. Same fix as
// /api/admin/material-upload and /api/admin/upload.
export async function POST(request: NextRequest) {
  await verifySession();

  const formData = await request.formData();
  const projectId = String(formData.get("projectId") ?? "");
  const file = formData.get("file");

  if (!projectId) {
    return NextResponse.json({ error: "Inget projekt angivet." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ingen fil vald." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const result = await storeProjectFile(supabase, projectId, file);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await logProjectActivity(projectId, `Laddade upp filen "${file.name}"`);

  revalidatePath(`/admin/projekt/${projectId}`);

  return NextResponse.json({ ok: true });
}
