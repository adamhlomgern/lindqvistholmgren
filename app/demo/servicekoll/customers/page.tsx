"use client";

import { useMemo, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { filterAssetsByIndustry, industryPresets } from "@/features/service-platform/config/industries";
import { SearchInput } from "@/components/demo/SearchInput";
import { CustomersTable } from "@/features/service-platform/components/CustomersTable";
import { EmptyState } from "@/components/demo/EmptyState";
import { Button } from "@/components/demo/Button";
import { AddCustomerModal } from "@/features/service-platform/components/AddCustomerModal";

export default function ServicekollCustomersPage() {
  const { customers, assets, industry } = useServicePlatform();
  const preset = industryPresets[industry];
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const visibleAssets = useMemo(() => filterAssetsByIndustry(assets, industry), [assets, industry]);

  const visibleCustomers = useMemo(() => {
    if (preset.ownership === "internal") return [];
    // A customer shows up here if they have an asset matching the current
    // preset, or if they have no assets at all yet (just created — not
    // filtered out until they're assigned to a vertical).
    const idsWithVisibleAsset = new Set(visibleAssets.map((asset) => asset.customerId));
    const idsWithAnyAsset = new Set(assets.map((asset) => asset.customerId).filter(Boolean));
    return customers.filter((customer) => idsWithVisibleAsset.has(customer.id) || !idsWithAnyAsset.has(customer.id));
  }, [customers, assets, visibleAssets, preset.ownership]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return visibleCustomers;
    return visibleCustomers.filter((customer) =>
      [customer.name, customer.companyName, customer.email, customer.phone]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query)),
    );
  }, [visibleCustomers, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-demo-text md:text-3xl">Kunder</h1>
          <p className="mt-1 text-demo-text-muted">Kunder vars {preset.assetLabelPlural.toLowerCase()} ni håller koll på.</p>
        </div>
        {preset.ownership === "customer" && (
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus size={16} />
            Lägg till kund
          </Button>
        )}
      </div>

      {preset.ownership === "internal" ? (
        <EmptyState
          icon={Users}
          title="Den här vyn har inga externa kunder"
          description="I underhållsläget hör objekten till er egen utrustning — det finns inga kunder att visa här. Byt till Bilverkstad eller VVS i topbaren för att se kundexempel."
        />
      ) : (
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Sök namn, företag, email eller telefon…" />
          {filteredCustomers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Inga kunder ännu"
              description="Lägg till er första kund för att komma igång."
              action={<Button onClick={() => setAddOpen(true)}>Lägg till kund</Button>}
            />
          ) : (
            <CustomersTable customers={filteredCustomers} assets={visibleAssets} />
          )}
        </>
      )}

      <AddCustomerModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
