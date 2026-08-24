"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { MapPin, Navigation2, Phone } from "lucide-react";
import { Button } from "@/components/demo/Button";
import type { Order } from "@/features/restaurant-platform/types";
import type { Tone } from "@/components/demo/tokens";
import { formatSek, minutesSince } from "@/features/restaurant-platform/utils/format";
import { urgencyLevel, urgencyTone } from "@/features/restaurant-platform/utils/orderStatus";
import { deliveryPayoutSek } from "@/features/restaurant-platform/utils/courier";

const timeToneClasses: Record<Tone, string> = {
  primary: "text-demo-primary",
  danger: "text-demo-danger",
  warning: "text-demo-warning",
  info: "text-demo-info",
  neutral: "text-demo-text-muted",
};

const timeToneBorderClasses: Record<Tone, string> = {
  primary: "border-l-demo-primary",
  danger: "border-l-demo-danger",
  warning: "border-l-demo-warning",
  info: "border-l-demo-info",
  neutral: "border-l-transparent",
};

const toneCssVar: Record<Tone, string> = {
  primary: "var(--color-demo-primary)",
  danger: "var(--color-demo-danger)",
  warning: "var(--color-demo-warning)",
  info: "var(--color-demo-info)",
  neutral: "var(--color-demo-neutral)",
};

// "Att hämta" gets a shorter fuse than "ute på leverans" — a pizza sitting
// on the counter is a food-quality problem within minutes, while a driving
// leg legitimately takes longer before it's worth flagging.
const PICKUP_LATE_MINUTES = 8;
const ACTIVE_LATE_MINUTES = 25;

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function CourierOrderCard({
  order,
  mode,
  actionLabel,
  onAction,
  highlighted,
  justMoved,
}: {
  order: Order;
  mode: "pickup" | "active";
  actionLabel: string;
  onAction: (order: Order) => void;
  highlighted?: boolean;
  justMoved?: Tone;
}) {
  const minutes = minutesSince(order.statusUpdatedAt);
  const lateAfter = mode === "pickup" ? PICKUP_LATE_MINUTES : ACTIVE_LATE_MINUTES;
  const urgency = urgencyLevel(minutes, lateAfter);
  const tone = urgencyTone[urgency];
  const timeLabel = urgency === "late" ? `SEN · ${minutes} min` : `${minutes} min`;
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <motion.div
      layout
      layoutId={`courier-order-${order.id}`}
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }, default: { duration: 0.2 } }}
      style={highlighted || justMoved ? ({ "--flash-color": toneCssVar[justMoved ?? "primary"] } as CSSProperties) : undefined}
      className={`flex flex-col gap-3 rounded-2xl border border-demo-border border-l-4 ${timeToneBorderClasses[tone]} bg-demo-surface p-4 ${
        highlighted ? "animate-new-order" : justMoved ? "animate-status-flash" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-xs font-bold uppercase tracking-label ${timeToneClasses[tone]}`}>
            {mode === "pickup" ? "Väntar på hämtning" : "Ute på leverans"} · {timeLabel}
          </p>
          <p className="mt-0.5 font-display text-sm font-bold text-demo-text">
            {order.customerName} <span className="font-sans text-xs font-normal text-demo-text-faint">#{order.number}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-demo-primary-soft px-2.5 py-1 text-xs font-bold text-demo-primary-soft-text">
          +{deliveryPayoutSek(order)} kr
        </span>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-demo-neutral-soft px-3 py-2.5">
        <MapPin size={16} className="mt-0.5 shrink-0 text-demo-text-muted" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-demo-text">{order.deliveryAddress}</p>
          {order.deliveryNote && <p className="mt-0.5 text-xs text-demo-text-muted">{order.deliveryNote}</p>}
        </div>
      </div>

      <p className="text-xs text-demo-text-muted">
        {itemCount} {itemCount === 1 ? "artikel" : "artiklar"} · {formatSek(order.total)}
      </p>

      <div className="flex items-center gap-2">
        <a
          href={telHref(order.customerPhone)}
          title={`Ring ${order.customerName}`}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-demo-border px-3.5 py-2.5 text-xs font-semibold text-demo-text-muted transition-colors hover:border-demo-text-muted hover:text-demo-text"
        >
          <Phone size={14} />
          <span className="hidden sm:inline">Ring</span>
        </a>
        {order.deliveryAddress && (
          <a
            href={mapsUrl(order.deliveryAddress)}
            target="_blank"
            rel="noopener noreferrer"
            title="Öppna i Google Maps"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-demo-border px-3.5 py-2.5 text-xs font-semibold text-demo-text-muted transition-colors hover:border-demo-text-muted hover:text-demo-text"
          >
            <Navigation2 size={14} />
            <span className="hidden sm:inline">Navigera</span>
          </a>
        )}
        <Button className="flex-1 px-3.5 py-2.5 text-sm transition-transform active:scale-[0.97]" onClick={() => onAction(order)}>
          {actionLabel}
        </Button>
      </div>
    </motion.div>
  );
}
