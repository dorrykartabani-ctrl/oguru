'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Mail, Clock, Sparkles } from 'lucide-react';

export default function VendorPendingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 mx-auto rounded-full bg-primary flex items-center justify-center shadow-xl">
              <CheckCircle2 size={48} className="text-on-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-on-surface tracking-tight">
              Application received! 🌾
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Thank you for applying to join OGuru. We&apos;re excited to review your business.
            </p>
          </div>

          <div className="space-y-3 text-left mt-8">
            <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">Review within 48 hours</p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Our team is checking your details now
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">Email confirmation</p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Check your inbox for confirmation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">Approval & setup</p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  We&apos;ll guide you through setting up your store
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-on-primary font-label font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform uppercase tracking-wider"
            >
              Back to home
            </button>
          </div>

          <p className="text-sm text-on-surface-variant pt-4">
            Questions? Email{' '}
            <a href="mailto:vendors@oguru.app" className="text-primary font-semibold underline">
              vendors@oguru.app
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
