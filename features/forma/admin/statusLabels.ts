import type { QuoteRequestStatus } from "@/features/forma/types/configuration";

export const statusLabels: Record<QuoteRequestStatus, string> = {
  ny: "Ny",
  kontaktad: "Kontaktad",
  "mote-bokat": "Möte bokat",
  "offert-skickad": "Offert skickad",
  vunnen: "Vunnen",
  forlorad: "Förlorad",
};

export const statusOrder: QuoteRequestStatus[] = ["ny", "kontaktad", "mote-bokat", "offert-skickad", "vunnen", "forlorad"];
