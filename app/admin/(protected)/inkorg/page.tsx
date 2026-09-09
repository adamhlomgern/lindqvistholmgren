import Link from "next/link";
import { Inbox, MessageSquareText, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getRecentEmails } from "@/lib/data/emails";
import { getCustomers } from "@/lib/data/customers";
import { getBlockedSenders } from "@/lib/data/blocked-senders";
import { getEmailAttachmentCounts } from "@/lib/data/files";
import { getMessageThreadsForAdmin } from "@/lib/data/customer-messages";
import { matchEmailToCustomer, deleteEmail, unblockSender } from "@/lib/actions/emails";
import { DeleteEmailButton } from "@/components/admin/DeleteEmailButton";
import { BlockSenderButton } from "@/components/admin/BlockSenderButton";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import { Select } from "@/components/ui/Select";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function AdminInboxPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = tab === "chatt" ? "chatt" : "mejl";

  const [emails, customers, blockedSenders, threads] = await Promise.all([
    getRecentEmails(100),
    getCustomers(),
    getBlockedSenders(),
    getMessageThreadsForAdmin(),
  ]);
  const attachmentCounts = await getEmailAttachmentCounts(emails.map((email) => email.id));
  const waitingThreadsCount = threads.filter((thread) => thread.latestMessage.authorRole === "customer").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Inkorg</h1>
      <p className="mt-1 text-sm text-stone">
        {activeTab === "mejl"
          ? "Inkommande mejl, synkade från företagets mejlbox. Uppdateras automatiskt var 10:e minut."
          : "Chattmeddelanden mellan er och kunder i kundportalen."}
      </p>

      <div className="mt-6 flex items-center gap-1 border-b border-bone/10">
        <Link
          href="/admin/inkorg"
          className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
            activeTab === "mejl" ? "border-emerald text-bone" : "border-transparent text-stone hover:text-bone"
          }`}
        >
          <Inbox size={15} strokeWidth={2.25} />
          Mejl
        </Link>
        <Link
          href="/admin/inkorg?tab=chatt"
          className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
            activeTab === "chatt" ? "border-emerald text-bone" : "border-transparent text-stone hover:text-bone"
          }`}
        >
          <MessageSquareText size={15} strokeWidth={2.25} />
          Chatt
          {waitingThreadsCount > 0 && (
            <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-coral">
              {waitingThreadsCount}
            </span>
          )}
        </Link>
      </div>

      {activeTab === "chatt" ? (
        threads.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
            <MessageSquareText size={24} strokeWidth={2} className="text-stone" />
            <p className="text-sm text-stone">Inga chattmeddelanden ännu.</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {threads.map((thread) => {
              const waitingForReply = thread.latestMessage.authorRole === "customer";
              return (
                <Link key={thread.customerId} href={`/admin/inkorg/chatt/${thread.customerId}`}>
                  <Card className="transition-colors hover:bg-bone/[0.08]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold text-bone">{thread.customerName}</p>
                        <p className="mt-1 line-clamp-1 text-sm text-stone">{thread.latestMessage.body}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="text-xs text-stone">{formatRelativeSv(thread.latestMessage.createdAt)}</span>
                        {waitingForReply && <Tag className="bg-coral/15 text-coral">Väntar på svar</Tag>}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )
      ) : emails.length === 0 ? (
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

      {activeTab === "mejl" && blockedSenders.length > 0 && (
        <div className="mt-10">
          <CollapsibleSection label="Blockerade avsändare" count={blockedSenders.length}>
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
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
}
