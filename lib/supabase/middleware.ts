import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes accessible when logged out
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/login/customer',
  '/login/vendor',
  '/vendor/apply',
];

// Routes requiring customer auth
const CUSTOMER_ROUTES = ['/home', '/explore', '/gifts', '/orders', '/profile'];

// Routes requiring vendor auth (except /vendor/apply)
const VENDOR_ROUTES = ['/vendor/dashboard', '/vendor/menu', '/vendor/settings', '/vendor/insights'];

// Auth pages to redirect AWAY from if already logged in
const AUTH_PAGES = ['/', '/login', '/login/customer', '/login/vendor'];

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
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Skip static assets, images, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  // Fast session refresh — NO database queries
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. LOGGED OUT USERS
  if (!user) {
    const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    if (isPublic) {
      return supabaseResponse;
    }
    // Redirect unauthenticated users back to splash
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 2. LOGGED IN USERS
  // Read role directly from session metadata (0ms latency, no DB call)
  const role = user.user_metadata?.role || 'customer';

  // If on splash or auth pages, redirect to their home
  if (AUTH_PAGES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'vendor' ? '/vendor/dashboard' : '/home';
    return NextResponse.redirect(url);
  }

  // Prevent vendors from visiting customer routes
  if (role === 'vendor' && CUSTOMER_ROUTES.some((r) => pathname.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = '/vendor/dashboard';
    return NextResponse.redirect(url);
  }

  // Prevent customers from visiting vendor dashboard
  if (
    role === 'customer' &&
    VENDOR_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
