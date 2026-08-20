"use client";

import Link from "next/link";
import { Check, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { Badge } from "@/components/demo/Badge";
import { EmptyState } from "@/components/demo/EmptyState";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";
import { statusSequence, orderStatusLabel, orderStatusTone } from "@/features/restaurant-platform/utils/orderStatus";
import { formatClock, formatSek } from "@/features/restaurant-platform/utils/format";

export function OrderTrackingView({ orderId }: { orderId: string }) {
  const { getOrder, restaurant } = useRestaurantPlatform();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Hittade ingen order"
        description="Ordern kan ha försvunnit om demot återställdes. Lägg gärna en ny beställning."
        action={
          <Link href={mumsaRoutes.storefront()} className="text-sm font-semibold text-demo-primary hover:underline">
            Till menyn
          </Link>
        }
      />
    );
  }

  const sequence = statusSequence(order.fulfillment);
  const currentIndex = sequence.indexOf(order.status);
  const estimatedReady = new Date(new Date(order.createdAt).getTime() + restaurant.estimatedPrepMinutes * 60_000);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div className="text-center">
        <p className="text-sm text-demo-text-muted">Order #{order.number}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-demo-text">Tack, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-1 text-sm text-demo-text-muted">
          {order.fulfillment === "delivery" ? "Vi levererar så fort den är klar." : "Vi hör av oss så fort den är redo att hämtas."}
        </p>
      </div>

      {order.status === "avbruten" ? (
        <Card className="text-center">
          <Badge tone="danger">Avbruten</Badge>
          <p className="mt-2 text-sm text-demo-text-muted">Restaurangen har avbrutit den här ordern.</p>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between">
            <Badge tone={orderStatusTone[order.status]}>{orderStatusLabel(order.status, order.fulfillment)}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-demo-text-muted">
              <Clock size={13} />
              Beräknat klart {formatClock(estimatedReady.toISOString())}
            </span>
          </div>
          <div className="mt-5 flex items-center gap-1">
            {sequence.map((status, index) => (
              <div key={status} className="flex flex-1 items-center gap-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index <= currentIndex ? "bg-demo-primary text-white" : "bg-demo-neutral-soft text-demo-text-faint"
                    }`}
                  >
                    {index < currentIndex ? <Check size={13} /> : index + 1}
                  </span>
                  <span className="max-w-[64px] text-center text-[10px] leading-tight text-demo-text-muted">
                    {orderStatusLabel(status, order.fulfillment)}
                  </span>
                </div>
                {index < sequence.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full ${index < currentIndex ? "bg-demo-primary" : "bg-demo-border"}`} />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card padding="compact">
        <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">Beställning</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {order.lines.map((line, index) => (
            <div key={index} className="flex justify-between gap-3 text-sm">
              <div>
                <p className="text-demo-text">
                  {line.quantity} × {line.name}
                </p>
                {line.toppings.length > 0 && (
                  <p className="text-xs text-demo-text-muted">{line.toppings.map((t) => t.name).join(", ")}</p>
                )}
              </div>
              <span className="shrink-0 text-demo-text-muted">{formatSek(line.unitPrice * line.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1 border-t border-demo-border pt-3 text-sm">
          <div className="flex justify-between text-demo-text-muted">
            <span>Delsumma</span>
            <span>{formatSek(order.subtotal)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-demo-text-muted">
              <span>Leverans</span>
              <span>{formatSek(order.deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-demo-text">
            <span>Totalt</span>
            <span>{formatSek(order.total)}</span>
          </div>
        </div>
        {order.fulfillment === "delivery" && order.deliveryAddress && (
          <div className="mt-3 flex items-center gap-2 border-t border-demo-border pt-3 text-sm text-demo-text-muted">
            <MapPin size={14} className="shrink-0 text-demo-primary" />
            {order.deliveryAddress}
          </div>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2 text-center text-xs text-demo-text-faint">
        <p>Nyfiken på hur restaurangen ser den här ordern? Byt till fliken &quot;Restaurang&quot; högst upp.</p>
        <Link href={mumsaRoutes.storefront()} className="font-semibold text-demo-primary hover:underline">
          Beställ igen
        </Link>
      </div>
    </div>
  );
}
