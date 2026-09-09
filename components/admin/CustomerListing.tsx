"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, Search, Users } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { CustomerRowMenu } from "@/components/admin/CustomerRowMenu";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { CustomerListRow } from "@/lib/data/customer-list";
import type { PortalStatus } from "@/lib/data/customer-members";
import type { Customer } from "@/lib/types";

type QuickFilter = "all" | "active" | "followup";
type SortKey = "name" | "lastContact" | "nextFollowUp";

const portalLabels: Record<PortalStatus, string> = { none: "Inte inbjuden", invited: "Inbjuden", active: "Aktiv" };
const portalTones: Record<PortalStatus, string> = { none: "text-stone", invited: "text-peach", active: "text-emerald" };

function displayName(customer: Customer) {
  return customer.company || customer.name;
}

function initials(customer: Customer) {
  return displayName(customer).trim().charAt(0).toUpperCase() || "?";
}

function isFollowUpToday(row: CustomerListRow, todayIso: string) {
  return row.nextMilestone?.date === todayIso;
}

// The single boolean the "Behöver uppföljning" quick filter uses — kept in
// sync with getAttentionBadges below so the filter and the badges a
// customer actually shows never disagree with each other.
function needsFollowUp(row: CustomerListRow, todayIso: string) {
  return row.waitingForReply || row.overdueInvoiceCount > 0 || isFollowUpToday(row, todayIso) || row.waitingOnCustomer;
}

type Badge = { label: string; href: string; tone: string };

// Most-urgent-first, capped to two so a customer with everything going on
// doesn't turn into a wall of pills.
function getAttentionBadges(row: CustomerListRow, todayIso: string): Badge[] {
  const base = `/admin/kunder/${row.customer.id}`;
  const badges: Badge[] = [];

  if (row.waitingForReply) {
    badges.push({ label: "Väntar på ditt svar", href: `${base}/meddelanden`, tone: "bg-coral/15 text-coral" });
  }
  if (row.overdueInvoiceCount > 0) {
    badges.push({
      label: `${row.overdueInvoiceCount} förfallen${row.overdueInvoiceCount === 1 ? "" : "a"} faktura${
        row.overdueInvoiceCount === 1 ? "" : "or"
      }`,
      href: `${base}/ekonomi`,
      tone: "bg-coral/15 text-coral",
    });
  }
  if (isFollowUpToday(row, todayIso)) {
    badges.push({ label: "Uppföljning idag", href: `${base}/projekt`, tone: "bg-peach/15 text-peach" });
  }
  if (row.waitingOnCustomer) {
    badges.push({ label: "Väntar på kund", href: `${base}/projekt`, tone: "bg-sky/15 text-sky" });
  }

  return badges.slice(0, 2);
}

