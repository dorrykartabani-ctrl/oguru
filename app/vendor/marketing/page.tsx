'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Promotion, Punchcard, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import {
  Loader2,
  ArrowRight,
  Tag,
  Clock,
  CreditCard,
  Users,
  Sparkles,
  TrendingUp,
  Megaphone,
  Bell,
} from 'lucide-react';

const marketingTools = [
  {
    id: 'promotions',
    icon: Tag,
    title: 'Promotions',
    subtitle: 'Time-limited deals to drive sales',
    description: 'Percentage discounts, meal deals, and bundle offers',
    href: '/vendor/marketing/promotions',
    available: true,
    color: 'bg-primary/10 text-primary',
    borderColor: 'border-primary/20',
  },
  {
    id: 'happy_hours',
    icon: Clock,
    title: 'Happy Hours',
    subtitle: 'Fill quiet times with automatic discounts',
    description: 'Recurring time-based promotions',
    href: '#',
    available: false,
    color: 'bg-tertiary/10 text-tertiary',
    borderColor: 'border-tertiary/20',
  },
  {
    id: 'punchcards',
    icon: CreditCard,
    title: 'Digital Punchcards',
    subtitle: 'Reward loyal customers automatically',
    description: 'Buy 10 coffees, get 1 free — no physical card needed',
    href: '/vendor/marketing/punchcards',
    available: true,
    color: 'bg-secondary-container text-on-secondary-container',
    borderColor: 'border-secondary/20',
  },
  {
    id: 'birthday',
    icon: Sparkles,
    title: 'Birthday Rewards',
    subtitle: 'Automatic gifts on customer birthdays',
    description: 'Coming soon — auto-send special day offers',
    href: '#',
    available: false,
    color: 'bg-tertiary-container/40 text-on-tertiary-container',
    borderColor: 'border-tertiary/20',
  },
  {
    id: 'announcements',
    icon: Megaphone,
    title: 'Announcements',
    subtitle: 'Push notifications to your followers',
    description: 'New menu, special events, seasonal changes',
    href: '#',
    available: false,
    color: 'bg-primary-container/40 text-primary',
    borderColor: 'border-primary/20',
  },
  {
    id: 'referrals',
    icon: Users,
    title: 'Referral Program',
    subtitle: 'Reward customers who bring friends',
    description: 'Both get a discount when new customer orders',
    href: '#',
    available: false,
    color: 'bg-secondary/10 text-secondary',
    borderColor: 'border-secondary/20',
  },
];

export default function MarketingHubPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [activePunchcards, setActivePunchcards] = useState<Punchcard[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) setProfile(profileData);

      const { data: businessData } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
      if (!businessData || businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }
      setBusiness(businessData);

      const { data: promoData } = await supabase.from('promotions').select('*').eq('business_id', businessData.id).eq('is_active', true);
      setActivePromotions(promoData || []);

      const { data: punchcardData } = await supabase.from('punchcards').select('*').eq('business_id', businessData.id).eq('is_active', true);
      setActivePunchcards(punchcardData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  if (!business) return null;

  const businessInitials = business.legal_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <h1 className="font-display text-lg font-bold text-primary">Marketing</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Marketing
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Tools to grow your customer base and drive sales
          </p>
        </div>

        {activePromotions.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">
                {activePromotions.length} active promotion{activePromotions.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-on-surface-variant">Live on your store page</p>
            </div>
            <button
              onClick={() => router.push('/vendor/marketing/promotions')}
              className="text-sm font-label font-semibold text-primary hover:underline"
            >
              Manage →
            </button>
          </div>
        )}

        {activePunchcards.length > 0 && (
          <div className="mb-6 p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
              <CreditCard size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">
                {activePunchcards.length} active punchcard{activePunchcards.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-on-surface-variant">Live on your store page</p>
            </div>
            <button
              onClick={() => router.push('/vendor/marketing/punchcards')}
              className="text-sm font-label font-semibold text-secondary hover:underline"
            >
              Manage →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketingTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => tool.available && tool.href !== '#' && router.push(tool.href)}
                disabled={!tool.available}
                className={`bg-surface-container-lowest border ${tool.borderColor} rounded-2xl p-5 text-left transition-all ${
                  tool.available
                    ? 'hover:border-primary/40 hover:shadow-organic cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                    <Icon size={22} />
                  </div>
                  {!tool.available && (
                    <span className="text-[10px] font-label font-semibold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-full uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-lg text-on-surface mb-1">
                  {tool.title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-3">
                  {tool.subtitle}
                </p>
                <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                  {tool.description}
                </p>
                {tool.available && (
                  <div className="flex items-center gap-1 mt-4 text-primary font-label text-xs font-semibold uppercase tracking-wider">
                    <span>Open</span>
                    <ArrowRight size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}