'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, EyeIcon } from '@/components/icons';

export default function CustomerAuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/home');
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        data: {
          full_name: signupName.trim(),
          phone: signupPhone.trim(),
          role: 'customer',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push('/home');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-background relative overflow-x-hidden">
      {/* Decorative texture layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left image panel (desktop) */}
      <div className="hidden md:block w-1/2 relative z-0">
        <div className="absolute inset-0 bg-secondary-container mix-blend-multiply opacity-20 z-10" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB05ab7v-4_1z2fCeI1yeuc8WympOpMn80iXdBPXM_v_-dKQLEaGbwPjVkH2HmD8R-ypem1uy2IAF_DvJz5rSzXyvRjUIIL9Tc9u1ucphowvIeuDM3Je0g902eXHb5xHMCjyPaRov6OqRpOv5rsWCFlCE9RfIkIaezveUgHIaRKNjxzInfphk-E0vbe4Yj-Y-qw_8vxVKv4zHKsmZ77uFwpk2n3ShyFmd8Taej9G_RlPAFI0gmSFElB"
          alt="Farmers market"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Form panel */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen relative z-10 bg-surface md:rounded-l-3xl md:shadow-[-20px_0_40px_rgba(93,64,55,0.05)] overflow-y-auto">

        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-10 h-24 w-full sticky top-0 bg-surface/90 backdrop-blur-md z-20 transition-all duration-300">
          <button
            onClick={() => router.push('/login')}
            className="w-12 h-12 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-high active:scale-95 transition-all duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-display font-bold text-[24px] md:text-[28px] text-primary tracking-tight">
            OGuru
          </div>
          <div className="w-12" />
        </header>

        <main className="flex-grow flex flex-col px-4 md:px-10 pb-12 max-w-lg w-full mx-auto justify-center pt-8">

          {/* Tab Control */}
          <div className="flex p-1 bg-surface-container-high rounded-full mb-10 w-full relative">
            <div
              className="absolute top-1 bottom-1 left-1 bg-surface rounded-full shadow-organic-sm transition-all duration-300 ease-in-out w-[calc(50%-4px)]"
              style={{
                transform: tab === 'login' ? 'translateX(0)' : 'translateX(100%)',
              }}
            />
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3 text-center z-10 font-label text-sm transition-colors duration-200 ${
                tab === 'login' ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-3 text-center z-10 font-label text-sm transition-colors duration-200 ${
                tab === 'signup' ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login View */}
          {tab === 'login' && (
            <div>
              <h1 className="font-display font-bold text-[28px] md:text-[32px] text-on-background mb-2 leading-tight">
                Welcome back, Foodie
              </h1>
              <p className="font-body text-on-surface-variant mb-8">
                Sign in to discover fresh, local artisanal goods.
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email-login"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email-login"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label
                      htmlFor="password-login"
                      className="block font-label text-xs uppercase tracking-wider text-on-surface"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="font-label text-xs text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-error-container/50 border border-error/20">
                    <p className="text-on-error-container text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-label text-sm uppercase tracking-wider py-4 rounded-full mt-6 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(74,100,16,0.2)] disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>
          )}

          {/* Signup View */}
          {tab === 'signup' && (
            <div>
              <h1 className="font-display font-bold text-[28px] md:text-[32px] text-on-background mb-2 leading-tight">
                Join the Community
              </h1>
              <p className="font-body text-on-surface-variant mb-8">
                Create an account to start pre-ordering fresh.
              </p>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label
                    htmlFor="name-signup"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="name-signup"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Alex Morgan"
                    autoComplete="name"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-signup"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email-signup"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone-signup"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone-signup"
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password-signup"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant text-on-background rounded-2xl py-3 px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-error-container/50 border border-error/20">
                    <p className="text-on-error-container text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-label text-sm uppercase tracking-wider py-4 rounded-full mt-6 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(74,100,16,0.2)] disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label text-xs">
                Or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-label text-sm text-on-surface">Google</span>
              </button>

              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="font-label text-sm text-on-surface">Apple</span>
              </button>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => router.push('/login/vendor')}
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label text-sm group"
              >
                <span className="border-b border-secondary/30 group-hover:border-primary/50 pb-0.5">
                  Are you a vendor? Switch account
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
