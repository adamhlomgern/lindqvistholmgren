"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

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

  const approve = useCallback(() => dispatch({ type: "APPROVE" }), []);
  const requestChanges = useCallback((note: string) => dispatch({ type: "REQUEST_CHANGES", note }), []);
  const jumpToEnd = useCallback(() => dispatch({ type: "JUMP_TO_END" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo<CustomerPortalDemoContextValue>(
    () => ({
      ...state,
      finalMaterialsUnlocked: state.approvalStatus === "approved",
      approve,
      requestChanges,
      jumpToEnd,
      reset,
    }),
    [state, approve, requestChanges, jumpToEnd, reset],
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
