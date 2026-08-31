"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { sendInvoiceEmail, type SendInvoiceState } from "@/lib/actions/invoices";

export function SendInvoiceEmailForm({
  id,
  customerEmail,
}: {
  id: string;
  customerEmail?: string;
}) {
  const action = sendInvoiceEmail.bind(null, id);
  const [state, formAction, pending] = useActionState<SendInvoiceState, FormData>(action, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm(`Skicka fakturan till ${customerEmail}?`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={pending || !customerEmail}
        className="flex items-center gap-1.5 rounded-full bg-emerald px-3.5 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-50"
        title={!customerEmail ? "Kunden saknar e-postadress" : undefined}
      >
        <Send size={14} strokeWidth={2.25} />
        {pending ? "Skickar…" : "Skicka via mejl"}
      </button>
      {state?.error && <p className="mt-2 max-w-xs text-xs text-coral">{state.error}</p>}
      {state?.success && <p className="mt-2 text-xs text-emerald">Fakturan har skickats.</p>}
    </form>
  );
}
