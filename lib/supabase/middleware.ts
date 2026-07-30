import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Public routes that logged-out users can access
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/login/customer',
  '/login/vendor',
  '/vendor/apply',
];

// Routes only for logged-in customers
const CUSTOMER_ROUTES = ['/home', '/customer'];

// Routes only for logged-in vendors
const VENDOR_ROUTES = ['/vendor'];

// Routes that logged-in users should be redirected away from
const AUTH_ROUTES = ['/', '/login', '/login/customer', '/login/vendor'];

function pathMatches(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route === pathname) return true;
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
}

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
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
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

  // Refresh session and get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Skip route protection for API routes and Next internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  // ---- LOGGED OUT ----
  if (!user) {
    // Allow public routes
    if (pathMatches(pathname, PUBLIC_ROUTES)) {
      return supabaseResponse;
    }
    // Block everything else — send to splash
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // ---- LOGGED IN ----
  // Fetch the user's role from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'customer';

  // Redirect logged-in users away from splash/login/fork
  if (AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'vendor' ? '/vendor/dashboard' : '/home';
    return NextResponse.redirect(url);
  }

  // Prevent vendors accessing customer routes
  if (role === 'vendor' && pathMatches(pathname, CUSTOMER_ROUTES)) {
    const url = request.nextUrl.clone();
    url.pathname = '/vendor/dashboard';
    return NextResponse.redirect(url);
  }

  // Prevent customers accessing vendor routes (except apply)
  if (
    role === 'customer' &&
    pathMatches(pathname, VENDOR_ROUTES) &&
    !pathname.startsWith('/vendor/apply')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
