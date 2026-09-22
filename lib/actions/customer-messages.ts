"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCustomerById } from "@/lib/data/customers";
import { getActiveCustomerMemberEmails } from "@/lib/data/customer-members";
import { deleteStoredFiles, sanitizeStorageFilename } from "@/lib/data/files";
import { sendBrandedEmail } from "@/lib/email/send";
import { resolveAdminDisplayName } from "@/lib/format";

export type MessageFormState = { error?: string } | undefined;

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

// Best-effort: the message is already saved by the caller, so a failed
// notification email should never surface as if the message itself failed
// to send. Shared by the text form action below and both chat-upload Route
// Handlers (admin and customer), so every way of sending an admin message
// triggers the same customer notification.
export async function notifyCustomerOfNewMessage(customerId: string) {
  const recipients = await getActiveCustomerMemberEmails(customerId);
  if (recipients.length === 0) return;

  const origin = (await headers()).get("origin") ?? FALLBACK_SITE_URL;
  const ctaUrl = `${origin}/kund/meddelanden`;

  try {
    await Promise.all(
      recipients.map((to) =>
        sendBrandedEmail({
          to,
          subject: "Nytt meddelande i er kundportal – Lindqvist / Holmgren",
          heading: "Ni har fått ett nytt meddelande",
          bodyHtml: "Vi har skickat ett nytt meddelande till er i kundportalen. Logga in för att läsa det och svara.",
          ctaLabel: "Läs meddelandet",
          ctaUrl,
        }),
      ),
    );
  } catch (err) {
    console.error("[notifyCustomerOfNewMessage] Kunde inte skicka mejlnotis", err);
  }
}

const MAX_CHAT_IMAGE_SIZE = 8 * 1024 * 1024;
const CHAT_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

// Shared by the admin and customer chat-upload Route Handlers (images go
// through a Route Handler, not a Server Action, for the same 1MB body-size
// cap reasoning as /api/admin/material-upload) — keeps the storage-path
// scheme and cleanup-on-failed-insert behavior from drifting between the two.
export async function insertChatImageMessage(
  supabase: ReturnType<typeof createServiceRoleClient>,
  params: { customerId: string; authorRole: "admin" | "customer"; authorLabel: string; body: string; file: File },
): Promise<{ error?: string }> {
  const { customerId, authorRole, authorLabel, body, file } = params;

  if (!CHAT_IMAGE_TYPES.has(file.type)) {
    return { error: "Endast bilder (JPG, PNG, WEBP, AVIF eller GIF) kan skickas." };
  }
  if (file.size > MAX_CHAT_IMAGE_SIZE) {
    return { error: "Bilden är för stor (max 8 MB)." };
  }

  const storagePath = `chat/${customerId}/${crypto.randomUUID()}-${sanitizeStorageFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("attachments").upload(storagePath, file, {
    contentType: file.type,
  });
  if (uploadError) return { error: `Kunde inte ladda upp bilden: ${uploadError.message}` };

  const { error: insertError } = await supabase.from("customer_messages").insert({
    customer_id: customerId,
    author_role: authorRole,
    author_label: authorLabel,
    body,
    attachment_storage_path: storagePath,
    attachment_filename: file.name,
    attachment_content_type: file.type,
    attachment_size: file.size,
  });
  if (insertError) {
    await deleteStoredFiles([storagePath]);
    return { error: `Kunde inte spara meddelandet: ${insertError.message}` };
  }

  return {};
}

export async function sendAdminMessage(
  customerId: string,
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const { user } = await verifySession();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Skriv ett meddelande." };

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("customer_messages").insert({
    customer_id: customerId,
    author_role: "admin",
    author_label: resolveAdminDisplayName(user),
    body,
  });
  if (error) return { error: "Kunde inte skicka meddelandet." };

  revalidatePath(`/admin/kunder/${customerId}`);
  revalidatePath("/kund", "layout");

  await notifyCustomerOfNewMessage(customerId);
}

// customerId is deliberately not a parameter here — it comes straight out of
// the verified session, same as every other customer-facing action, so a
// customer can never post a message into another company's thread.
export async function sendCustomerMessage(
  _prevState: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const { customerId } = await verifyCustomerSession();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Skriv ett meddelande." };

  const customer = await getCustomerById(customerId);
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("customer_messages").insert({
    customer_id: customerId,
    author_role: "customer",
    author_label: customer?.name ?? "Kund",
    body,
  });
  if (error) return { error: "Kunde inte skicka meddelandet." };

  revalidatePath("/kund/meddelanden");
  revalidatePath(`/admin/kunder/${customerId}`);
}

// Called client-side (see components/customer/MarkMessagesRead.tsx) once
// the customer has actually mounted the Meddelanden page — not during
// render, so an automatic prefetch of the route can never mark messages
// read before the customer has actually seen them.
export async function markMessagesRead() {
  const { membershipId } = await verifyCustomerSession();
  const supabase = createServiceRoleClient();
  await supabase.from("customer_members").update({ last_read_at: new Date().toISOString() }).eq("id", membershipId);

  revalidatePath("/kund", "layout");
}
