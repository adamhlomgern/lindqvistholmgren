import { SalonProfileClient } from "@/features/booking-platform/components/salon/SalonProfileClient";

export default async function BokadSalonPage(props: PageProps<"/demo/bokad/salong/[slug]">) {
  const { slug } = await props.params;
  return <SalonProfileClient slug={slug} />;
}
