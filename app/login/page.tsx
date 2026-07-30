'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, StoreIcon, RestaurantIcon } from '@/components/icons';

export default function PreLoginFork() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<'foodie' | 'vendor' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = (role: 'foodie' | 'vendor') => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
    setSelected(role);

    // Slight delay for visual feedback
    setTimeout(() => {
      if (role === 'foodie') {
        router.push('/login/customer');
      } else {
        router.push('/login/vendor');
      }
    }, 200);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")`,
        }}
      />

      {/* Decorative background */}
      <div
        className={`absolute top-1/4 -right-40 w-80 h-80 rounded-full bg-primary-fixed/15 blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-secondary-fixed/15 blur-3xl transition-all duration-1000 delay-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Back button */}
      <div className="fixed top-0 left-0 w-full z-30 px-margin-mobile pt-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all duration-150"
          aria-label="Back to splash"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-margin-mobile max-w-lg mx-auto w-full py-16">

        {/* Heading */}
        <div
          className={`mb-10 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background leading-tight mb-3">
            How will you use{' '}
            <span className="text-primary">OGuru?</span>
          </h1>
          <p className="text-on-surface-variant font-body-md opacity-80 leading-relaxed">
            Choose the experience that fits you. You can always switch later.
          </p>
        </div>

        {/* Role cards */}
        <div className="space-y-4 mb-8">

          {/* Foodie card */}
          <button
            onClick={() => handleContinue('foodie')}
            disabled={selected !== null}
            className={`group w-full text-left bg-surface-container-lowest rounded-2xl border-2 p-5 transition-all duration-300 disabled:cursor-not-allowed ${
              selected === 'foodie'
                ? 'border-primary shadow-[0_8px_24px_rgba(93,64,55,0.15)] scale-[1.02]'
                : 'border-outline-variant/20 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(93,64,55,0.10)] active:scale-[0.99]'
            } ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: mounted ? '300ms' : '0ms' }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary-fixed/50 flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <ArrowLeft className="w-5 h-5 text-on-surface" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-body-lg text-on-surface font-semibold">I&apos;m a Foodie</h3>
                  <span className="text-lg">🍽️</span>
                </div>
                <p className="text-on-surface-variant text-sm font-body-md leading-relaxed mb-3">
                  Discover local vendors, pre-order your favourites, and skip the queue.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">search</span>
                    Discover
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
                    Pre-order
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">card_giftcard</span>
                    Gift
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 self-center">
               {/* Arrow */}
<div className="flex-shrink-0 self-center">
  <ArrowRight
    className={`w-6 h-6 transition-all ${
      selected === 'foodie'
        ? 'text-primary translate-x-1'
        : 'text-outline-variant group-hover:text-primary group-hover:translate-x-1'
    }`}
  />
</div>
              </div>
            </div>
          </button>

          {/* Vendor card */}
          <button
            onClick={() => handleContinue('vendor')}
            disabled={selected !== null}
            className={`group w-full text-left bg-surface-container-lowest rounded-2xl border-2 p-5 transition-all duration-300 disabled:cursor-not-allowed ${
              selected === 'vendor'
                ? 'border-primary shadow-[0_8px_24px_rgba(93,64,55,0.15)] scale-[1.02]'
                : 'border-outline-variant/20 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(93,64,55,0.10)] active:scale-[0.99]'
            } ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: mounted ? '450ms' : '0ms' }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-secondary-fixed/60 flex items-center justify-center group-hover:bg-secondary-fixed transition-colors">
                <StoreIcon className="w-7 h-7 text-secondary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-body-lg text-on-surface font-semibold">I&apos;m a Vendor</h3>
                  <span className="text-lg">🏪</span>
                </div>
                <p className="text-on-surface-variant text-sm font-body-md leading-relaxed mb-3">
                  Reach new customers, manage pre-orders, and grow your local business.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">store</span>
                    List store
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">receipt_long</span>
                    Manage orders
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-label-sm tracking-wide">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    Grow
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 self-center">
                <ArrowRight className={`w-6 h-6 transition-all ${
                  selected === 'vendor' ? 'text-primary translate-x-1' : 'text-outline-variant group-hover:text-primary group-hover:translate-x-1'
                }`}>
                  
              </div>
            </div>
          </button>
        </div>

        {/* Existing user link */}
        <div
          className={`text-center transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '600ms' : '0ms' }}
        >
          <p className="text-on-surface-variant font-body-md text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login/customer')}
              className="text-primary font-semibold border-b border-primary/30 hover:border-primary transition-colors"
            >
              Log in
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}x