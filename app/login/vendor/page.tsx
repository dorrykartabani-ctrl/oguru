'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight } from '@/components/icons';

export default function VendorAuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupCategory, setSignupCategory] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

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

    router.push('/vendor/dashboard');
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    // Note: Vendor signup requires a password. Since Stitch design doesn't include one,
    // we'll send them to /vendor/apply after collecting basics, or you can add a
    // password field here if preferred.

    // For now, generate a temporary password and let them set it during apply flow
    const tempPassword = crypto.randomUUID();

    const { error: signUpError } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: tempPassword,
      options: {
        data: {
          full_name: signupBusinessName.trim(),
          phone: signupPhone.trim(),
          role: 'vendor',
          business_name: signupBusinessName.trim(),
          business_category: signupCategory,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Send new vendors to the apply flow to complete their profile
    router.push('/vendor/apply');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface text-on-background flex flex-col relative overflow-x-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="w-full sticky top-0 bg-surface/80 backdrop-blur-md z-40">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/login')}
            aria-label="Go back"
            className="text-primary hover:opacity-80 active:scale-95 transition-all duration-150 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-display font-bold text-[24px] md:text-[28px] text-primary tracking-tight">
            OGuru
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10 w-full max-w-7xl mx-auto relative z-10">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_rgba(93,64,55,0.06)] border border-outline-variant/30 p-6 md:p-8 relative overflow-hidden">

          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

          {/* ---------- LOGIN VIEW ---------- */}
          {view === 'login' && (
            <div className="relative z-10 transition-all duration-300">
              <div className="mb-8 text-center">
                <h1 className="font-display font-bold text-[28px] md:text-[32px] text-on-surface mb-2 leading-tight">
                  Merchant Login
                </h1>
                <p className="font-body text-on-surface-variant">
                  Welcome back. Manage your business.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1"
                  >
                    Business Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="hello@yourbusiness.com"
                    autoComplete="email"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="login-password"
                      className="block font-label text-xs uppercase tracking-wider text-on-surface-variant"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="font-label text-xs text-primary hover:text-primary-container transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-error-container/50 border border-error/20">
                    <p className="text-on-error-container text-sm">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-on-primary font-label text-sm uppercase tracking-wider py-4 rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(74,100,16,0.2)] hover:shadow-[0_6px_16px_rgba(74,100,16,0.3)] disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="font-body text-on-surface-variant">
                  New merchant?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="text-primary font-bold hover:underline"
                  >
                    Get Started
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ---------- SIGNUP VIEW ---------- */}
          {view === 'signup' && (
            <div className="relative z-10 transition-all duration-300">
              <div className="mb-6 text-center relative">
                <button
                  onClick={() => setView('login')}
                  className="absolute left-0 top-0 text-on-surface-variant hover:text-primary transition-colors flex items-center p-1 rounded-full hover:bg-surface-container-high"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display font-bold text-[28px] md:text-[32px] text-on-surface mb-2 leading-tight">
                  Grow your business
                </h1>
                <p className="font-body text-on-surface-variant">
                  Join the OGuru vendor network.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Business Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1"
                  >
                    Business Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupBusinessName}
                    onChange={(e) => setSignupBusinessName(e.target.value)}
                    placeholder="Green Valley Farms"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="signup-category"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="signup-category"
                      value={signupCategory}
                      onChange={(e) => setSignupCategory(e.target.value)}
                      required
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner appearance-none cursor-pointer"
                    >
                      <option disabled value="">
                        Select business type
                      </option>
                      <option value="cafe">Cafe</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="bakery">Bakery</option>
                      <option value="pizza">Pizza</option>
                      <option value="burgers">Burgers</option>
                      <option value="coffee">Coffee Shop</option>
                      <option value="juice">Juice / Smoothies</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1"
                  >
                    Business Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="hello@yourbusiness.com"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-base shadow-inner"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-error-container/50 border border-error/20">
                    <p className="text-on-error-container text-sm">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-on-primary font-label text-sm uppercase tracking-wider py-4 rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(74,100,16,0.2)] hover:shadow-[0_6px_16px_rgba(74,100,16,0.3)] disabled:opacity-50"
                  >
                    {loading ? 'Getting started...' : 'Get Started'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/30 shadow-sm">
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Powered by OGuru AI Intelligence
          </span>
        </div>
        <button
          onClick={() => router.push('/login/customer')}
          className="font-body text-secondary hover:text-primary transition-colors flex items-center gap-1 group"
        >
          Not a vendor? Sign in as Foodie
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
}
