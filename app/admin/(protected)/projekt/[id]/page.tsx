import { notFound } from "next/navigation";
import {
  getClientProjectById,
  getProjectActivity,
  getProjectChecklistItems,
} from "@/lib/data/client-projects";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities } from "@/lib/data/billing";
import { getProjectFiles } from "@/lib/data/files";
import { ProjectWorkspace } from "@/components/admin/ProjectWorkspace";

type Props = { params: Promise<{ id: string }> };

export default async function ClientProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, customers, billingEntities, files, checklist, activity] = await Promise.all([
    getClientProjectById(id),
    getCustomers(),
    getBillingEntities(),
    getProjectFiles(id),
    getProjectChecklistItems(id),
    getProjectActivity(id),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectWorkspace
      project={project}
      customers={customers}
      billingEntities={billingEntities}
      files={files}
      checklist={checklist}
      activity={activity}
    />
  );
}
