"use server";

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
