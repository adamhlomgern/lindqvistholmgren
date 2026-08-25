import { BookingReceipt } from "@/features/booking-platform/components/booking/BookingReceipt";

export default async function BokadBookingPage(props: PageProps<"/demo/bokad/bokning/[id]">) {
  const { id } = await props.params;
  return <BookingReceipt bookingId={id} />;
}
