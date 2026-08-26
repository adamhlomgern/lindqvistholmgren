import type { Accent } from "@/lib/design/accents";

export type BusinessCategory = "frisor" | "skonhet" | "massage" | "pt" | "naglar" | "tandvard";

export type OpeningHours = {
  // 0 = söndag .. 6 = lördag, matchar Date#getDay()
  day: number;
  open: string | null;
  close: string | null;
};

export type Organization = {
  id: string;
  slug: string;
  name: string;
  category: BusinessCategory;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  tagline: string;
  // Salongens egen accentfärg (jfr Mumsas restaurant.brandColor) — ger varje
  // salong i katalogen sin egen visuella identitet, skilt från Bokads egen
  // produktfärg som app-skalet i övrigt använder.
  accent: Accent;
  openingHours: OpeningHours[];
  createdAt: string;
};

// Nullable-koncept, jfr Asset.customerId i Servicekoll: en solo-verksamhet
// (t.ex. en ensam PT eller nagelbar) har inga rader i staff — deras
// bokningar har staffId: null. En salong med flera anställda listar dem här.
export type Staff = {
  id: string;
  organizationId: string;
  name: string;
  title: string;
};

export type Service = {
  id: string;
  organizationId: string;
  name: string;
  durationMinutes: number;
  priceSek: number;
  category?: string;
};

// Skapas ad hoc vid bokning — ingen inloggning i den här demon.
export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
};

// Static seed data, read-only in the demo — there's no "leave a review" flow,
// only browsing what's already there (jfr Organization.rating/reviewCount,
// which stay hand-authored aggregates rather than being derived from these).
export type Review = {
  id: string;
  organizationId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";

export type Booking = {
  id: string;
  organizationId: string;
  staffId: string | null;
  serviceId: string;
  customerId: string;
  start: string;
  end: string;
  status: BookingStatus;
  createdAt: string;
};
