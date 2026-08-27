import { getModel } from "@/features/forma/data/models";
import { bathroomPrice, facadeOptions, fireplacePrice, flooringOptions, getPackage, kitchenOptions, roofOptions, windowOptions } from "@/features/forma/data/options";
import type { Configuration, PriceBreakdown, PriceLineItem } from "@/features/forma/types/configuration";

// Range factor: the summary shows an interval rather than a false-precision
// exact number, since real cost depends on markarbete/tomt (see Configuration.site).
const RANGE_HIGH_FACTOR = 1.07;

function findOrThrow<T extends { id: string; priceDelta: number; name: string }>(options: T[], id: string): T {
  const option = options.find((o) => o.id === id);
  if (!option) {
    throw new Error(`Unknown option id: ${id}`);
  }
  return option;
}

export function calculatePrice(configuration: Configuration): PriceBreakdown {
  const model = getModel(configuration.model);
  const lineItems: PriceLineItem[] = [];

  const facade = findOrThrow(facadeOptions, configuration.exterior.facade);
  if (facade.priceDelta > 0) lineItems.push({ key: "facade", label: facade.name, amount: facade.priceDelta });

  const roof = findOrThrow(roofOptions, configuration.exterior.roof);
  if (roof.priceDelta > 0) lineItems.push({ key: "roof", label: roof.name, amount: roof.priceDelta });

  const windows = findOrThrow(windowOptions, configuration.exterior.windows);
  if (windows.priceDelta > 0) lineItems.push({ key: "windows", label: windows.name, amount: windows.priceDelta });

  const kitchen = findOrThrow(kitchenOptions, configuration.interior.kitchen);
  if (kitchen.priceDelta > 0) lineItems.push({ key: "kitchen", label: kitchen.name, amount: kitchen.priceDelta });

  if (configuration.interior.bathroom) {
    lineItems.push({ key: "bathroom", label: "Badrum", amount: bathroomPrice });
  }

  if (configuration.interior.flooring) {
    const flooring = findOrThrow(flooringOptions, configuration.interior.flooring);
    if (flooring.priceDelta > 0) lineItems.push({ key: "flooring", label: flooring.name, amount: flooring.priceDelta });
  }

  if (configuration.interior.fireplace) {
    lineItems.push({ key: "fireplace", label: "Kamin", amount: fireplacePrice });
  }

  for (const packageId of configuration.packages) {
    const pkg = getPackage(packageId);
    lineItems.push({ key: `package-${pkg.id}`, label: pkg.name, amount: pkg.priceDelta });
  }

  const total = model.basePrice + lineItems.reduce((sum, item) => sum + item.amount, 0);

  return {
    base: model.basePrice,
    lineItems,
    total,
    rangeLow: total,
    rangeHigh: Math.round((total * RANGE_HIGH_FACTOR) / 1000) * 1000,
  };
}
