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

  // Fler exempel i olika säljsteg så att säljvyn (tabell och tavla) ser ut
  // som en riktig pipeline.
  const extra: {
    id: string;
    name: string;
    phone: string;
    municipality: string;
    start: string;
    status: QuoteRequest["status"];
    days: number;
    config: Partial<Omit<Configuration, "id">> & { model: Configuration["model"] };
  }[] = [
    { id: "C7M21", name: "Sara Lindqvist", phone: "070-555 12 34", municipality: "Hammarö", start: "Sommaren 2026", status: "mote-bokat", days: 9, config: { model: "forma-30", exterior: { facade: "natur", roof: "sadel", windows: "standard" }, yearRoundLiving: true, packages: ["winter"] } },
    { id: "D2P58", name: "Mikael Ek", phone: "072-321 76 54", municipality: "Kil", start: "Våren 2027", status: "offert-skickad", days: 14, config: { model: "forma-25", exterior: { facade: "svart", roof: "platt", windows: "standard" }, packages: ["smart-home"] } },
    { id: "E9R13", name: "Familjen Holm", phone: "076-444 98 21", municipality: "Grums", start: "Hösten 2026", status: "vunnen", days: 31, config: { model: "forma-30", exterior: { facade: "falurod", roof: "sadel", windows: "standard" }, yearRoundLiving: true, packages: ["winter", "smart-home"] } },
    { id: "F1T77", name: "Linnea Ström", phone: "070-888 22 11", municipality: "Karlstad", start: "Vet inte än", status: "ny", days: 1, config: { model: "forma-20", exterior: { facade: "natur", roof: "platt", windows: "standard" } } },
    { id: "G6W40", name: "Per Axelsson", phone: "073-111 45 90", municipality: "Arvika", start: "Våren 2027", status: "forlorad", days: 40, config: { model: "forma-25", exterior: { facade: "svart", roof: "sadel", windows: "standard" } } },
  ];
  for (const e of extra) {
    const configuration = makeSeedConfiguration(
      { ...e.config, id: e.id, site: { municipality: e.municipality, terrain: "plan", waterAndSewer: "ja", access: "ja" } },
      dayAgo(e.days),
    );
    configurations[e.id] = configuration;
    const price = calculatePrice(configuration);
    const leadId = `lead-${e.id.toLowerCase()}`;
    quoteRequests[leadId] = {
      id: leadId,
      configurationId: e.id,
      name: e.name,
      email: `${e.name.split(" ")[0].toLowerCase()}@example.se`,
      phone: e.phone,
      municipality: e.municipality,
      desiredStart: e.start,
      estimatedLow: price.rangeLow,
      estimatedHigh: price.rangeHigh,
      status: e.status,
      createdAt: dayAgo(e.days),
    };
  }

  return { configurations, quoteRequests };
}

export function createDraftConfiguration(model: Configuration["model"] = "forma-25"): Configuration {
  return baseConfiguration(model, new Date().toISOString());
}
