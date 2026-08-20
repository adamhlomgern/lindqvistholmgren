"use client";

import { useEffect, useState } from "react";
import { Clock, CreditCard, MapPin, Phone, X } from "lucide-react";
import { Badge } from "@/components/demo/Badge";
import { Button } from "@/components/demo/Button";
import type { Order } from "@/features/restaurant-platform/types";
import { nextStatusActionLabel, orderStatusLabel, orderStatusTone } from "@/features/restaurant-platform/utils/orderStatus";
import { formatClock, formatSek } from "@/features/restaurant-platform/utils/format";

// The card is deliberately terse — phone number, full address and a status
// timeline don't belong on something staff scan dozens of times an hour.
// This is where that detail lives instead, one click away.
export function OrderDetailDrawer({
  order,
  onClose,
  onAdvance,
  onReject,
}: {
  order: Order | null;
  onClose: () => void;
  onAdvance: (order: Order) => void;
  onReject: (order: Order) => void;
}) {
  const [confirmingReject, setConfirmingReject] = useState(false);

  useEffect(() => {
    if (!order) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [order, onClose]);

  if (!order) return null;

  const actionLabel = nextStatusActionLabel(order.status, order.fulfillment);
  const canReject = order.status === "ny";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-demo-text/40 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-demo-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Order #${order.number}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Order #{order.number}</p>
            <Badge tone={orderStatusTone[order.status]} className="mt-1.5">
              {orderStatusLabel(order.status, order.fulfillment)}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="flex h-8 w-8 items-center justify-center rounded-full text-demo-text-muted transition-colors hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Kund</p>
          <p className="mt-1.5 text-sm font-semibold text-demo-text">{order.customerName}</p>
          <a
            href={`tel:${order.customerPhone.replace(/\s|-/g, "")}`}
            className="mt-1 flex items-center gap-1.5 text-sm text-demo-primary hover:underline"
          >
            <Phone size={13} />
            Ring {order.customerPhone}
          </a>
          {order.fulfillment === "delivery" && order.deliveryAddress && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-demo-text-muted">
              <MapPin size={13} className="shrink-0" />
              {order.deliveryAddress}
            </p>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Beställning</p>
          <div className="mt-2 flex flex-col gap-2.5">
            {order.lines.map((line, index) => (
              <div key={index} className="flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-demo-text">
                    {line.quantity} × {line.name}
                  </p>
                  {line.toppings.map((topping) => (
                    <p key={topping.optionId} className="ml-3 text-xs text-demo-text-muted">
                      ↳ {topping.name}
                    </p>
                  ))}
                </div>
                <span className="shrink-0 text-demo-text-muted">{formatSek(line.unitPrice * line.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {order.kitchenNote && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Köksinstruktion</p>
            <p className="mt-1.5 rounded-lg bg-demo-warning-soft px-3 py-2 text-sm text-demo-text">{order.kitchenNote}</p>
          </div>
        )}

        {order.deliveryNote && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Leveransinstruktion</p>
            <p className="mt-1.5 rounded-lg bg-demo-info-soft px-3 py-2 text-sm text-demo-text">{order.deliveryNote}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-demo-border pt-4 text-sm">
          <span className="flex items-center gap-1.5 text-demo-text-muted">
            <CreditCard size={14} />
            Betald
          </span>
          <span className="font-display text-base font-bold text-demo-text">{formatSek(order.total)}</span>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 text-xs text-demo-text-muted">
          <p className="flex items-center gap-1.5">
            <Clock size={12} />
            Mottagen {formatClock(order.createdAt)}
          </p>
          {order.statusUpdatedAt !== order.createdAt && (
            <p className="flex items-center gap-1.5">
              <Clock size={12} />
              Senast uppdaterad {formatClock(order.statusUpdatedAt)}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-6">
          {actionLabel && (
            <Button
              className="transition-transform active:scale-[0.97]"
              onClick={() => {
                onAdvance(order);
                onClose();
              }}
            >
              {actionLabel}
            </Button>
          )}
          {canReject &&
            (confirmingReject ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onReject(order);
                    onClose();
                  }}
                  className="flex-1 rounded-full border border-demo-danger px-4 py-2 text-sm font-semibold text-demo-danger transition-transform hover:bg-demo-danger-soft active:scale-[0.97]"
                >
                  Bekräfta nekad order
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReject(false)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-demo-text-muted hover:text-demo-text"
                >
                  Avbryt
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReject(true)}
                className="rounded-full border border-demo-border px-4 py-2 text-sm font-medium text-demo-text-muted transition-colors hover:border-demo-danger hover:text-demo-danger"
              >
                Neka order
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
