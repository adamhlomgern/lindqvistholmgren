"use client";

import { useMemo } from "react";
import { BadgePercent, CalendarCheck, CircleAlert, Star, Store, Wallet } from "lucide-react";
import { EmptyState } from "@/components/demo/EmptyState";
import { KpiCard } from "@/components/demo/KpiCard";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { ServiceManager } from "@/features/booking-platform/components/agare/ServiceManager";
import { CalendarView } from "@/features/booking-platform/components/kalender/CalendarView";
import { computeOwnerStats } from "@/features/booking-platform/utils/stats";

export function OwnerDashboard() {
  const {
    organizations,
    currentOrgSlug,
    staff,
    services,
    bookings,
    customers,
    updateService,
    addService,
    removeService,
    completeBooking,
    markNoShow,
    cancelBooking,
  } = useBookingPlatform();
  const organization = organizations.find((org) => org.slug === currentOrgSlug);
  const orgStaff = useMemo(() => staff.filter((member) => organization && member.organizationId === organization.id), [staff, organization]);
  const orgServices = useMemo(
    () => services.filter((service) => organization && service.organizationId === organization.id),
    [services, organization],
  );
  const orgBookings = useMemo(
    () => bookings.filter((booking) => organization && booking.organizationId === organization.id),
    [bookings, organization],
  );

  const stats = useMemo(() => {
    if (!organization) return null;
    return computeOwnerStats({ organization, staffCount: orgStaff.length, bookings, services: orgServices });
  }, [organization, orgStaff, bookings, orgServices]);

  if (!organization || !stats) {
    return <EmptyState icon={Store} title="Ingen salong vald" description="Välj en salong i topbaren för att se dashboarden." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">{organization.name}</h1>
        <p className="mt-1 text-demo-text-muted">Översikt för veckan och salongens tjänster.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <KpiCard icon={CalendarCheck} label="Bokningar denna vecka" value={stats.bookingsThisWeek} tone="primary" />
        <KpiCard icon={BadgePercent} label="Beläggning" value={`${Math.round(stats.occupancyRate * 100)}%`} tone="info" />
        <KpiCard icon={Wallet} label="Intäkter" value={`${stats.revenueThisWeek.toLocaleString("sv-SE")} kr`} tone="warning" />
        <KpiCard icon={CircleAlert} label="No-show-andel" value={`${Math.round(stats.noShowRate * 100)}%`} tone="danger" />
        <KpiCard icon={Star} label="Snittbetyg" value={organization.rating.toFixed(1)} tone="neutral" />
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-demo-text">Kalender</h2>
        <div className="mt-3">
          <CalendarView
            bookings={orgBookings}
            services={orgServices}
            staff={orgStaff}
            customers={customers}
            onComplete={completeBooking}
            onNoShow={markNoShow}
            onCancel={cancelBooking}
          />
        </div>
      </div>

      <ServiceManager
        organizationId={organization.id}
        services={orgServices}
        onSave={updateService}
        onAdd={addService}
        onDelete={removeService}
      />
    </div>
  );
}
