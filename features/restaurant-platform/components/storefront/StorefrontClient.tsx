"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem, Order } from "@/features/restaurant-platform/types";
import { menuCategories, menuItems } from "@/features/restaurant-platform/data/menu";
import { useRestaurantPlatform } from "@/features/restaurant-platform/state/RestaurantPlatformProvider";
import { mumsaRoutes } from "@/features/restaurant-platform/config/product";
import { RestaurantHeader } from "@/features/restaurant-platform/components/storefront/RestaurantHeader";
import { MenuBrowser } from "@/features/restaurant-platform/components/storefront/MenuBrowser";
import { MenuItemModal } from "@/features/restaurant-platform/components/storefront/MenuItemModal";
import { CartBar } from "@/features/restaurant-platform/components/storefront/CartBar";
import { CartDrawer } from "@/features/restaurant-platform/components/storefront/CartDrawer";
import { CheckoutModal } from "@/features/restaurant-platform/components/storefront/CheckoutModal";

type Panel = "cart" | "checkout" | null;

export function StorefrontClient() {
  const router = useRouter();
  const { restaurant, addToCart } = useRestaurantPlatform();
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [panel, setPanel] = useState<Panel>(null);

  function handleSelectItem(item: MenuItem) {
    if (item.toppingGroups.length === 0) {
      addToCart({ menuItemId: item.id, name: item.name, image: item.image, basePrice: item.price, quantity: 1, toppings: [] });
      return;
    }
    setActiveItem(item);
  }

  function handleOrderPlaced(order: Order) {
    setPanel(null);
    router.push(mumsaRoutes.order(order.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <RestaurantHeader restaurant={restaurant} />
      <MenuBrowser categories={menuCategories} items={menuItems} onSelectItem={handleSelectItem} />

      {activeItem && (
        <MenuItemModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onAdd={({ quantity, toppings }) =>
            addToCart({
              menuItemId: activeItem.id,
              name: activeItem.name,
              image: activeItem.image,
              basePrice: activeItem.price,
              quantity,
              toppings,
            })
          }
        />
      )}

      <CartBar onOpen={() => setPanel("cart")} />
      <CartDrawer open={panel === "cart"} onClose={() => setPanel(null)} onCheckout={() => setPanel("checkout")} />
      <CheckoutModal
        open={panel === "checkout"}
        onClose={() => setPanel(null)}
        onBack={() => setPanel("cart")}
        onPlaced={handleOrderPlaced}
      />
    </div>
  );
}
