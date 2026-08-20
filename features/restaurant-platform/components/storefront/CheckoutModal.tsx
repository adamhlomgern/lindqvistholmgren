"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Modal } from "@/components/demo/Modal";
import { Button } from "@/components/demo/Button";
import { Field, inputClass } from "@/components/demo/Field";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { orderDeliveryFee } from "@/features/restaurant-platform/utils/pricing";
import { formatSek } from "@/features/restaurant-platform/utils/format";
import type { FulfillmentType, Order } from "@/features/restaurant-platform/types";

export function CheckoutModal({
  open,
  onClose,
  onBack,
  onPlaced,
}: {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onPlaced: (order: Order) => void;
}) {
  const { restaurant, cartSubtotal, placeOrder } = useRestaurantPlatform();

  const canDeliver = restaurant.deliveryEnabled && cartSubtotal >= restaurant.minOrderForDelivery;
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kitchenNote, setKitchenNote] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paying, setPaying] = useState(false);

  const deliveryFee = orderDeliveryFee(fulfillment, restaurant);
  const total = cartSubtotal + deliveryFee;
  const canSubmit = name.trim().length > 1 && phone.trim().length > 3 && (fulfillment === "pickup" || address.trim().length > 3);

  function handleSubmit() {
    if (!canSubmit) return;
    setPaying(true);
    // Ingen riktig betalning i demot — en kort fördröjning ger samma
    // "det här känns på riktigt"-effekt som en verklig kortbetalning.
    setTimeout(() => {
      const order = placeOrder({
        fulfillment,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: fulfillment === "delivery" ? address.trim() : undefined,
        kitchenNote: kitchenNote.trim() || undefined,
        deliveryNote: fulfillment === "delivery" ? deliveryNote.trim() || undefined : undefined,
      });
      setPaying(false);
      onPlaced(order);
    }, 900);
  }

  return (
    <Modal open={open} onClose={onClose} title="Kassa">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold text-demo-text">Hämtsätt</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFulfillment("pickup")}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                fulfillment === "pickup" ? "border-demo-primary bg-demo-primary-soft text-demo-primary-soft-text" : "border-demo-border text-demo-text-muted"
              }`}
            >
              Avhämtning
            </button>
            <button
              type="button"
              disabled={!canDeliver}
              onClick={() => setFulfillment("delivery")}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                fulfillment === "delivery" ? "border-demo-primary bg-demo-primary-soft text-demo-primary-soft-text" : "border-demo-border text-demo-text-muted"
              }`}
            >
              Leverans (+{formatSek(restaurant.deliveryFee)})
            </button>
          </div>
          {restaurant.deliveryEnabled && !canDeliver && (
            <p className="mt-1.5 text-xs text-demo-text-faint">
              Leverans kräver minst {formatSek(restaurant.minOrderForDelivery)} i beställning.
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Namn" htmlFor="checkout-name" required>
            <input id="checkout-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="För- och efternamn" />
          </Field>
          <Field label="Telefon" htmlFor="checkout-phone" required>
            <input id="checkout-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070-123 45 67" />
          </Field>
        </div>

        {fulfillment === "delivery" && (
          <Field label="Leveransadress" htmlFor="checkout-address" required>
            <input id="checkout-address" className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Gata, nummer, ev. lägenhet" />
          </Field>
        )}

        <Field label="Anteckning till köket" htmlFor="checkout-kitchen-note">
          <textarea
            id="checkout-kitchen-note"
            className={`${inputClass} min-h-[64px] resize-none`}
            value={kitchenNote}
            onChange={(e) => setKitchenNote(e.target.value)}
            placeholder="T.ex. allergi, utan lök, sås vid sidan"
          />
        </Field>

        {fulfillment === "delivery" && (
          <Field label="Leveransinstruktion" htmlFor="checkout-delivery-note">
            <textarea
              id="checkout-delivery-note"
              className={`${inputClass} min-h-[64px] resize-none`}
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="T.ex. portkod eller ring vid ankomst"
            />
          </Field>
        )}

        <div className="rounded-xl border border-demo-border p-3.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-demo-text">
            <CreditCard size={15} className="text-demo-primary" />
            Kortbetalning
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <input className={`${inputClass} col-span-2`} placeholder="Kortnummer" inputMode="numeric" defaultValue="4242 4242 4242 4242" />
            <input className={inputClass} placeholder="MM/ÅÅ" defaultValue="12/28" />
            <input className={inputClass} placeholder="CVC" defaultValue="123" />
          </div>
          <p className="mt-2 text-xs text-demo-text-faint">Demo — ingen riktig betalning genomförs.</p>
        </div>

        <div className="flex flex-col gap-1 border-t border-demo-border pt-4 text-sm">
          <div className="flex justify-between text-demo-text-muted">
            <span>Delsumma</span>
            <span>{formatSek(cartSubtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-demo-text-muted">
              <span>Leverans</span>
              <span>{formatSek(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-demo-text">
            <span>Totalt</span>
            <span>{formatSek(total)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack} className="shrink-0">
            Tillbaka
          </Button>
          <Button className="flex-1" disabled={!canSubmit || paying} onClick={handleSubmit}>
            {paying ? "Betalar…" : `Betala ${formatSek(total)}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
