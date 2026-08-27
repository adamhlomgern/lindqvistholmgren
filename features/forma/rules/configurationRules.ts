import { getPackage } from "@/features/forma/data/options";
import { getLayout } from "@/features/forma/data/layouts";
import type { Configuration, PackageId } from "@/features/forma/types/configuration";

// Declarative rule set demonstrating the "regelmotor" (rule engine) from the
// brief: automatic requirements, incompatible combinations, and soft
// recommendations. Each rule is a plain predicate + effect rather than a
// generic path-matcher DSL — there are only three concrete rules in the demo
// (see brief), so a tiny interpreter would be speculative machinery with no
// second use case yet.

export type RequireRule = {
  type: "require";
  id: string;
  when: (configuration: Configuration) => boolean;
  packageId: PackageId;
  message: (configuration: Configuration) => string;
};

export type IncompatibleResolution = {
  label: string;
  apply: (configuration: Configuration) => Configuration;
};

export type IncompatibleRule = {
  type: "incompatible";
  id: string;
  when: (configuration: Configuration) => boolean;
  message: (configuration: Configuration) => string;
  resolutions: (configuration: Configuration) => IncompatibleResolution[];
};

export type RecommendRule = {
  type: "recommend";
  id: string;
  when: (configuration: Configuration) => boolean;
  packageId: PackageId;
  message: (configuration: Configuration) => string;
};

export const requireRules: RequireRule[] = [
  {
    id: "bathroom-requires-va",
    type: "require",
    when: (c) => c.interior.bathroom,
    packageId: "va",
    message: () => `${getPackage("va").name} har lagts till automatiskt eftersom du valt badrum.`,
  },
];

export const incompatibleRules: IncompatibleRule[] = [
  {
    id: "panorama-vs-layout-b",
    type: "incompatible",
    when: (c) => c.exterior.windows === "panorama" && c.layout === "layout-b",
    message: () => `Panoramafönster kan inte kombineras med planlösningen "${getLayout("layout-b").name}".`,
    resolutions: () => [
      {
        label: "Byt planlösning",
        apply: (c) => ({ ...c, layout: "layout-a" }),
      },
      {
        label: "Ta bort panoramafönster",
        apply: (c) => ({ ...c, exterior: { ...c.exterior, windows: "standard" } }),
      },
    ],
  },
];

export const recommendRules: RecommendRule[] = [
  {
    id: "year-round-recommends-winter",
    type: "recommend",
    when: (c) => c.yearRoundLiving && !c.packages.includes("winter"),
    packageId: "winter",
    message: () => `Eftersom du valt året-runt-boende rekommenderar vi vårt ${getPackage("winter").name.toLowerCase()}.`,
  },
];

export type RuleEvaluation = {
  requiredAdds: { rule: RequireRule; message: string }[];
  incompatibilities: { rule: IncompatibleRule; message: string; resolutions: IncompatibleResolution[] }[];
  recommendations: { rule: RecommendRule; message: string }[];
};

export function evaluateRules(configuration: Configuration): RuleEvaluation {
  return {
    requiredAdds: requireRules
      .filter((rule) => rule.when(configuration) && !configuration.packages.includes(rule.packageId))
      .map((rule) => ({ rule, message: rule.message(configuration) })),
    incompatibilities: incompatibleRules
      .filter((rule) => rule.when(configuration))
      .map((rule) => ({ rule, message: rule.message(configuration), resolutions: rule.resolutions(configuration) })),
    recommendations: recommendRules
      .filter((rule) => rule.when(configuration))
      .map((rule) => ({ rule, message: rule.message(configuration) })),
  };
}

// Applies every currently-triggered "require" rule by adding the missing
// package — called after every configuration change so requirements never
// have to be manually re-checked by the caller.
export function applyRequiredAdds(configuration: Configuration): Configuration {
  const evaluation = evaluateRules(configuration);
  if (evaluation.requiredAdds.length === 0) return configuration;
  const packages = [...configuration.packages];
  for (const { rule } of evaluation.requiredAdds) {
    if (!packages.includes(rule.packageId)) packages.push(rule.packageId);
  }
  return { ...configuration, packages };
}
