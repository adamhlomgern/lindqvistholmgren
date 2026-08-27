import type {
  FacadeId,
  FlooringId,
  KitchenId,
  PackageId,
  RoofId,
  WindowId,
} from "@/features/forma/types/configuration";

export type SwatchOption<TId extends string> = {
  id: TId;
  name: string;
  priceDelta: number;
  swatch: string; // hex used for the material swatch + house illustration recolor
  description?: string;
};

export const facadeOptions: SwatchOption<FacadeId>[] = [
  { id: "natur", name: "Natur", priceDelta: 0, swatch: "#c9b89a" },
  { id: "svart", name: "Svart träpanel", priceDelta: 12_000, swatch: "#1c1c1c" },
  { id: "falurod", name: "Faluröd träpanel", priceDelta: 8_000, swatch: "#7a2620" },
  { id: "vit", name: "Vit", priceDelta: 0, swatch: "#f2efe8" },
  { id: "thermowood", name: "Thermowood", priceDelta: 28_000, swatch: "#5b4230" },
];

export const roofOptions: SwatchOption<RoofId>[] = [
  { id: "platt", name: "Platt tak", priceDelta: 0, swatch: "#3a3a3a" },
  { id: "sadel", name: "Sadeltak", priceDelta: 18_000, swatch: "#2b2b2b" },
];

export const windowOptions: SwatchOption<WindowId>[] = [
  { id: "standard", name: "Standardfönster", priceDelta: 0, swatch: "#a9c4d4" },
  {
    id: "panorama",
    name: "Panoramafönster",
    priceDelta: 24_000,
    swatch: "#cfe4f0",
    description: "Golv-i-tak-fönster mot en av långsidorna.",
  },
];

export const kitchenOptions: SwatchOption<KitchenId>[] = [
  { id: "standard", name: "Standardkök", priceDelta: 0, swatch: "#e5e0d5" },
  { id: "premium", name: "Premiumkök", priceDelta: 45_000, swatch: "#3f3a33" },
];

export const flooringOptions: SwatchOption<FlooringId>[] = [
  { id: "laminat", name: "Laminat", priceDelta: 0, swatch: "#c8ab7d" },
  { id: "ekparkett", name: "Ekparkett", priceDelta: 18_000, swatch: "#a97c4f" },
];

export const bathroomPrice = 59_000;
export const fireplacePrice = 32_000;

export type PackageOption = {
  id: PackageId;
  name: string;
  priceDelta: number;
  description: string;
};

export const packageOptions: PackageOption[] = [
  { id: "winter", name: "Vinterpaket", priceDelta: 28_000, description: "Extra isolering och golvvärme för åretruntboende." },
  { id: "smart-home", name: "Smart home", priceDelta: 16_000, description: "Uppkopplad belysning, lås och klimatstyrning." },
  { id: "solar", name: "Solcellspaket", priceDelta: 49_000, description: "Solceller på taket med app för uppföljning." },
  { id: "va", name: "VA-paket", priceDelta: 52_000, description: "Anslutning för vatten och avlopp." },
];

export function getPackage(id: PackageId): PackageOption {
  const pkg = packageOptions.find((p) => p.id === id);
  if (!pkg) {
    throw new Error(`Unknown package id: ${id}`);
  }
  return pkg;
}
