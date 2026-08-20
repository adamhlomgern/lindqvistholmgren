"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { Button } from "@/components/demo/Button";
import { Field, inputClass } from "@/components/demo/Field";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";
import { menuItems } from "@/features/restaurant-platform/data/menu";
import { dayLabel, formatHoursRange } from "@/features/restaurant-platform/utils/hours";
import { formatSek } from "@/features/restaurant-platform/utils/format";

const brandColors = [
  { name: "Terracotta", value: "#e2542b" },
  { name: "Tomatröd", value: "#c0392b" },
  { name: "Basilika", value: "#4b7a3f" },
  { name: "Senapsgul", value: "#c8871f" },
  { name: "Aubergine", value: "#6b3f5f" },
];

const steps = ["Namn & varumärke", "Meny", "Öppettider", "Leverans", "Klart"];

export function OnboardingWizard() {
  const router = useRouter();
  const { restaurant, updateRestaurant, setDeliveryEnabled } = useRestaurantPlatform();
  const [step, setStep] = useState(0);

  const sunday = restaurant.openingHours.find((h) => h.day === 0);
  const sundayClosed = !sunday?.open;

  function toggleSundayClosed() {
    updateRestaurant({
      openingHours: restaurant.openingHours.map((hours) =>
        hours.day === 0 ? { ...hours, open: sundayClosed ? "13:00" : null, close: sundayClosed ? "21:00" : null } : hours,
      ),
    });
  }

  const pizzaItems = menuItems.filter((item) => item.categoryId === "cat-pizza");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                index <= step ? "bg-demo-primary text-white" : "bg-demo-neutral-soft text-demo-text-faint"
              }`}
            >
              {index < step ? <Check size={13} /> : index + 1}
            </div>
            {index < steps.length - 1 && <div className={`h-0.5 flex-1 ${index < step ? "bg-demo-primary" : "bg-demo-border"}`} />}
          </div>
        ))}
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-label text-demo-text-muted">
          Steg {step + 1} av {steps.length}
        </p>
        <h1 className="mt-1 font-display text-xl font-bold text-demo-text">{steps[step]}</h1>

        {step === 0 && (
          <div className="mt-5 flex flex-col gap-4">
            <Field label="Restaurangnamn" htmlFor="onb-name">
              <input id="onb-name" className={inputClass} value={restaurant.name} onChange={(e) => updateRestaurant({ name: e.target.value })} />
            </Field>
            <Field label="Kort beskrivning" htmlFor="onb-tagline">
              <input id="onb-tagline" className={inputClass} value={restaurant.tagline} onChange={(e) => updateRestaurant({ tagline: e.target.value })} />
            </Field>
            <div>
              <p className="text-xs font-medium text-demo-text-muted">Varumärkesfärg</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {brandColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateRestaurant({ brandColor: color.value })}
                    title={color.name}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      restaurant.brandColor === color.value ? "ring-2 ring-offset-2 ring-offset-demo-surface" : ""
                    }`}
                    style={{ backgroundColor: color.value, ...(restaurant.brandColor === color.value ? { boxShadow: `0 0 0 2px ${color.value}` } : {}) }}
                  >
                    {restaurant.brandColor === color.value && <Check size={15} className="text-white" />}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-demo-text-faint">Färgen används direkt i hela er beställningssida.</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-sm text-demo-text-muted">
              <Sparkles size={14} className="text-demo-primary" />
              Vi har fyllt i en pizzeria-meny åt er som utgångspunkt — redigera fritt senare.
            </p>
            {pizzaItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-demo-border p-2.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  {item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-demo-text">{item.name}</p>
                </div>
                <span className="text-sm text-demo-text-muted">{formatSek(item.price)}</span>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col divide-y divide-demo-border rounded-xl border border-demo-border">
              {restaurant.openingHours.map((hours) => (
                <div key={hours.day} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
                  <span className="text-demo-text">{dayLabel(hours.day)}</span>
                  <span className="text-demo-text-muted">{formatHoursRange(hours)}</span>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2.5 text-sm text-demo-text">
              <input type="checkbox" checked={sundayClosed} onChange={toggleSundayClosed} className="accent-[var(--color-demo-primary)]" />
              Stängt på söndagar
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="mt-5 flex flex-col gap-4">
            <label className="flex items-center justify-between rounded-xl border border-demo-border p-3.5">
              <span className="text-sm font-medium text-demo-text">Erbjud hemleverans</span>
              <input
                type="checkbox"
                checked={restaurant.deliveryEnabled}
                onChange={(e) => setDeliveryEnabled(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-demo-primary)]"
              />
            </label>
            {restaurant.deliveryEnabled && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Leveransavgift (kr)" htmlFor="onb-fee">
                  <input
                    id="onb-fee"
                    type="number"
                    className={inputClass}
                    value={restaurant.deliveryFee}
                    onChange={(e) => updateRestaurant({ deliveryFee: Number(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Minsta ordersumma (kr)" htmlFor="onb-min">
                  <input
                    id="onb-min"
                    type="number"
                    className={inputClass}
                    value={restaurant.minOrderForDelivery}
                    onChange={(e) => updateRestaurant({ minOrderForDelivery: Number(e.target.value) || 0 })}
                  />
                </Field>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-sm text-demo-text-muted">
              <strong className="text-demo-text">{restaurant.name}</strong> är redo. Kunder kan börja beställa direkt, ordrarna
              dyker upp i restaurangvyn och ni följer försäljningen i ägarvyn — allt i samma system.
            </p>
            <div className="rounded-xl bg-demo-primary-soft p-3.5 text-sm text-demo-primary-soft-text">
              {restaurant.deliveryEnabled ? "Leverans aktiverad" : "Endast avhämtning"} · {formatHoursRange(restaurant.openingHours[1])} de flesta vardagar
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-2">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Tillbaka
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
              Nästa
              <ChevronRight size={15} />
            </Button>
          ) : (
            <Button onClick={() => router.push(mumsaRoutes.storefront())}>Öppna min sida</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
