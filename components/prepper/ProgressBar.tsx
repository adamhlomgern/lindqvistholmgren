export function ProgressBar({
  done,
  total,
  inverse = false,
}: {
  done: number;
  total: number;
  inverse?: boolean;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${inverse ? "bg-prepper-inverse-text/20" : "bg-prepper-border"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${inverse ? "bg-prepper-inverse-text" : "bg-prepper-primary"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
