import { notFound } from "next/navigation";
import {
  getClientProjectById,
  getProjectActivity,
  getProjectChecklistItems,
} from "@/lib/data/client-projects";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities } from "@/lib/data/billing";
import { getProjectFiles } from "@/lib/data/files";
import { getProjectApprovals } from "@/lib/data/approvals";
import { getAllMaterialItemsFlat } from "@/lib/data/material";
import { ProjectWorkspace } from "@/components/admin/ProjectWorkspace";

type Props = { params: Promise<{ id: string }> };

export default async function ClientProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, customers, billingEntities, files, checklist, activity, approvals] = await Promise.all([
    getClientProjectById(id),
    getCustomers(),
    getBillingEntities(),
    getProjectFiles(id),
    getProjectChecklistItems(id),
    getProjectActivity(id),
    getProjectApprovals(id),
  ]);

  if (!project) {
    notFound();
  }

  // No customer linked → nothing to pick a material item from and nobody to
  // notify, so the item picker is simply not fetched.
  const materialItems = project.customerId ? await getAllMaterialItemsFlat(project.customerId) : [];

  return (
    <ProjectWorkspace
      project={project}
      customers={customers}
      billingEntities={billingEntities}
      files={files}
      checklist={checklist}
      activity={activity}
      approvals={approvals}
      materialItems={materialItems}
    />
  );
}
