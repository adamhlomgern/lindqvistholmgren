import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isKundRoute = path.startsWith("/kund");
  // Public within /kund — the invite-acceptance page needs the session from
  // the invite email link, not an existing logged-in session.
  const isKundPublicRoute =
    path === "/kund/login" || path === "/kund/valkommen" || path === "/kund/glomt-losenord";
  const isAdminLoginRoute = path === "/admin/login";

  if (isKundRoute) {
    if (!user && !isKundPublicRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/kund/login";
      return NextResponse.redirect(loginUrl);
    }
    // No eager "already logged in, skip the login page" redirect here: unlike
    // admin's role check below, there's no free signal on the JWT for "is an
    // active (non-revoked) customer_members row" — only a DB lookup would
    // tell us that, and verifyCustomerSession() already does it once you
    // land on a protected page. Redirecting any authenticated user away from
    // /kund/login caused a redirect loop for anyone logged in as something
    // other than an active customer (an admin testing the flow, or a
    // revoked contact): /kund/login -> /kund -> verifyCustomerSession fails
    // -> /kund/login -> ... A valid customer manually revisiting /kund/login
    // just sees the form, which is harmless.
    return response;
  }

  if (!user && !isAdminLoginRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAdminLoginRoute && user.app_metadata?.role === "admin") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/kund/:path*"],
};
