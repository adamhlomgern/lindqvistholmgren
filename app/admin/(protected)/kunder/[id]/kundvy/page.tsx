import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { computeCustomerOverview } from "@/lib/data/customer/overview";
import { getDefaultBillingEntity } from "@/lib/data/billing";
import { OverviewPage } from "@/components/customer/OverviewPage";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerKundvyOverviewTab({ params }: Props) {
  const { id } = await params;
  const [projects, defaultContact] = await Promise.all([getClientProjectsByCustomerId(id), getDefaultBillingEntity()]);
  const overview = computeCustomerOverview(projects);

  return (
    <OverviewPage
      activeProjects={overview.activeProjects}
      latestUpdate={overview.latestUpdate}
      nextMilestone={overview.nextMilestone}
      contact={overview.activeProjects[0]?.assignee ?? defaultContact ?? undefined}
    />
  );
}
