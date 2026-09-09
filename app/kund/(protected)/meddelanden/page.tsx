import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerMessages } from "@/lib/data/customer-messages";
import { MessagesPanel } from "@/components/customer/MessagesPanel";
import { MarkMessagesRead } from "@/components/customer/MarkMessagesRead";

export default async function CustomerMessagesRoute() {
  const { customerId } = await verifyCustomerSession();
  const messages = await getCustomerMessages(customerId);

  return (
    <>
      <MarkMessagesRead />
      <MessagesPanel messages={messages} />
    </>
  );
}
