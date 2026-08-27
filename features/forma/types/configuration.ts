export type ModelId = "forma-20" | "forma-25" | "forma-30";

export type FacadeId = "natur" | "svart" | "falurod" | "vit" | "thermowood";
export type RoofId = "platt" | "sadel";
export type WindowId = "standard" | "panorama";
export type LayoutId = "layout-a" | "layout-b" | "layout-c";
export type KitchenId = "standard" | "premium";
export type FlooringId = "laminat" | "ekparkett";
export type PackageId = "winter" | "smart-home" | "solar" | "va";

export type TerrainId = "plan" | "lutande" | "kraftigt-lutande" | "vet-inte";
export type YesNoUnknown = "ja" | "nej" | "vet-inte";
export type AccessId = "ja" | "begransad" | "vet-inte";

export type SiteInfo = {
  municipality: string;
  terrain: TerrainId | null;
  waterAndSewer: YesNoUnknown | null;
  access: AccessId | null;
};

export type Configuration = {
  id: string | null;
  model: ModelId;
  exterior: {
    facade: FacadeId;
    roof: RoofId;
    windows: WindowId;
  };
  layout: LayoutId;
  interior: {
    kitchen: KitchenId;
    bathroom: boolean;
    flooring: FlooringId | null;
    fireplace: boolean;
  };
  yearRoundLiving: boolean;
  packages: PackageId[];
  site: SiteInfo;
  createdAt: string;
  updatedAt: string;
};

export type QuoteRequestStatus = "ny" | "kontaktad" | "mote-bokat" | "offert-skickad" | "vunnen" | "forlorad";

export type QuoteRequest = {
  id: string;
  configurationId: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  desiredStart: string;
  estimatedLow: number;
  estimatedHigh: number;
  status: QuoteRequestStatus;
  createdAt: string;
};

export type PriceLineItem = {
  key: string;
  label: string;
  amount: number;
};

export type PriceBreakdown = {
  base: number;
  lineItems: PriceLineItem[];
  total: number;
  rangeLow: number;
  rangeHigh: number;
};
