"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCustomerById } from "@/lib/data/customers";
import { getActiveCustomerMemberEmails } from "@/lib/data/customer-members";
import { sendBrandedEmail } from "@/lib/email/send";
import { resolveAdminDisplayName } from "@/lib/format";

export type MessageFormState = { error?: string } | undefined;

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

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

  // Best-effort: the message is already saved above, so a failed notification
  // email should never surface as if the message itself failed to send.
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
    console.error("[sendAdminMessage] Kunde inte skicka mejlnotis", err);
  }
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
