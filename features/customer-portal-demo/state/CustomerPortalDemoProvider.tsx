"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { CustomerMessage } from "@/lib/types";
import { demoCustomer, demoMessages } from "@/features/customer-portal-demo/data/seed";

export type DemoApprovalStatus = "pending" | "assembling" | "approved" | "changes_requested";

type DemoState = {
  approvalStatus: DemoApprovalStatus;
  decisionNote?: string;
  decidedAt?: string;
};

type DemoAction =
  | { type: "APPROVE" }
  | { type: "COMPLETE_ASSEMBLY" }
  | { type: "REQUEST_CHANGES"; note: string }
  | { type: "JUMP_TO_END" }
  | { type: "RESET" };

const initialState: DemoState = { approvalStatus: "pending" };

// Skriptade svar från "Ada" utifrån vad besökaren skriver i demochatten.
function demoReply(body: string): string {
  const text = body.toLowerCase();
  if (/pris|kost|faktur|offert/.test(text)) return "Bra fråga! Jag lägger in en uppdaterad offert här i portalen under dagen så ni ser allt samlat.";
  if (/fil|ladda|logga|logo|vektor|pdf/.test(text)) return "Alla filer ligger under Material. Slutversionerna låses upp så fort ni har godkänt, säg till om något saknas!";
  if (/färg|font|typsnitt|ändr/.test(text)) return "Absolut, det fixar vi. Jag gör en justerad version och lägger upp den för granskning, ni får en notis när den är klar.";
  if (/tack|toppen|bra|perfekt/.test(text)) return "Tack själv! Säg till om det är något mer ni undrar över.";
  return "Tack för meddelandet! Jag tittar på det och återkommer under dagen. /Ada";
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "APPROVE":
      // Brief "simulerad händelse" for finalizing the delivery — the
      // provider's own effect below flips this to "approved" shortly after.
      return { approvalStatus: "assembling" };
    case "COMPLETE_ASSEMBLY":
      return state.approvalStatus === "assembling"
        ? { approvalStatus: "approved", decidedAt: new Date().toISOString() }
        : state;
    case "REQUEST_CHANGES":
      return { approvalStatus: "changes_requested", decisionNote: action.note, decidedAt: new Date().toISOString() };
    case "JUMP_TO_END":
      // The "Visa färdig leverans" shortcut — same end state as APPROVE, no animation.
      return { approvalStatus: "approved", decidedAt: new Date().toISOString() };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type CustomerPortalDemoContextValue = DemoState & {
  finalMaterialsUnlocked: boolean;
  messages: CustomerMessage[];
  typing: boolean;
  sendMessage: (body: string) => void;
  approve: () => void;
  requestChanges: (note: string) => void;
  jumpToEnd: () => void;
  reset: () => void;
};

const CustomerPortalDemoContext = createContext<CustomerPortalDemoContextValue | null>(null);

export function CustomerPortalDemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.approvalStatus !== "assembling") return;
    const timeout = setTimeout(() => dispatch({ type: "COMPLETE_ASSEMBLY" }), 1500);
    return () => clearTimeout(timeout);
  }, [state.approvalStatus]);

  // Chatten i demon: kundens meddelande läggs till direkt, sedan "Ada
  // skriver…" och ett svar som passar frågan. Allt ligger i minnet.
  const [messages, setMessages] = useState<CustomerMessage[]>(demoMessages);
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const sendMessage = useCallback((body: string) => {
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, customerId: demoCustomer.id, authorRole: "customer", authorLabel: demoCustomer.name ?? "Du", body, createdAt: now },
    ]);
    timers.current.push(setTimeout(() => setTyping(true), 900));
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `reply-${Date.now()}`, customerId: demoCustomer.id, authorRole: "admin", authorLabel: "Ada", body: demoReply(body), createdAt: new Date().toISOString() },
        ]);
      }, 2800),
    );
  }, []);

  const approve = useCallback(() => dispatch({ type: "APPROVE" }), []);
  const requestChanges = useCallback((note: string) => dispatch({ type: "REQUEST_CHANGES", note }), []);
  const jumpToEnd = useCallback(() => dispatch({ type: "JUMP_TO_END" }), []);
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    timers.current.forEach(clearTimeout);
    setTyping(false);
    setMessages(demoMessages);
  }, []);

  const value = useMemo<CustomerPortalDemoContextValue>(
    () => ({
      ...state,
      finalMaterialsUnlocked: state.approvalStatus === "approved",
      messages,
      typing,
      sendMessage,
      approve,
      requestChanges,
      jumpToEnd,
      reset,
    }),
    [state, messages, typing, sendMessage, approve, requestChanges, jumpToEnd, reset],
  );

  return <CustomerPortalDemoContext.Provider value={value}>{children}</CustomerPortalDemoContext.Provider>;
}

export function useCustomerPortalDemo(): CustomerPortalDemoContextValue {
  const ctx = useContext(CustomerPortalDemoContext);
  if (!ctx) {
    throw new Error("useCustomerPortalDemo must be used within a CustomerPortalDemoProvider");
  }
  return ctx;
}
