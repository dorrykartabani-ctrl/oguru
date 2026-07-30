'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from '@/components/icons';

export default function SplashScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
    router.push('/login');
  };

  return (
    <>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9999]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`,
        }}
      />

      <main
        className="flex-1 flex flex-col px-6 pt-12 max-w-[390px] mx-auto w-full relative min-h-screen"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
        }}
      >
        {/* Header wordmark */}
        <header
          className={`mb-10 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
            OGuru
          </span>
        </header>

        {/* Hero visual */}
        <div
          className={`relative mb-10 transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="relative overflow-hidden rounded-[24px] shadow-[0_10px_40px_-10px_rgba(93,64,55,0.15)] aspect-[3/4] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="A vibrant neighbourhood café with people enjoying artisan coffee and fresh food at rustic wooden tables. Morning light streams in with a warm, social, farm-to-table atmosphere."
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHvUV0QaYkrnoUI-ynvu00Yom_dzi2U-hmkDuZLqze7plFeUqHZH5s9yYOXSWx9Me0Fu8UtBnx58qaljGIgbmPrZHnJLXNTUUR9YRbK3JLZFOdPnvIPtg81U7gYzd9P4kMAm2bjZ0t7JhZ8G_aNwh8S5ZL2v4dp1-PFXy0xl3OngSk3mxb0Wh0jtHm_8hIbpaLyHG7D-_gZiIR1n0xnoZjYm8SF1gKltrdpxqea73mF5fxRPmag9_v"
            />

            {/* Floating status badge */}
            <div className="absolute top-4 right-4 bg-surface/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <p className="font-label-sm text-[10px] tracking-wider text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                PRE-ORDERS OPEN
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-[1.1] mb-4 tracking-tight">
            Pre-order from your{' '}
            <span className="text-primary italic">neighbourhood&apos;s</span> best.
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-10">
            Skip the queue. Discover local vendors, reserve your favourites, and pick up when you&apos;re ready.
          </p>
        </div>

        {/* Action section */}
        <div
          className={`mt-auto pb-[env(safe-area-inset-bottom,24px)] transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            onClick={handleGetStarted}
            className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl font-semibold flex items-center justify-between shadow-lg active:scale-[0.98] transition-all hover:bg-primary-container hover:text-on-primary-container group"
          >
            <span className="uppercase tracking-widest text-[14px]">Get Started</span>
            import { ArrowRight } from '@/components/icons';

<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <footer className="mt-6 pb-4">
            <p className="text-[10px] text-on-surface-variant/60 text-center uppercase tracking-tighter">
              By continuing, you agree to our{' '}
              <a className="underline underline-offset-2" href="#">Terms</a> and{' '}
              <a className="underline underline-offset-2" href="#">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}