import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { computeCustomerOverview } from "@/lib/data/customer/overview";
import { getLatestCustomerMessages } from "@/lib/data/customer-messages";
import { getDefaultBillingEntity } from "@/lib/data/billing";
import { OverviewPage } from "@/components/customer/OverviewPage";

const RECENT_MESSAGES_LIMIT = 3;

type Props = { params: Promise<{ id: string }> };

export default async function CustomerKundvyOverviewTab({ params }: Props) {
  const { id } = await params;
  const [projects, recentMessages, defaultContact] = await Promise.all([
    getClientProjectsByCustomerId(id),
    getLatestCustomerMessages(id, RECENT_MESSAGES_LIMIT),
    getDefaultBillingEntity(),
  ]);
  const overview = computeCustomerOverview(projects);

  return (
    <OverviewPage
      activeProjects={overview.activeProjects}
      actionItems={overview.actionItems}
      recentMessages={recentMessages}
      contact={overview.activeProjects[0]?.assignee ?? defaultContact ?? undefined}
    />
  );
}
