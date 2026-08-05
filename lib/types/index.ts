export type Service = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  features: string[];
};

export type ServicePage = {
  category: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
  body: string[];
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

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  content: string[];
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
  | "under-15k"
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
