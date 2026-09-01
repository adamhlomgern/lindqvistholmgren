import Link from "next/link";
import { Inbox, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getRecentEmails } from "@/lib/data/emails";
import { getCustomers } from "@/lib/data/customers";
import { getBlockedSenders } from "@/lib/data/blocked-senders";
import { getEmailAttachmentCounts } from "@/lib/data/files";
import { matchEmailToCustomer, deleteEmail, unblockSender } from "@/lib/actions/emails";
import { DeleteEmailButton } from "@/components/admin/DeleteEmailButton";
import { BlockSenderButton } from "@/components/admin/BlockSenderButton";
import { formatDateSv } from "@/lib/format";
import { Select } from "@/components/ui/Select";

export default async function AdminInboxPage() {
  const [emails, customers, blockedSenders] = await Promise.all([
    getRecentEmails(100),
    getCustomers(),
    getBlockedSenders(),
  ]);
  const attachmentCounts = await getEmailAttachmentCounts(emails.map((email) => email.id));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Inkorg</h1>
      <p className="mt-1 text-sm text-stone">
        Inkommande mejl, synkade från företagets mejlbox. Uppdateras automatiskt var 10:e minut.
      </p>

      {emails.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Inbox size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga mejl synkade ännu.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {emails.map((email) => (
            <Card key={email.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link href={`/admin/inkorg/${email.id}`} className="min-w-0">
                  <p className="font-display text-base font-bold text-bone hover:underline">
                    {email.fromName || email.fromAddress}
                  </p>
                  <p className="text-sm text-stone">{email.fromAddress}</p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  {(attachmentCounts.get(email.id) ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-stone">
                      <Paperclip size={12} strokeWidth={2.25} />
                      {attachmentCounts.get(email.id)}
                    </span>
                  )}
                  <span className="text-xs text-stone">{formatDateSv(email.receivedAt)}</span>
                </div>
              </div>

              <Link href={`/admin/inkorg/${email.id}`} className="block">
                {email.subject && (
                  <p className="mt-3 text-sm font-medium text-bone hover:underline">{email.subject}</p>
                )}
                {email.bodyText && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone">{email.bodyText}</p>
                )}
              </Link>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-bone/10 pt-4">
                {email.customerId ? (
                  <Link href={`/admin/kunder/${email.customerId}`}>
                    <Tag className="bg-emerald/15 text-emerald">Matchad kund</Tag>
                  </Link>
                ) : (
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const customerId = String(formData.get("customerId") ?? "");
                      if (customerId) await matchEmailToCustomer(email.id, customerId);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Tag className="shrink-0">Ej matchad</Tag>
                    <Select
                      name="customerId"
                      placeholder="Koppla till kund…"
                      className="w-44 rounded-full px-2.5 py-1 text-xs"
                      options={customers.map((customer) => ({ value: customer.id, label: customer.name }))}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-bone/15 px-2.5 py-1 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
                    >
                      Koppla
                    </button>
                  </form>
                )}
                <div className="flex items-center gap-2">
                  <BlockSenderButton email={email.fromAddress} />
                  <DeleteEmailButton
                    action={deleteEmail.bind(null, email.id)}
                    subject={email.subject || "(Inget ämne)"}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {blockedSenders.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-bone">Blockerade avsändare</h2>
          <div className="mt-4 flex flex-col gap-2">
            {blockedSenders.map((sender) => (
              <div
                key={sender.id}
                className="flex items-center justify-between rounded-2xl bg-bone/5 px-5 py-3"
              >
                <span className="text-sm text-bone">{sender.email}</span>
                <form action={unblockSender.bind(null, sender.id)}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-stone transition-colors hover:text-emerald"
                  >
                    Avblockera
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
