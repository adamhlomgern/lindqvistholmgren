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

export type ArticleStatus = "publicerad" | "utkast" | "schemalagd" | "avpublicerad";

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
  status: ArticleStatus;
  updatedAt: string;
  seoTitle?: string;
  metaDescription?: string;
};

// Listing/dashboard views never render article body content, so this omits
// the (often large) rich-text `content` column to avoid fetching it in bulk.
export type ArticleSummary = Omit<Article, "content">;

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

export type Customer = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  orgNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingEntity = {
  id: string;
  name: string;
  address?: string;
  postalCode?: string;
  city?: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  vatNumber?: string;
  fSkatt: boolean;
  paymentTerms?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BankAccount = {
  id: string;
  label: string;
  kontonummer: string;
  bank?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceStatus = "utkast" | "skickad" | "betald";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  position: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: number;
  customerId: string;
  status: InvoiceStatus;
  billingEntityId: string;
  bankAccountId: string;
  paymentLink?: string;
  momsRate: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string;
  issuedDate?: string;
  dueDate?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceWithCustomer = Invoice & { customer: Customer };
export type InvoiceWithItems = InvoiceWithCustomer & { items: InvoiceItem[] };

export type ClientProjectStatus = "planerat" | "pagaende" | "vantar_pa_kund" | "pausat" | "klar";

// What kind of action the customer needs to take, if any — decides the
// call-to-action label and link on the portal overview (see
// lib/project-phase.ts's awaitingCustomerCta).
export type AwaitingCustomerType = "material" | "message" | "project";

export type ClientProject = {
  id: string;
  title: string;
  customerId?: string;
  status: ClientProjectStatus;
  overview?: string;
  notes?: string;
  deadline?: string;
  assigneeEntityId?: string;
  customerUpdate?: string;
  customerUpdateAt?: string;
  nextMilestoneLabel?: string;
  nextMilestoneDate?: string;
  nextMilestoneDelivered: boolean;
  // Ordered phase names for the project's own progress indicator (e.g.
  // ["Uppstart", "Designarbete", "Din återkoppling", "Slutleverans"]) and the
  // 0-based index of the current one. Both unset means no phase indicator is
  // shown — opt-in per project so it can be skipped for engagement types it
  // doesn't fit.
  phaseLabels?: string[];
  phaseCurrent?: number;
  // A specific, concrete thing the customer needs to do right now — distinct
  // from customerUpdate, which is a general status blurb. Unset means
  // nothing is currently awaiting the customer on this project.
  awaitingCustomerLabel?: string;
  awaitingCustomerType?: AwaitingCustomerType;
  awaitingCustomerDue?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientProjectWithCustomer = ClientProject & {
  customer?: Customer;
  assignee?: BillingEntity;
};

export type ClientProjectListItem = ClientProjectWithCustomer & {
  checklistDone: number;
  checklistTotal: number;
  nextTask?: string;
};

export type ProjectChecklistItem = {
  id: string;
  projectId: string;
  label: string;
  done: boolean;
  position: number;
  createdAt: string;
};

export type ProjectActivityEntry = {
  id: string;
  projectId: string;
  message: string;
  createdAt: string;
};

type StoredFile = {
  id: string;
  filename: string;
  contentType?: string;
  size?: number;
  storagePath: string;
  createdAt: string;
};

export type EmailAttachment = StoredFile & { emailId: string };
export type ProjectFile = StoredFile & { projectId: string };

export type CustomerMessage = {
  id: string;
  customerId: string;
  authorRole: "admin" | "customer";
  authorLabel: string;
  body: string;
  createdAt: string;
};

// A file, a text note, or both — covers logos (file), site login details
// (note), and anything else a customer might need to reach for later,
// without a separate "type" field to keep in sync.
export type CustomerMaterial = {
  id: string;
  customerId: string;
  title: string;
  note?: string;
  filename?: string;
  contentType?: string;
  size?: number;
  storagePath?: string;
  createdAt: string;
};

export type BlockedSender = {
  id: string;
  email: string;
  createdAt: string;
};

export type Email = {
  id: string;
  customerId?: string;
  messageId: string;
  fromAddress: string;
  fromName?: string;
  toAddress?: string;
  subject?: string;
  bodyText?: string;
  bodyHtml?: string;
  receivedAt: string;
  createdAt: string;
};

export type CustomerMember = {
  id: string;
  userId: string;
  customerId: string;
  invitedAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  createdAt: string;
};

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
