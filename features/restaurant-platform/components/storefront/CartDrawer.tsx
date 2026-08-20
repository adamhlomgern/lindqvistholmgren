"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Modal } from "@/components/demo/Modal";
import { Button } from "@/components/demo/Button";
import { EmptyState } from "@/components/demo/EmptyState";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { cartLineTotal } from "@/features/restaurant-platform/utils/pricing";
import { formatSek } from "@/features/restaurant-platform/utils/format";

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { cart, cartSubtotal, updateCartQuantity, removeCartLine } = useRestaurantPlatform();

  return (
    <Modal open={open} onClose={onClose} title="Din varukorg">
      {cart.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Varukorgen är tom" description="Lägg till något gott från menyn." />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {cart.map((line) => (
              <div key={line.id} className="flex gap-3 border-b border-demo-border pb-3 last:border-0 last:pb-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-demo-neutral-soft">
                  {line.image ? (
                    <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-demo-text-faint">
                      <UtensilsCrossed size={18} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-demo-text">{line.name}</p>
                    <button
                      type="button"
                      onClick={() => removeCartLine(line.id)}
                      className="shrink-0 text-demo-text-faint hover:text-demo-danger"
                      aria-label="Ta bort"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {line.toppings.length > 0 && (
                    <p className="mt-0.5 text-xs text-demo-text-muted">{line.toppings.map((t) => t.name).join(", ")}</p>
                  )}
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(line.id, Math.max(1, line.quantity - 1))}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-demo-border text-demo-text-muted hover:bg-demo-surface-hover"
                        aria-label="Minska antal"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-3 text-center text-xs font-semibold text-demo-text">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(line.id, line.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-demo-border text-demo-text-muted hover:bg-demo-surface-hover"
                        aria-label="Öka antal"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-demo-text">{formatSek(cartLineTotal(line))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-demo-border pt-4 text-sm font-semibold text-demo-text">
            <span>Delsumma</span>
            <span>{formatSek(cartSubtotal)}</span>
          </div>

          <Button className="w-full" onClick={onCheckout}>
            Gå till kassan
          </Button>
        </div>
      )}
    </Modal>
  );
}
