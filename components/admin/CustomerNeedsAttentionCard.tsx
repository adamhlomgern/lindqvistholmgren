import Link from "next/link";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

// Only reflects unanswered messages for now — approvals/follow-ups aren't
// built yet (Etapp 1.6), so this stays honest about what it can actually
// detect instead of showing placeholder categories with nothing behind them.
export function CustomerNeedsAttentionCard({
  customerId,
  latestMessage,
}: {
  customerId: string;
  latestMessage: CustomerMessage | undefined;
}) {
  const waitingForReply = latestMessage?.authorRole === "customer";

  return (
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Behöver hanteras</h2>

      {waitingForReply && latestMessage ? (
        <Link
          href={`/admin/kunder/${customerId}/meddelanden`}
          className="mt-3 flex items-start gap-2.5 rounded-xl bg-coral/10 px-3.5 py-3 transition-colors hover:bg-coral/15"
        >
          <MessageSquareText size={16} className="mt-0.5 shrink-0 text-coral" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-coral">Obesvarat meddelande från {latestMessage.authorLabel}</p>
            <p className="mt-0.5 line-clamp-1 text-sm text-stone">{latestMessage.body}</p>
            <p className="mt-0.5 text-xs text-stone/60">{formatRelativeSv(latestMessage.createdAt)}</p>
          </div>
        </Link>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-sm text-stone">
          <CheckCircle2 size={16} className="text-emerald" />
          Inget som kräver er uppmärksamhet just nu.
        </p>
      )}
    </Card>
  );
}
