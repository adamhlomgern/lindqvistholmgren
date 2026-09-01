import type { MonthlyRevenue } from "@/lib/data/invoices";
import { formatCurrencySek } from "@/lib/format";

const CHART_HEIGHT = 64;

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: CHART_HEIGHT + 28 }}>
        {data.map((month) => {
          const height = month.total > 0 ? Math.max((month.total / max) * CHART_HEIGHT, 4) : 2;
          return (
            <div key={month.month} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] font-medium text-stone">
                {month.total > 0 ? formatCurrencySek(month.total) : ""}
              </span>
              <div
                className="w-full rounded-t-md bg-emerald/70"
                style={{ height }}
                title={`${month.label}: ${formatCurrencySek(month.total)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3 border-t border-bone/10 pt-2">
        {data.map((month) => (
          <span key={month.month} className="flex-1 text-center text-[10px] uppercase tracking-label text-stone">
            {month.label}
          </span>
        ))}
      </div>
    </div>
  );
}
