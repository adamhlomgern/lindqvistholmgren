import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDateSv } from "@/lib/format";
import type { CustomerActionItem } from "@/lib/data/customer/overview";

type Props = { actionItems: CustomerActionItem[] };

// Adapts to the situation per the audit: a real card per pending action when
// something needs the customer, a single compact status row — no big card —
// when nothing does.
export function ActionItemsSection({ actionItems }: Props) {
  if (actionItems.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-stone">
        <CheckCircle2 size={16} className="text-emerald" />
        Du behöver inte göra något just nu.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {actionItems.map((item) => (
        <Card key={`${item.project.id}-${item.label}`} className="border border-peach/20 bg-peach/[0.06]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone">{item.project.title}</p>
              <p className="mt-0.5 text-sm font-medium text-bone">{item.label}</p>
              {item.due && <p className="mt-1 text-xs text-stone">Senast {formatDateSv(item.due)}</p>}
            </div>
            <Link
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              {item.ctaLabel}
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
