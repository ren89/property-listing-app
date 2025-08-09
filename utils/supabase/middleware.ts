import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user role from JWT claims
  const { data } = await supabase.auth.getClaims();
  const userRole = data?.claims.user_role;

  const pathname = request.nextUrl.pathname;

  // Define route access rules
  const routeAccess: Record<string, string[]> = {
    "/": [],
    "/property": ["User", "Admin"],
    "/admin": ["Admin"],
  };

  // Check if current path needs authentication
  const currentRoute =
    Object.keys(routeAccess).find(
      (route) => pathname.startsWith(route) && route !== "/"
    ) || (pathname === "/" ? "/" : null);

  // If page doesn't exist in our defined routes, redirect to home
  if (!currentRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (currentRoute && routeAccess[currentRoute]) {
    const allowedRoles = routeAccess[currentRoute];

    // If route requires authentication and user is not authenticated
    if (allowedRoles.length > 0 && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // If user is authenticated and route has role restrictions, check role-based access
    if (user && allowedRoles.length > 0) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to home page
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
