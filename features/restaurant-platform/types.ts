export type OpeningHours = {
  // 0 = söndag .. 6 = lördag, matchar Date#getDay()
  day: number;
  open: string | null;
  close: string | null;
};

export type Restaurant = {
  name: string;
  logo: string;
  heroImage: string;
  tagline: string;
  phone: string;
  address: string;
  brandColor: string;
  openingHours: OpeningHours[];
  deliveryEnabled: boolean;
  deliveryFee: number;
  minOrderForDelivery: number;
  estimatedPrepMinutes: number;
};

export type ToppingOption = {
  id: string;
  name: string;
  priceDelta: number;
};

export type ToppingGroup = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  maxSelect?: number;
  options: ToppingOption[];
};

export type MenuCategory = {
  id: string;
  name: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  toppingGroups: ToppingGroup[];
  popular?: boolean;
};

export type SelectedTopping = {
  groupId: string;
  optionId: string;
  name: string;
  priceDelta: number;
};

export type CartLine = {
  id: string;
  menuItemId: string;
  name: string;
  image: string | null;
  basePrice: number;
  quantity: number;
  toppings: SelectedTopping[];
  notes?: string;
};

export type FulfillmentType = "pickup" | "delivery";

export type OrderStatus = "ny" | "tillagas" | "redo" | "levereras" | "klar" | "avbruten";

export type OrderLine = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  toppings: SelectedTopping[];
};

export type Order = {
  id: string;
  number: number;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: FulfillmentType;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  // Split rather than one free-text field: the kitchen needs to see "no
  // onions" the moment an order lands, but a courier note like a gate code
  // is noise until the order is actually ready to go out.
  kitchenNote?: string;
  deliveryNote?: string;
  // Not set anywhere yet — no real exception source exists (failed payment,
  // missing ingredient, no-show courier) to drive it. It exists so the card
  // and drawer can render a future "needs attention" state without a
  // redesign once one of those sources is wired up.
  needsAttention?: boolean;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string;
};
