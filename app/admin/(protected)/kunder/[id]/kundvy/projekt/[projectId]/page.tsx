import { notFound } from "next/navigation";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getProjectApprovals } from "@/lib/data/approvals";
import { ProjectDetailView } from "@/components/customer/ProjectDetailView";

type Props = { params: Promise<{ id: string; projectId: string }> };

// Reached via "Visa som kund" on the project's own admin page, not from the
// kundvy tabs — a project preview isn't one of the customer's top-level
// sections, it's a drill-down from a specific project.
export default async function CustomerKundvyProjectPreview({ params }: Props) {
  const { id, projectId } = await params;
  const [project, approvals] = await Promise.all([getClientProjectById(projectId), getProjectApprovals(projectId)]);

  if (!project || project.customerId !== id) {
    notFound();
  }

  return (
    <ProjectDetailView
      project={project}
      approvals={approvals}
      backHref={`/admin/projekt/${projectId}`}
      backLabel={project.title}
      approvalHref={(approvalId) => `/admin/kunder/${id}/kundvy/projekt/${projectId}/godkannande/${approvalId}`}
    />
  );
}
