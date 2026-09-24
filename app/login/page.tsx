'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, StoreIcon, RestaurantIcon } from '@/components/icons';

export default function PreLoginFork() {
  const router = useRouter();
  const [selected, setSelected] = useState<'foodie' | 'vendor' | null>(null);

  const handleContinue = (role: 'foodie' | 'vendor') => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }

    setSelected(role);

    setTimeout(() => {
      router.push(role === 'foodie' ? '/login/customer' : '/login/vendor');
    }, 150);
  };

  return (
    <main className="min-h-screen bg-[#f6f4eb] flex flex-col relative overflow-hidden font-body selection:bg-[#4a6410] selection:text-white">

      {/* Back button */}
      <div className="fixed top-0 left-0 w-full z-30 px-6 pt-6">
        <button
          onClick={() => router.push('/')}
          className="p-2 -ml-2 rounded-full text-[#1b1c19] hover:bg-[#1b1c19]/5 active:scale-95 transition-all duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full py-16">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1b1c19] leading-tight mb-3">
            How will you use <span className="text-[#4a6410]">OGuru?</span>
          </h1>
          <p className="text-[#44483a]/80 text-sm sm:text-base leading-relaxed">
            Choose the experience that fits you. You can switch between experiences anytime.
          </p>
        </div>

        <div className="space-y-4 mb-8">

          {/* Foodie Card */}
          <button
            onClick={() => handleContinue('foodie')}
            disabled={selected !== null}
            className={`group w-full text-left bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${
              selected === 'foodie'
                ? 'border-[#4a6410] shadow-md scale-[1.01]'
                : 'border-[#1b1c19]/10 hover:border-[#4a6410]/40 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-[#4a6410]/10 flex items-center justify-center shrink-0">
                <RestaurantIcon className="w-7 h-7 text-[#4a6410]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold text-[#1b1c19] mb-1">
                  I&apos;m a Foodie 🍽️
                </h3>
                <p className="text-[#44483a]/80 text-xs sm:text-sm leading-relaxed">
                  Discover local vendors, pre-order your favourites, and skip the morning queue.
                </p>
              </div>

              <div className="self-center shrink-0">
                <ArrowRight
                  className={`w-5 h-5 transition-all ${
                    selected === 'foodie'
                      ? 'text-[#4a6410] translate-x-1'
                      : 'text-[#44483a]/40 group-hover:text-[#4a6410] group-hover:translate-x-1'
                  }`}
                />
              </div>

            </div>
          </button>

          {/* Vendor Card */}
          <button
            onClick={() => handleContinue('vendor')}
            disabled={selected !== null}
            className={`group w-full text-left bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${
              selected === 'vendor'
                ? 'border-[#4a6410] shadow-md scale-[1.01]'
                : 'border-[#1b1c19]/10 hover:border-[#4a6410]/40 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-[#924700]/10 flex items-center justify-center shrink-0">
                <StoreIcon className="w-7 h-7 text-[#924700]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold text-[#1b1c19] mb-1">
                  I&apos;m a Merchant / Vendor 🏪
                </h3>
                <p className="text-[#44483a]/80 text-xs sm:text-sm leading-relaxed">
                  Manage pre-orders, sync your POS, launch punchcards, and grow your local customer base.
                </p>
              </div>

              <div className="self-center shrink-0">
                <ArrowRight
                  className={`w-5 h-5 transition-all ${
                    selected === 'vendor'
                      ? 'text-[#4a6410] translate-x-1'
                      : 'text-[#44483a]/40 group-hover:text-[#4a6410] group-hover:translate-x-1'
                  }`}
                />
              </div>

            </div>
          </button>

        </div>

        {/* Direct Logins */}
        <div className="text-center space-y-2">
          <p className="text-[#44483a] text-xs sm:text-sm">
            Already have an account?
          </p>
          <div className="flex justify-center gap-4 text-xs font-bold">
            <button
              onClick={() => router.push('/login/customer')}
              className="text-[#4a6410] border-b border-[#4a6410]/30 hover:border-[#4a6410]"
            >
              Foodie Login
            </button>
            <span className="text-[#44483a]/40">•</span>
            <button
              onClick={() => router.push('/login/vendor')}
              className="text-[#924700] border-b border-[#924700]/30 hover:border-[#924700]"
            >
              Merchant Login
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
