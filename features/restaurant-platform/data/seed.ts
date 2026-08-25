import type { Order, OrderLine, OrderStatus, Restaurant, SelectedTopping } from "@/features/restaurant-platform/types";
import { menuItems } from "@/features/restaurant-platform/data/menu";

export type SeedData = {
  restaurant: Restaurant;
  orders: Order[];
  nextOrderNumber: number;
};

export function createSeedRestaurant(): Restaurant {
  return {
    name: "Pizzeria Bella Napoli",
    logo: "/images/demos/mumsa-logo.svg",
    heroImage: "/images/demos/mumsa/hero-pizza-oven.jpg",
    tagline: "Stenugnsbakad pizza mitt i stan",
    phone: "08-123 456 78",
    address: "Storgatan 14, Stockholm",
    brandColor: "#e2542b",
    openingHours: [
      { day: 0, open: "13:00", close: "21:00" },
      { day: 1, open: "11:00", close: "21:00" },
      { day: 2, open: "11:00", close: "21:00" },
      { day: 3, open: "11:00", close: "21:00" },
      { day: 4, open: "11:00", close: "22:00" },
      { day: 5, open: "11:00", close: "23:00" },
      { day: 6, open: "12:00", close: "23:00" },
    ],
    deliveryEnabled: true,
    deliveryFee: 39,
    minOrderForDelivery: 150,
    estimatedPrepMinutes: 20,
  };
}

