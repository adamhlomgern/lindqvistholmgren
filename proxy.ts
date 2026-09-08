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
    if (user && path === "/kund/login") {
      const kundUrl = request.nextUrl.clone();
      kundUrl.pathname = "/kund";
      return NextResponse.redirect(kundUrl);
    }
    return response;
  }

  if (!user && !isAdminLoginRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAdminLoginRoute) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/kund/:path*"],
};
