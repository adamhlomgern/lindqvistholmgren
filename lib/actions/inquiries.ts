"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function deleteInquiry(id: string) {
  await verifySession();
  const supabase = createServiceRoleClient();
  await supabase.from("projektforfragningar").delete().eq("id", id);
  redirect("/admin/forfragningar");
}
