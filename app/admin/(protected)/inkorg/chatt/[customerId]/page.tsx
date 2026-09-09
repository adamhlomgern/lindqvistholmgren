import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/data/customers";
import { getCustomerMessages } from "@/lib/data/customer-messages";
import { CustomerMessagesCard } from "@/components/admin/CustomerMessagesCard";
import { BackLink } from "@/components/admin/BackLink";

type Props = { params: Promise<{ customerId: string }> };

export default async function InboxChatThreadPage({ params }: Props) {
  const { customerId } = await params;
  const customer = await getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const messages = await getCustomerMessages(customerId);

  return (
    <div>
      <BackLink href="/admin/inkorg?tab=chatt" label="Tillbaka till inkorg" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-bone">
            {customer.company || customer.name}
          </h1>
          {customer.company && <p className="mt-1 text-sm text-stone">{customer.name}</p>}
        </div>
        <Link
          href={`/admin/kunder/${customer.id}`}
          className="shrink-0 text-xs font-medium text-emerald hover:underline"
        >
          Till kundkortet
        </Link>
      </div>

      <div className="mt-8 max-w-xl">
        <CustomerMessagesCard customerId={customer.id} messages={messages} />
      </div>
    </div>
  );
}
