import type { Service } from "@/features/booking-platform/types";

export function ServicePicker({
  services,
  selectedServiceId,
  onSelect,
}: {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {services.map((service) => {
        const active = service.id === selectedServiceId;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            aria-pressed={active}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              active ? "border-demo-primary bg-demo-primary-soft" : "border-demo-border bg-demo-surface hover:bg-demo-surface-hover"
            }`}
          >
            <div>
              <p className={`text-sm font-semibold ${active ? "text-demo-primary-soft-text" : "text-demo-text"}`}>{service.name}</p>
              <p className="mt-0.5 text-xs text-demo-text-muted">{service.durationMinutes} min</p>
            </div>
            <span className={`shrink-0 text-sm font-semibold ${active ? "text-demo-primary-soft-text" : "text-demo-text"}`}>
              {service.priceSek} kr
            </span>
          </button>
        );
      })}
    </div>
  );
}
