import Link from "next/link";

export default function CustomerNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="font-display text-lg font-semibold text-fg">Sidan hittades inte</h2>
      <p className="max-w-sm text-sm text-fg-muted">
        Länken kan vara felaktig eller inte längre gälla för ditt konto.
      </p>
      <Link
        href="/kund"
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        Till startsidan
      </Link>
    </div>
  );
}
