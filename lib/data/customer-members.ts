import { createServiceRoleClient } from "@/lib/supabase/server";
import type { CustomerMember } from "@/lib/types";

type CustomerMemberRow = {
  id: string;
  user_id: string;
  customer_id: string;
  invited_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

function toCustomerMember(row: CustomerMemberRow): CustomerMember {
  return {
    id: row.id,
    userId: row.user_id,
    customerId: row.customer_id,
    invitedAt: row.invited_at,
    acceptedAt: row.accepted_at ?? undefined,
    revokedAt: row.revoked_at ?? undefined,
    createdAt: row.created_at,
  };
}

export type CustomerMemberWithEmail = CustomerMember & { email: string };

// auth.users lives outside the public schema PostgREST exposes, so emails
// come from the Admin API per member rather than a join — fine at the
// handful-of-contacts-per-customer scale this is used at.
export async function getCustomerMembers(customerId: string): Promise<CustomerMemberWithEmail[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_members")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCustomerMembers] Supabase-fråga misslyckades", error);
    return [];
  }

  const members = (data ?? []).map((row) => toCustomerMember(row as CustomerMemberRow));

  return Promise.all(
    members.map(async (member) => {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(member.userId);
      return { ...member, email: userError || !userData.user ? "(okänd användare)" : (userData.user.email ?? "(okänd e-post)") };
    }),
  );
}
