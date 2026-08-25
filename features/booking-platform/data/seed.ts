import type {
  Booking,
  BookingStatus,
  Customer,
  Organization,
  OpeningHours,
  Service,
  Staff,
} from "@/features/booking-platform/types";
import { addDays, addMinutes, startOfDay } from "@/features/booking-platform/utils/dates";

export type SeedData = {
  organizations: Organization[];
  staff: Staff[];
  services: Service[];
  customers: Customer[];
  bookings: Booking[];
};

type HoursSpec = Partial<Record<number, [string, string]>>;

// spec keys are Date#getDay() (0 = söndag .. 6 = lördag); missing days come
// out closed (open/close both null).
function weeklyHours(spec: HoursSpec): OpeningHours[] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const entry = spec[day];
    return { day, open: entry ? entry[0] : null, close: entry ? entry[1] : null };
  });
}

const SALON_HOURS = weeklyHours({
  2: ["09:00", "18:00"],
  3: ["09:00", "18:00"],
  4: ["09:00", "18:00"],
  5: ["09:00", "18:00"],
  6: ["10:00", "14:00"],
});
const BARBER_HOURS = weeklyHours({
  1: ["10:00", "19:00"],
  2: ["10:00", "19:00"],
  3: ["10:00", "19:00"],
  4: ["10:00", "19:00"],
  5: ["10:00", "19:00"],
  6: ["10:00", "15:00"],
});
const BROW_HOURS = weeklyHours({
  2: ["10:00", "17:00"],
  3: ["10:00", "17:00"],
  4: ["10:00", "17:00"],
  5: ["10:00", "17:00"],
  6: ["10:00", "13:00"],
});
const MASSAGE_HOURS = weeklyHours({
  1: ["10:00", "19:00"],
  2: ["10:00", "19:00"],
  3: ["10:00", "19:00"],
  4: ["10:00", "19:00"],
  5: ["10:00", "19:00"],
  6: ["10:00", "14:00"],
});
const PT_HOURS = weeklyHours({
  1: ["07:00", "20:00"],
  2: ["07:00", "20:00"],
  3: ["07:00", "20:00"],
  4: ["07:00", "20:00"],
  5: ["07:00", "20:00"],
  6: ["09:00", "13:00"],
});
const DENTAL_HOURS = weeklyHours({
  1: ["08:00", "17:00"],
  2: ["08:00", "17:00"],
  3: ["08:00", "17:00"],
  4: ["08:00", "17:00"],
  5: ["08:00", "16:00"],
});

// Blueprint tuples keep the ~60 seeded bookings below readable as a table
// rather than 60 verbose object literals: [dayOffset, hour, minute,
// serviceIndex, staffIndex-or-null, customerIndex, status].
type BookingBlueprint = [
  dayOffset: number,
  hour: number,
  minute: number,
  serviceIndex: number,
  staffIndex: number | null,
  customerIndex: number,
  status: BookingStatus,
];

