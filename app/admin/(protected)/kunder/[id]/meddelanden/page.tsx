import Link from "next/link";
import { getCustomerMessages } from "@/lib/data/customer-messages";
import { getEmailsForCustomer } from "@/lib/data/emails";
import { CustomerMessagesCard } from "@/components/admin/CustomerMessagesCard";
import { Card } from "@/components/ui/Card";
import { formatDateSv } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerMessagesTab({ params }: Props) {
  const { id } = await params;
  const [messages, emails] = await Promise.all([getCustomerMessages(id), getEmailsForCustomer(id)]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-display text-lg font-semibold text-fg">Portalchatt</h2>
        <p className="mt-1 text-sm text-fg-muted">Direktkonversation med kunden i kundportalen.</p>
        <div className="mt-4 max-w-xl">
          <CustomerMessagesCard customerId={id} messages={messages} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-fg">E-post</h2>
        <p className="mt-1 text-sm text-fg-muted">Mejl som kommit in och kopplats till den här kunden.</p>
        {emails.length === 0 ? (
          <p className="mt-4 text-sm text-fg-muted">Inga mejl kopplade ännu.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {emails.map((email) => (
              <Link key={email.id} href={`/admin/inkorg/${email.id}`} className="block">
                <Card className="transition-colors hover:bg-fg/[0.08]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-fg">{email.subject || "(Inget ämne)"}</p>
                    <span className="shrink-0 text-xs text-fg-muted">{formatDateSv(email.receivedAt)}</span>
                  </div>
                  {email.bodyText && <p className="mt-1 line-clamp-2 text-xs text-fg-muted">{email.bodyText}</p>}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
