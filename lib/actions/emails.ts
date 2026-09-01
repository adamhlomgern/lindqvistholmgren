"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function matchEmailToCustomer(emailId: string, customerId: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("emails").update({ customer_id: customerId }).eq("id", emailId);

  revalidatePath("/admin/inkorg");
  revalidatePath(`/admin/kunder/${customerId}`);
}

export async function deleteEmail(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("emails").delete().eq("id", id);

  revalidatePath("/admin/inkorg");
  redirect("/admin/inkorg");
}

export async function blockSender(email: string) {
  await verifySession();
  const supabase = createServiceRoleClient();

  await supabase.from("blocked_senders").upsert({ email }, { onConflict: "email" });
  // Also clear out anything already synced from this sender — blocking
  // implies "I don't want to see their mail", not just "stop future mail".
  await supabase.from("emails").delete().ilike("from_address", email);

  revalidatePath("/admin/inkorg");
  redirect("/admin/inkorg");
}

export async function unblockSender(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("blocked_senders").delete().eq("id", id);

  revalidatePath("/admin/inkorg");
}
