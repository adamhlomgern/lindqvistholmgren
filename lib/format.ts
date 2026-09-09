export function formatCurrencySek(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(amount);
}

export function formatDateSv(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" }).format(new Date(iso));
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

// Compact "when" label for activity feeds: clock time today, "Igår"
// yesterday, otherwise a short day+month.
export function formatRelativeSv(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit" }).format(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Igår";

  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" }).format(date);
}
