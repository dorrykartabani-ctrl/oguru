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

    setTimeout(() => {
      router.push(role === 'foodie' ? '/login/customer' : '/login/vendor');
    }, 200);
  };

  return (
    <main className="min-h-screen bg-surface flex flex-col relative overflow-hidden">

      {/* Back button */}
      <div className="fixed top-0 left-0 w-full z-30 px-margin-mobile pt-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all duration-150"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-margin-mobile max-w-lg mx-auto w-full py-16">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background leading-tight mb-3">
            How will you use <span className="text-primary">OGuru?</span>
          </h1>
          <p className="text-on-surface-variant font-body-md opacity-80 leading-relaxed">
            Choose the experience that fits you. You can always switch later.
          </p>
        </div>

        <div className="space-y-4 mb-8">

          {/* Foodie Card */}
          <button
            onClick={() => handleContinue('foodie')}
            disabled={selected !== null}
            className={`group w-full text-left bg-surface-container-lowest rounded-2xl border-2 p-5 transition-all duration-300 ${
              selected === 'foodie'
                ? 'border-primary shadow-[0_8px_24px_rgba(93,64,55,0.15)] scale-[1.02]'
                : 'border-outline-variant/20 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(93,64,55,0.10)]'
            }`}
          >
            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-primary-fixed/50 flex items-center justify-center">
                <RestaurantIcon className="w-7 h-7 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="font-body-lg text-on-surface font-semibold mb-1">
                  I&apos;m a Foodie 🍽️
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Discover local vendors, pre-order your favourites, and skip the queue.
                </p>
              </div>

              <div className="self-center">
                <ArrowRight
                  className={`w-6 h-6 transition-all ${
                    selected === 'foodie'
                      ? 'text-primary translate-x-1'
                      : 'text-outline-variant group-hover:text-primary group-hover:translate-x-1'
                  }`}
                />
              </div>

            </div>
          </button>

          {/* Vendor Card */}
          <button
            onClick={() => handleContinue('vendor')}
            disabled={selected !== null}
            className={`group w-full text-left bg-surface-container-lowest rounded-2xl border-2 p-5 transition-all duration-300 ${
              selected === 'vendor'
                ? 'border-primary shadow-[0_8px_24px_rgba(93,64,55,0.15)] scale-[1.02]'
                : 'border-outline-variant/20 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(93,64,55,0.10)]'
            }`}
          >
            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/60 flex items-center justify-center">
                <StoreIcon className="w-7 h-7 text-secondary" />
              </div>

              <div className="flex-1">
                <h3 className="font-body-lg text-on-surface font-semibold mb-1">
                  I&apos;m a Vendor 🏪
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Reach new customers, manage pre-orders, and grow your local business.
                </p>
              </div>

              <div className="self-center">
                <ArrowRight
                  className={`w-6 h-6 transition-all ${
                    selected === 'vendor'
                      ? 'text-primary translate-x-1'
                      : 'text-outline-variant group-hover:text-primary group-hover:translate-x-1'
                  }`}
                />
              </div>

            </div>
          </button>

        </div>

        <div className="text-center">
          <p className="text-on-surface-variant text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login/customer')}
              className="text-primary font-semibold border-b border-primary/30 hover:border-primary"
            >
              Log in
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}