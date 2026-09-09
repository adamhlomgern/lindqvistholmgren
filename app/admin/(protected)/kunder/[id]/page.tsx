import { getCustomerById } from "@/lib/data/customers";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { getCustomerMessages } from "@/lib/data/customer-messages";
import { getRecentMaterialItems } from "@/lib/data/material";
import { getCustomerMemberStatusCounts } from "@/lib/data/customer-members";
import { buildCustomerActivity } from "@/lib/data/customer-activity";
import { activeStatusOrder } from "@/lib/project-status";
import { CustomerNeedsAttentionCard } from "@/components/admin/CustomerNeedsAttentionCard";
import { CustomerActiveProjectsCard } from "@/components/admin/CustomerActiveProjectsCard";
import { CustomerMessagesPreviewCard } from "@/components/admin/CustomerMessagesPreviewCard";
import { CustomerMaterialsPreviewCard } from "@/components/admin/CustomerMaterialsPreviewCard";
import { CustomerRecentActivityCard } from "@/components/admin/CustomerRecentActivityCard";
import { CustomerContactCard } from "@/components/admin/CustomerContactCard";
import { CustomerPortalSummaryCard } from "@/components/admin/CustomerPortalSummaryCard";
import { CustomerNotesCard } from "@/components/admin/CustomerNotesCard";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  has_invoices: "Kunden har fakturor kopplade till sig och kan inte raderas.",
  unknown: "Något gick fel — kunden kunde inte raderas.",
};

export default async function CustomerOverviewTab({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const [customer, projects, messages, materials, memberCounts] = await Promise.all([
    getCustomerById(id),
    getClientProjectsByCustomerId(id),
    getCustomerMessages(id),
    getRecentMaterialItems(id, 20),
    getCustomerMemberStatusCounts(id),
  ]);

  if (!customer) {
    return null;
  }

  const activeProjects = projects
    .filter((project) => project.status !== "klar")
    .sort((a, b) => activeStatusOrder.indexOf(a.status) - activeStatusOrder.indexOf(b.status));
  const latestMessage = messages[messages.length - 1];
  const activity = buildCustomerActivity(id, messages, materials);

  return (
    <div>
      {error && (
        <p className="mb-6 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
          {errorMessages[error] ?? errorMessages.unknown}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CustomerNeedsAttentionCard customerId={id} latestMessage={latestMessage} />
          <CustomerActiveProjectsCard projects={activeProjects} />
          <div className="grid gap-6 sm:grid-cols-2">
            <CustomerMessagesPreviewCard customerId={id} messages={messages} />
            <CustomerMaterialsPreviewCard customerId={id} materials={materials} />
          </div>
          <CustomerRecentActivityCard activity={activity} />
        </div>

        <div className="flex flex-col gap-6">
          <CustomerContactCard customer={customer} />
          <CustomerPortalSummaryCard customerId={id} memberCounts={memberCounts} />
          <CustomerNotesCard customerId={id} notes={customer.notes} />
        </div>
      </div>
    </div>
  );
}
