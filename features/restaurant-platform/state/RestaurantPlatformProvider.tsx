"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { CartLine, Order, OrderStatus, Restaurant, SelectedTopping } from "@/features/restaurant-platform/types";
import { createSeedData, type SeedData } from "@/features/restaurant-platform/data/seed";
import { cartLineUnitPrice, cartSubtotal, orderDeliveryFee } from "@/features/restaurant-platform/utils/pricing";
import { nextStatus } from "@/features/restaurant-platform/utils/orderStatus";

type State = SeedData & { cart: CartLine[] };

type Action =
  | { type: "ADD_TO_CART"; line: CartLine }
  | { type: "UPDATE_CART_QTY"; lineId: string; quantity: number }
  | { type: "REMOVE_CART_LINE"; lineId: string }
  | { type: "CLEAR_CART" }
  | { type: "PLACE_ORDER"; order: Order }
  | { type: "ADVANCE_ORDER"; orderId: string; status: OrderStatus; at: string }
  | { type: "CANCEL_ORDER"; orderId: string; at: string }
  | { type: "SET_DELIVERY_ENABLED"; enabled: boolean }
  | { type: "UPDATE_RESTAURANT"; patch: Partial<Restaurant> }
  | { type: "RESET"; seed: SeedData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.line] };
    case "UPDATE_CART_QTY":
      return {
        ...state,
        cart: state.cart.map((line) => (line.id === action.lineId ? { ...line, quantity: action.quantity } : line)),
      };
    case "REMOVE_CART_LINE":
      return { ...state, cart: state.cart.filter((line) => line.id !== action.lineId) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "PLACE_ORDER":
      return { ...state, orders: [action.order, ...state.orders], cart: [], nextOrderNumber: state.nextOrderNumber + 1 };
    case "ADVANCE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, status: action.status, statusUpdatedAt: action.at } : order,
        ),
      };
    case "CANCEL_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, status: "avbruten", statusUpdatedAt: action.at } : order,
        ),
      };
    case "SET_DELIVERY_ENABLED":
      return { ...state, restaurant: { ...state.restaurant, deliveryEnabled: action.enabled } };
    case "UPDATE_RESTAURANT":
      return { ...state, restaurant: { ...state.restaurant, ...action.patch } };
    case "RESET":
      return { ...action.seed, cart: [] };
    default:
      return state;
  }
}

type NewCartLineInput = {
  menuItemId: string;
  name: string;
  image: string | null;
  basePrice: number;
  quantity: number;
  toppings: SelectedTopping[];
  notes?: string;
};

type PlaceOrderInput = {
  fulfillment: Order["fulfillment"];
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  kitchenNote?: string;
  deliveryNote?: string;
};

type RestaurantPlatformContextValue = Omit<State, never> & {
  cartSubtotal: number;
  cartCount: number;
  addToCart: (input: NewCartLineInput) => void;
  updateCartQuantity: (lineId: string, quantity: number) => void;
  removeCartLine: (lineId: string) => void;
  clearCart: () => void;
  placeOrder: (input: PlaceOrderInput) => Order;
  advanceOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  // Sets a status directly rather than stepping through the sequence —
  // used to undo an accidental advance/reject, restoring exactly the
  // status the order had a moment ago.
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  setDeliveryEnabled: (enabled: boolean) => void;
  updateRestaurant: (patch: Partial<Restaurant>) => void;
  resetDemo: () => void;
  getOrder: (orderId: string) => Order | undefined;
};

const RestaurantPlatformContext = createContext<RestaurantPlatformContextValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function RestaurantPlatformProvider({ children }: { children: ReactNode }) {
  const seed = useMemo(() => createSeedData(), []);
  const [state, dispatch] = useReducer(reducer, seed, (initialSeed) => ({ ...initialSeed, cart: [] }));

  const addToCart = useCallback((input: NewCartLineInput) => {
    dispatch({ type: "ADD_TO_CART", line: { ...input, id: generateId("cart") } });
  }, []);

  const updateCartQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QTY", lineId, quantity });
  }, []);

  const removeCartLine = useCallback((lineId: string) => {
    dispatch({ type: "REMOVE_CART_LINE", lineId });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const placeOrder = useCallback(
    (input: PlaceOrderInput) => {
      const now = new Date().toISOString();
      const subtotal = cartSubtotal(state.cart);
      const deliveryFee = orderDeliveryFee(input.fulfillment, state.restaurant);
      const order: Order = {
        id: generateId("order"),
        number: state.nextOrderNumber,
        lines: state.cart.map((cartLine) => ({
          menuItemId: cartLine.menuItemId,
          name: cartLine.name,
          quantity: cartLine.quantity,
          unitPrice: cartLineUnitPrice(cartLine),
          toppings: cartLine.toppings,
        })),
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        fulfillment: input.fulfillment,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryAddress: input.deliveryAddress,
        kitchenNote: input.kitchenNote,
        deliveryNote: input.deliveryNote,
        status: "ny",
        createdAt: now,
        statusUpdatedAt: now,
      };
      dispatch({ type: "PLACE_ORDER", order });
      return order;
    },
    [state.cart, state.nextOrderNumber, state.restaurant],
  );

  const advanceOrder = useCallback(
    (orderId: string) => {
      const order = state.orders.find((candidate) => candidate.id === orderId);
      if (!order) return;
      const next = nextStatus(order);
      if (!next) return;
      dispatch({ type: "ADVANCE_ORDER", orderId, status: next, at: new Date().toISOString() });
    },
    [state.orders],
  );

  const cancelOrder = useCallback((orderId: string) => {
    dispatch({ type: "CANCEL_ORDER", orderId, at: new Date().toISOString() });
  }, []);

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    dispatch({ type: "ADVANCE_ORDER", orderId, status, at: new Date().toISOString() });
  }, []);

  const setDeliveryEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_DELIVERY_ENABLED", enabled });
  }, []);

  const updateRestaurant = useCallback((patch: Partial<Restaurant>) => {
    dispatch({ type: "UPDATE_RESTAURANT", patch });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: "RESET", seed: createSeedData() });
  }, []);

  const getOrder = useCallback((orderId: string) => state.orders.find((order) => order.id === orderId), [state.orders]);

  const value = useMemo<RestaurantPlatformContextValue>(
    () => ({
      restaurant: state.restaurant,
      orders: state.orders,
      cart: state.cart,
      nextOrderNumber: state.nextOrderNumber,
      cartSubtotal: cartSubtotal(state.cart),
      cartCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
      addToCart,
      updateCartQuantity,
      removeCartLine,
      clearCart,
      placeOrder,
      advanceOrder,
      cancelOrder,
      setOrderStatus,
      setDeliveryEnabled,
      updateRestaurant,
      resetDemo,
      getOrder,
    }),
    [
      state,
      addToCart,
      updateCartQuantity,
      removeCartLine,
      clearCart,
      placeOrder,
      advanceOrder,
      cancelOrder,
      setOrderStatus,
      setDeliveryEnabled,
      updateRestaurant,
      resetDemo,
      getOrder,
    ],
  );

  return <RestaurantPlatformContext.Provider value={value}>{children}</RestaurantPlatformContext.Provider>;
}

export function useRestaurantPlatform(): RestaurantPlatformContextValue {
  const ctx = useContext(RestaurantPlatformContext);
  if (!ctx) {
    throw new Error("useRestaurantPlatform must be used within a RestaurantPlatformProvider");
  }
  return ctx;
}
