import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCustomerById } from "@/lib/data/customers";
import { insertChatImageMessage } from "@/lib/actions/customer-messages";

// A Route Handler, not a Server Action — same 1MB body-size cap reasoning as
// /api/admin/material-upload. customerId comes from the verified session,
// same as sendCustomerMessage, so a customer can never post into another
// company's thread.
export async function POST(request: NextRequest) {
  const { customerId } = await verifyCustomerSession();

  const formData = await request.formData();
  const body = String(formData.get("body") ?? "").trim();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ingen bild vald." }, { status: 400 });
  }

  const customer = await getCustomerById(customerId);
  const supabase = createServiceRoleClient();
  const result = await insertChatImageMessage(supabase, {
    customerId,
    authorRole: "customer",
    authorLabel: customer?.name ?? "Kund",
    body,
    file,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePath("/kund/meddelanden");
  revalidatePath(`/admin/kunder/${customerId}`);

  return NextResponse.json({ ok: true });
}
