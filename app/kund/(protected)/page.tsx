import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerById } from "@/lib/data/customers";
import { getCustomerOverview } from "@/lib/data/customer/overview";
import { getDefaultBillingEntity } from "@/lib/data/billing";
import { OverviewPage } from "@/components/customer/OverviewPage";

export default async function CustomerOverviewRoute() {
  const { customerId } = await verifyCustomerSession();
  const [customer, overview, defaultContact] = await Promise.all([
    getCustomerById(customerId),
    getCustomerOverview(customerId),
    getDefaultBillingEntity(),
  ]);

  if (!customer) {
    return <p className="text-sm text-stone">Kunde inte hitta kunduppgifterna.</p>;
  }

  return (
    <OverviewPage
      activeProjects={overview.activeProjects}
      latestUpdate={overview.latestUpdate}
      nextMilestone={overview.nextMilestone}
      contact={overview.activeProjects[0]?.assignee ?? defaultContact ?? undefined}
    />
  );
}
