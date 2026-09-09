import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Membership is looked up with the service-role client, same as every other
// data access in this app (see lib/supabase/server.ts) — there's no RLS to
// lean on here, so this lookup plus the customerId comparison in
// requireCustomerAccess() below is the one place that decides what a
// customer session may see. Every new customer-facing data/action function
// must call requireCustomerAccess() before touching customer data.
export const verifyCustomerSession = cache(async () => {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/kund/login");
  }

  const serviceClient = createServiceRoleClient();
  const { data, error } = await serviceClient
    .from("customer_members")
    .select("id, customer_id, last_read_at")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .maybeSingle();

  if (error) {
    console.error("[verifyCustomerSession] Supabase-fråga misslyckades", error);
    redirect("/kund/login");
  }

  if (!data) {
    redirect("/kund/login");
  }

  return {
    user,
    membershipId: data.id,
    customerId: data.customer_id as string,
    lastReadAt: data.last_read_at as string | null,
  };
});

// Every customer-facing data/action function calls this first with the
// customerId it's about to read or mutate — a mismatch means the logged-in
// contact is trying to reach another company's data.
export async function requireCustomerAccess(customerId: string) {
  const session = await verifyCustomerSession();
  if (session.customerId !== customerId) {
    notFound();
  }
  return session;
}
