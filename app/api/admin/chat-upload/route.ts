import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { insertChatImageMessage, notifyCustomerOfNewMessage } from "@/lib/actions/customer-messages";
import { resolveAdminDisplayName } from "@/lib/format";

// A Route Handler, not a Server Action — same 1MB body-size cap reasoning as
// /api/admin/material-upload.
export async function POST(request: NextRequest) {
  const { user } = await verifySession();

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const file = formData.get("file");

  if (!customerId) {
    return NextResponse.json({ error: "Ingen kund angiven." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ingen bild vald." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const result = await insertChatImageMessage(supabase, {
    customerId,
    authorRole: "admin",
    authorLabel: resolveAdminDisplayName(user),
    body,
    file,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePath(`/admin/kunder/${customerId}`);
  revalidatePath("/kund", "layout");

  await notifyCustomerOfNewMessage(customerId);

  return NextResponse.json({ ok: true });
}
