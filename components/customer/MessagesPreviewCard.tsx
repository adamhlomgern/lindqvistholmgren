import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

type Props = { messages: CustomerMessage[] };

// A compact preview, not the full thread — "Öppna meddelande" always goes
// to the real chat. An unread message here doesn't imply the customer must
// act (that's what ActionItemsSection is for); it's just new information.
export function MessagesPreviewCard({ messages }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-bone">Senaste meddelanden</h3>
        <Link href="/kund/meddelanden" className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline">
          Öppna meddelande
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </div>
      {messages.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-stone">
          <MessageSquareText size={15} className="text-stone/60" />
          Inga meddelanden ännu.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-stone">{message.authorLabel}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-bone">{message.body}</p>
              </div>
              <span className="shrink-0 text-xs text-stone/60">{formatRelativeSv(message.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
