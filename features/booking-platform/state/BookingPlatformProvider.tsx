"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Booking, BookingStatus, Customer, Service } from "@/features/booking-platform/types";
import { createSeedData, type SeedData } from "@/features/booking-platform/data/seed";
import { useQueryParam } from "@/features/booking-platform/utils/useQueryParam";

type State = SeedData & { currentOrgSlug: string; currentOrgTouched: boolean };

type Action =
  | { type: "CREATE_BOOKING"; customer: Customer; booking: Booking }
  | { type: "CANCEL_BOOKING"; bookingId: string }
  | { type: "MARK_NO_SHOW"; bookingId: string }
  | { type: "COMPLETE_BOOKING"; bookingId: string }
  | { type: "UPDATE_SERVICE"; service: Service }
  | { type: "SET_CURRENT_ORG"; slug: string }
  | { type: "RESET"; seed: SeedData };

function setBookingStatus(state: State, bookingId: string, status: BookingStatus): State {
  return {
    ...state,
    bookings: state.bookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CREATE_BOOKING":
      return { ...state, customers: [action.customer, ...state.customers], bookings: [action.booking, ...state.bookings] };
    case "CANCEL_BOOKING":
      return setBookingStatus(state, action.bookingId, "cancelled");
    case "MARK_NO_SHOW":
      return setBookingStatus(state, action.bookingId, "no_show");
    case "COMPLETE_BOOKING":
      return setBookingStatus(state, action.bookingId, "completed");
    case "UPDATE_SERVICE":
      return { ...state, services: state.services.map((service) => (service.id === action.service.id ? action.service : service)) };
    case "SET_CURRENT_ORG":
      return { ...state, currentOrgSlug: action.slug, currentOrgTouched: true };
    case "RESET":
      return { ...action.seed, currentOrgSlug: state.currentOrgSlug, currentOrgTouched: state.currentOrgTouched };
    default:
      return state;
  }
}

// No login in this demo — every booking creates a fresh, ad hoc customer
// record rather than looking one up (see types.ts: Customer is created at
// booking time, not beforehand).
type PlaceBookingInput = {
  organizationId: string;
  serviceId: string;
  staffId: string | null;
  start: string;
  end: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
};

type BookingPlatformContextValue = Omit<State, "currentOrgTouched"> & {
  placeBooking: (input: PlaceBookingInput) => Booking;
  cancelBooking: (bookingId: string) => void;
  markNoShow: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  updateService: (service: Service) => void;
  setCurrentOrgSlug: (slug: string) => void;
  resetDemo: () => void;
  getOrganization: (slug: string) => State["organizations"][number] | undefined;
  getBooking: (bookingId: string) => Booking | undefined;
};

const BookingPlatformContext = createContext<BookingPlatformContextValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BookingPlatformProvider({ children }: { children: ReactNode }) {
  const seed = useMemo(() => createSeedData(), []);
  const [state, dispatch] = useReducer(reducer, seed, (initialSeed) => ({
    ...initialSeed,
    currentOrgSlug: initialSeed.organizations[0]?.slug ?? "",
    currentOrgTouched: false,
  }));

  // ?business= in the URL sets which seeded salong is "yours" in
  // Salong/Ägare, but only until the OrgSwitcher is touched — same
  // hydration-safe pattern as Servicekoll's ?industry=.
  const businessParam = useQueryParam("business");
  const resolvedOrgSlug =
    !state.currentOrgTouched && businessParam && state.organizations.some((org) => org.slug === businessParam)
      ? businessParam
      : state.currentOrgSlug;

  const placeBooking = useCallback((input: PlaceBookingInput) => {
    const customer: Customer = {
      id: generateId("cust"),
      name: input.customerName,
      phone: input.customerPhone,
      email: input.customerEmail,
      createdAt: new Date().toISOString(),
    };
    const booking: Booking = {
      id: generateId("bok"),
      organizationId: input.organizationId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      customerId: customer.id,
      start: input.start,
      end: input.end,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "CREATE_BOOKING", customer, booking });
    return booking;
  }, []);

  const cancelBooking = useCallback((bookingId: string) => dispatch({ type: "CANCEL_BOOKING", bookingId }), []);
  const markNoShow = useCallback((bookingId: string) => dispatch({ type: "MARK_NO_SHOW", bookingId }), []);
  const completeBooking = useCallback((bookingId: string) => dispatch({ type: "COMPLETE_BOOKING", bookingId }), []);
  const updateService = useCallback((service: Service) => dispatch({ type: "UPDATE_SERVICE", service }), []);
  const setCurrentOrgSlug = useCallback((slug: string) => dispatch({ type: "SET_CURRENT_ORG", slug }), []);
  const resetDemo = useCallback(() => dispatch({ type: "RESET", seed: createSeedData() }), []);

  const getOrganization = useCallback(
    (slug: string) => state.organizations.find((org) => org.slug === slug),
    [state.organizations],
  );
  const getBooking = useCallback(
    (bookingId: string) => state.bookings.find((booking) => booking.id === bookingId),
    [state.bookings],
  );

  const value = useMemo<BookingPlatformContextValue>(
    () => ({
      organizations: state.organizations,
      staff: state.staff,
      services: state.services,
      customers: state.customers,
      bookings: state.bookings,
      currentOrgSlug: resolvedOrgSlug,
      placeBooking,
      cancelBooking,
      markNoShow,
      completeBooking,
      updateService,
      setCurrentOrgSlug,
      resetDemo,
      getOrganization,
      getBooking,
    }),
    [
      state,
      resolvedOrgSlug,
      placeBooking,
      cancelBooking,
      markNoShow,
      completeBooking,
      updateService,
      setCurrentOrgSlug,
      resetDemo,
      getOrganization,
      getBooking,
    ],
  );

  return <BookingPlatformContext.Provider value={value}>{children}</BookingPlatformContext.Provider>;
}

export function useBookingPlatform(): BookingPlatformContextValue {
  const ctx = useContext(BookingPlatformContext);
  if (!ctx) {
    throw new Error("useBookingPlatform must be used within a BookingPlatformProvider");
  }
  return ctx;
}
