"use client";

import { useActionState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { sendCustomerMessage } from "@/lib/actions/customer-messages";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

const textareaClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

type MessagesPanelProps = {
  messages: CustomerMessage[];
  // Used by the admin-side "Kundvy" preview — that renders this exact
  // component with admin-fetched data so the preview can never drift from
  // what the real page shows, but the compose form calls sendCustomerMessage,
  // which resolves the customer from the *session* — an admin session isn't
  // a customer, so submitting it there would just redirect to /kund/login.
  // Hiding the form avoids that dead end instead of letting someone hit it.
  readOnly?: boolean;
};

export function MessagesPanel({ messages, readOnly = false }: MessagesPanelProps) {
  const [state, formAction, pending] = useActionState(sendCustomerMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Meddelanden</h1>
      <p className="mt-1 text-sm text-stone">Chatta direkt med oss om ert projekt.</p>

      <Card className="mt-8">
        <div className="flex min-h-64 flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-sm text-stone">Inga meddelanden ännu — skriv gärna om du har en fråga.</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                message.authorRole === "customer"
                  ? "self-end bg-emerald/15 text-bone"
                  : "self-start bg-bone/10 text-bone"
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

        {readOnly ? (
          <p className="mt-4 border-t border-bone/10 pt-4 text-xs text-stone/60">
            Det här är en förhandsvisning — meddelanden går inte att skicka härifrån.
          </p>
        ) : (
          <>
            <form ref={formRef} action={formAction} className="mt-4 flex items-end gap-2">
              <textarea name="body" required rows={2} placeholder="Skriv ett meddelande…" className={textareaClasses} />
              <button
                type="submit"
                disabled={pending}
                className="shrink-0 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
              >
                Skicka
              </button>
            </form>
            {state?.error && <p className="mt-2 text-sm text-coral">{state.error}</p>}
          </>
        )}
      </Card>
    </div>
  );
}
