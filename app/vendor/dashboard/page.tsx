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
  Sun,
  Sparkles,
  ArrowRight,
  ArrowUp,
  TrendingUp,
  Gift,
  UserPlus,
  Clock,
  Loader2,
  LogOut,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: false, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

// Mock data (will become real when we build these features)
const stats = [
  { label: 'Followers', value: '0', change: 'No followers yet', trend: 'neutral' },
  { label: 'Nearby', value: '0', change: 'coming soon', trend: 'neutral' },
  { label: 'Gifts Sent', value: '0', change: 'this week', trend: 'neutral' },
  { label: 'Regulars', value: '0', change: 'loyal visitors', trend: 'neutral' },
];

const campaigns = [
  { name: 'No active campaigns yet', subtext: 'Create your first', orders: 0 },
];

const recommendations = [
  {
    icon: Sparkles,
    title: 'Complete your profile',
    description: 'Add photos, description, and opening hours to attract customers.',
    cta: 'Complete profile',
    bg: 'bg-primary text-on-primary',
    ctaClass: 'bg-white/20 hover:bg-white/30',
    href: '#',
  },
  {
    icon: UtensilsCrossed,
    title: 'Set up your menu',
    description: 'Add products so customers can start ordering from your store.',
    cta: 'Add products',
    bg: 'bg-secondary-container text-on-secondary-container',
    ctaClass: 'bg-tertiary-container text-white',
    href: '/vendor/menu',
  },
  {
    icon: TrendingUp,
    title: 'Boost your visibility',
    description: 'Connect your Instagram to auto-share your products with followers.',
    cta: 'Connect social',
    bg: 'bg-surface-container-low border border-outline-variant text-on-surface',
    ctaClass: 'border border-outline text-on-surface-variant hover:bg-surface-variant',
    href: '#',
  },
];

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

// Format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency || 'AUD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!businessData) {
        // No business — send to apply
        router.push('/vendor/apply');
        return;
      }

      // Check status
      if (businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(businessData);

      // Load primary location
      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);
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

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading your dashboard...</p>
      </main>
    );
  }

  // Shouldn't reach here (redirects above), but safety check
  if (!business || !profile) {
    return null;
  }

  const greeting = getGreeting();
  const businessInitials = getInitials(business.legal_name);
  const profileInitials = profile.full_name
    ? getInitials(profile.full_name)
    : 'V';
  const firstName = profile.full_name?.split(' ')[0] || 'there';

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Grainy texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top App Bar (mobile only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
            {businessInitials}
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

      {/* Side Navigation (tablet + desktop) */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
            {businessInitials}
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
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
              {profileInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">
                {profile.full_name || 'Vendor'}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {business.owner_role}
              </p>
            </div>
          </div>
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
            Your community is growing 🌱
          </p>
          {location && (
            <p className="text-sm text-on-surface-variant mt-3">
              {location.city} · {business.currency}
            </p>
          )}
        </section>

        {/* Welcome / Setup Prompt (for new approved vendors) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 mb-6">
          {/* Onboarding hero card */}
          <div className="lg:col-span-8 bg-primary-container text-on-primary-container p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-organic">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} />
                <span className="font-label text-xs font-semibold uppercase tracking-wider">
                  Welcome to OGuru
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 leading-tight">
                Let&apos;s get your store ready
              </h3>
              <p className="text-on-primary-container/80 mb-6 text-sm md:text-base leading-relaxed">
                Complete your profile and add your products to start attracting customers in {location?.city || 'your area'}.
              </p>
              <button
                onClick={() => router.push('/vendor/menu')}
                className="bg-white text-primary px-6 py-3 rounded-lg font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                Set up menu
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <UtensilsCrossed size={140} />
            </div>
          </div>

          {/* Stats mini-grid */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
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
          </div>
        </div>

        {/* Setup Recommendations */}
        <div className="mb-6">
          <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 md:mb-4">
            Get Started
          </p>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible -mx-4 md:mx-0 px-4 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {recommendations.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <button
                  key={i}
                  onClick={() => rec.href !== '#' && router.push(rec.href)}
                  className={`${rec.bg} min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink p-5 rounded-2xl relative overflow-hidden shadow-organic-sm hover:shadow-organic transition-all text-left`}
                >
                  <div className="absolute top-3 right-3 opacity-20">
                    <Icon size={40} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-display font-bold text-base md:text-lg mb-2 pr-8">
                      {rec.title}
                    </h4>
                    <p
                      className={`text-sm mb-4 leading-relaxed ${
                        rec.bg.includes('text-on-primary')
                          ? 'text-white/80'
                          : 'opacity-80'
                      }`}
                    >
                      {rec.description}
                    </p>
                    <span
                      className={`inline-block text-xs font-label font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${rec.ctaClass}`}
                    >
                      {rec.cta}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty state notice */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-display text-lg md:text-xl font-semibold text-on-surface mb-2">
            Your dashboard will come alive
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Once you set up your menu and get your first orders, you&apos;ll see live insights, customer birthdays, campaign performance, and AI recommendations here.
          </p>
        </div>
      </div>

      {/* Bottom Navigation — Mobile Only */}
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
