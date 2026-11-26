export type AssetCategory =
  | "vehicle"
  | "machine"
  | "heat_pump"
  | "ventilation"
  | "fire_safety"
  | "compressor"
  | "other";

export type Customer = {
  id: string;
  name: string;
  companyName?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export type Asset = {
  id: string;
  customerId: string | null;
  name: string;
  category: AssetCategory;
  identifier?: string;
  notes?: string;
  lastServiceDate: string | null;
  nextServiceDate: string | null;
  serviceIntervalMonths: number | null;
  // Set when someone has manually called the customer to follow up about the
  // upcoming service (separate from the automated email/SMS reminders).
  // Cleared whenever a new service is registered, since it's a note about
  // the *current* upcoming cycle.
  manualContactedAt: string | null;
  // Bokad tid för nästa service (ISO datum + tid), satt via "Boka tid" eller
  // när ett samtal slutar med en bokning. Nollställs när servicen registreras.
  bookedAt: string | null;
  createdAt: string;
};

export type ServiceEvent = {
  id: string;
  assetId: string;
  performedAt: string;
  serviceType?: string;
  notes?: string;
};

export type AssetStatus = "overdue" | "due_soon" | "upcoming" | "ok" | "no_service_date";

export type ReminderChannel = "email" | "sms";
export type ReminderState = "sent" | "scheduled";

export type Reminder = {
  id: string;
  assetId: string;
  daysBefore: number;
  channel: ReminderChannel;
  scheduledAt: string;
  state: ReminderState;
};

// Kontakt som personalen själv tagit med kunden från Servicekoll (utöver de
// automatiska påminnelserna): ett skickat SMS eller mejl, eller ett samtal
// med utfall. Visas i objektets och kundens tidslinje och i översikten.
export type ContactChannel = "sms" | "email" | "call";
export type CallOutcome = "booked" | "no_answer" | "call_back" | "talked";

export type ContactEvent = {
  id: string;
  customerId: string;
  assetId: string | null;
  channel: ContactChannel;
  at: string;
  message?: string;
  outcome?: CallOutcome;
};
