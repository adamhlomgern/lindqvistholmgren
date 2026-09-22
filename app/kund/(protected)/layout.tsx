import type { ReactNode } from "react";
import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerById } from "@/lib/data/customers";
import { getUnreadMessageCount } from "@/lib/data/customer-messages";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const { customerId, lastReadAt } = await verifyCustomerSession();
  const [customer, unreadMessageCount] = await Promise.all([
    getCustomerById(customerId),
    getUnreadMessageCount(customerId, lastReadAt),
  ]);
  const companyName = customer?.company || customer?.name || "Kundportal";

  return (
    // h-dvh (not just md:h-screen) + main's own overflow-y-auto on every
    // breakpoint, not just desktop — a page like Meddelanden needs a
    // properly height-bound, internally-scrolling ancestor chain to pin its
    // compose bar at the bottom instead of scrolling the whole document.
    // Harmless for every other page: their content just renders inside a
    // scrollable box instead of the bare page, which looks identical.
    <div className="flex h-dvh flex-col bg-forest text-bone md:flex-row">
      <CustomerSidebar companyName={companyName} unreadMessageCount={unreadMessageCount} />
      <main className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 sm:py-10 md:px-10">
        <div className="mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
}
