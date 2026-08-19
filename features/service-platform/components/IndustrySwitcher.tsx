"use client";

import { useServicePlatform } from "@/features/service-platform/state/ServicePlatformProvider";
import { industryOrder, industryPresets } from "@/features/service-platform/config/industries";

export function IndustrySwitcher() {
  const { industry, setIndustry } = useServicePlatform();

  return (
    <div className="flex items-center gap-1 rounded-full border border-demo-border bg-demo-surface-hover p-1">
      {industryOrder.map((key) => {
        const preset = industryPresets[key];
        const active = industry === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setIndustry(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active ? "bg-demo-primary text-white" : "text-demo-text-muted hover:text-demo-text"
            }`}
          >
            {preset.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
