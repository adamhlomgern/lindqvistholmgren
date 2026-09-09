"use client";

import { useEffect } from "react";
import { markMessagesRead } from "@/lib/actions/customer-messages";

// Fires once the Meddelanden page has actually mounted in the browser —
// deliberately not a side effect during the page's server render, so a
// background route prefetch can never mark messages as read before the
// customer has actually looked at them.
export function MarkMessagesRead() {
  useEffect(() => {
    markMessagesRead();
  }, []);

  return null;
}
