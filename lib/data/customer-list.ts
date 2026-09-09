import { getCustomers } from "@/lib/data/customers";
import { getCustomerProjectSummaries } from "@/lib/data/client-projects";
import { getMessageThreadsForAdmin } from "@/lib/data/customer-messages";
import { getLastEmailContactByCustomer } from "@/lib/data/emails";
import { getPortalStatusByCustomerBulk, type PortalStatus } from "@/lib/data/customer-members";
import { getOverdueInvoiceCountsByCustomer } from "@/lib/data/invoices";
import type { Customer } from "@/lib/types";

export type CustomerListRow = {
  customer: Customer;
  activeProjectCount: number;
  waitingOnCustomer: boolean;
  nextMilestone: { label: string; date?: string } | undefined;
  lastContact: string | undefined;
  portalStatus: PortalStatus;
  overdueInvoiceCount: number;
  waitingForReply: boolean;
};

// Six independent, already-bulk queries (one per concern, none of them
// N+1 per customer) merged into one row per customer for the Kunder list
// page — search/filter/sort then happens entirely in the client against
// this already-computed array, no server round trip per interaction.
export async function getCustomerListRows(): Promise<CustomerListRow[]> {
  const [customers, projectSummaries, messageThreads, emailContacts, portalStatuses, overdueInvoiceCounts] =
    await Promise.all([
      getCustomers(),
      getCustomerProjectSummaries(),
      getMessageThreadsForAdmin(),
      getLastEmailContactByCustomer(),
      getPortalStatusByCustomerBulk(),
      getOverdueInvoiceCountsByCustomer(),
    ]);

  const messageThreadByCustomer = new Map(messageThreads.map((thread) => [thread.customerId, thread]));

  return customers.map((customer) => {
    const projectSummary = projectSummaries.get(customer.id);
    const thread = messageThreadByCustomer.get(customer.id);
    const emailContact = emailContacts.get(customer.id);

    const lastContact = [thread?.latestMessage.createdAt, emailContact]
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => b.localeCompare(a))[0];

    return {
      customer,
      activeProjectCount: projectSummary?.activeCount ?? 0,
      waitingOnCustomer: projectSummary?.waitingOnCustomer ?? false,
      nextMilestone: projectSummary?.nextMilestone,
      lastContact,
      portalStatus: portalStatuses.get(customer.id) ?? "none",
      overdueInvoiceCount: overdueInvoiceCounts.get(customer.id) ?? 0,
      waitingForReply: thread?.latestMessage.authorRole === "customer",
    };
  });
}
