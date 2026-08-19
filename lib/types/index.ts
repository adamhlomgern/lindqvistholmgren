export type ServiceIconKey =
  | "search"
  | "gauge"
  | "file-text"
  | "map-pin"
  | "line-chart"
  | "target"
  | "code-2"
  | "smartphone"
  | "layout-template"
  | "palette-icon"
  | "layers"
  | "pen-tool"
  | "trending-up"
  | "megaphone"
  | "bar-chart"
  | "zap"
  | "workflow"
  | "mail"
  | "calendar-clock"
  | "life-buoy"
  | "shield-check"
  | "refresh-cw"
  | "rocket";

export type ServiceFeature = {
  icon: ServiceIconKey;
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  icon: ServiceIconKey;
  title: string;
  description: string;
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  heroHeadline?: string;
  heroAccentWord?: string;
  // Lowercase form used mid-sentence ("läs mer om {titleLower}"). Defaults
  // to title.toLowerCase(), but acronyms like "SEO" need to stay uppercase.
  titleLower?: string;
  features: ServiceFeature[];
  process?: ServiceProcessStep[];
  faq?: ServiceFaqItem[];
};

export type ServicePage = {
  category: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
  body: string[];
  highlights?: string[];
};

export type ProjectStat = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  intro: string;
  image: string;
  gallery?: string[];
  client: string;
  industry: string;
  services: string;
  launch: string;
  platform: string;
  challenge: string;
  solution: string[];
  stats?: ProjectStat[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type ArticleIconKey =
  | "wallet"
  | "layers"
  | "mouse-pointer-click"
  | "git-compare"
  | "palette"
  | "search"
  | "triangle-alert"
  | "shopping-cart"
  | "handshake"
  | "map-pin"
  | "piggy-bank"
  | "code-2"
  | "globe"
  | "megaphone";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  icon: ArticleIconKey;
  date: string;
  readTime: string;
  content: string;
};

export type ProjectCategory =
  | "grafisk-design"
  | "tryck"
  | "forpackning"
  | "webb"
  | "app-utveckling"
  | "marknadsforing"
  | "vet-inte";

export type ProjectBudget =
  | "under-5k"
  | "5k-15k"
  | "15k-50k"
  | "50k-150k"
  | "over-150k"
  | "vet-inte";

export type ProjectTimeline = "asap" | "1-3-manader" | "3-6-manader" | "utforskar";

export type ProjectInquiry = {
  categories: ProjectCategory[];
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  description: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};
