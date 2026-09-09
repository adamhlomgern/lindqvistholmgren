import { ActionItemsSection } from "@/components/customer/ActionItemsSection";
import { ProjectOverviewCard } from "@/components/customer/ProjectOverviewCard";
import { MessagesPreviewCard } from "@/components/customer/MessagesPreviewCard";
import { CompactContactCard } from "@/components/customer/CompactContactCard";
import { Card } from "@/components/ui/Card";
import type { CustomerActionItem } from "@/lib/data/customer/overview";
import type { BillingEntity, ClientProjectWithCustomer, CustomerMessage } from "@/lib/types";

type Props = {
  activeProjects: ClientProjectWithCustomer[];
  actionItems: CustomerActionItem[];
  recentMessages: CustomerMessage[];
  contact: BillingEntity | undefined;
};

// Order matches the audit: heading, anything needing the customer's action,
// active projects (each self-contained — see ProjectOverviewCard), recent
// messages, then a compact way to reach us.
export function OverviewPage({ activeProjects, actionItems, recentMessages, contact }: Props) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Vad händer nu?</h1>
      <p className="mt-1 text-sm text-stone">
        {activeProjects.length > 0
          ? `${activeProjects.length} ${activeProjects.length === 1 ? "aktivt projekt" : "aktiva projekt"} hos oss just nu.`
          : "Inga aktiva projekt just nu."}
      </p>

      <div className="mt-6">
        <ActionItemsSection actionItems={actionItems} />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {activeProjects.length === 0 ? (
          <Card>
            <p className="text-sm text-stone">Inget aktivt projekt just nu — hör av dig om ni vill starta något nytt.</p>
          </Card>
        ) : (
          activeProjects.map((project) => <ProjectOverviewCard key={project.id} project={project} />)
        )}
      </div>

      <div className="mt-4">
        <MessagesPreviewCard messages={recentMessages} />
      </div>

      <div className="mt-4">
        <CompactContactCard contact={contact} />
      </div>
    </div>
  );
}
