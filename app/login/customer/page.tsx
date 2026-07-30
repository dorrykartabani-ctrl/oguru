'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CustomerAuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isValid =
    mode === 'signup'
      ? fullName.trim().length >= 1 && email.trim().length >= 3 && password.length >= 6
      : email.trim().length >= 3 && password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: 'customer',
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // Signup succeeded — trigger creates profile — redirect to home
        router.push('/home');
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        router.push('/home');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => router.push('/login');

  const toggleMode = () => {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setError(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")`,
        }}
      />

      {/* Back button */}
      <div className="fixed top-0 left-0 w-full z-30 px-margin-mobile pt-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all duration-150"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
      </div>

      <main className="min-h-screen bg-surface flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-margin-mobile max-w-lg mx-auto w-full py-20">

          {/* Logo */}
          <div
            className={`mb-8 transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
              OGuru
            </h1>
          </div>

          {/* Heading */}
          <div
            className={`mb-8 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background leading-tight mb-2">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-on-surface-variant font-body-md opacity-80">
              {mode === 'signup'
                ? 'Find and pre-order from your favourite local spots.'
                : 'Log in to your OGuru account.'}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`mb-8 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {mode === 'signup' && (
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className="w-full px-4 py-4 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface placeholder:text-outline shadow-inner"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-4 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface placeholder:text-outline shadow-inner"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full px-4 py-4 pr-12 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface placeholder:text-outline shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-container-high transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {mode === 'login' && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="text-primary text-sm font-body-md hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error-container/50 border border-error/20">
                <p className="text-on-error-container text-sm font-body-md">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full py-4 mt-2 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider active:scale-[0.98] transition-all duration-150 shadow-[0_4px_12px_rgba(93,64,55,0.10)] hover:shadow-[0_6px_16px_rgba(93,64,55,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'CREATE ACCOUNT' : 'LOG IN'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div
            className={`text-center transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <p className="text-on-surface-variant font-body-md">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary font-semibold border-b border-primary/30 hover:border-primary transition-colors"
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <footer className="px-margin-mobile pb-8 max-w-lg mx-auto w-full">
          <p className="text-center text-on-surface-variant/60 text-xs font-body-md leading-relaxed">
            By continuing, you agree to OGuru&apos;s{' '}
            <a href="#" className="underline hover:text-primary">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </footer>
      </main>
    </>
  );
}
