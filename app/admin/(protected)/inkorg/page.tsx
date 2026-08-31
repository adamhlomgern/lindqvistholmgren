import Link from "next/link";
import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getRecentEmails } from "@/lib/data/emails";
import { getCustomers } from "@/lib/data/customers";
import { matchEmailToCustomer } from "@/lib/actions/emails";
import { formatDateSv } from "@/lib/format";

// Windows renders <option> against the OS theme, not the page's CSS, unless
// each option carries its own explicit colors.
const optionStyle = { backgroundColor: "var(--color-forest)", color: "var(--color-bone)" };

export default async function AdminInboxPage() {
  const [emails, customers] = await Promise.all([getRecentEmails(100), getCustomers()]);

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
                <div className="min-w-0">
                  <p className="font-display text-base font-bold text-bone">
                    {email.fromName || email.fromAddress}
                  </p>
                  <p className="text-sm text-stone">{email.fromAddress}</p>
                </div>
                <span className="shrink-0 text-xs text-stone">{formatDateSv(email.receivedAt)}</span>
              </div>

              {email.subject && <p className="mt-3 text-sm font-medium text-bone">{email.subject}</p>}
              {email.bodyText && (
                <p className="mt-1 line-clamp-2 text-sm text-stone">{email.bodyText}</p>
              )}

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-bone/10 pt-4">
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
                    <Tag>Ej matchad</Tag>
                    <select
                      name="customerId"
                      defaultValue=""
                      className="rounded-lg border border-bone/10 bg-bone/5 px-2 py-1 text-xs text-bone"
                      style={optionStyle}
                    >
                      <option value="" disabled style={optionStyle}>
                        Koppla till kund…
                      </option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id} style={optionStyle}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-full border border-bone/15 px-2.5 py-1 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
                    >
                      Koppla
                    </button>
                  </form>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
