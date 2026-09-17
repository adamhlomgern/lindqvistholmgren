import { notFound } from "next/navigation";
import { getApprovalWithItem } from "@/lib/data/approvals";
import { getClientProjectById } from "@/lib/data/client-projects";
import { ApprovalView } from "@/components/customer/ApprovalView";
import { ReadOnlyApprovalDecisionForm } from "@/components/admin/ReadOnlyApprovalDecisionForm";

type Props = { params: Promise<{ id: string; projectId: string; approvalId: string }> };

export default async function CustomerKundvyApprovalPreview({ params }: Props) {
  const { id, projectId, approvalId } = await params;

  const approval = await getApprovalWithItem(approvalId);
  if (!approval || approval.projectId !== projectId || approval.customerId !== id) {
    notFound();
  }

  const project = await getClientProjectById(projectId);

  return (
    <ApprovalView
      approval={approval}
      projectTitle={project?.title ?? "Projekt"}
      backHref={`/admin/kunder/${id}/kundvy/projekt/${projectId}`}
      DecisionForm={ReadOnlyApprovalDecisionForm}
    />
  );
}
