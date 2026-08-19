import type { Asset, AssetCategory } from "@/features/service-platform/types";

export type IndustryKey = "automotive" | "heatpump" | "equipment";

export type IndustryPreset = {
  key: IndustryKey;
  label: string;
  shortLabel: string;
  tagline: string;
  dashboardIntro: string;
  ownership: "customer" | "internal";
  categories: AssetCategory[];
  assetLabelSingular: string;
  assetLabelPlural: string;
  identifierLabel: string;
};

export const industryPresets: Record<IndustryKey, IndustryPreset> = {
  automotive: {
    key: "automotive",
    label: "Bilverkstad",
    shortLabel: "Bilverkstad",
    tagline: "Håll koll på kundernas fordon",
    dashboardIntro: "Fordon som snart behöver service hos era kunder.",
    ownership: "customer",
    categories: ["vehicle"],
    assetLabelSingular: "Fordon",
    assetLabelPlural: "Fordon",
    identifierLabel: "Registreringsnummer",
  },
  heatpump: {
    key: "heatpump",
    label: "Värmepump & ventilation",
    shortLabel: "Värmepump",
    tagline: "Håll koll på kundernas anläggningar",
    dashboardIntro: "Anläggningar som snart behöver service hos era kunder.",
    ownership: "customer",
    categories: ["heat_pump", "ventilation"],
    assetLabelSingular: "Anläggning",
    assetLabelPlural: "Anläggningar",
    identifierLabel: "Serienummer",
  },
  equipment: {
    key: "equipment",
    label: "Eget underhåll",
    shortLabel: "Eget underhåll",
    tagline: "Håll koll på företagets egen utrustning",
    dashboardIntro: "Er egen utrustning som snart behöver service eller kontroll.",
    ownership: "internal",
    categories: [],
    assetLabelSingular: "Utrustning",
    assetLabelPlural: "Utrustning",
    identifierLabel: "ID / serienummer",
  },
};

export const industryOrder: IndustryKey[] = ["automotive", "heatpump", "equipment"];

export const defaultIndustry: IndustryKey = "automotive";

export function isIndustryKey(value: string | null | undefined): value is IndustryKey {
  return !!value && value in industryPresets;
}

export function filterAssetsByIndustry(assets: Asset[], industry: IndustryKey): Asset[] {
  const preset = industryPresets[industry];
  if (preset.ownership === "internal") {
    return assets.filter((asset) => asset.customerId === null);
  }
  return assets.filter((asset) => asset.customerId !== null && preset.categories.includes(asset.category));
}
