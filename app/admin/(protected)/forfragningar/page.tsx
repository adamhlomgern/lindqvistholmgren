import { Mail, Phone } from "lucide-react";
import { getInquiries } from "@/lib/data/inquiries";
import { deleteInquiry } from "@/lib/actions/inquiries";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { DeleteInquiryButton } from "@/components/admin/DeleteInquiryButton";
import { projectBudgetLabels, projectCategoryLabels, projectTimelineLabels } from "@/lib/constants";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(iso),
  );
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Förfrågningar</h1>
      <p className="mt-1 text-sm text-stone">Inkomna projektförfrågningar från kontaktformuläret.</p>

      <div className="mt-8 flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold text-bone">{inquiry.name}</p>
                {inquiry.company && <p className="text-sm text-stone">{inquiry.company}</p>}
              </div>
              <span className="shrink-0 text-xs text-stone">{formatDate(inquiry.createdAt)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {inquiry.categories.map((category) => (
                <Tag key={category}>{projectCategoryLabels[category]}</Tag>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-stone">{inquiry.description}</p>

            <div className="mt-4 grid gap-3 border-t border-bone/10 pt-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-label text-stone/70">Budget</p>
                <p className="mt-1 text-bone">{projectBudgetLabels[inquiry.budget]}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-label text-stone/70">Tidsram</p>
                <p className="mt-1 text-bone">{projectTimelineLabels[inquiry.timeline]}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-bone/10 pt-4 text-sm">
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-1.5 text-emerald hover:underline"
              >
                <Mail size={14} strokeWidth={2.25} />
                {inquiry.email}
              </a>
              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-1.5 text-emerald hover:underline"
                >
                  <Phone size={14} strokeWidth={2.25} />
                  {inquiry.phone}
                </a>
              )}
              <div className="ml-auto">
                <DeleteInquiryButton
                  action={deleteInquiry.bind(null, inquiry.id)}
                  inquiryName={inquiry.name}
                />
              </div>
            </div>
          </Card>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-stone">Inga förfrågningar ännu.</p>}
      </div>
    </div>
  );
}
