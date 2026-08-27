import type { ModelId } from "@/features/forma/types/configuration";

export type ModelSpec = {
  id: ModelId;
  name: string;
  sizeSqm: number;
  basePrice: number;
  tagline: string;
};

export const models: ModelSpec[] = [
  {
    id: "forma-20",
    name: "Forma 20",
    sizeSqm: 20,
    basePrice: 395_000,
    tagline: "Kompakt och komplett — perfekt som gäststuga eller kontor.",
  },
  {
    id: "forma-25",
    name: "Forma 25",
    sizeSqm: 25,
    basePrice: 465_000,
    tagline: "Vår mest sålda modell — rymlig planlösning för åretruntboende.",
  },
  {
    id: "forma-30",
    name: "Forma 30",
    sizeSqm: 30,
    basePrice: 535_000,
    tagline: "Maximal yta inom attefallsmåtten — plats för hela familjen.",
  },
];

export function getModel(id: ModelId): ModelSpec {
  const model = models.find((m) => m.id === id);
  if (!model) {
    throw new Error(`Unknown model id: ${id}`);
  }
  return model;
}
