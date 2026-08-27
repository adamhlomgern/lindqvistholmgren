import { calculatePrice } from "@/features/forma/pricing/calculatePrice";
import type { Configuration, QuoteRequest } from "@/features/forma/types/configuration";

function baseConfiguration(model: Configuration["model"], createdAt: string): Configuration {
  return {
    id: null,
    model,
    layout: "layout-a",
    exterior: { facade: "natur", roof: "platt", windows: "standard" },
    interior: { kitchen: "standard", bathroom: false, flooring: null, fireplace: false },
    yearRoundLiving: false,
    packages: [],
    site: { municipality: "", terrain: null, waterAndSewer: null, access: null },
    createdAt,
    updatedAt: createdAt,
  };
}

// Fixed (not random) ids for seeded example data — see FormaProvider,
// which regenerates the whole seed on every fresh page load. Runtime data
// created via the actual configurator/quote flow still gets random ids
// (generateId/generateShareCode); only the demo's own pre-built examples
// need to resolve to the same URL across reloads.
function makeSeedConfiguration(overrides: Partial<Configuration> & { model: Configuration["model"]; id: string }, createdAt: string): Configuration {
  return { ...baseConfiguration(overrides.model, createdAt), ...overrides };
}

export type SeedData = {
  configurations: Record<string, Configuration>;
  quoteRequests: Record<string, QuoteRequest>;
};

export function createSeedData(): SeedData {
  const now = new Date();
  const dayAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const annaConfig = makeSeedConfiguration(
    {
      id: "A8F32",
      model: "forma-30",
      exterior: { facade: "svart", roof: "sadel", windows: "standard" },
      interior: { kitchen: "premium", bathroom: false, flooring: null, fireplace: false },
      yearRoundLiving: true,
      packages: ["winter", "smart-home"],
      site: { municipality: "Karlstad", terrain: "plan", waterAndSewer: "ja", access: "ja" },
    },
    dayAgo(2),
  );

  const johanConfig = makeSeedConfiguration(
    {
      id: "B4K90",
      model: "forma-25",
      exterior: { facade: "falurod", roof: "platt", windows: "standard" },
      interior: { kitchen: "standard", bathroom: false, flooring: "ekparkett", fireplace: false },
      yearRoundLiving: false,
      packages: ["smart-home"],
      site: { municipality: "Örebro", terrain: "lutande", waterAndSewer: "vet-inte", access: "ja" },
    },
    dayAgo(5),
  );

  const annaPrice = calculatePrice(annaConfig);
  const johanPrice = calculatePrice(johanConfig);

  const configurations: Record<string, Configuration> = {
    [annaConfig.id as string]: annaConfig,
    [johanConfig.id as string]: johanConfig,
  };

  const quoteRequests: Record<string, QuoteRequest> = {};

  const annaRequestId = "lead-anna-berg";
  quoteRequests[annaRequestId] = {
    id: annaRequestId,
    configurationId: annaConfig.id as string,
    name: "Anna Berg",
    email: "anna.berg@example.se",
    phone: "070-123 45 67",
    municipality: "Karlstad",
    desiredStart: "Våren 2027",
    estimatedLow: annaPrice.rangeLow,
    estimatedHigh: annaPrice.rangeHigh,
    status: "ny",
    createdAt: dayAgo(2),
  };

  const johanRequestId = "lead-johan-nilsson";
  quoteRequests[johanRequestId] = {
    id: johanRequestId,
    configurationId: johanConfig.id as string,
    name: "Johan Nilsson",
    email: "johan.nilsson@example.se",
    phone: "073-987 65 43",
    municipality: "Örebro",
    desiredStart: "Hösten 2026",
    estimatedLow: johanPrice.rangeLow,
    estimatedHigh: johanPrice.rangeHigh,
    status: "kontaktad",
    createdAt: dayAgo(5),
  };

  return { configurations, quoteRequests };
}

export function createDraftConfiguration(model: Configuration["model"] = "forma-25"): Configuration {
  return baseConfiguration(model, new Date().toISOString());
}
