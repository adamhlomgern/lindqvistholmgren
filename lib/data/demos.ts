import { Pizza, Wrench, type LucideIcon } from "lucide-react";

export type DemoStatus = "live" | "kommer-snart";

export type DemoListing = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  // Optional dedicated product mark — falls back to the AccentBadge/icon
  // combo when a demo doesn't have its own logo yet.
  logo?: string;
  status: DemoStatus;
};

export const demos: DemoListing[] = [
  {
    slug: "servicekoll",
    title: "Servicekoll",
    tagline: "Service- och underhållssystem",
    description:
      "Håll koll på vad som behöver service innan det blir för sent — för bilverkstäder, VVS-företag eller företagets egen utrustning.",
    icon: Wrench,
    logo: "/images/demos/servicekoll-logo.svg",
    status: "live",
  },
  {
    slug: "mumsa",
    title: "Mumsa",
    tagline: "Beställningssida för restauranger",
    description:
      "En egen beställningssida på minuter — kunder beställer online, restaurangen ser ordrarna live och ägaren följer försäljningen.",
    icon: Pizza,
    logo: "/images/demos/mumsa-logo.svg",
    status: "live",
  },
];
