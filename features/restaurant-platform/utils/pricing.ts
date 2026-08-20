import type { CartLine, FulfillmentType, Restaurant, SelectedTopping } from "@/features/restaurant-platform/types";

export function toppingsTotal(toppings: SelectedTopping[]): number {
  return toppings.reduce((sum, topping) => sum + topping.priceDelta, 0);
}

export function cartLineUnitPrice(line: Pick<CartLine, "basePrice" | "toppings">): number {
  return line.basePrice + toppingsTotal(line.toppings);
}

export function cartLineTotal(line: Pick<CartLine, "basePrice" | "toppings" | "quantity">): number {
  return cartLineUnitPrice(line) * line.quantity;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + cartLineTotal(line), 0);
}

export function orderDeliveryFee(fulfillment: FulfillmentType, restaurant: Restaurant): number {
  return fulfillment === "delivery" ? restaurant.deliveryFee : 0;
}
