import type { Asset, Customer, ServiceEvent } from "@/features/service-platform/types";
import { addDays, addMonths, toISODate } from "@/features/service-platform/utils/dates";

export type SeedData = {
  customers: Customer[];
  assets: Asset[];
  serviceEvents: ServiceEvent[];
};

type AssetBlueprint = {
  id: string;
  customerId: string | null;
  name: string;
  category: Asset["category"];
  identifier?: string;
  intervalMonths: number | null;
  dueInDays: number | null;
  historyEntries?: number;
};

// dueInDays is relative to "today" at seed time, so the demo always shows a
// realistic mix of overdue/due-soon/upcoming/ok items no matter when it's
// viewed. lastServiceDate and service history are back-computed from it.
export function createSeedData(today: Date = new Date()): SeedData {
  const customers: Customer[] = [
    { id: "cust-1", name: "Anna Karlsson", phone: "070-123 45 67", email: "anna@example.se", createdAt: iso(today, -400) },
    { id: "cust-2", name: "Erik Karlsson", companyName: "Karlsson Bygg AB", phone: "070-234 56 78", email: "erik@karlssonbygg.se", createdAt: iso(today, -390) },
    { id: "cust-3", name: "Maria Svensson", companyName: "Svensson Transport AB", phone: "070-345 67 89", email: "maria@svenssontransport.se", createdAt: iso(today, -370) },
    { id: "cust-4", name: "Peter Nilsson", companyName: "Byggmästarna AB", phone: "070-456 78 90", email: "peter@byggmastarna.se", createdAt: iso(today, -300) },
    { id: "cust-5", name: "Petra Lind", phone: "070-567 89 01", email: "petra.lind@example.se", createdAt: iso(today, -250) },
    { id: "cust-6", name: "Johan Andersson", companyName: "Andersson Fastigheter AB", phone: "070-678 90 12", email: "johan@anderssonfastigheter.se", createdAt: iso(today, -500) },
    { id: "cust-7", name: "Lena Berg", companyName: "Svensson Rör AB", phone: "070-789 01 23", email: "lena@svenssonror.se", createdAt: iso(today, -480) },
    { id: "cust-8", name: "Fastighets AB Solsidan", companyName: "Fastighets AB Solsidan", phone: "070-890 12 34", email: "info@solsidan.se", createdAt: iso(today, -600) },
    { id: "cust-9", name: "Brf Ekot", companyName: "Bostadsrättsföreningen Ekot", phone: "070-901 23 45", email: "styrelsen@brfekot.se", createdAt: iso(today, -700) },
  ];

  const blueprints: AssetBlueprint[] = [
    // Automotive — customer-owned vehicles
    { id: "asset-1", customerId: "cust-1", name: "Kia EV3", category: "vehicle", identifier: "ABC123", intervalMonths: 12, dueInDays: -3, historyEntries: 2 },
    { id: "asset-2", customerId: "cust-2", name: "Volvo XC60", category: "vehicle", identifier: "XYZ789", intervalMonths: 12, dueInDays: 12 },
    { id: "asset-3", customerId: "cust-3", name: "Tesla Model Y", category: "vehicle", identifier: "DEF456", intervalMonths: 12, dueInDays: 45 },
    { id: "asset-4", customerId: "cust-1", name: "VW Golf", category: "vehicle", identifier: "GHI321", intervalMonths: 12, dueInDays: 200 },
    { id: "asset-5", customerId: "cust-4", name: "Toyota Hilux", category: "vehicle", identifier: "JKL654", intervalMonths: 12, dueInDays: null },
    { id: "asset-6", customerId: "cust-5", name: "BMW 320i", category: "vehicle", identifier: "MNO987", intervalMonths: 12, dueInDays: -20 },

    // Heatpump & ventilation — customer-owned installations
    { id: "asset-7", customerId: "cust-6", name: "IVT Geo 512", category: "heat_pump", identifier: "SN-183829", intervalMonths: 12, dueInDays: 8, historyEntries: 2 },
    { id: "asset-8", customerId: "cust-7", name: "Nibe F750", category: "heat_pump", identifier: "SN-220144", intervalMonths: 12, dueInDays: -5 },
    { id: "asset-9", customerId: "cust-6", name: "Systemair Ventilationsaggregat", category: "ventilation", identifier: "SN-556231", intervalMonths: 6, dueInDays: 60 },
    { id: "asset-10", customerId: "cust-8", name: "Thermia Diplomat", category: "heat_pump", identifier: "SN-778812", intervalMonths: 12, dueInDays: 150 },
    { id: "asset-11", customerId: "cust-9", name: "Ventum VX2", category: "ventilation", identifier: "SN-990011", intervalMonths: 6, dueInDays: null },

    // Equipment — company's own assets (no customer)
    { id: "asset-12", customerId: null, name: "Atlas Copco GA11 (Kompressor 03)", category: "compressor", identifier: "KOMP-03", intervalMonths: 12, dueInDays: -1, historyEntries: 2 },
    { id: "asset-13", customerId: null, name: "Volvo EC220 (Grävmaskin)", category: "machine", identifier: "MASK-01", intervalMonths: 6, dueInDays: 25 },
    { id: "asset-14", customerId: null, name: "VW Transporter (Truck 02)", category: "vehicle", identifier: "TRUCK-02", intervalMonths: 12, dueInDays: 40 },
    { id: "asset-15", customerId: null, name: "Brandsläckare — lager A", category: "fire_safety", identifier: "BR-100", intervalMonths: 12, dueInDays: 100 },
    { id: "asset-16", customerId: null, name: "Atlas Copco GA22 (Kompressor 02)", category: "compressor", identifier: "KOMP-02", intervalMonths: 12, dueInDays: null },
  ];

  const assets: Asset[] = [];
  const serviceEvents: ServiceEvent[] = [];

  for (const bp of blueprints) {
    const nextServiceDate = bp.dueInDays === null ? null : iso(today, bp.dueInDays);
    const lastServiceDate =
      bp.dueInDays === null || bp.intervalMonths === null
        ? null
        : toISODate(addMonths(addDays(today, bp.dueInDays), -bp.intervalMonths));

    assets.push({
      id: bp.id,
      customerId: bp.customerId,
      name: bp.name,
      category: bp.category,
      identifier: bp.identifier,
      lastServiceDate,
      nextServiceDate,
      serviceIntervalMonths: bp.intervalMonths,
      createdAt: iso(today, -365),
    });

    if (lastServiceDate) {
      serviceEvents.push({
        id: `${bp.id}-event-1`,
        assetId: bp.id,
        performedAt: lastServiceDate,
        serviceType: "Årlig service",
      });

      if (bp.historyEntries === 2 && bp.intervalMonths) {
        serviceEvents.push({
          id: `${bp.id}-event-2`,
          assetId: bp.id,
          performedAt: toISODate(addMonths(new Date(lastServiceDate), -bp.intervalMonths)),
          serviceType: "Årlig service",
        });
      }
    }
  }

  return { customers, assets, serviceEvents };
}

function iso(today: Date, offsetDays: number): string {
  return toISODate(addDays(today, offsetDays));
}
