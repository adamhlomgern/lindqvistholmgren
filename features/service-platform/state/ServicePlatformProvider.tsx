"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Asset, CallOutcome, ContactChannel, ContactEvent, Customer, ServiceEvent } from "@/features/service-platform/types";
import { createSeedData, type SeedData } from "@/features/service-platform/data/seed";
import { addMonths, toISODate } from "@/features/service-platform/utils/dates";
import { defaultIndustry, isIndustryKey, type IndustryKey } from "@/features/service-platform/config/industries";
import { useQueryParam } from "@/features/service-platform/utils/useQueryParam";

type State = SeedData & { industry: IndustryKey; industryTouched: boolean };

type Action =
  | { type: "ADD_CUSTOMER"; customer: Customer }
  | { type: "ADD_ASSET"; asset: Asset }
  | { type: "REGISTER_SERVICE"; assetId: string; event: ServiceEvent; nextServiceDate: string | null }
  | { type: "TOGGLE_MANUAL_CONTACT"; assetId: string; contactedAt: string | null }
  | { type: "LOG_CONTACTS"; events: ContactEvent[] }
  | { type: "BOOK_SERVICE"; assetId: string; bookedAt: string | null }
  | { type: "UPDATE_CUSTOMER_NOTES"; customerId: string; notes: string }
  | { type: "SET_INDUSTRY"; industry: IndustryKey }
  | { type: "RESET"; seed: SeedData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_CUSTOMER":
      return { ...state, customers: [action.customer, ...state.customers] };
    case "ADD_ASSET":
      return { ...state, assets: [action.asset, ...state.assets] };
    case "REGISTER_SERVICE":
      return {
        ...state,
        serviceEvents: [action.event, ...state.serviceEvents],
        assets: state.assets.map((asset) =>
          asset.id === action.assetId
            ? {
                ...asset,
                lastServiceDate: action.event.performedAt,
                nextServiceDate: action.nextServiceDate,
                // A fresh service cycle starts — any earlier "we called
                // about this" note no longer applies.
                manualContactedAt: null,
                bookedAt: null,
              }
            : asset,
        ),
      };
    case "LOG_CONTACTS": {
      // Ett samtal räknas som att man själv kontaktat kunden om objektet.
      const calledAssets = new Set(
        action.events.filter((e) => e.channel === "call" && e.assetId).map((e) => e.assetId as string),
      );
      return {
        ...state,
        contactEvents: [...action.events, ...state.contactEvents],
        assets: calledAssets.size
          ? state.assets.map((asset) =>
              calledAssets.has(asset.id) ? { ...asset, manualContactedAt: toISODate(new Date()) } : asset,
            )
          : state.assets,
      };
    }
    case "BOOK_SERVICE":
      return {
        ...state,
        assets: state.assets.map((asset) => (asset.id === action.assetId ? { ...asset, bookedAt: action.bookedAt } : asset)),
      };
    case "UPDATE_CUSTOMER_NOTES":
      return {
        ...state,
        customers: state.customers.map((c) => (c.id === action.customerId ? { ...c, notes: action.notes } : c)),
      };
    case "TOGGLE_MANUAL_CONTACT":
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.id === action.assetId ? { ...asset, manualContactedAt: action.contactedAt } : asset,
        ),
      };
    case "SET_INDUSTRY":
      return { ...state, industry: action.industry, industryTouched: true };
    case "RESET":
      return { ...action.seed, industry: state.industry, industryTouched: state.industryTouched };
    default:
      return state;
  }
}

type NewCustomerInput = Omit<Customer, "id" | "createdAt">;
type NewAssetInput = Omit<Asset, "id" | "createdAt" | "manualContactedAt" | "bookedAt">;
type ContactInput = { customerId: string; assetId: string | null; channel: ContactChannel; message?: string; outcome?: CallOutcome };
type RegisterServiceInput = { performedAt: string; serviceType?: string; notes?: string; nextServiceDate: string | null };

type ServicePlatformContextValue = Omit<State, "industryTouched"> & {
  addCustomer: (input: NewCustomerInput) => Customer;
  addAsset: (input: NewAssetInput) => Asset;
  registerService: (assetId: string, input: RegisterServiceInput) => void;
  toggleManualContact: (assetId: string) => void;
  logContacts: (inputs: ContactInput[]) => void;
  bookService: (assetId: string, bookedAt: string | null) => void;
  updateCustomerNotes: (customerId: string, notes: string) => void;
  notify: (message: string) => void;
  setIndustry: (industry: IndustryKey) => void;
  resetDemo: () => void;
};

