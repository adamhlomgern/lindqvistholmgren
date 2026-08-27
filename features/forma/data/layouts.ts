import type { LayoutId } from "@/features/forma/types/configuration";

export type LayoutOption = {
  id: LayoutId;
  name: string;
  description: string;
};

export const layoutOptions: LayoutOption[] = [
  { id: "layout-a", name: "Öppen planlösning", description: "Ett stort sammanhängande rum för kök, vardagsrum och sovplats." },
  {
    id: "layout-b",
    name: "Två sovrum",
    description: "Avdelad sovavdelning med två separata sovrum.",
  },
  { id: "layout-c", name: "Storstuga", description: "Ett rymligt sovrum och en generös vardagsyta." },
];

export function getLayout(id: LayoutId): LayoutOption {
  const layout = layoutOptions.find((l) => l.id === id);
  if (!layout) {
    throw new Error(`Unknown layout id: ${id}`);
  }
  return layout;
}
