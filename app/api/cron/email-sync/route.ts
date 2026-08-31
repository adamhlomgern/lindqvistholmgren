import { NextRequest, NextResponse } from "next/server";
import { syncInbox } from "@/lib/email/imap";

// Deliberately not verifySession() — the caller is the GitHub Actions
// scheduled workflow, not a logged-in admin session. Auth is a shared
// secret instead.
export async function POST(request: NextRequest) {
  if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncInbox();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[email-sync] misslyckades", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
