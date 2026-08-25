import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { Card } from "@/components/demo/Card";
import type { Organization } from "@/features/booking-platform/types";
import { categoryIcons, categoryLabels } from "@/features/booking-platform/config/categories";
import { bokadRoutes } from "@/features/booking-platform/config/product";
import { formatSlotLabelSv } from "@/features/booking-platform/utils/dates";
import { orgAccentStyle } from "@/features/booking-platform/utils/accent";

export function SalonCard({
  organization,
  nextSlotIso,
  startingPriceSek,
}: {
  organization: Organization;
  nextSlotIso: string | null;
  startingPriceSek: number | null;
}) {
  const Icon = categoryIcons[organization.category];
  const { badge, icon } = orgAccentStyle(organization.accent);

  return (
    <Link href={bokadRoutes.salon(organization.slug)} className="group block h-full">
      <Card className="flex h-full flex-col justify-between transition-colors group-hover:border-demo-text-faint">
        <div>
          <div className="flex items-start justify-between gap-3">
            <span style={badge} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <Icon size={20} style={icon} strokeWidth={2} />
            </span>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-demo-text">
              <Star size={14} className="fill-demo-warning text-demo-warning" />
              {organization.rating.toFixed(1)}
              <span className="font-normal text-demo-text-faint">({organization.reviewCount})</span>
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-demo-text">{organization.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-label text-demo-text-faint">
            {categoryLabels[organization.category]}
          </p>
          <p className="mt-2 text-sm text-demo-text-muted">{organization.tagline}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-demo-text-faint">
            <MapPin size={12} className="shrink-0" />
            {organization.city}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-demo-border pt-4">
          <div>
            {nextSlotIso ? (
              <p className="text-xs text-demo-text-muted">
                Nästa lediga tid
                <br />
                <span className="font-semibold text-demo-primary-soft-text">{formatSlotLabelSv(nextSlotIso)}</span>
              </p>
            ) : (
              <p className="text-xs text-demo-text-faint">Inga lediga tider just nu</p>
            )}
          </div>
          {startingPriceSek !== null && (
            <p className="shrink-0 text-right text-xs text-demo-text-muted">
              Från
              <br />
              <span className="font-semibold text-demo-text">{startingPriceSek} kr</span>
            </p>
          )}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-demo-primary transition-all group-hover:gap-2.5">
          Boka tid
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Card>
    </Link>
  );
}
