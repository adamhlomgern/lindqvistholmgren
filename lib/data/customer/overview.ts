import { requireCustomerAccess } from "@/lib/auth/customer";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { getPendingApprovalsByCustomerId } from "@/lib/data/approvals";
import { activeStatusOrder } from "@/lib/project-status";
import { getAwaitingCustomerCta } from "@/lib/project-phase";
import type { ClientProjectWithCustomer, ProjectApproval } from "@/lib/types";

export type CustomerActionItem = {
  project: ClientProjectWithCustomer;
  label: string;
  ctaLabel: string;
  href: string;
  due?: string;
};

export type CustomerOverview = {
  activeProjects: ClientProjectWithCustomer[];
  actionItems: CustomerActionItem[];
};

// Pulled out from getCustomerOverview so the admin-side "Kundvy" preview
// (app/admin/(protected)/kunder/[id]/kundvy) can reuse the exact same
// reduction logic without going through requireCustomerAccess, which would
// reject the admin's own session. The customer route below still gates on
// it — this half has no auth concerns of its own, it's pure computation.
export function computeCustomerOverview(
  projects: ClientProjectWithCustomer[],
  pendingApprovals: ProjectApproval[] = [],
): CustomerOverview {
  const activeProjects = projects
    .filter((project) => project.status !== "klar")
    .sort((a, b) => activeStatusOrder.indexOf(a.status) - activeStatusOrder.indexOf(b.status));

  const projectById = new Map(projects.map((project) => [project.id, project]));

  const manualItems: CustomerActionItem[] = activeProjects
    .filter((project) => project.awaitingCustomerLabel)
    .map((project) => {
      const cta = getAwaitingCustomerCta(project.awaitingCustomerType);
      return {
        project,
        label: project.awaitingCustomerLabel!,
        ctaLabel: cta.ctaLabel,
        href: cta.href(project.id),
        due: project.awaitingCustomerDue,
      };
    });

  // Additive to the manual awaitingCustomer* slot above — a project can have
  // both a manual status callout and a real pending approval at once.
  const approvalItems: CustomerActionItem[] = pendingApprovals
    .map((approval): CustomerActionItem | null => {
      const project = projectById.get(approval.projectId);
      if (!project) return null;
      return {
        project,
        label: approval.title,
        ctaLabel: "Granska och godkänn",
        href: `/kund/projekt/${approval.projectId}/godkannande/${approval.id}`,
        due: approval.dueAt,
      };
    })
    .filter((item): item is CustomerActionItem => item !== null);

  const actionItems = [...manualItems, ...approvalItems].sort((a, b) =>
    (a.due ?? "9999").localeCompare(b.due ?? "9999"),
  );

  return { activeProjects, actionItems };
}

export async function getCustomerOverview(customerId: string): Promise<CustomerOverview> {
  await requireCustomerAccess(customerId);
  const [projects, pendingApprovals] = await Promise.all([
    getClientProjectsByCustomerId(customerId),
    getPendingApprovalsByCustomerId(customerId),
  ]);
  return computeCustomerOverview(projects, pendingApprovals);
}
