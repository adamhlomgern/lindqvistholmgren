"use client";

import { MessagesPanel } from "@/components/customer/MessagesPanel";
import { demoMessages } from "@/features/customer-portal-demo/data/seed";

// A fixed, scripted conversation for the visitor to read — not something to
// type into, so this just reuses MessagesPanel's existing readOnly mode
// (built for the admin Kundvy preview).
export function DemoMessagesPage() {
  return <MessagesPanel messages={demoMessages} readOnly />;
}
