"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/demo/EmptyState";
import { Button } from "@/components/demo/Button";
import { useBookingPlatform } from "@/features/booking-platform/state/BookingPlatformProvider";
import { bokadRoutes } from "@/features/booking-platform/config/product";
import { SalonHeader } from "@/features/booking-platform/components/salon/SalonHeader";
import { ServicePicker } from "@/features/booking-platform/components/salon/ServicePicker";
import { StaffPicker, AUTO_STAFF } from "@/features/booking-platform/components/salon/StaffPicker";
import { SlotPicker } from "@/features/booking-platform/components/salon/SlotPicker";
import { BookingConfirmModal } from "@/features/booking-platform/components/salon/BookingConfirmModal";
import { ReviewsList } from "@/features/booking-platform/components/salon/ReviewsList";
import { getAvailableSlots, findFreeStaffId } from "@/features/booking-platform/utils/slots";
import { formatSlotLabelSv } from "@/features/booking-platform/utils/dates";

export function SalonProfileClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { organizations, services, staff, bookings, reviews, placeBooking } = useBookingPlatform();
  const organization = organizations.find((org) => org.slug === slug);

  const orgServices = useMemo(
    () => services.filter((service) => organization && service.organizationId === organization.id),
    [services, organization],
  );
  const orgStaff = useMemo(
    () => staff.filter((member) => organization && member.organizationId === organization.id),
    [staff, organization],
  );
  const orgReviews = useMemo(
    () =>
      reviews
        .filter((review) => organization && review.organizationId === organization.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews, organization],
  );

  const [selectedServiceIdRaw, setSelectedServiceId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(AUTO_STAFF);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Defaults to the first service once the org's services are known — a
  // plain derived value (not an effect + setState) since it only depends on
  // orgServices, which itself only depends on `organization` from context.
  const selectedServiceId = selectedServiceIdRaw ?? orgServices[0]?.id ?? null;
  const selectedService = orgServices.find((service) => service.id === selectedServiceId) ?? null;

  // Changing service or staff invalidates whatever slot was picked under the
  // old combination — it may not even exist in the new availability. Reset
  // during render (React's "adjusting state when a prop changes" pattern)
  // rather than in an effect, comparing against the previous selection key
  // tracked in state.
  const selectionKey = `${selectedServiceId ?? ""}:${selectedStaffId}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);
  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey);
    setSelectedSlotIso(null);
  }

  const days = useMemo(() => {
    if (!organization || !selectedService) return [];
    return getAvailableSlots({
      organization,
      staff: orgStaff,
      bookings,
      durationMinutes: selectedService.durationMinutes,
      staffId: selectedStaffId === AUTO_STAFF ? undefined : selectedStaffId,
    });
  }, [organization, orgStaff, bookings, selectedService, selectedStaffId]);

  if (!organization) {
    return (
      <EmptyState
        icon={Store}
        title="Hittade ingen salong"
        description="Salongen kan ha försvunnit om demot återställdes."
        action={
          <Link href={bokadRoutes.directory()} className="text-sm font-semibold text-demo-primary hover:underline">
            Till katalogen
          </Link>
        }
      />
    );
  }

  const staffLabel =
    orgStaff.length === 0
      ? null
      : selectedStaffId === AUTO_STAFF
        ? "Första lediga"
        : (orgStaff.find((member) => member.id === selectedStaffId)?.name ?? "Första lediga");

  function handleConfirm(input: { name: string; phone: string; email: string }) {
    if (!organization || !selectedService || !selectedSlotIso) return;
    const resolvedStaffId =
      orgStaff.length === 0
        ? null
        : selectedStaffId !== AUTO_STAFF
          ? selectedStaffId
          : findFreeStaffId({
              organization,
              staff: orgStaff,
              bookings,
              durationMinutes: selectedService.durationMinutes,
              slotIso: selectedSlotIso,
            });

    const start = new Date(selectedSlotIso);
    const end = new Date(start.getTime() + selectedService.durationMinutes * 60_000);

    const booking = placeBooking({
      organizationId: organization.id,
      serviceId: selectedService.id,
      staffId: resolvedStaffId,
      start: start.toISOString(),
      end: end.toISOString(),
      customerName: input.name,
      customerPhone: input.phone,
      customerEmail: input.email,
    });

    setModalOpen(false);
    router.push(bokadRoutes.booking(booking.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <SalonHeader organization={organization} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-lg font-bold text-demo-text">Välj tjänst</h2>
            <div className="mt-3">
              {orgServices.length === 0 ? (
                <p className="text-sm text-demo-text-faint">Inga tjänster registrerade.</p>
              ) : (
                <ServicePicker services={orgServices} selectedServiceId={selectedServiceId} onSelect={setSelectedServiceId} />
              )}
            </div>
          </div>

          {orgStaff.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-demo-text">Välj personal</h2>
              <div className="mt-3">
                <StaffPicker staff={orgStaff} selectedStaffId={selectedStaffId} onSelect={setSelectedStaffId} />
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-demo-text">Välj tid</h2>
          <div className="mt-3">
            {selectedService ? (
              <SlotPicker days={days} selectedSlotIso={selectedSlotIso} onSelect={setSelectedSlotIso} />
            ) : (
              <p className="text-sm text-demo-text-faint">Välj en tjänst för att se lediga tider.</p>
            )}
          </div>

          {selectedSlotIso && selectedService && (
            <div className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-demo-border bg-demo-surface p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-demo-text">
                <span className="font-semibold">{formatSlotLabelSv(selectedSlotIso)}</span> · {selectedService.name} · {selectedService.priceSek} kr
              </p>
              <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto">
                Boka tid
              </Button>
            </div>
          )}
        </div>
      </div>

      <ReviewsList reviews={orgReviews} rating={organization.rating} reviewCount={organization.reviewCount} />

      {selectedService && selectedSlotIso && (
        <BookingConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          organization={organization}
          service={selectedService}
          staffLabel={staffLabel}
          slotIso={selectedSlotIso}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
