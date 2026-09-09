import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerById } from "@/lib/data/customers";
import { getCustomerOverview } from "@/lib/data/customer/overview";
import { getLatestCustomerMessages } from "@/lib/data/customer-messages";
import { getDefaultBillingEntity } from "@/lib/data/billing";
import { OverviewPage } from "@/components/customer/OverviewPage";

const RECENT_MESSAGES_LIMIT = 3;

export default async function CustomerOverviewRoute() {
  const { customerId } = await verifyCustomerSession();
  const [customer, overview, recentMessages, defaultContact] = await Promise.all([
    getCustomerById(customerId),
    getCustomerOverview(customerId),
    getLatestCustomerMessages(customerId, RECENT_MESSAGES_LIMIT),
    getDefaultBillingEntity(),
  ]);

  if (!customer) {
    return <p className="text-sm text-stone">Kunde inte hitta kunduppgifterna.</p>;
  }

  return (
    <OverviewPage
      activeProjects={overview.activeProjects}
      actionItems={overview.actionItems}
      recentMessages={recentMessages}
      contact={overview.activeProjects[0]?.assignee ?? defaultContact ?? undefined}
    />
  );
}
