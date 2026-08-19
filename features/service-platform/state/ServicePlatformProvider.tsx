"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Asset, Customer, ServiceEvent } from "@/features/service-platform/types";
import { createSeedData, type SeedData } from "@/features/service-platform/data/seed";
import { addMonths, toISODate } from "@/features/service-platform/utils/dates";
import { defaultIndustry, isIndustryKey, type IndustryKey } from "@/features/service-platform/config/industries";
import { useQueryParam } from "@/features/service-platform/utils/useQueryParam";

type State = SeedData & { industry: IndustryKey; industryTouched: boolean };

type Action =
  | { type: "ADD_CUSTOMER"; customer: Customer }
  | { type: "ADD_ASSET"; asset: Asset }
  | { type: "REGISTER_SERVICE"; assetId: string; event: ServiceEvent; nextServiceDate: string | null }
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
            ? { ...asset, lastServiceDate: action.event.performedAt, nextServiceDate: action.nextServiceDate }
            : asset,
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
type NewAssetInput = Omit<Asset, "id" | "createdAt">;
type RegisterServiceInput = { performedAt: string; serviceType?: string; notes?: string; nextServiceDate: string | null };

type ServicePlatformContextValue = Omit<State, "industryTouched"> & {
  addCustomer: (input: NewCustomerInput) => Customer;
  addAsset: (input: NewAssetInput) => Asset;
  registerService: (assetId: string, input: RegisterServiceInput) => void;
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
    const asset: Asset = { ...input, id: generateId("asset"), createdAt: new Date().toISOString() };
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
      industry: resolvedIndustry,
      addCustomer,
      addAsset,
      registerService,
      setIndustry,
      resetDemo,
    }),
    [state, resolvedIndustry, addCustomer, addAsset, registerService, setIndustry, resetDemo],
  );

  return <ServicePlatformContext.Provider value={value}>{children}</ServicePlatformContext.Provider>;
}

export function useServicePlatform(): ServicePlatformContextValue {
  const ctx = useContext(ServicePlatformContext);
  if (!ctx) {
    throw new Error("useServicePlatform must be used within a ServicePlatformProvider");
  }
  return ctx;
}
