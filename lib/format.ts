export function formatCurrencySek(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(amount);
}

// Pinned explicitly everywhere below: this app only ever has a Swedish
// audience, but these formatters run both server-side (Vercel, UTC) and
// client-side (the visitor's own browser) — without a fixed zone the same
// timestamp renders differently depending on where it happened to format,
// which showed up as chat timestamps being off by a couple of hours between
// a server-rendered preview card and the client-rendered chat itself.
const SWEDEN_TZ = "Europe/Stockholm";

export function formatDateSv(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeZone: SWEDEN_TZ }).format(new Date(iso));
}

// Compact "18 sep" form — used for Prepper's due-date chips, where the full
// "medium" format (with weekday/year) is too wide for a small badge.
export function formatShortDateSv(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", timeZone: SWEDEN_TZ }).format(new Date(iso));
}

// There's no separate display-name field on the admin user — derive
// something readable from the email's local part instead of showing the
// raw address.
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local.split(/[._-]+/).filter(Boolean);
  if (words.length === 0) return "Admin";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// An admin can set a custom display name (see updateDisplayName in
// lib/actions/account.ts) so their own email/username never has to be the
// thing a customer sees as the sender in the portal chat — falls back to
// the derived name above when nothing's been set.
export function resolveAdminDisplayName(user: { email?: string | null; user_metadata?: Record<string, unknown> | null }): string {
  const raw = user.user_metadata?.display_name;
  const displayName = typeof raw === "string" ? raw.trim() : "";
  return displayName || nameFromEmail(user.email ?? "");
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// yyyy-mm-dd in Sweden's own calendar day, regardless of what timezone this
// runs in — used below instead of toDateString(), which compares calendar
// days in the runtime's local timezone and so disagreed with itself between
// a UTC server render and a browser in Stockholm.
function swedenDateKey(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: SWEDEN_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    date,
  );
}

// Compact "when" label for activity feeds: clock time today, "Igår"
// yesterday, otherwise a short day+month.
export function formatRelativeSv(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (swedenDateKey(date) === swedenDateKey(now)) {
    return new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit", timeZone: SWEDEN_TZ }).format(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (swedenDateKey(date) === swedenDateKey(yesterday)) return "Igår";

  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", timeZone: SWEDEN_TZ }).format(date);
}
