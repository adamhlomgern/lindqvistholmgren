"use client";

import { ActionItemsSection } from "@/components/customer/ActionItemsSection";
import { ProjectOverviewCard } from "@/components/customer/ProjectOverviewCard";
import { MessagesPreviewCard } from "@/components/customer/MessagesPreviewCard";
import { CompactContactCard } from "@/components/customer/CompactContactCard";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";
import { buildDemoApprovals, buildDemoProject, demoAssignee, demoMessages } from "@/features/customer-portal-demo/data/seed";
import type { CustomerActionItem } from "@/lib/data/customer/overview";

const BASE = "/demo/kundportal";

// Not a reuse of the real OverviewPage — that runs projects through
// computeCustomerOverview's "klar" filter, which would make the finished
// project vanish from the overview right when the brief wants it shown
// prominently as complete. This composes the same building blocks directly
// off the demo's own state instead.
export function DemoOverview() {
  const demo = useCustomerPortalDemo();
  const project = buildDemoProject(demo.finalMaterialsUnlocked);
  const approvals = buildDemoApprovals(demo);
  const pendingApproval = approvals.find((approval) => approval.status === "pending");

  const actionItems: CustomerActionItem[] = pendingApproval
    ? [
        {
          project,
          label: pendingApproval.title,
          ctaLabel: "Granska slutversionen",
          href: `${BASE}/godkannande/${pendingApproval.id}`,
          due: pendingApproval.dueAt,
        },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">
        {demo.finalMaterialsUnlocked ? "Klart! Er identitet är levererad" : "Ditt sista godkännande behövs"}
      </h1>
      <p className="mt-1 text-sm text-stone">
        {demo.finalMaterialsUnlocked
          ? "Slutleveransen finns i materialbiblioteket, redo att användas."
          : "1 aktivt projekt hos oss just nu."}
      </p>

      <div className="mt-6">
        <ActionItemsSection actionItems={actionItems} />
      </div>

      <div className="mt-8">
        <ProjectOverviewCard project={project} hrefBase={BASE} />
      </div>

      <div className="mt-4">
        <MessagesPreviewCard messages={demoMessages} hrefBase={BASE} />
      </div>

      <div className="mt-4">
        <CompactContactCard contact={demoAssignee} hrefBase={BASE} />
      </div>
    </div>
  );
}
