import { notFound } from "next/navigation";
import {
  getClientProjectById,
  getProjectActivity,
  getProjectChecklistItems,
} from "@/lib/data/client-projects";
import { getCustomers } from "@/lib/data/customers";
import { getBillingEntities } from "@/lib/data/billing";
import { getProjectApprovals } from "@/lib/data/approvals";
import { getAllMaterialItemsFlat, getProjectMaterialItems } from "@/lib/data/material";
import { getCustomerMemberStatusCounts } from "@/lib/data/customer-members";
import { ProjectWorkspace } from "@/components/admin/ProjectWorkspace";

type Props = { params: Promise<{ id: string }> };

export default async function ClientProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, customers, billingEntities, files, checklist, activity, approvals] = await Promise.all([
    getClientProjectById(id),
    getCustomers(),
    getBillingEntities(),
    getProjectMaterialItems(id),
    getProjectChecklistItems(id),
    getProjectActivity(id),
    getProjectApprovals(id),
  ]);

  if (!project) {
    notFound();
  }

  // No customer linked → nothing to pick a material item from and nobody to
  // notify, so the item picker is simply not fetched.
  const [materialItems, activeMemberCount] = project.customerId
    ? await Promise.all([
        getAllMaterialItemsFlat(project.customerId),
        getCustomerMemberStatusCounts(project.customerId).then((counts) => counts.active),
      ])
    : [[], 0];

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
      activeMemberCount={activeMemberCount}
    />
  );
}
