"use client";

import { MessagesPanel } from "@/components/customer/MessagesPanel";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

// Samma chatt som i den riktiga kundportalen, men i demoläge: man kan skriva
// och får ett skriptat svar från "Ada" (se CustomerPortalDemoProvider).
export function DemoMessagesPage() {
  const { messages, typing, sendMessage } = useCustomerPortalDemo();
  return <MessagesPanel messages={messages} onSend={sendMessage} typingLabel={typing ? "Ada" : null} />;
}
