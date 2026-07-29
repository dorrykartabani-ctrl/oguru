'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import {
  Bell,
  Sparkles,
  ArrowRight,
  Loader2,
  TrendingUp,
  Share2,
  UtensilsCrossed,
  Megaphone,
} from 'lucide-react';

const stats = [
  { label: 'Followers', value: '0', change: 'No followers yet', trend: 'neutral' },
  { label: 'Nearby', value: '0', change: 'coming soon', trend: 'neutral' },
  { label: 'Gifts Sent', value: '0', change: 'this week', trend: 'neutral' },
  { label: 'Regulars', value: '0', change: 'loyal visitors', trend: 'neutral' },
];

const quickActions = [
  {
    icon: UtensilsCrossed,
    title: 'Manage menu',
    subtitle: 'Add and edit products',
    href: '/vendor/menu',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Share2,
    title: 'Share your store',
    subtitle: 'Get your OGuru link',
    href: '/vendor/settings',
    color: 'bg-secondary-container text-on-secondary-container',
  },
  {
    icon: Megaphone,
    title: 'Create campaign',
    subtitle: 'Promotions & marketing',
    href: '/vendor/marketing',
    color: 'bg-tertiary/10 text-tertiary',
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [openingHoursCount, setOpeningHoursCount] = useState(0);
  const [keywordsCount, setKeywordsCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) setProfile(profileData);

      const { data: businessData } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
      if (!businessData) {
        router.push('/vendor/apply');
        return;
      }
      if (businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }
      setBusiness(businessData);

      const { data: locationData } = await supabase.from('locations').select('*').eq('business_id', businessData.id).eq('is_primary', true).single();
      if (locationData) {
        setLocation(locationData);
        const [productsResult, hoursResult, keywordsResult] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('location_id', locationData.id),
          supabase.from('opening_hours').select('day_of_week', { count: 'exact', head: true }).eq('location_id', locationData.id),
          supabase.from('vendor_keywords').select('id', { count: 'exact', head: true }).eq('business_id', businessData.id),
        ]);
        setProductCount(productsResult.count || 0);
        setOpeningHoursCount(hoursResult.count || 0);
        setKeywordsCount(keywordsResult.count || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (): { pct: number; sections: number; total: number } => {
    if (!business) return { pct: 0, sections: 0, total: 6 };
    let completed = 0;
    const total = 6;
    if (business.logo_url && business.cover_url) completed++;
    if (business.description && business.description.length > 20 && business.business_types.length > 0) completed++;
    if (location) completed++;
    if (openingHoursCount >= 3) completed++;
    if (keywordsCount >= 3) completed++;
    if (productCount >= 1) completed++;
    return {
      pct: Math.round((completed / total) * 100),
      sections: completed,
      total,
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading your dashboard...</p>
      </main>
    );
  }

  if (!business || !profile) return null;

  const greeting = getGreeting();
  const businessInitials = getInitials(business.legal_name);
  const firstName = profile.full_name?.split(' ')[0] || 'there';
  const completion = calculateCompletion();
  const isProfileComplete = completion.pct === 100;

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Grainy texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <h1 className="font-display text-lg font-bold text-primary truncate max-w-[180px]">
            {business.legal_name}
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary-container" />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
        {/* Greeting */}
        <section className="mb-6 md:mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight">
            {greeting}, {firstName}.
          </h2>
          <p className="font-display text-2xl md:text-3xl font-semibold text-primary mt-1 leading-tight">
            {isProfileComplete ? 'Your community is growing 🌱' : "Welcome to OGuru"}
          </p>
          {location && (
            <p className="text-sm text-on-surface-variant mt-3">
              {location.city} · {business.currency}
            </p>
          )}
        </section>

        {/* Profile Completion Prompt */}
        {!isProfileComplete && (
          <section className="mb-6">
            <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl p-6 md:p-8 shadow-organic relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} />
                    <span className="font-label text-xs font-semibold uppercase tracking-wider opacity-90">
                      Get Started
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-2 leading-tight">
                    Complete your profile ({completion.pct}%)
                  </h3>
                  <p className="text-white/85 text-sm md:text-base mb-4 leading-relaxed max-w-md">
                    {completion.sections} of {completion.total} sections done. Add photos, hours, and keywords to help customers find you.
                  </p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4 max-w-md">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${completion.pct}%` }}
                    />
                  </div>
                  <button
                    onClick={() => router.push('/vendor/settings')}
                    className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
                  >
                    Complete profile
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="hidden md:block flex-shrink-0">
                  <div className="relative">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(completion.pct / 100) * 283} 283`} className="transition-all duration-700" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl">
                      {completion.pct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-6">
          <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Quick actions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => router.push(action.href)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-organic transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-on-surface truncate">
                      {action.title}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {action.subtitle}
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Community Stats */}
        <section className="mb-6">
          <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Your Community
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5">
                <p className="font-label text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <span className="font-display text-2xl md:text-3xl font-semibold text-on-surface block mb-1">
                  {stat.value}
                </span>
                <p className="text-[10px] text-on-surface-variant">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Empty state */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-display text-lg md:text-xl font-semibold text-on-surface mb-2">
            {isProfileComplete ? 'Your insights will appear here' : 'Ready to grow your business'}
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            {isProfileComplete
              ? "Once customers start engaging with your store, you'll see live insights, birthdays, campaign performance, and AI recommendations here."
              : "Complete your profile to start attracting customers. Once you have followers and orders, this dashboard will come alive with insights."}
          </p>
        </div>
      </div>
    </main>
  );
}
