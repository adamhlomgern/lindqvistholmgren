import { notFound } from "next/navigation";
import { getApprovalWithItem } from "@/lib/data/approvals";
import { getClientProjectById } from "@/lib/data/client-projects";
import { ApprovalView } from "@/components/customer/ApprovalView";
import { ReadOnlyApprovalDecisionForm } from "@/components/admin/ReadOnlyApprovalDecisionForm";

type Props = { params: Promise<{ id: string; projectId: string; approvalId: string }> };

export default async function CustomerKundvyApprovalTab({ params }: Props) {
  const { id, projectId, approvalId } = await params;

  const approval = await getApprovalWithItem(approvalId);
  if (!approval || approval.projectId !== projectId || approval.customerId !== id) {
    notFound();
  }

  const project = await getClientProjectById(approval.projectId);
  const hrefBase = `/admin/kunder/${id}/kundvy`;

  return (
    <ApprovalView
      approval={approval}
      projectTitle={project?.title ?? "Projekt"}
      backHref={`${hrefBase}/projekt/${approval.projectId}`}
      DecisionForm={ReadOnlyApprovalDecisionForm}
    />
  );
}
