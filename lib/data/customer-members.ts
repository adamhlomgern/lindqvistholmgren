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

export type CustomerMemberStatusCounts = { active: number; invited: number; revoked: number };

// Cheap alternative to getCustomerMembers for callers that only need the
// active/invited/revoked counts (the workspace header's status pill, the
// overview's portal summary card) — skips the per-member Admin API email
// lookup entirely, since none of those call sites ever display an email.
// This runs in the customer workspace's shared layout, so it fires on every
// single tab click; the N+1 version was adding a real Admin API round trip
// per contact to every navigation for no visible benefit there.
export async function getCustomerMemberStatusCounts(customerId: string): Promise<CustomerMemberStatusCounts> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_members")
    .select("accepted_at, revoked_at")
    .eq("customer_id", customerId);

  if (error) {
    console.error("[getCustomerMemberStatusCounts] Supabase-fråga misslyckades", error);
    return { active: 0, invited: 0, revoked: 0 };
  }

  let active = 0;
  let invited = 0;
  let revoked = 0;
  for (const row of data ?? []) {
    if (row.revoked_at) revoked += 1;
    else if (row.accepted_at) active += 1;
    else invited += 1;
  }
  return { active, invited, revoked };
}

export type PortalStatus = "none" | "invited" | "active";

// One query for every customer's portal status — the Kunder list page's
// "Kundportal" column and its filter, computed for every row at once.
// Revoked-with-no-other-membership reads as "none" here (matches "Inte
// inbjuden" in the list — the nuance of a past revocation only matters on
// the customer's own Åtkomst tab).
export async function getPortalStatusByCustomerBulk(): Promise<Map<string, PortalStatus>> {
  const statusByCustomer = new Map<string, PortalStatus>();
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("customer_members").select("customer_id, accepted_at, revoked_at");

  if (error) {
    console.error("[getPortalStatusByCustomerBulk] Supabase-fråga misslyckades", error);
    return statusByCustomer;
  }

  for (const row of data ?? []) {
    const customerId = row.customer_id as string;
    const current = statusByCustomer.get(customerId);
    if (current === "active") continue;

    const rowStatus: PortalStatus = row.revoked_at ? "none" : row.accepted_at ? "active" : "invited";
    if (rowStatus === "active" || current === undefined || (current === "none" && rowStatus === "invited")) {
      statusByCustomer.set(customerId, rowStatus);
    }
  }

  return statusByCustomer;
}
