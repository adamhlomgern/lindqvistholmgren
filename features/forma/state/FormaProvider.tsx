"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { createSeedData, type SeedData } from "@/features/forma/data/seed";
import { calculatePrice } from "@/features/forma/pricing/calculatePrice";
import { generateId, generateShareCode } from "@/features/forma/utils/id";
import type { Configuration, QuoteRequest, QuoteRequestStatus } from "@/features/forma/types/configuration";

type State = SeedData;

type Action =
  | { type: "SAVE_CONFIGURATION"; configuration: Configuration; id: string }
  | { type: "SUBMIT_QUOTE_REQUEST"; quoteRequest: QuoteRequest }
  | { type: "UPDATE_LEAD_STATUS"; id: string; status: QuoteRequestStatus }
  | { type: "RESET"; seed: SeedData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SAVE_CONFIGURATION":
      return {
        ...state,
        configurations: { ...state.configurations, [action.id]: { ...action.configuration, id: action.id } },
      };
    case "SUBMIT_QUOTE_REQUEST":
      return { ...state, quoteRequests: { ...state.quoteRequests, [action.quoteRequest.id]: action.quoteRequest } };
    case "UPDATE_LEAD_STATUS": {
      const existing = state.quoteRequests[action.id];
      if (!existing) return state;
      return {
        ...state,
        quoteRequests: { ...state.quoteRequests, [action.id]: { ...existing, status: action.status } },
      };
    }
    case "RESET":
      return action.seed;
    default:
      return state;
  }
}

type SubmitQuoteRequestInput = {
  configuration: Configuration;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  desiredStart: string;
};

type FormaContextValue = State & {
  saveConfiguration: (configuration: Configuration) => string;
  submitQuoteRequest: (input: SubmitQuoteRequestInput) => QuoteRequest;
  updateLeadStatus: (id: string, status: QuoteRequestStatus) => void;
  resetDemo: () => void;
  getConfiguration: (id: string) => Configuration | undefined;
  getQuoteRequest: (id: string) => QuoteRequest | undefined;
};

const FormaContext = createContext<FormaContextValue | null>(null);

export function FormaProvider({ children }: { children: ReactNode }) {
  const seed = useMemo(() => createSeedData(), []);
  const [state, dispatch] = useReducer(reducer, seed);

  const saveConfiguration = useCallback((configuration: Configuration) => {
    const id = configuration.id ?? generateShareCode();
    dispatch({ type: "SAVE_CONFIGURATION", configuration, id });
    return id;
  }, []);

  const submitQuoteRequest = useCallback((input: SubmitQuoteRequestInput) => {
    const price = calculatePrice(input.configuration);
    const configurationId = input.configuration.id ?? generateShareCode();
    if (!input.configuration.id) {
      dispatch({ type: "SAVE_CONFIGURATION", configuration: input.configuration, id: configurationId });
    }
    const quoteRequest: QuoteRequest = {
      id: generateId("lead"),
      configurationId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      municipality: input.municipality,
      desiredStart: input.desiredStart,
      estimatedLow: price.rangeLow,
      estimatedHigh: price.rangeHigh,
      status: "ny",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "SUBMIT_QUOTE_REQUEST", quoteRequest });
    return quoteRequest;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: QuoteRequestStatus) => {
    dispatch({ type: "UPDATE_LEAD_STATUS", id, status });
  }, []);

  const resetDemo = useCallback(() => dispatch({ type: "RESET", seed: createSeedData() }), []);

  const getConfiguration = useCallback((id: string) => state.configurations[id], [state.configurations]);
  const getQuoteRequest = useCallback((id: string) => state.quoteRequests[id], [state.quoteRequests]);

  const value = useMemo<FormaContextValue>(
    () => ({
      configurations: state.configurations,
      quoteRequests: state.quoteRequests,
      saveConfiguration,
      submitQuoteRequest,
      updateLeadStatus,
      resetDemo,
      getConfiguration,
      getQuoteRequest,
    }),
    [state, saveConfiguration, submitQuoteRequest, updateLeadStatus, resetDemo, getConfiguration, getQuoteRequest],
  );

  return <FormaContext.Provider value={value}>{children}</FormaContext.Provider>;
}

export function useForma(): FormaContextValue {
  const ctx = useContext(FormaContext);
  if (!ctx) {
    throw new Error("useForma must be used within a FormaProvider");
  }
  return ctx;
}
