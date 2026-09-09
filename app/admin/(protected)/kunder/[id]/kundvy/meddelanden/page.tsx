import { getCustomerMessages } from "@/lib/data/customer-messages";
import { MessagesPanel } from "@/components/customer/MessagesPanel";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerKundvyMessagesTab({ params }: Props) {
  const { id } = await params;
  const messages = await getCustomerMessages(id);

  return <MessagesPanel messages={messages} readOnly />;
}
