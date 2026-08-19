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
