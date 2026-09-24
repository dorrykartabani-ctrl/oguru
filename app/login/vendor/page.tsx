'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, StoreIcon, CheckCircleIcon } from '@/components/icons';

export default function VendorLoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const supabase = createClient();

    try {
      if (isSignUp) {
        // 1. Sign Up Merchant with vendor metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'vendor',
              business_name: businessName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // 2. Ensure profile row exists as vendor
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            role: 'vendor',
          });

          // 3. Create initial pending business record
          await supabase.from('businesses').insert({
            owner_id: data.user.id,
            legal_name: businessName,
            trading_name: businessName,
            registration_number: 'PENDING',
            owner_full_name: fullName,
            owner_role: 'Owner',
            owner_email: email,
            owner_phone: 'PENDING',
            business_email: email,
            business_phone: 'PENDING',
            status: 'approved', // Auto-approve demo merchants
          });

          router.push('/vendor/dashboard');
          router.refresh();
        }
      } else {
        // 1. Sign In Merchant
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // 2. Update profile role if missing
          await supabase.from('profiles').upsert({
            id: data.user.id,
            role: 'vendor',
          });

          // 3. Route directly to Merchant Dashboard
          router.push('/vendor/dashboard');
          router.refresh();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f4eb] flex flex-col justify-center px-6 py-12 font-body selection:bg-[#4a6410] selection:text-white">
      
      {/* Top Header */}
      <div className="fixed top-0 left-0 w-full z-30 px-6 pt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-[#4a6410] font-label text-xs font-bold p-2 -ml-2 rounded-full hover:bg-[#1b1c19]/5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto">
        
        {/* Merchant Banner Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#924700]/10 flex items-center justify-center text-[#924700] mb-4">
            <StoreIcon className="w-7 h-7" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#1b1c19]">
            Merchant Portal
          </h1>
          <p className="mt-1 text-sm text-[#44483a]/80">
            {isSignUp ? 'Create your vendor account' : 'Log in to manage your café or bakery'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#ebe8db] p-1 mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 rounded-lg py-2.5 font-label text-xs font-bold transition ${
              !isSignUp ? 'bg-white text-[#1b1c19] shadow-sm' : 'text-[#44483a]/60'
            }`}
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 rounded-lg py-2.5 font-label text-xs font-bold transition ${
              isSignUp ? 'bg-white text-[#1b1c19] shadow-sm' : 'text-[#44483a]/60'
            }`}
          >
            SIGN UP VENDOR
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-[#1b1c19]/10 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {isSignUp && (
            <>
              <div>
                <label className="font-label text-xs font-bold text-[#44483a]">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#f6f4eb] p-3 text-sm outline-none focus:border-[#4a6410]"
                />
              </div>

              <div>
                <label className="font-label text-xs font-bold text-[#44483a]">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Pophams Bakery"
                  className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#f6f4eb] p-3 text-sm outline-none focus:border-[#4a6410]"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-label text-xs font-bold text-[#44483a]">Business Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yourcafe.com"
              className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#f6f4eb] p-3 text-sm outline-none focus:border-[#4a6410]"
            />
          </div>

          <div>
            <label className="font-label text-xs font-bold text-[#44483a]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#f6f4eb] p-3 text-sm outline-none focus:border-[#4a6410]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#4a6410] py-3.5 font-label text-xs font-bold text-white shadow-sm transition active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Merchant Account' : 'Log In to Merchant Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#44483a]/60">
          Looking for customer pre-orders?{' '}
          <Link href="/login/customer" className="text-[#4a6410] font-bold underline">
            Go to Foodie Login
          </Link>
        </p>

      </div>
    </main>
  );
}
