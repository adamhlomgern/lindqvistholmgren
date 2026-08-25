import { Clock, MapPin, Star } from "lucide-react";
import type { Organization } from "@/features/booking-platform/types";
import { categoryIcons, categoryLabels } from "@/features/booking-platform/config/categories";
import { isOpenNow, todaysHours, formatHoursRange } from "@/features/booking-platform/utils/hours";
import { orgAccentStyle } from "@/features/booking-platform/utils/accent";
import { accentHex } from "@/lib/design/accents";

export function SalonHeader({ organization }: { organization: Organization }) {
  const Icon = categoryIcons[organization.category];
  const open = isOpenNow(organization);
  const today = todaysHours(organization);
  const { icon } = orgAccentStyle(organization.accent);
  const hex = accentHex[organization.accent];

  return (
    <div className="overflow-hidden rounded-3xl border border-demo-border bg-demo-surface">
      {/* No product photography exists for these fictional salons — a flat
          accent-tinted band with the category glyph reads as an intentional
          brand mark rather than a missing image. */}
      <div
        className="relative flex h-32 items-center justify-center sm:h-40"
        style={{ backgroundImage: `linear-gradient(135deg, ${hex}33, ${hex}12)` }}
      >
        <Icon size={56} style={icon} strokeWidth={1.5} />
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
              open ? "text-demo-primary-soft-text" : "text-demo-text-muted"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-demo-primary" : "bg-demo-text-faint"}`} />
            {open ? "Öppet nu" : "Stängt just nu"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-demo-text-faint">
            {categoryLabels[organization.category]}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-demo-text sm:text-3xl">{organization.name}</h1>
          <p className="mt-1 text-sm text-demo-text-muted">{organization.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-demo-text">
            <span className="flex items-center gap-1.5">
              <Star size={14} className="fill-demo-warning text-demo-warning" />
              {organization.rating.toFixed(1)} <span className="font-normal text-demo-text-faint">({organization.reviewCount} omdömen)</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-demo-text-muted">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-demo-primary" />
            {organization.address}, {organization.city}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="shrink-0 text-demo-primary" />
            {today ? `Idag ${formatHoursRange(today)}` : "Stängt idag"}
          </div>
        </div>
      </div>
    </div>
  );
}
