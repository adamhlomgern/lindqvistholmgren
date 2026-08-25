"use client";

import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/demo/EmptyState";
import { SalonCard } from "@/features/booking-platform/components/directory/SalonCard";
import type { Booking, Organization, Service, Staff } from "@/features/booking-platform/types";
import { nextAvailableSlot } from "@/features/booking-platform/utils/slots";

export function DirectoryGrid({
  organizations,
  services,
  staff,
  bookings,
}: {
  organizations: Organization[];
  services: Service[];
  staff: Staff[];
  bookings: Booking[];
}) {
  // "Nästa lediga tid" uses each salong's fastest service as a
  // representative proxy — the quickest possible slot is the most honest
  // single number to headline on a catalog card, since the actual next slot
  // depends on which service the customer ends up picking.
  const cards = useMemo(() => {
    return organizations.map((organization) => {
      const orgServices = services.filter((service) => service.organizationId === organization.id);
      const orgStaff = staff.filter((member) => member.organizationId === organization.id);
      const fastestService = orgServices.reduce<Service | null>(
        (fastest, service) => (!fastest || service.durationMinutes < fastest.durationMinutes ? service : fastest),
        null,
      );
      const startingPriceSek =
        orgServices.length > 0 ? Math.min(...orgServices.map((service) => service.priceSek)) : null;
      const nextSlotIso = fastestService
        ? nextAvailableSlot({ organization, staff: orgStaff, bookings, durationMinutes: fastestService.durationMinutes })
        : null;
      return { organization, nextSlotIso, startingPriceSek };
    });
  }, [organizations, services, staff, bookings]);

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="Inga salonger hittades"
        description="Prova en annan sökning eller ta bort kategorifiltret."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ organization, nextSlotIso, startingPriceSek }) => (
        <SalonCard key={organization.id} organization={organization} nextSlotIso={nextSlotIso} startingPriceSek={startingPriceSek} />
      ))}
    </div>
  );
}
