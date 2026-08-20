import { OrderQueue } from "@/features/restaurant-platform/components/restaurant/OrderQueue";

// No page heading/explainer here on purpose — this is an operational
// screen staff check dozens of times an hour, not a dashboard they land on
// once. The compact status bar inside OrderQueue carries that weight instead.
export default function MumsaRestaurantPage() {
  return <OrderQueue />;
}
