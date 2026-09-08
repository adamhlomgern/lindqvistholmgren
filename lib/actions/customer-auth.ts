"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendBrandedEmail } from "@/lib/email/send";
import { isRateLimited } from "@/lib/rate-limit";

const FALLBACK_SITE_URL = "https://lindqvistholmgren.se";

export type CustomerLoginState = { error?: string } | undefined;

export async function loginCustomer(
  _prevState: CustomerLoginState,
  formData: FormData,
): Promise<CustomerLoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Fyll i e-post och lösenord." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`kund-login:${ip}`)) {
    return { error: "För många inloggningsförsök, försök igen om en stund." };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Fel e-post eller lösenord." };
  }

  redirect("/kund");
}

export async function logoutCustomer() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/kund/login");
}

export type RequestPasswordResetState = { message: string } | undefined;

const GENERIC_RESET_MESSAGE = "Om adressen finns hos oss har vi skickat en länk för att återställa lösenordet.";

// Always returns the same message regardless of whether the address exists
// or the send actually succeeded — a distinguishable response here would let
// anyone probe which emails have a customer account.
export async function requestCustomerPasswordReset(
  _prevState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`kund-reset:${ip}`) || isRateLimited(`kund-reset:${email}`)) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  const origin = (await headers()).get("origin") ?? FALLBACK_SITE_URL;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/auth/confirm?next=/kund/valkommen` },
  });

  const actionLink = data?.properties?.action_link;
  if (!error && actionLink) {
    try {
      await sendBrandedEmail({
        to: email,
        subject: "Återställ ditt lösenord – Lindqvist / Holmgren",
        heading: "Återställ ditt lösenord",
        bodyHtml:
          "Vi fick en förfrågan om att återställa lösenordet för ditt konto i kundportalen. Klicka nedan för att sätta ett nytt. Bad du inte om det här kan du bortse från mejlet.",
        ctaLabel: "Sätt nytt lösenord",
        ctaUrl: actionLink,
      });
    } catch (err) {
      console.error("[requestCustomerPasswordReset] Kunde inte skicka mejlet", err);
    }
  }

  return { message: GENERIC_RESET_MESSAGE };
}
