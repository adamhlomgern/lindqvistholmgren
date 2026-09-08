import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createAuthClient } from "@/lib/supabase/auth";

// Supabase's admin-generated links (invite/recovery/magiclink) point at
// GoTrue's own /auth/v1/verify endpoint, which — after checking the token —
// redirects the browser here with token_hash+type as query params, not a
// ready-made session. verifyOtp() exchanges that for a real session and
// (via the @supabase/ssr server client's cookie adapter) persists it as
// cookies, so the page the user lands on next is already authenticated.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/kund";
  const safeNext = next.startsWith("/") ? next : "/kund";

  if (tokenHash && type) {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/kund/login?error=expired`);
}
