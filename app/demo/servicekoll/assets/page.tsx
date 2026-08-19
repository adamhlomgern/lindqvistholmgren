"use client";

import { useMemo, useState } from "react";
import { PackagePlus, Package, X } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { filterAssetsByIndustry, industryPresets } from "@/features/service-platform/config/industries";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { useQueryParam } from "@/features/service-platform/utils/useQueryParam";
import { SearchInput } from "@/components/demo/SearchInput";
import { HorizontalScroller } from "@/components/demo/HorizontalScroller";
import { AssetsTable } from "@/features/service-platform/components/AssetsTable";
import { EmptyState } from "@/components/demo/EmptyState";
import { Button } from "@/components/demo/Button";
import { AddAssetModal } from "@/features/service-platform/components/AddAssetModal";

type FilterKey = "all" | "customer" | "own" | "due_soon" | "overdue";

const baseFilterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Alla" },
  { key: "customer", label: "Kundobjekt" },
  { key: "own", label: "Egna objekt" },
  { key: "due_soon", label: "Service snart" },
  { key: "overdue", label: "Försenade" },
];

export default function ServicekollAssetsPage() {
  const { assets, customers, industry } = useServicePlatform();
  const preset = industryPresets[industry];
  const isInternal = preset.ownership === "internal";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [customerFilterCleared, setCustomerFilterCleared] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // Every object is already "egen utrustning" in the internal persona, so
  // the ownership split is meaningless there — drop those two pills.
  const filterOptions = useMemo(
    () => (isInternal ? baseFilterOptions.filter((option) => option.key !== "customer" && option.key !== "own") : baseFilterOptions),
    [isInternal],
  );
  const effectiveFilter = isInternal && (filter === "customer" || filter === "own") ? "all" : filter;

  const customerIdFromUrl = useQueryParam("customer");
  const customerId = customerFilterCleared ? null : customerIdFromUrl;

  const customerById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);
  const activeCustomer = customerId ? customerById.get(customerId) : undefined;

  const visibleAssets = useMemo(() => filterAssetsByIndustry(assets, industry), [assets, industry]);

  const filteredAssets = useMemo(() => {
    let result = visibleAssets;
    if (customerId) result = result.filter((asset) => asset.customerId === customerId);
    if (effectiveFilter === "customer") result = result.filter((asset) => asset.customerId !== null);
    if (effectiveFilter === "own") result = result.filter((asset) => asset.customerId === null);
    if (effectiveFilter === "due_soon") result = result.filter((asset) => getAssetStatus(asset) === "due_soon");
    if (effectiveFilter === "overdue") result = result.filter((asset) => getAssetStatus(asset) === "overdue");

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((asset) => {
        const customer = asset.customerId ? customerById.get(asset.customerId) : undefined;
        return [asset.name, asset.identifier, customer?.name, customer?.companyName]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query));
      });
    }

    return result;
  }, [visibleAssets, customerId, effectiveFilter, search, customerById]);

  function clearCustomerFilter() {
    setCustomerFilterCleared(true);
    window.history.replaceState(null, "", window.location.pathname);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">Objekt</h1>
          <p className="mt-1 text-demo-text-muted">Alla {preset.assetLabelPlural.toLowerCase()} som ni håller koll på.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PackagePlus size={16} />
          Lägg till objekt
        </Button>
      </div>

      {activeCustomer && (
        <div className="flex w-fit items-center gap-2 rounded-full border border-demo-border bg-demo-surface px-3 py-1.5 text-sm text-demo-text-muted">
          Filtrerat på:
          <span className="font-medium text-demo-text">{activeCustomer.companyName ?? activeCustomer.name}</span>
          <button
            type="button"
            onClick={clearCustomerFilter}
            aria-label="Rensa kundfilter"
            className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-demo-surface-hover hover:text-demo-text"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Sök namn, identifierare eller kund…" />
        <HorizontalScroller
          className="flex items-center gap-1 rounded-full border border-demo-border bg-demo-surface-hover p-1"
          fadeFrom="from-demo-surface-hover"
          rounding="full"
        >
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                effectiveFilter === option.key ? "bg-demo-primary text-white" : "text-demo-text-muted hover:text-demo-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </HorizontalScroller>
      </div>

      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Inga objekt hittades"
          description="Prova att ändra filter eller sökning, eller lägg till ert första objekt."
          action={<Button onClick={() => setAddOpen(true)}>Lägg till objekt</Button>}
        />
      ) : (
        <AssetsTable assets={filteredAssets} customers={customers} showOwnerColumn={!isInternal} />
      )}

      <AddAssetModal open={addOpen} onClose={() => setAddOpen(false)} defaultCustomerId={customerId ?? undefined} />
    </div>
  );
}
