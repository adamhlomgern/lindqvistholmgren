import type { ArticleIconKey, ProjectBudget, ProjectCategory, ProjectTimeline } from "@/lib/types";

// Window used both for the dashboard's "Att hantera" panel and the sidebar's
// Förfrågningar badge, so the two numbers never drift apart.
export const RECENT_INQUIRY_WINDOW_DAYS = 7;

export const projectCategories: ProjectCategory[] = [
  "grafisk-design",
  "tryck",
  "forpackning",
  "webb",
  "app-utveckling",
  "marknadsforing",
  "vet-inte",
];

export const projectBudgets: ProjectBudget[] = [
  "under-5k",
  "5k-15k",
  "15k-50k",
  "50k-150k",
  "over-150k",
  "vet-inte",
];

export const projectTimelines: ProjectTimeline[] = ["asap", "1-3-manader", "3-6-manader", "utforskar"];

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "grafisk-design": "Grafisk design",
  tryck: "Trycksaker",
  forpackning: "Förpackningsdesign",
  webb: "Webbplats",
  "app-utveckling": "App / utveckling",
  marknadsforing: "Marknadsföring",
  "vet-inte": "Vet inte riktigt än",
};

export const projectBudgetLabels: Record<ProjectBudget, string> = {
  "under-5k": "Under 5 000 kr",
  "5k-15k": "5 000–15 000 kr",
  "15k-50k": "15 000–50 000 kr",
  "50k-150k": "50 000–150 000 kr",
  "over-150k": "Över 150 000 kr",
  "vet-inte": "Vet inte ännu",
};

export const projectTimelineLabels: Record<ProjectTimeline, string> = {
  asap: "Så snart som möjligt",
  "1-3-manader": "Inom 1–3 månader",
  "3-6-manader": "Inom 3–6 månader",
  utforskar: "Utforskar bara ännu",
};

export const articleIconKeys: ArticleIconKey[] = [
  "wallet",
  "layers",
  "mouse-pointer-click",
  "git-compare",
  "palette",
  "search",
  "triangle-alert",
  "shopping-cart",
  "handshake",
  "map-pin",
  "piggy-bank",
  "code-2",
  "globe",
  "megaphone",
];
