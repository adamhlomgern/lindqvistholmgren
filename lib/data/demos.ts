import { Wrench, type LucideIcon } from "lucide-react";

export type DemoStatus = "live" | "kommer-snart";

export type DemoListing = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: DemoStatus;
};

export const demos: DemoListing[] = [
  {
    slug: "servicekoll",
    title: "Servicekoll",
    tagline: "Service- och underhållssystem",
    description:
      "Håll koll på vad som behöver service innan det blir för sent — för bilverkstäder, värmepumpsföretag eller företagets egen utrustning.",
    icon: Wrench,
    status: "live",
  },
];
