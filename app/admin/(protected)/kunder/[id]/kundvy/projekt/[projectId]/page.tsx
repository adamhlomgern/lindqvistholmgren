import { notFound } from "next/navigation";
import { getClientProjectById } from "@/lib/data/client-projects";
import { getProjectApprovals } from "@/lib/data/approvals";
import { ProjectDetailView } from "@/components/customer/ProjectDetailView";

type Props = { params: Promise<{ id: string; projectId: string }> };

// Reached both via "Visa som kund" on the project's own admin page (back
// goes to that admin page) and via the kundvy "Projekt" tab's project list
// (which links here directly) — hrefBase keeps the "Nästa steg" milestone
// link and the customer-check below scoped to this preview either way.
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
      hrefBase={`/admin/kunder/${id}/kundvy`}
      backHref={`/admin/projekt/${projectId}`}
      backLabel={project.title}
      approvalHref={(approvalId) => `/admin/kunder/${id}/kundvy/projekt/${projectId}/godkannande/${approvalId}`}
    />
  );
}
