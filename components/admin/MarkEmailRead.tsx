"use client";

import { useEffect } from "react";
import { markEmailRead } from "@/lib/actions/emails";

// Fires once the email detail page has actually mounted in the browser.
// markEmailRead calls revalidatePath, which Next.js doesn't allow during a
// page's own server render — calling it there crashed the route outright on
// the first open of any unread email. Same fix as MarkMessagesRead.
export function MarkEmailRead({ emailId }: { emailId: string }) {
  useEffect(() => {
    markEmailRead(emailId);
  }, [emailId]);

  return null;
}
