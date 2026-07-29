'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import { Loader2, Users, Heart, Cake, TrendingDown, MessageSquare, Bell } from 'lucide-react';

export default function CommunityPage() {
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
          <h1 className="font-display text-lg font-bold text-primary">Community</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Community
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Know your customers and grow lasting relationships
          </p>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Users,
              title: 'Follower Insights',
              description: 'See who follows you, when they joined, and their favorite items',
              color: 'bg-primary/10 text-primary',
            },
            {
              icon: Heart,
              title: 'Regulars & VIPs',
              description: 'Identify your top customers and reward loyalty',
              color: 'bg-secondary-container text-on-secondary-container',
            },
            {
              icon: Cake,
              title: 'Birthday Rewards',
              description: 'Send automatic gifts on customer birthdays',
              color: 'bg-tertiary/10 text-tertiary',
            },
            {
              icon: TrendingDown,
              title: 'Lapsed Customer Recovery',
              description: 'Win back customers who haven\'t visited recently',
              color: 'bg-error/10 text-error',
            },
            {
              icon: MessageSquare,
              title: 'Direct Messaging',
              description: 'Send announcements and updates to your followers',
              color: 'bg-primary/10 text-primary',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 opacity-70"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-label font-semibold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-full uppercase tracking-wider">
                    Coming Soon
                  </span>
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

        {/* Info card */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Users size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              Building community tools
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Once you start getting followers and orders, this section will show you who your customers are, what they love, and how to keep them coming back.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
