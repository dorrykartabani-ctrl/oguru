'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import { Loader2, BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, Bell } from 'lucide-react';

export default function InsightsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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

      if (!businessData || businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(businessData);
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
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <h1 className="font-display text-lg font-bold text-primary">Insights</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-label font-semibold uppercase tracking-wider mb-3">
            <BarChart3 size={12} />
            Coming Soon
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Insights
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Data-driven insights to grow your business
          </p>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: DollarSign,
              title: 'Revenue Analytics',
              description: 'Daily, weekly, and monthly revenue trends',
            },
            {
              icon: ShoppingBag,
              title: 'Order Insights',
              description: 'Peak hours, popular items, average order value',
            },
            {
              icon: Users,
              title: 'Customer Analytics',
              description: 'New vs returning, top spenders, retention rates',
            },
            {
              icon: TrendingUp,
              title: 'Growth Trends',
              description: 'Follower growth, engagement, market position',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 opacity-70"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-on-surface mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <BarChart3 size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              Insights unlock as you grow
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Once you start receiving orders and followers, this section will visualize your data and reveal patterns to help you grow.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
