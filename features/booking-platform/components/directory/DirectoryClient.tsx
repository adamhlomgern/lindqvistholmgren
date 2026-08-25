"use client";

import { useMemo, useState } from "react";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { categoryLabels } from "@/features/booking-platform/config/categories";
import type { BusinessCategory } from "@/features/booking-platform/types";
import { DirectorySearch } from "@/features/booking-platform/components/directory/DirectorySearch";
import { CategoryChips } from "@/features/booking-platform/components/directory/CategoryChips";
import { DirectoryGrid } from "@/features/booking-platform/components/directory/DirectoryGrid";

export function DirectoryClient() {
  const { organizations, services, staff, bookings } = useBookingPlatform();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<BusinessCategory | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return organizations.filter((org) => {
      if (category && org.category !== category) return false;
      if (!query) return true;
      return (
        org.name.toLowerCase().includes(query) ||
        org.city.toLowerCase().includes(query) ||
        categoryLabels[org.category].toLowerCase().includes(query)
      );
    });
  }, [organizations, search, category]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">Hitta din nästa tid</h1>
        <p className="mt-1 text-demo-text-muted">
          {organizations.length} salonger i Karlstad och Värmland — jämför, välj och boka direkt.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <DirectorySearch value={search} onChange={setSearch} />
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      <DirectoryGrid organizations={filtered} services={services} staff={staff} bookings={bookings} />
    </div>
  );
}
