"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";
import { isRateLimited } from "@/lib/rate-limit";

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
