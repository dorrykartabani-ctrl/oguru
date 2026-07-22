'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login succeeded but no user data returned');
        setLoading(false);
        return;
      }

      // Check profile role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Admins go to admin page (if we build one later)
      if (profile?.role === 'admin') {
        // For now admins can still see the vendor flow
        // In future: router.push('/admin');
      }

      // Check business status to route appropriately
      const { data: business } = await supabase
        .from('businesses')
        .select('status')
        .eq('owner_id', data.user.id)
        .single();

      if (!business) {
        // No business yet — send to apply
        router.push('/vendor/apply');
      } else if (business.status === 'approved') {
        router.push('/vendor/dashboard');
      } else {
        // Pending, under_review, rejected, suspended
        router.push('/vendor/pending');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Welcome */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="OGuru"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">
            Welcome back
          </h1>
          <p className="text-on-surface-variant mt-2">
            Log in to your OGuru account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 space-y-4 shadow-organic-sm"
        >
          {/* Error message */}
          {error && (
            <div className="p-3 bg-error-container border border-error/20 rounded-xl flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-error flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-label font-bold text-sm uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Log in
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm text-on-surface-variant">
          New vendor?{' '}
          <button
            onClick={() => router.push('/vendor/apply')}
            className="text-primary font-semibold hover:underline"
          >
            Apply here
          </button>
        </p>

        {/* Back to home */}
        <p className="text-center mt-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider font-label"
          >
            ← Back to home
          </button>
        </p>
      </div>
    </main>
  );
}
