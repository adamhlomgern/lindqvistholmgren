"use client";

import { updateInvoiceStatus } from "@/lib/actions/invoices";
import type { InvoiceStatus } from "@/lib/types";

const buttonClasses =
  "rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/10";

function StatusButton({
  id,
  status,
  label,
  confirmMessage,
}: {
  id: string;
  status: InvoiceStatus;
  label: string;
  confirmMessage?: string;
}) {
  const action = updateInvoiceStatus.bind(null, id, status);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (confirmMessage && !confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className={buttonClasses}>
        {label}
      </button>
    </form>
  );
}

export function InvoiceStatusActions({ id, status }: { id: string; status: InvoiceStatus }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "utkast" && <StatusButton id={id} status="skickad" label="Markera som skickad" />}
      {status === "skickad" && (
        <>
          <StatusButton id={id} status="betald" label="Markera som betald" />
          <StatusButton
            id={id}
            status="utkast"
            label="Återställ till utkast"
            confirmMessage="Återställ fakturan till utkast? Den blir då redigerbar igen."
          />
        </>
      )}
      {status === "betald" && (
        <StatusButton
          id={id}
          status="utkast"
          label="Återställ till utkast"
          confirmMessage="Återställ fakturan till utkast? Den blir då redigerbar igen."
        />
      )}
    </div>
  );
}
