import { requireCustomerAccess } from "@/lib/auth/customer";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { activeStatusOrder } from "@/lib/project-status";
import type { ClientProjectWithCustomer } from "@/lib/types";

export type CustomerOverview = {
  activeProjects: ClientProjectWithCustomer[];
  latestUpdate: ClientProjectWithCustomer | undefined;
  nextMilestone: ClientProjectWithCustomer | undefined;
};

// Pulled out from getCustomerOverview so the admin-side "Kundvy" preview
// (app/admin/(protected)/kunder/[id]/kundvy) can reuse the exact same
// reduction logic without going through requireCustomerAccess, which would
// reject the admin's own session. The customer route below still gates on
// it — this half has no auth concerns of its own, it's pure computation.
export function computeCustomerOverview(projects: ClientProjectWithCustomer[]): CustomerOverview {
  const activeProjects = projects
    .filter((project) => project.status !== "klar")
    .sort((a, b) => activeStatusOrder.indexOf(a.status) - activeStatusOrder.indexOf(b.status));

  const latestUpdate = [...projects]
    .filter((project) => project.customerUpdateAt)
    .sort((a, b) => (b.customerUpdateAt ?? "").localeCompare(a.customerUpdateAt ?? ""))[0];

  const nextMilestone = [...activeProjects]
    .filter((project) => project.nextMilestoneDate)
    .sort((a, b) => (a.nextMilestoneDate ?? "").localeCompare(b.nextMilestoneDate ?? ""))[0];

  return { activeProjects, latestUpdate, nextMilestone };
}

export async function getCustomerOverview(customerId: string): Promise<CustomerOverview> {
  await requireCustomerAccess(customerId);
  const projects = await getClientProjectsByCustomerId(customerId);
  return computeCustomerOverview(projects);
}
