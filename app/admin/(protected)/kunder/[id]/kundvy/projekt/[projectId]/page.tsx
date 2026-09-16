import { notFound } from "next/navigation";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getProjectApprovals } from "@/lib/data/approvals";
import { ProjectDetailView } from "@/components/customer/ProjectDetailView";

type Props = { params: Promise<{ id: string; projectId: string }> };

export default async function CustomerKundvyProjectTab({ params }: Props) {
  const { id, projectId } = await params;
  const [project, approvals] = await Promise.all([
    getClientProjectById(projectId),
    getProjectApprovals(projectId),
  ]);

  // Same "id must belong to this customer" check the real customer route
  // makes against the session — here checked against the kundvy route's
  // own customer id instead, so a mistyped projectId can't preview another
  // customer's project.
  if (!project || project.customerId !== id) {
    notFound();
  }

  return <ProjectDetailView project={project} approvals={approvals} hrefBase={`/admin/kunder/${id}/kundvy`} />;
}