export function CustomerListing({ rows }: { rows: CustomerListRow[] }) {
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [portalFilter, setPortalFilter] = useState<"all" | PortalStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  // Computed once on mount rather than per-render/per-row — a customer's
  // "uppföljning idag" status shouldn't flip mid-session just because a
  // re-render happened to straddle midnight.
  const [todayIso] = useState(() => new Date().toISOString().slice(0, 10));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (q) {
        const matches =
          row.customer.name.toLowerCase().includes(q) ||
          (row.customer.company ?? "").toLowerCase().includes(q) ||
          (row.customer.email ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (quickFilter === "active" && row.activeProjectCount === 0) return false;
      if (quickFilter === "followup" && !needsFollowUp(row, todayIso)) return false;
      if (portalFilter !== "all" && row.portalStatus !== portalFilter) return false;
      return true;
    });
  }, [rows, query, quickFilter, portalFilter, todayIso]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortKey === "name") {
      copy.sort((a, b) => displayName(a.customer).localeCompare(displayName(b.customer), "sv"));
    } else if (sortKey === "lastContact") {
      copy.sort((a, b) => (b.lastContact ?? "").localeCompare(a.lastContact ?? ""));
    } else {
      copy.sort((a, b) => {
        const dateA = a.nextMilestone?.date;
        const dateB = b.nextMilestone?.date;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.localeCompare(dateB);
      });
    }
    return copy;
  }, [filtered, sortKey]);

  const hasActiveFilters = query.trim() !== "" || quickFilter !== "all" || portalFilter !== "all";

  function resetFilters() {
    setQuery("");
    setQuickFilter("all");
    setPortalFilter("all");
  }

  if (rows.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
        <Users size={24} strokeWidth={2} className="text-stone" />
        <p className="text-sm text-stone">Inga kunder ännu.</p>
        <Link href="/admin/kunder/ny" className="mt-1 text-sm font-medium text-emerald hover:underline">
          Lägg till din första kund
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök på företag, kontaktperson eller e-post…"
              className="w-full rounded-full border border-bone/10 bg-bone/5 py-2.5 pl-10 pr-4 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
            />
          </div>
          <Select
            value={portalFilter}
            onValueChange={(value) => setPortalFilter(value as "all" | PortalStatus)}
            className="w-full rounded-full px-4 py-2.5 text-sm sm:w-48"
            options={[
              { value: "all", label: "Alla portalstatusar" },
              { value: "none", label: "Inte inbjuden" },
              { value: "invited", label: "Inbjuden" },
              { value: "active", label: "Aktiv" },
            ]}
          />
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
            className="w-full rounded-full px-4 py-2.5 text-sm sm:w-52"
            options={[
              { value: "name", label: "Sortera: Namn" },
              { value: "lastContact", label: "Sortera: Senaste kontakt" },
              { value: "nextFollowUp", label: "Sortera: Nästa uppföljning" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { value: "all", label: "Alla kunder" },
              { value: "active", label: "Med aktiva projekt" },
              { value: "followup", label: "Behöver uppföljning" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setQuickFilter(option.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                quickFilter === option.value ? "bg-emerald/15 text-emerald" : "bg-bone/5 text-stone hover:text-bone"
              }`}
            >
              {option.label}
            </button>
          ))}

          <span className="ml-auto text-xs text-stone">
            {sorted.length} {sorted.length === 1 ? "kund" : "kunder"}
            {hasActiveFilters && ` av ${rows.length}`}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-medium text-stone transition-colors hover:text-bone"
            >
              <RotateCcw size={12} strokeWidth={2.25} />
              Rensa filter
            </button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Search size={20} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Ingen kund matchar filtren.</p>
          <button type="button" onClick={resetFilters} className="text-sm font-medium text-emerald hover:underline">
            Rensa filter
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-bone/10 border-t border-bone/10">
          {sorted.map((row) => (
            <CustomerRowItem key={row.customer.id} row={row} todayIso={todayIso} />
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerRowItem({ row, todayIso }: { row: CustomerListRow; todayIso: string }) {
  const { customer } = row;
  const badges = getAttentionBadges(row, todayIso);

  return (
    <div className="flex flex-col gap-3 px-2 py-4 transition-colors hover:bg-bone/[0.05] sm:flex-row sm:items-center sm:gap-4 sm:py-0 sm:min-h-[84px]">
      <div className="flex items-start gap-3 sm:w-64 sm:shrink-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-sm font-bold text-emerald">
          {initials(customer)}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/kunder/${customer.id}`}
            className="block truncate font-display text-sm font-bold text-bone hover:underline"
          >
            {displayName(customer)}
          </Link>
          {customer.company && <p className="truncate text-xs text-stone">{customer.name}</p>}
          {badges.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <Link
                  key={badge.label}
                  href={badge.href}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${badge.tone}`}
                >
                  {badge.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="sm:hidden">
          <CustomerRowMenu customer={customer} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-stone sm:hidden">
        <span>
          {row.activeProjectCount} {row.activeProjectCount === 1 ? "aktivt projekt" : "aktiva projekt"}
        </span>
        <Tag className={portalTones[row.portalStatus]}>{portalLabels[row.portalStatus]}</Tag>
      </div>

      <Link
        href={`/admin/kunder/${customer.id}/projekt`}
        className="hidden text-sm text-bone hover:text-emerald hover:underline sm:block sm:w-16"
      >
        {row.activeProjectCount}
      </Link>

      <div className="hidden text-sm sm:block sm:w-40">
        {row.nextMilestone?.label || row.nextMilestone?.date ? (
          <>
            {row.nextMilestone.label && <span className="block truncate text-bone">{row.nextMilestone.label}</span>}
            {row.nextMilestone.date && <span className="text-xs text-stone">{formatDateSv(row.nextMilestone.date)}</span>}
          </>
        ) : (
          <span className="text-xs text-stone">Ingen uppföljning planerad</span>
        )}
      </div>

      <div className="hidden text-xs text-stone sm:block sm:w-28">
        {row.lastContact ? formatRelativeSv(row.lastContact) : "Ingen kontakt ännu"}
      </div>

      <div className="hidden sm:block sm:w-28">
        <Tag className={portalTones[row.portalStatus]}>{portalLabels[row.portalStatus]}</Tag>
      </div>

      <div className="hidden sm:flex sm:w-10 sm:justify-center">
        <CustomerRowMenu customer={customer} />
      </div>
    </div>
  );
}
