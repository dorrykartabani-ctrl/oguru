'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, Profile } from '@/lib/supabase/types';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  MoreHorizontal,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Loader2,
  LogOut,
  Camera,
  FileText,
  Clock,
  Tag,
  Share2,
  CheckCircle2,
  User,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: false, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

const stats = [
  { label: 'Followers', value: '0', change: 'No followers yet', trend: 'neutral' },
  { label: 'Nearby', value: '0', change: 'coming soon', trend: 'neutral' },
  { label: 'Gifts Sent', value: '0', change: 'this week', trend: 'neutral' },
  { label: 'Regulars', value: '0', change: 'loyal visitors', trend: 'neutral' },
];

// Profile setup steps in priority order
type ProfileStep = {
  key: string;
  icon: typeof Camera;
  title: string;
  subtitle: string;
  href: string;
  weight: number; // For calculating completion
};

const profileSteps: ProfileStep[] = [
  {
    key: 'photos',
    icon: Camera,
    title: 'Add photos',
    subtitle: 'Logo, cover photo, chip identity',
    href: '/vendor/profile/photos',
    weight: 25,
  },
  {
    key: 'about',
    icon: FileText,
    title: 'Write your story',
    subtitle: 'Tagline, description, business type',
    href: '/vendor/profile/about',
    weight: 20,
  },
  {
    key: 'hours',
    icon: Clock,
    title: 'Set opening hours',
    subtitle: 'When customers can find you',
    href: '/vendor/profile/hours',
    weight: 15,
  },
  {
    key: 'keywords',
    icon: Tag,
    title: 'Add keywords',
    subtitle: 'Help customers discover you',
    href: '/vendor/profile/keywords',
    weight: 15,
  },
  {
    key: 'social',
    icon: Share2,
    title: 'Link social accounts',
    subtitle: 'Instagram, Facebook, website',
    href: '/vendor/profile/social',
    weight: 10,
  },
  {
    key: 'menu',
    icon: UtensilsCrossed,
    title: 'Set up your menu',
    subtitle: 'Add products for customers to order',
    href: '/vendor/menu',
    weight: 15,
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!businessData) {
        router.push('/vendor/apply');
        return;
      }

      if (businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(businessData);

      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);

        // Load counts for progress calculation
        const [productsResult, hoursResult, keywordsResult] = await Promise.all([
          supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('location_id', locationData.id),
          supabase
            .from('opening_hours')
            .select('day_of_week', { count: 'exact', head: true })
            .eq('location_id', locationData.id),
          supabase
            .from('vendor_keywords')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', businessData.id),
        ]);

        setProductCount(productsResult.count || 0);
        setOpeningHoursCount(hoursResult.count || 0);
        setKeywordsCount(keywordsResult.count || 0);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Determine which sections are complete
  const isComplete = (step: ProfileStep): boolean => {
    if (!business) return false;

    switch (step.key) {
      case 'photos':
        return !!(business.logo_url && business.cover_url);
      case 'about':
        return !!(business.description && business.description.length > 20);
      case 'hours':
        return openingHoursCount >= 3;
      case 'keywords':
        return keywordsCount >= 3;
           case 'social':
        // Social is completely optional — always counts as complete
        return true;
      case 'menu':
        return productCount >= 1;
      default:
        return false;
    }
  };

  const incompleteSteps = profileSteps.filter((step) => !isComplete(step));
  const completedSteps = profileSteps.filter((step) => isComplete(step));
  const totalWeight = profileSteps.reduce((sum, s) => sum + s.weight, 0);
  const completedWeight = completedSteps.reduce((sum, s) => sum + s.weight, 0);
  const completionPct = Math.round((completedWeight / totalWeight) * 100);

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
  const profileInitials = profile.full_name ? getInitials(profile.full_name) : 'V';
  const firstName = profile.full_name?.split(' ')[0] || 'there';
  const showProfileCards = completionPct < 100;

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top App Bar — mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden">
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
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary-container" />
        </button>
      </header>

      {/* Side Nav — tablet+ */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base text-primary font-bold leading-tight truncate">
              {business.legal_name}
            </h1>
            <p className="text-xs text-on-surface-variant">Vendor Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium text-left ${
                  item.active
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant">
          <button
            onClick={() => router.push('/vendor/profile')}
            className="w-full flex items-center gap-3 px-2 mb-3 hover:bg-surface-variant p-2 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
              {profileInitials}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold truncate">
                {profile.full_name || 'Vendor'}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                View profile
              </p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-1 font-label"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
        {/* Greeting */}
        <section className="mb-6 md:mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight">
            {greeting}, {firstName}.
          </h2>
          <p className="font-display text-2xl md:text-3xl font-semibold text-primary mt-1 leading-tight">
            {completionPct === 100
              ? 'Your community is growing 🌱'
              : "Let's finish setting you up"}
          </p>
          {location && (
            <p className="text-sm text-on-surface-variant mt-3">
              {location.city} · {business.currency}
            </p>
          )}
        </section>

        {/* Profile Completion Section (shown until 100%) */}
        {showProfileCards && (
          <section className="mb-8">
            {/* Progress Header */}
            <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl p-6 md:p-8 mb-4 shadow-organic">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-label text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">
                    Store Setup
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold">
                    Your profile is {completionPct}% complete
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {completedSteps.length} of {profileSteps.length} sections done
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(completionPct / 100) * 283} 283`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg">
                    {completionPct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Incomplete Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {incompleteSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.key}
                    onClick={() => router.push(step.href)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-organic transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-on-surface truncate">
                        {step.title}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {step.subtitle}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                    />
                  </button>
                );
              })}
            </div>

            {/* Completed section (collapsible) */}
            {completedSteps.length > 0 && (
              <div className="mt-6">
                <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                  Completed ({completedSteps.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {completedSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <button
                        key={step.key}
                        onClick={() => router.push(step.href)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        <Icon size={12} />
                        {step.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Stats (always shown) */}
        <section className="mb-6">
          <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Your Community
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5"
              >
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

        {/* Empty state (when profile complete but no activity yet) */}
        {completionPct === 100 && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-display text-lg md:text-xl font-semibold text-on-surface mb-2">
              Your dashboard will come alive
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              You&apos;re fully set up! Once customers start engaging, you&apos;ll see live insights, birthdays, campaign performance, and AI recommendations here.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)]">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all active:scale-90 ${
                  item.active
                    ? 'bg-primary-container/40 text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} fill={item.active ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-label font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}