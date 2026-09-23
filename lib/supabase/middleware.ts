import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/login/customer',
  '/login/vendor',
  '/vendor/apply',
];

const CUSTOMER_ROUTES = ['/home', '/explore', '/gifts', '/orders', '/profile'];
const VENDOR_ROUTES = ['/vendor/dashboard', '/vendor/menu', '/vendor/settings', '/vendor/insights'];
const AUTH_PAGES = ['/', '/login', '/login/customer', '/login/vendor'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // 1. Immediately skip static files, Next.js internals, and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return supabaseResponse;
  }

  try {
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

    // 2. Race Supabase against a 1-second timeout so Vercel NEVER times out with a 504
    const getUserWithTimeout = Promise.race([
      supabase.auth.getUser(),
      new Promise<{ data: { user: null }; error: null }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null }, error: null }), 1000)
      ),
    ]);

    const { data } = await getUserWithTimeout;
    const user = data?.user;

    // 3. UNAUTHENTICATED USERS
    if (!user) {
      const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
      if (isPublic) {
        return supabaseResponse;
      }
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // 4. AUTHENTICATED USERS - Read role from metadata (0ms)
    const role = user.user_metadata?.role || 'customer';

    if (AUTH_PAGES.includes(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = role === 'vendor' ? '/vendor/dashboard' : '/home';
      return NextResponse.redirect(url);
    }

    if (role === 'vendor' && CUSTOMER_ROUTES.some((r) => pathname.startsWith(r))) {
      const url = request.nextUrl.clone();
      url.pathname = '/vendor/dashboard';
      return NextResponse.redirect(url);
    }

    if (role === 'customer' && VENDOR_ROUTES.some((r) => pathname.startsWith(r))) {
      const url = request.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    // Fallback: If anything fails, return response safely without timing out
    return supabaseResponse;
  }
}
