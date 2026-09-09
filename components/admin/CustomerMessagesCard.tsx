"use client";

import { useActionState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { sendAdminMessage } from "@/lib/actions/customer-messages";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

const textareaClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

export function CustomerMessagesCard({ customerId, messages }: { customerId: string; messages: CustomerMessage[] }) {
  const action = sendAdminMessage.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Meddelanden</h2>

      <div className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && <p className="text-sm text-stone">Inga meddelanden ännu.</p>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
              message.authorRole === "admin" ? "self-end bg-emerald/15 text-bone" : "self-start bg-bone/10 text-bone"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.body}</p>
            <p className="mt-1 text-[11px] text-stone/60">
              {message.authorLabel} · {formatRelativeSv(message.createdAt)}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form ref={formRef} action={formAction} className="mt-3 flex items-end gap-2">
        <textarea name="body" required rows={2} placeholder="Skriv ett meddelande till kunden…" className={textareaClasses} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-emerald px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          Skicka
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-coral">{state.error}</p>}
    </Card>
  );
}