const ServicePlatformContext = createContext<ServicePlatformContextValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function suggestNextServiceDate(performedAt: string, intervalMonths: number | null): string | null {
  if (!intervalMonths) return null;
  return toISODate(addMonths(new Date(performedAt), intervalMonths));
}

export function ServicePlatformProvider({ children }: { children: ReactNode }) {
  const seed = useMemo(() => createSeedData(), []);
  const [state, dispatch] = useReducer(reducer, seed, (initialSeed) => ({
    ...initialSeed,
    industry: defaultIndustry,
    industryTouched: false,
  }));

  // ?industry= in the URL sets the initial preset, but only until the user
  // touches the switcher — read via an external-store hook (not an effect)
  // so the server-rendered HTML and first client render stay in sync.
  const industryParam = useQueryParam("industry");
  const resolvedIndustry =
    !state.industryTouched && isIndustryKey(industryParam) ? industryParam : state.industry;

  const addCustomer = useCallback((input: NewCustomerInput) => {
    const customer: Customer = { ...input, id: generateId("cust"), createdAt: new Date().toISOString() };
    dispatch({ type: "ADD_CUSTOMER", customer });
    return customer;
  }, []);

  const addAsset = useCallback((input: NewAssetInput) => {
    const asset: Asset = {
      ...input,
      id: generateId("asset"),
      manualContactedAt: null,
      bookedAt: null,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ASSET", asset });
    return asset;
  }, []);

  const registerService = useCallback((assetId: string, input: RegisterServiceInput) => {
    const event: ServiceEvent = {
      id: generateId("event"),
      assetId,
      performedAt: input.performedAt,
      serviceType: input.serviceType,
      notes: input.notes,
    };
    dispatch({ type: "REGISTER_SERVICE", assetId, event, nextServiceDate: input.nextServiceDate });
  }, []);

  const toggleManualContact = useCallback(
    (assetId: string) => {
      const current = state.assets.find((asset) => asset.id === assetId)?.manualContactedAt ?? null;
      dispatch({
        type: "TOGGLE_MANUAL_CONTACT",
        assetId,
        contactedAt: current ? null : toISODate(new Date()),
      });
    },
    [state.assets],
  );

  const logContacts = useCallback((inputs: ContactInput[]) => {
    const now = new Date();
    const stamp = `${toISODate(now)}T${now.toTimeString().slice(0, 5)}`;
    dispatch({
      type: "LOG_CONTACTS",
      events: inputs.map((input) => ({ ...input, id: generateId("contact"), at: stamp })),
    });
  }, []);

  const bookService = useCallback((assetId: string, bookedAt: string | null) => {
    dispatch({ type: "BOOK_SERVICE", assetId, bookedAt });
  }, []);

  const updateCustomerNotes = useCallback((customerId: string, notes: string) => {
    dispatch({ type: "UPDATE_CUSTOMER_NOTES", customerId, notes });
  }, []);

  // Liten bekräftelse längst ned ("SMS skickat till …"), så att varje
  // åtgärd i demon känns som att den faktiskt hände.
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const notify = useCallback((message: string) => setToast({ id: Date.now(), message }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const setIndustry = useCallback((industry: IndustryKey) => {
    dispatch({ type: "SET_INDUSTRY", industry });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: "RESET", seed: createSeedData() });
  }, []);

  const value = useMemo<ServicePlatformContextValue>(
    () => ({
      customers: state.customers,
      assets: state.assets,
      serviceEvents: state.serviceEvents,
      contactEvents: state.contactEvents,
      industry: resolvedIndustry,
      addCustomer,
      addAsset,
      registerService,
      toggleManualContact,
      logContacts,
      bookService,
      updateCustomerNotes,
      notify,
      setIndustry,
      resetDemo,
    }),
    [state, resolvedIndustry, addCustomer, addAsset, registerService, toggleManualContact, logContacts, bookService, updateCustomerNotes, notify, setIndustry, resetDemo],
  );

  return (
    <ServicePlatformContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex justify-center px-4 md:bottom-6">
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-2 rounded-full bg-demo-text px-4 py-2.5 text-sm font-medium text-white shadow-xl"
          >
            <CheckCircle2 size={16} className="text-emerald-300" />
            {toast.message}
          </div>
        )}
      </div>
    </ServicePlatformContext.Provider>
  );
}

export function useServicePlatform(): ServicePlatformContextValue {
  const ctx = useContext(ServicePlatformContext);
  if (!ctx) {
    throw new Error("useServicePlatform must be used within a ServicePlatformProvider");
  }
  return ctx;
}
