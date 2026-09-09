import type { ReactNode } from "react";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerById } from "@/lib/data/customers";
import { getLatestAdminMessageAt } from "@/lib/data/customer-messages";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const { customerId, lastReadAt } = await verifyCustomerSession();
  const [customer, latestAdminMessageAt] = await Promise.all([
    getCustomerById(customerId),
    getLatestAdminMessageAt(customerId),
  ]);
  const companyName = customer?.company || customer?.name || "Kundportal";
  const hasUnreadMessages = Boolean(latestAdminMessageAt && (!lastReadAt || latestAdminMessageAt > lastReadAt));

  return (
    <div className="flex flex-col bg-forest text-bone md:h-screen md:flex-row">
      <CustomerSidebar companyName={companyName} hasUnreadMessages={hasUnreadMessages} />
      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-10 md:overflow-y-auto md:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