function findItem(id: string) {
  const item = menuItems.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown seed menu item: ${id}`);
  return item;
}

function line(menuItemId: string, quantity: number, toppings: SelectedTopping[] = []): OrderLine {
  const item = findItem(menuItemId);
  const toppingsPrice = toppings.reduce((sum, topping) => sum + topping.priceDelta, 0);
  return { menuItemId, name: item.name, quantity, unitPrice: item.price + toppingsPrice, toppings };
}

function family(): SelectedTopping {
  return { groupId: "grp-storlek", optionId: "size-family", name: "Familjestorlek (Ø 40 cm)", priceDelta: 45 };
}

function extra(id: string, name: string, priceDelta: number): SelectedTopping {
  return { groupId: "grp-extra", optionId: id, name, priceDelta };
}

type OrderBlueprint = {
  number: number;
  lines: OrderLine[];
  fulfillment: Order["fulfillment"];
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  kitchenNote?: string;
  deliveryNote?: string;
  status: OrderStatus;
  minutesAgo: number;
  statusMinutesAgo: number;
  // Delivery orders only, and only when status is already past "levereras"
  // (i.e. "klar") — backfills the one extra statusHistory entry the courier
  // dashboard's delivery-duration stat needs (levereras -> klar), since the
  // single-entry default below only captures the order's *current* status.
  outForDeliveryMinutesAgo?: number;
};

// minutesAgo/statusMinutesAgo are relative to "now" at seed time, so the
// demo always shows a realistic, freshly-timestamped queue no matter when
// it's opened — same trick as Servicekoll's dueInDays-relative seed data.
export function createSeedData(now: Date = new Date()): SeedData {
  const restaurant = createSeedRestaurant();

  const blueprints: OrderBlueprint[] = [
    {
      number: 132,
      lines: [line("item-pepperoni", 1), line("item-cola", 1)],
      fulfillment: "pickup",
      customerName: "Johan Ek",
      customerPhone: "070-234 11 09",
      status: "ny",
      minutesAgo: 3,
      statusMinutesAgo: 3,
    },
    {
      number: 131,
      lines: [line("item-margherita", 2, [extra("extra-ost", "Extra ost", 15)]), line("item-vitloksbrod", 1)],
      fulfillment: "delivery",
      customerName: "Sara Lindqvist",
      customerPhone: "070-556 12 34",
      deliveryAddress: "Kungsgatan 4, lgh 1102",
      deliveryNote: "Ring på porttelefonen, koden fungerar inte.",
      status: "ny",
      minutesAgo: 6,
      statusMinutesAgo: 6,
    },
    {
      number: 130,
      lines: [line("item-vegetarian", 1), line("item-hawaii", 1), line("item-pommes", 1)],
      fulfillment: "pickup",
      customerName: "Amir Hosseini",
      customerPhone: "073-812 90 21",
      kitchenNote: "Nötallergi — ingen pesto, ingen nötolja.",
      status: "tillagas",
      minutesAgo: 14,
      statusMinutesAgo: 5,
    },
    {
      number: 129,
      lines: [line("item-fyra-ostar", 1, [family()]), line("item-cola", 2)],
      fulfillment: "delivery",
      customerName: "Elin Berg",
      customerPhone: "070-441 77 02",
      deliveryAddress: "Odengatan 61",
      status: "tillagas",
      minutesAgo: 18,
      statusMinutesAgo: 4,
    },
    {
      number: 128,
      lines: [line("item-pepperoni", 1, [extra("extra-jalapeno", "Jalapeños", 10)])],
      fulfillment: "pickup",
      customerName: "Nina Holm",
      customerPhone: "072-390 44 18",
      status: "redo",
      minutesAgo: 24,
      statusMinutesAgo: 3,
    },
    {
      number: 127,
      lines: [line("item-margherita", 1), line("item-hawaii", 1), line("item-vatten", 2)],
      fulfillment: "delivery",
      customerName: "Marcus Wall",
      customerPhone: "076-220 65 40",
      deliveryAddress: "Vasagatan 22",
      status: "levereras",
      minutesAgo: 35,
      statusMinutesAgo: 9,
    },
    {
      number: 126,
      lines: [line("item-vegetarian", 2, [extra("extra-champinjon", "Champinjoner", 12)])],
      fulfillment: "pickup",
      customerName: "Klara Sundin",
      customerPhone: "070-118 65 33",
      status: "klar",
      minutesAgo: 70,
      statusMinutesAgo: 45,
    },
    {
      number: 125,
      lines: [line("item-pepperoni", 1, [family(), extra("extra-kebab", "Kebabkött", 20)]), line("item-pommes", 2)],
      fulfillment: "delivery",
      customerName: "Oscar Nyberg",
      customerPhone: "073-905 21 87",
      deliveryAddress: "Sveavägen 88",
      status: "klar",
      minutesAgo: 110,
      statusMinutesAgo: 80,
      outForDeliveryMinutesAgo: 92,
    },
    {
      number: 124,
      lines: [line("item-fyra-ostar", 1), line("item-cola", 1)],
      fulfillment: "pickup",
      customerName: "Tove Ahlgren",
      customerPhone: "070-663 41 09",
      status: "klar",
      minutesAgo: 160,
      statusMinutesAgo: 140,
    },
    {
      number: 123,
      lines: [line("item-hawaii", 1)],
      fulfillment: "pickup",
      customerName: "Robin Fors",
      customerPhone: "072-540 18 66",
      kitchenNote: "Beställde av misstag, ville avboka.",
      status: "avbruten",
      minutesAgo: 200,
      statusMinutesAgo: 195,
    },
    {
      number: 122,
      lines: [line("item-hawaii", 1), line("item-cola", 1)],
      fulfillment: "delivery",
      customerName: "Freja Åkesson",
      customerPhone: "070-902 33 61",
      deliveryAddress: "Drottninggatan 50",
      status: "klar",
      minutesAgo: 230,
      statusMinutesAgo: 205,
      outForDeliveryMinutesAgo: 216,
    },
    // Sits in "redo" so the courier view's "Att hämta" queue has a real
    // order waiting for pickup on first load, not just an empty state.
    {
      number: 121,
      lines: [line("item-vegetarian", 1), line("item-vitloksbrod", 1)],
      fulfillment: "delivery",
      customerName: "Leo Malmberg",
      customerPhone: "073-664 12 50",
      deliveryAddress: "Hantverkargatan 15",
      deliveryNote: "Portkod 4471, våning 3.",
      status: "redo",
      minutesAgo: 20,
      statusMinutesAgo: 4,
    },
  ];

  const orders: Order[] = blueprints.map((bp) => {
    const subtotal = bp.lines.reduce((sum, orderLine) => sum + orderLine.unitPrice * orderLine.quantity, 0);
    const deliveryFee = bp.fulfillment === "delivery" ? restaurant.deliveryFee : 0;
    const statusHistory: Order["statusHistory"] =
      bp.outForDeliveryMinutesAgo !== undefined
        ? [
            { status: "levereras", at: minutesAgoIso(now, bp.outForDeliveryMinutesAgo) },
            { status: bp.status, at: minutesAgoIso(now, bp.statusMinutesAgo) },
          ]
        : [{ status: bp.status, at: minutesAgoIso(now, bp.statusMinutesAgo) }];
    return {
      id: `order-${bp.number}`,
      number: bp.number,
      lines: bp.lines,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      fulfillment: bp.fulfillment,
      customerName: bp.customerName,
      customerPhone: bp.customerPhone,
      deliveryAddress: bp.deliveryAddress,
      kitchenNote: bp.kitchenNote,
      deliveryNote: bp.deliveryNote,
      status: bp.status,
      createdAt: minutesAgoIso(now, bp.minutesAgo),
      statusUpdatedAt: minutesAgoIso(now, bp.statusMinutesAgo),
      // Single entry by default (just current status) — most seeded orders
      // don't get backfilled multi-step history. See types.ts and
      // outForDeliveryMinutesAgo above for the one exception.
      statusHistory,
    };
  });

  return { restaurant, orders, nextOrderNumber: 133 };
}

function minutesAgoIso(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}
