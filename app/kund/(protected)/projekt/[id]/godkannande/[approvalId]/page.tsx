import { notFound } from "next/navigation";
import { requireCustomerAccess } from "@/lib/auth/customer";
import { getApprovalWithItem } from "@/lib/data/approvals";
import { getClientProjectById } from "@/lib/data/client-projects";
import { ApprovalView } from "@/components/customer/ApprovalView";

type Props = { params: Promise<{ id: string; approvalId: string }> };

export default async function CustomerApprovalRoute({ params }: Props) {
  const { id, approvalId } = await params;

  const approval = await getApprovalWithItem(approvalId);
  if (!approval || approval.projectId !== id) {
    notFound();
  }

  await requireCustomerAccess(approval.customerId);

  const project = await getClientProjectById(approval.projectId);

  return <ApprovalView approval={approval} projectTitle={project?.title ?? "Projekt"} />;
}
