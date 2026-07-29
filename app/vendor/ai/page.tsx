'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import { Loader2, Sparkles, MessageSquare, Wand2, TrendingUp, Image, Bell } from 'lucide-react';

export default function AIAssistantPage() {
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
          <h1 className="font-display text-lg font-bold text-primary">AI Assistant</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-label font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            Coming Soon
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            AI Assistant
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Your smart business partner for growing OGuru
          </p>
        </div>

        {/* Hero Card */}
        <div className="mb-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} />
              <span className="font-label text-xs font-semibold uppercase tracking-wider opacity-90">
                Powered by AI
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Marketing that thinks for you
            </h2>
            <p className="text-white/90 leading-relaxed">
              Ask questions in plain English. Get promotional copy, campaign ideas, and smart suggestions based on your data.
            </p>
          </div>
          <Sparkles
            size={200}
            className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none"
          />
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              icon: MessageSquare,
              title: 'AI Chat Assistant',
              description: 'Ask anything: "Write a rainy day promo" or "What should I promote this weekend?"',
              example: '"Help me write a promotion for our new matcha latte"',
            },
            {
              icon: Wand2,
              title: 'Content Generator',
              description: 'Auto-write product descriptions, social captions, and email announcements',
              example: '"Generate an Instagram caption for our brunch menu"',
            },
            {
              icon: TrendingUp,
              title: 'Smart Insights',
              description: 'Get automatic recommendations based on your sales and customer patterns',
              example: '"Your matcha sales spike on Sundays — promote it earlier"',
            },
            {
              icon: Image,
              title: 'Menu AI Helper',
              description: 'Enhance product listings with AI-generated descriptions and suggestions',
              example: '"Rewrite this to sound more appealing"',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-on-surface mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <p className="text-xs text-primary italic">
                    {feature.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="p-4 bg-tertiary/5 border border-tertiary/20 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              Coming in early 2025
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We&apos;re building AI features that actually help — no fluff, just tools that save you time on marketing so you can focus on your craft.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
