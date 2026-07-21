'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, BusinessStatus } from '@/lib/supabase/types';
import {
  CheckCircle2,
  Mail,
  Clock,
  Sparkles,
  LogOut,
  ArrowRight,
  AlertCircle,
  XCircle,
  Loader2,
  Store,
} from 'lucide-react';

type StatusConfig = {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  title: string;
  subtitle: string;
  showRefresh: boolean;
};

const statusConfigs: Record<BusinessStatus, StatusConfig> = {
  draft: {
    icon: AlertCircle,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    title: 'Draft saved',
    subtitle: 'Complete your application to submit for review.',
    showRefresh: false,
  },
  pending: {
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    title: 'Application received!',
    subtitle: "Thank you for applying to join OGuru. We're excited to review your business.",
    showRefresh: true,
  },
  under_review: {
    icon: Sparkles,
    color: 'text-tertiary',
    bgColor: 'bg-tertiary/10',
    title: 'Under review',
    subtitle: "Our team is taking a closer look at your application. We'll be in touch soon.",
    showRefresh: true,
  },
  approved: {
    icon: CheckCircle2,
    color: 'text-primary',
    bgColor: 'bg-primary',
    title: 'You&apos;re approved! 🌾',
    subtitle: "Welcome to OGuru! Let's set up your store and start reaching customers.",
    showRefresh: false,
  },
  suspended: {
    icon: XCircle,
    color: 'text-error',
    bgColor: 'bg-error/10',
    title: 'Account suspended',
    subtitle: 'Please contact support to resolve this.',
    showRefresh: false,
  },
  rejected: {
    icon: XCircle,
    color: 'text-error',
    bgColor: 'bg-error/10',
    title: 'Application not approved',
    subtitle: "Unfortunately, we can't approve your application at this time.",
    showRefresh: false,
  },
};

export default function VendorPendingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        // Not logged in, send to login
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');

      // Get their business
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (businessError || !businessData) {
        console.error('No business found for user:', businessError);
        // They're logged in but no business — send to apply
        router.push('/vendor/apply');
        return;
      }

      setBusiness(businessData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleContinueToDashboard = () => {
    router.push('/vendor/dashboard');
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading your application...</p>
      </main>
    );
  }

  // No business found (shouldn't reach here due to redirect above)
  if (!business) {
    return null;
  }

  const config = statusConfigs[business.status];
  const StatusIcon = config.icon;
  const isApproved = business.status === 'approved';

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <header className="border-b border-outline-variant">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="OGuru" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="font-display font-bold text-primary">OGuru</p>
              <p className="text-xs text-on-surface-variant">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-label"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Status icon */}
          <div className="relative inline-block">
            {isApproved && (
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            )}
            <div
              className={`relative w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-xl ${
                isApproved ? 'bg-primary' : config.bgColor
              }`}
            >
              <StatusIcon
                size={48}
                className={isApproved ? 'text-on-primary' : config.color}
              />
            </div>
          </div>

          {/* Status text */}
          <div className="space-y-3">
            <h1
              className="font-display font-bold text-3xl md:text-4xl text-on-surface tracking-tight"
              dangerouslySetInnerHTML={{ __html: config.title }}
            />
            <p className="text-lg text-on-surface-variant leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* Business summary */}
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Store size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-on-surface">
                  {business.legal_name}
                </p>
                <p className="text-xs text-on-surface-variant capitalize">
                  Status: {business.status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Approved: show action button */}
          {isApproved ? (
            <div className="pt-4">
              <button
                onClick={handleContinueToDashboard}
                className="w-full bg-primary text-on-primary font-label font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              {/* Pending states: show timeline */}
              <div className="space-y-3 text-left mt-8">
                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">
                      Review within 48 hours
                    </p>
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
                    <p className="font-semibold text-on-surface">Stay logged in</p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      This page will update once approved
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">
                      Approval & setup
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      We&apos;ll guide you through setting up your store
                    </p>
                  </div>
                </div>
              </div>

              {/* Refresh button */}
              {config.showRefresh && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-2 mx-auto pt-4"
                >
                  {refreshing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>Check status</>
                  )}
                </button>
              )}
            </>
          )}

          <p className="text-sm text-on-surface-variant pt-4">
            Questions? Email{' '}
            <a
              href="mailto:vendors@oguru.app"
              className="text-primary font-semibold underline"
            >
              vendors@oguru.app
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
