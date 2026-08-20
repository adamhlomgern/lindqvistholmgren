import { OrderTrackingView } from "@/features/restaurant-platform/components/storefront/OrderTrackingView";

export default async function MumsaOrderPage(props: PageProps<"/demo/mumsa/order/[id]">) {
  const { id } = await props.params;
  return <OrderTrackingView orderId={id} />;
}
