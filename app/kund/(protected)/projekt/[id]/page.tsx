import { notFound } from "next/navigation";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getProjectApprovals } from "@/lib/data/approvals";
import { ProjectDetailView } from "@/components/customer/ProjectDetailView";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerProjectDetailRoute({ params }: Props) {
  const { id } = await params;
  const { customerId } = await verifyCustomerSession();
  const [project, approvals] = await Promise.all([getClientProjectById(id), getProjectApprovals(id)]);

  // A project id alone isn't enough — it must also belong to the logged-in
  // customer, same pattern as requireCustomerAccess elsewhere.
  if (!project || project.customerId !== customerId) {
    notFound();
  }

  return <ProjectDetailView project={project} approvals={approvals} />;
}
