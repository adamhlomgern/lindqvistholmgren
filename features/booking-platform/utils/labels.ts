import type { Booking, Customer, Service, Staff } from "@/features/booking-platform/types";

// Resolves a booking's foreign keys into display strings — shared by
// BookingQueue and CalendarView so the two views can't drift on how an
// "unknown" service/customer reads.
export function bookingLabels(
  booking: Booking,
  { services, staff, customers }: { services: Service[]; staff: Staff[]; customers: Customer[] },
) {
  const service = services.find((candidate) => candidate.id === booking.serviceId);
  const bookedStaff = staff.find((member) => member.id === booking.staffId);
  const customer = customers.find((candidate) => candidate.id === booking.customerId);
  return {
    serviceName: service?.name ?? "Okänd tjänst",
    staffName: bookedStaff?.name ?? null,
    customerName: customer?.name ?? "Okänd kund",
    customerPhone: customer?.phone ?? "",
  };
}
