import Link from "next/link";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

export function CustomerMessagesPreviewCard({
  customerId,
  messages,
}: {
  customerId: string;
  messages: CustomerMessage[];
}) {
  const latest = messages[messages.length - 1];

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Meddelanden</h2>
        <Link
          href={`/admin/kunder/${customerId}/meddelanden`}
          className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
        >
          Öppna meddelanden
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {latest ? (
        <div className="mt-3 flex items-start gap-2.5">
          <MessageSquareText size={16} className="mt-0.5 shrink-0 text-stone" />
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm text-bone">{latest.body}</p>
            <p className="mt-1 text-xs text-stone/60">
              {latest.authorLabel} · {formatRelativeSv(latest.createdAt)}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-stone">Ingen konversation ännu.</p>
      )}
    </Card>
  );
}
