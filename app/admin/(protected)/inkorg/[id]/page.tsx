import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmailById } from "@/lib/data/emails";
import { getCustomers } from "@/lib/data/customers";
import { getEmailAttachments } from "@/lib/data/files";
import { deleteEmail, matchEmailToCustomer } from "@/lib/actions/emails";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/admin/BackLink";
import { DeleteEmailButton } from "@/components/admin/DeleteEmailButton";
import { BlockSenderButton } from "@/components/admin/BlockSenderButton";
import { EmailHtmlView } from "@/components/admin/EmailHtmlView";
import { FileThumb } from "@/components/admin/FileThumb";
import { formatDateSv } from "@/lib/format";
import { Select } from "@/components/ui/Select";

type Props = { params: Promise<{ id: string }> };

export default async function EmailDetailPage({ params }: Props) {
  const { id } = await params;
  const email = await getEmailById(id);

  if (!email) {
    notFound();
  }

  const [customers, attachments] = await Promise.all([
    email.customerId ? Promise.resolve([]) : getCustomers(),
    getEmailAttachments(email.id),
  ]);

  return (
    <div>
      <BackLink href="/admin/inkorg" label="Tillbaka till inkorg" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-bone">{email.subject || "(Inget ämne)"}</h1>
          <p className="mt-1 text-sm text-stone">
            {email.fromName ? `${email.fromName} · ` : ""}
            {email.fromAddress}
          </p>
          <p className="mt-0.5 text-xs text-stone">{formatDateSv(email.receivedAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BlockSenderButton email={email.fromAddress} />
          <DeleteEmailButton action={deleteEmail.bind(null, email.id)} subject={email.subject || "(Inget ämne)"} />
        </div>
      </div>

      <div className="mt-6">
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
      </div>

      <Card className="mt-8">
        {email.bodyText ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-bone">{email.bodyText}</p>
        ) : email.bodyHtml ? (
          <EmailHtmlView html={email.bodyHtml} />
        ) : (
          <p className="text-sm text-stone">Inget innehåll.</p>
        )}
      </Card>

      {attachments.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-bold text-bone">
            Bilagor <span className="text-stone">({attachments.length})</span>
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {attachments.map((attachment) => (
              <FileThumb
                key={attachment.id}
                filename={attachment.filename}
                contentType={attachment.contentType}
                url={attachment.url}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