// dayOffset/hour are relative to "today" at seed time (not absolute
// weekdays), so the demo always shows a realistic mix of history + this
// week's queue no matter when it's opened — same trick as
// service-platform's dueInDays and restaurant-platform's minutesAgo.
export function createSeedData(now: Date = new Date()): SeedData {
  function iso(dayOffset: number): string {
    return addDays(startOfDay(now), dayOffset).toISOString();
  }

  const customers: Customer[] = [
    { id: "cust-1", name: "Anna Nilsson", phone: "070-111 22 33", email: "anna.nilsson@example.se", createdAt: iso(-300) },
    { id: "cust-2", name: "Erik Söderberg", phone: "070-222 33 44", email: "erik.soderberg@example.se", createdAt: iso(-290) },
    { id: "cust-3", name: "Maria Karlsson", phone: "070-333 44 55", email: "maria.karlsson@example.se", createdAt: iso(-280) },
    { id: "cust-4", name: "Johan Pettersson", phone: "070-444 55 66", email: "johan.pettersson@example.se", createdAt: iso(-270) },
    { id: "cust-5", name: "Sofia Lindgren", phone: "070-555 66 77", email: "sofia.lindgren@example.se", createdAt: iso(-260) },
    { id: "cust-6", name: "Oscar Bergström", phone: "070-666 77 88", email: "oscar.bergstrom@example.se", createdAt: iso(-250) },
    { id: "cust-7", name: "Emma Håkansson", phone: "070-777 88 99", email: "emma.hakansson@example.se", createdAt: iso(-240) },
    { id: "cust-8", name: "Lucas Åström", phone: "070-888 99 00", email: "lucas.astrom@example.se", createdAt: iso(-230) },
    { id: "cust-9", name: "Klara Sandberg", phone: "070-999 00 11", email: "klara.sandberg@example.se", createdAt: iso(-220) },
    { id: "cust-10", name: "Viktor Holm", phone: "070-101 20 33", email: "viktor.holm@example.se", createdAt: iso(-210) },
    { id: "cust-11", name: "Elin Forsberg", phone: "070-202 30 44", email: "elin.forsberg@example.se", createdAt: iso(-200) },
    { id: "cust-12", name: "Adam Nyström", phone: "070-303 40 55", email: "adam.nystrom@example.se", createdAt: iso(-190) },
    { id: "cust-13", name: "Julia Sjögren", phone: "070-404 50 66", email: "julia.sjogren@example.se", createdAt: iso(-180) },
    { id: "cust-14", name: "Filip Dahlgren", phone: "070-505 60 77", email: "filip.dahlgren@example.se", createdAt: iso(-170) },
    { id: "cust-15", name: "Ida Wallin", phone: "070-606 70 88", email: "ida.wallin@example.se", createdAt: iso(-160) },
    { id: "cust-16", name: "Noah Ekström", phone: "070-707 80 99", email: "noah.ekstrom@example.se", createdAt: iso(-150) },
  ];

  function buildBookings(
    organizationId: string,
    idPrefix: string,
    services: Service[],
    staff: Staff[],
    blueprints: BookingBlueprint[],
  ): Booking[] {
    return blueprints.map(([dayOffset, hour, minute, serviceIndex, staffIndex, customerIndex, status], index) => {
      const service = services[serviceIndex];
      const start = addDays(startOfDay(now), dayOffset);
      start.setHours(hour, minute, 0, 0);
      const end = addMinutes(start, service.durationMinutes);
      // Booked a few days ahead of the appointment itself (or shortly after,
      // for already-past visits) — never later than `start`.
      const createdAt = addDays(start, dayOffset <= 0 ? -5 : -3);
      return {
        id: `${idPrefix}-${index + 1}`,
        organizationId,
        staffId: staffIndex === null ? null : staff[staffIndex].id,
        serviceId: service.id,
        customerId: customers[customerIndex].id,
        start: start.toISOString(),
        end: end.toISOString(),
        status,
        createdAt: createdAt.toISOString(),
      };
    });
  }

  // --- 1. Salong Sirlig — frisör, Karlstad -------------------------------
  const sirligServices: Service[] = [
    { id: "svc-sirlig-1", organizationId: "org-sirlig", name: "Klippning dam", durationMinutes: 45, priceSek: 550 },
    { id: "svc-sirlig-2", organizationId: "org-sirlig", name: "Klippning herr", durationMinutes: 30, priceSek: 350 },
    { id: "svc-sirlig-3", organizationId: "org-sirlig", name: "Färgning", durationMinutes: 120, priceSek: 1200 },
    { id: "svc-sirlig-4", organizationId: "org-sirlig", name: "Styling/uppsättning", durationMinutes: 60, priceSek: 650 },
  ];
  const sirligStaff: Staff[] = [
    { id: "staff-sirlig-1", organizationId: "org-sirlig", name: "Sara Lind", title: "Frisör" },
    { id: "staff-sirlig-2", organizationId: "org-sirlig", name: "Emma Berg", title: "Frisör" },
    { id: "staff-sirlig-3", organizationId: "org-sirlig", name: "Noah Vik", title: "Colorist" },
  ];
  const sirligBookings = buildBookings("org-sirlig", "bok-sirlig", sirligServices, sirligStaff, [
    [-14, 10, 0, 0, 0, 0, "completed"],
    [-10, 13, 30, 2, 2, 3, "completed"],
    [-6, 9, 15, 1, 1, 5, "no_show"],
    [-2, 15, 0, 3, 0, 7, "completed"],
    [0, 11, 0, 0, 1, 1, "confirmed"],
    [1, 14, 0, 2, 2, 9, "confirmed"],
    [3, 10, 30, 1, 0, 2, "confirmed"],
    [2, 9, 0, 3, 1, 4, "cancelled"],
  ]);

  // --- 2. Barberaren på Tingvalla — frisör (barbershop), Karlstad --------
  const barberarenServices: Service[] = [
    { id: "svc-barberaren-1", organizationId: "org-barberaren", name: "Herrklippning", durationMinutes: 30, priceSek: 380 },
    { id: "svc-barberaren-2", organizationId: "org-barberaren", name: "Skäggtrimning", durationMinutes: 20, priceSek: 250 },
    { id: "svc-barberaren-3", organizationId: "org-barberaren", name: "Klippning + skägg", durationMinutes: 45, priceSek: 550 },
  ];
  const barberarenBookings = buildBookings("org-barberaren", "bok-barberaren", barberarenServices, [], [
    [-12, 11, 0, 0, null, 2, "completed"],
    [-8, 16, 0, 2, null, 6, "completed"],
    [-5, 10, 0, 1, null, 8, "no_show"],
    [-1, 17, 0, 0, null, 10, "completed"],
    [0, 13, 0, 2, null, 3, "confirmed"],
    [1, 11, 30, 0, null, 12, "confirmed"],
    [4, 15, 0, 1, null, 1, "confirmed"],
    [2, 10, 0, 0, null, 14, "cancelled"],
  ]);

  // --- 3. Klara Hud & Skönhet — skönhet, Karlstad ------------------------
  const klaraServices: Service[] = [
    { id: "svc-klara-1", organizationId: "org-klara", name: "Ansiktsbehandling", durationMinutes: 60, priceSek: 795 },
    { id: "svc-klara-2", organizationId: "org-klara", name: "Fransförlängning", durationMinutes: 90, priceSek: 950 },
    { id: "svc-klara-3", organizationId: "org-klara", name: "Brynlaminering", durationMinutes: 45, priceSek: 550 },
  ];
  const klaraStaff: Staff[] = [
    { id: "staff-klara-1", organizationId: "org-klara", name: "Klara Sund", title: "Hudterapeut" },
    { id: "staff-klara-2", organizationId: "org-klara", name: "Ida Malm", title: "Hudterapeut" },
  ];
  const klaraBookings = buildBookings("org-klara", "bok-klara", klaraServices, klaraStaff, [
    [-18, 10, 0, 0, 0, 4, "completed"],
    [-11, 13, 0, 1, 1, 9, "completed"],
    [-7, 9, 30, 2, 0, 11, "completed"],
    [-3, 14, 0, 0, 1, 13, "no_show"],
    [0, 16, 0, 2, 0, 0, "confirmed"],
    [2, 10, 0, 1, 1, 5, "confirmed"],
    [5, 11, 0, 0, 0, 7, "confirmed"],
    [3, 9, 0, 2, 1, 15, "cancelled"],
  ]);

  // --- 4. Brow Bar Kristinehamn — skönhet, Kristinehamn ------------------
  const browBarServices: Service[] = [
    { id: "svc-browbar-1", organizationId: "org-browbar", name: "Brynfärgning", durationMinutes: 30, priceSek: 350 },
    { id: "svc-browbar-2", organizationId: "org-browbar", name: "Fransfärgning", durationMinutes: 30, priceSek: 350 },
    { id: "svc-browbar-3", organizationId: "org-browbar", name: "Microblading", durationMinutes: 90, priceSek: 1800 },
  ];
  const browBarBookings = buildBookings("org-browbar", "bok-browbar", browBarServices, [], [
    [-15, 11, 0, 0, null, 2, "completed"],
    [-9, 12, 0, 2, null, 6, "completed"],
    [-4, 10, 30, 1, null, 10, "completed"],
    [-2, 13, 0, 0, null, 14, "no_show"],
    [1, 10, 0, 2, null, 3, "confirmed"],
    [3, 11, 30, 1, null, 8, "confirmed"],
    [6, 12, 30, 0, null, 12, "confirmed"],
  ]);

  // --- 5. Lugna Rum Massage — massage, Karlstad --------------------------
  const lugnaRumServices: Service[] = [
    { id: "svc-lugnarum-1", organizationId: "org-lugnarum", name: "Klassisk massage 60 min", durationMinutes: 60, priceSek: 750 },
    { id: "svc-lugnarum-2", organizationId: "org-lugnarum", name: "Klassisk massage 30 min", durationMinutes: 30, priceSek: 450 },
    { id: "svc-lugnarum-3", organizationId: "org-lugnarum", name: "Djupvävnadsmassage", durationMinutes: 60, priceSek: 850 },
  ];
  const lugnaRumStaff: Staff[] = [
    { id: "staff-lugnarum-1", organizationId: "org-lugnarum", name: "Peter Ahl", title: "Massör" },
    { id: "staff-lugnarum-2", organizationId: "org-lugnarum", name: "Frida Ekström", title: "Massör" },
  ];
  const lugnaRumBookings = buildBookings("org-lugnarum", "bok-lugnarum", lugnaRumServices, lugnaRumStaff, [
    [-16, 11, 0, 0, 0, 1, "completed"],
    [-10, 15, 0, 2, 1, 5, "completed"],
    [-6, 10, 0, 1, 0, 9, "completed"],
    [-3, 17, 0, 0, 1, 13, "no_show"],
    [0, 12, 0, 2, 0, 0, "confirmed"],
    [2, 14, 0, 1, 1, 4, "confirmed"],
    [4, 16, 0, 0, 0, 8, "confirmed"],
    [1, 11, 0, 2, 1, 11, "cancelled"],
  ]);

  // --- 6. Studio Form PT — pt, Karlstad -----------------------------------
  const studioFormServices: Service[] = [
    { id: "svc-studioform-1", organizationId: "org-studioform", name: "PT-pass", durationMinutes: 60, priceSek: 650 },
    { id: "svc-studioform-2", organizationId: "org-studioform", name: "Kostrådgivning", durationMinutes: 45, priceSek: 500 },
    { id: "svc-studioform-3", organizationId: "org-studioform", name: "Träningsanalys", durationMinutes: 30, priceSek: 350 },
  ];
  const studioFormBookings = buildBookings("org-studioform", "bok-studioform", studioFormServices, [], [
    [-14, 8, 0, 0, null, 2, "completed"],
    [-9, 17, 0, 1, null, 6, "completed"],
    [-5, 7, 30, 0, null, 10, "completed"],
    [-2, 18, 0, 2, null, 14, "no_show"],
    [0, 8, 0, 0, null, 3, "confirmed"],
    [1, 17, 30, 1, null, 7, "confirmed"],
    [3, 7, 0, 0, null, 12, "confirmed"],
  ]);

  // --- 7. Nagelbaren Karlstad — naglar, Karlstad --------------------------
  const nagelbarenServices: Service[] = [
    { id: "svc-nagelbaren-1", organizationId: "org-nagelbaren", name: "Gellack", durationMinutes: 60, priceSek: 550 },
    { id: "svc-nagelbaren-2", organizationId: "org-nagelbaren", name: "Nagelförlängning", durationMinutes: 90, priceSek: 750 },
    { id: "svc-nagelbaren-3", organizationId: "org-nagelbaren", name: "Manikyr", durationMinutes: 45, priceSek: 400 },
  ];
  const nagelbarenBookings = buildBookings("org-nagelbaren", "bok-nagelbaren", nagelbarenServices, [], [
    [-13, 10, 0, 2, null, 1, "completed"],
    [-8, 13, 0, 0, null, 5, "completed"],
    [-4, 11, 0, 1, null, 9, "completed"],
    [-1, 14, 30, 0, null, 13, "no_show"],
    [0, 10, 30, 2, null, 0, "confirmed"],
    [2, 12, 0, 1, null, 4, "confirmed"],
    [5, 9, 30, 0, null, 8, "confirmed"],
  ]);

  // --- 8. Värmlands Tandvård — tandvård, Karlstad -------------------------
  const varmlandsTandvardServices: Service[] = [
    { id: "svc-tandvard-1", organizationId: "org-tandvard", name: "Undersökning", durationMinutes: 30, priceSek: 450 },
    { id: "svc-tandvard-2", organizationId: "org-tandvard", name: "Tandstensborttagning", durationMinutes: 45, priceSek: 650 },
    { id: "svc-tandvard-3", organizationId: "org-tandvard", name: "Akut tandvärk", durationMinutes: 30, priceSek: 900 },
  ];
  const varmlandsTandvardStaff: Staff[] = [
    { id: "staff-tandvard-1", organizationId: "org-tandvard", name: "Sofia Grahn", title: "Tandläkare" },
    { id: "staff-tandvard-2", organizationId: "org-tandvard", name: "Anders Fält", title: "Tandläkare" },
  ];
  const varmlandsTandvardBookings = buildBookings("org-tandvard", "bok-tandvard", varmlandsTandvardServices, varmlandsTandvardStaff, [
    [-20, 9, 0, 0, 0, 2, "completed"],
    [-12, 13, 30, 1, 1, 6, "completed"],
    [-6, 8, 30, 0, 0, 10, "completed"],
    [-3, 10, 0, 2, 1, 14, "no_show"],
    [0, 9, 30, 0, 0, 1, "confirmed"],
    [2, 14, 0, 1, 1, 5, "confirmed"],
    [4, 8, 0, 0, 0, 9, "confirmed"],
    [1, 11, 0, 2, 1, 13, "cancelled"],
  ]);

  const organizations: Organization[] = [
    {
      id: "org-sirlig",
      slug: "salong-sirlig",
      name: "Salong Sirlig",
      category: "frisor",
      city: "Karlstad",
      address: "Kungsgatan 12",
      rating: 4.8,
      reviewCount: 142,
      tagline: "Klippning och färg mitt i city",
      accent: "emerald",
      openingHours: SALON_HOURS,
      createdAt: iso(-820),
    },
    {
      id: "org-barberaren",
      slug: "barberaren-tingvalla",
      name: "Barberaren på Tingvalla",
      category: "frisor",
      city: "Karlstad",
      address: "Tingvallagatan 5",
      rating: 4.6,
      reviewCount: 89,
      tagline: "Skägg, klippning och rakning på riktigt",
      accent: "sky",
      openingHours: BARBER_HOURS,
      createdAt: iso(-640),
    },
    {
      id: "org-klara",
      slug: "klara-hud-skonhet",
      name: "Klara Hud & Skönhet",
      category: "skonhet",
      city: "Karlstad",
      address: "Drottninggatan 22",
      rating: 4.9,
      reviewCount: 203,
      tagline: "Hudvård och behandlingar med känsla för detalj",
      accent: "lavender",
      openingHours: SALON_HOURS,
      createdAt: iso(-910),
    },
    {
      id: "org-browbar",
      slug: "brow-bar-kristinehamn",
      name: "Brow Bar Kristinehamn",
      category: "skonhet",
      city: "Kristinehamn",
      address: "Kungsgatan 9",
      rating: 4.7,
      reviewCount: 58,
      tagline: "Bryn och fransar som sitter",
      accent: "rose",
      openingHours: BROW_HOURS,
      createdAt: iso(-410),
    },
    {
      id: "org-lugnarum",
      slug: "lugna-rum-massage",
      name: "Lugna Rum Massage",
      category: "massage",
      city: "Karlstad",
      address: "Västra Torggatan 8",
      rating: 4.8,
      reviewCount: 121,
      tagline: "Återhämtning för kropp och knutar",
      accent: "moss",
      openingHours: MASSAGE_HOURS,
      createdAt: iso(-730),
    },
    {
      id: "org-studioform",
      slug: "studio-form-pt",
      name: "Studio Form PT",
      category: "pt",
      city: "Karlstad",
      address: "Sandbäcksgatan 3",
      rating: 4.5,
      reviewCount: 47,
      tagline: "Personlig träning som ger resultat",
      accent: "coral",
      openingHours: PT_HOURS,
      createdAt: iso(-520),
    },
    {
      id: "org-nagelbaren",
      slug: "nagelbaren-karlstad",
      name: "Nagelbaren Karlstad",
      category: "naglar",
      city: "Karlstad",
      address: "Järnvägsgatan 15",
      rating: 4.8,
      reviewCount: 168,
      tagline: "Gellack, förlängning och manikyr",
      accent: "peach",
      openingHours: SALON_HOURS,
      createdAt: iso(-680),
    },
    {
      id: "org-tandvard",
      slug: "varmlands-tandvard",
      name: "Värmlands Tandvård",
      category: "tandvard",
      city: "Karlstad",
      address: "Herrhagsgatan 2",
      rating: 4.6,
      reviewCount: 176,
      tagline: "Tandvård utan väntetider",
      accent: "sky",
      openingHours: DENTAL_HOURS,
      createdAt: iso(-1100),
    },
  ];

  const staff: Staff[] = [...sirligStaff, ...klaraStaff, ...lugnaRumStaff, ...varmlandsTandvardStaff];

  const services: Service[] = [
    ...sirligServices,
    ...barberarenServices,
    ...klaraServices,
    ...browBarServices,
    ...lugnaRumServices,
    ...studioFormServices,
    ...nagelbarenServices,
    ...varmlandsTandvardServices,
  ];

  const bookings: Booking[] = [
    ...sirligBookings,
    ...barberarenBookings,
    ...klaraBookings,
    ...browBarBookings,
    ...lugnaRumBookings,
    ...studioFormBookings,
    ...nagelbarenBookings,
    ...varmlandsTandvardBookings,
  ];

  return { organizations, staff, services, customers, bookings };
}
