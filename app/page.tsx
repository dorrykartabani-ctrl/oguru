'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    // Haptic feedback on mobile
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
    router.push('/login');
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

      {/* Decorative background circles */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      />
      <div
        className={`absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-secondary-fixed/20 blur-3xl transition-all duration-1000 delay-200 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      />

      {/* Top area: Brand */}
      <header className="relative z-10 pt-12 px-margin-mobile max-w-lg mx-auto w-full">
        <div
          className={`transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight leading-none">
            OGuru
          </h1>
        </div>
      </header>

      {/* Middle area: Visual hook + tagline */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-margin-mobile max-w-lg mx-auto w-full py-8">
        {/* Illustration cluster */}
        <div
          className={`relative mb-10 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative h-64 flex items-center justify-center">
            {/* Central card cluster */}
            <div className="relative w-full max-w-sm">
              {/* Card 1 — back left, rotated */}
              <div
                className="absolute top-0 left-2 w-32 h-40 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 shadow-[0_8px_24px_rgba(93,64,55,0.10)] overflow-hidden transform -rotate-6"
                style={{ transformOrigin: 'bottom right' }}
              >
                <div className="h-24 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary text-[40px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_cafe
                  </span>
                </div>
                <div className="p-2">
                  <div className="h-2 w-16 bg-surface-container-highest rounded-full mb-1.5" />
                  <div className="h-1.5 w-12 bg-surface-container-highest rounded-full" />
                </div>
              </div>

              {/* Card 2 — back right, rotated */}
              <div
                className="absolute top-0 right-2 w-32 h-40 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 shadow-[0_8px_24px_rgba(93,64,55,0.10)] overflow-hidden transform rotate-6"
                style={{ transformOrigin: 'bottom left' }}
              >
                <div className="h-24 bg-gradient-to-br from-tertiary-fixed to-secondary-fixed flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-tertiary text-[40px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_pizza
                  </span>
                </div>
                <div className="p-2">
                  <div className="h-2 w-16 bg-surface-container-highest rounded-full mb-1.5" />
                  <div className="h-1.5 w-12 bg-surface-container-highest rounded-full" />
                </div>
              </div>

              {/* Card 3 — front centre, main */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-44 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-[0_12px_32px_rgba(93,64,55,0.15)] overflow-hidden z-10">
                <div className="h-28 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center relative">
                  <span
                    className="material-symbols-outlined text-on-primary text-[48px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bakery_dining
                  </span>
                  {/* Status pill */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold text-primary tracking-wide font-label-sm">
                      OPEN
                    </span>
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="h-2.5 w-20 bg-on-surface/80 rounded-full mb-1.5" />
                  <div className="h-1.5 w-14 bg-outline-variant rounded-full mb-2" />
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <div className="h-1.5 w-8 bg-outline-variant rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating pin above */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="relative flex flex-col items-center animate-bounce" style={{ animationDuration: '2.5s' }}>
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center shadow-lg border-2 border-white">
                    <span
                      className="material-symbols-outlined text-on-tertiary text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-tertiary rotate-45 -mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Headline + tagline */}
        <div
          className={`transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background leading-tight mb-3">
            Pre-order from your{' '}
            <span className="text-primary">neighbourhood&apos;s best.</span>
          </h2>
          <p className="text-on-surface-variant font-body-md opacity-80 leading-relaxed">
            Skip the queue. Discover local vendors, reserve your favourites, and pick up when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Bottom area: CTA */}
      <footer className="relative z-10 px-margin-mobile pb-10 pt-4 max-w-lg mx-auto w-full">
        <div
          className={`transition-all duration-700 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleGetStarted}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider active:scale-[0.98] transition-all duration-150 shadow-[0_4px_12px_rgba(93,64,55,0.12)] hover:shadow-[0_6px_16px_rgba(93,64,55,0.18)] flex items-center justify-center gap-2"
          >
            <span>GET STARTED</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <p className="text-center text-on-surface-variant/60 text-xs font-body-md mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-primary">Terms</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </div>
      </footer>
    </main>
  );
}