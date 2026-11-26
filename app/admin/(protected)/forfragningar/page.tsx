import { MapPin, Mail, Phone } from "lucide-react";
import { sourceGroup, sourceLabel } from "@/lib/inquiries/sources";
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

// Gör länkar i meddelandet klickbara (t.ex. en delad skiss från Sajtbyggaren).
function Linkified({ text }: { text: string }) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="break-all text-primary underline underline-offset-2">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

// Källor de senaste 90 dagarna, störst först. Förfrågningar från innan
// källa började sparas räknas inte, så siffrorna växer från noll.
function sourceStats(inquiries: Awaited<ReturnType<typeof getInquiries>>) {
  const since = Date.now() - 90 * 86400000;
  const counts = new Map<string, number>();
  for (const inquiry of inquiries) {
    if (!inquiry.source || new Date(inquiry.createdAt).getTime() < since) continue;
    const group = sourceGroup(inquiry.source);
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();
  const stats = sourceStats(inquiries);
  const max = stats[0]?.[1] ?? 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Förfrågningar</h1>
      <p className="mt-1 text-sm text-fg-muted">Inkomna förfrågningar från sajten, formulären och verktygen.</p>

      <Card className="mt-6">
        <p className="font-display text-base font-semibold text-fg">Var kommer förfrågningarna ifrån?</p>
        <p className="mt-0.5 text-sm text-fg-muted">Senaste 90 dagarna, per knapp eller verktyg.</p>
        {stats.length === 0 ? (
          <p className="mt-4 text-sm text-fg-muted">
            Ingen förfrågan med källa ännu. Nya förfrågningar får källa automatiskt.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {stats.map(([group, count]) => (
              <li key={group} className="grid grid-cols-[10rem_1fr_2rem] items-center gap-3 text-sm sm:grid-cols-[14rem_1fr_2rem]">
                <span className="truncate text-fg">{group}</span>
                <span className="h-2 overflow-hidden rounded-full bg-fg/[0.06]">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
                </span>
                <span className="text-right font-medium tabular-nums text-fg">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-8 flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-fg">{inquiry.name}</p>
                {inquiry.company && <p className="text-sm text-fg-muted">{inquiry.company}</p>}
              </div>
              <span className="shrink-0 text-xs text-fg-muted">{formatDate(inquiry.createdAt)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {inquiry.source && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-lilac-100 px-2.5 py-0.5 text-xs font-medium text-plum-800"
                  title={inquiry.page ? `Skickad från ${inquiry.page}` : undefined}
                >
                  <MapPin size={12} />
                  {sourceLabel(inquiry.source)}
                  {inquiry.page && <span className="font-normal opacity-75">· {inquiry.page}</span>}
                </span>
              )}
              {inquiry.categories.map((category) => (
                <Tag key={category}>{projectCategoryLabels[category]}</Tag>
              ))}
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
              <Linkified text={inquiry.description} />
            </p>

            <div className="mt-4 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-label text-fg-subtle">Budget</p>
                <p className="mt-1 text-fg">{projectBudgetLabels[inquiry.budget]}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-label text-fg-subtle">Tidsram</p>
                <p className="mt-1 text-fg">{projectTimelineLabels[inquiry.timeline]}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-sm">
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                <Mail size={14} strokeWidth={2.25} />
                {inquiry.email}
              </a>
              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-1.5 text-primary hover:underline"
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
        {inquiries.length === 0 && <p className="text-sm text-fg-muted">Inga förfrågningar ännu.</p>}
      </div>
    </div>
  );
}
