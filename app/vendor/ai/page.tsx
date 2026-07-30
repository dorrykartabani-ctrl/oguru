'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Profile } from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import {
  Loader2,
  Sparkles,
  Bell,
  Send,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';

type GeneratedCampaign = {
  pushNotification: string;
  socialCaption: string;
  suggestedOffer: {
    title: string;
    description: string;
    emoji: string;
  };
  bestSendTime: string;
  reasoning: string;
};

const QUICK_PROMPTS = [
  "It's raining today and foot traffic is slow",
  'We have 15 leftover croissants to move by closing',
  'We just launched a new seasonal drink',
  "It's a public holiday tomorrow and we're open",
];

export default function AIAssistantPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [situation, setSituation] = useState('');
  const [generating, setGenerating] = useState(false);
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const generateCampaign = async () => {
    if (!situation.trim() || generating) return;

    setGenerating(true);
    setError(null);
    setCampaign(null);

    try {
      const res = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: situation.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setCampaign(data.campaign);
    } catch (err) {
      console.error(err);
      setError('Could not reach the AI service. Please check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const useOfferAsPromotion = () => {
    if (!campaign) return;
    const params = new URLSearchParams({
      title: campaign.suggestedOffer.title,
      description: campaign.suggestedOffer.description,
      emoji: campaign.suggestedOffer.emoji,
    });
    router.push(`/vendor/marketing/promotions/new?${params.toString()}`);
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
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-label font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            AI Campaign Generator
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            AI Assistant
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Describe what&apos;s going on today — get a push notification, a social caption, and a suggested offer, ready to send.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 mb-6">
          <label className="block text-sm font-semibold text-on-surface mb-2">
            What&apos;s happening?
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. I have 20 leftover croissants at 2pm and it's raining"
            maxLength={500}
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <div className="flex justify-end mt-1 mb-4">
            <span className="text-xs text-on-surface-variant/60">{situation.length}/500</span>
          </div>

          {/* Quick prompt chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSituation(prompt)}
                className="text-xs font-label font-medium px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <button
            onClick={generateCampaign}
            disabled={!situation.trim() || generating}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Campaign
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-2xl flex items-start gap-3">
            <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Results */}
        {campaign && (
          <div className="space-y-4">
            {/* Push notification */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Bell size={16} />
                  <span className="text-xs font-label font-semibold uppercase tracking-wider">
                    Push Notification
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(campaign.pushNotification, 'push')}
                  className="flex items-center gap-1 text-xs font-label font-semibold text-on-surface-variant hover:text-primary transition-colors"
                >
                  {copiedField === 'push' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === 'push' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low rounded-xl p-3">
                {campaign.pushNotification}
              </p>
            </div>

            {/* Social caption */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Send size={16} />
                  <span className="text-xs font-label font-semibold uppercase tracking-wider">
                    Social Caption
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(campaign.socialCaption, 'caption')}
                  className="flex items-center gap-1 text-xs font-label font-semibold text-on-surface-variant hover:text-primary transition-colors"
                >
                  {copiedField === 'caption' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === 'caption' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line bg-surface-container-low rounded-xl p-3">
                {campaign.socialCaption}
              </p>
            </div>

            {/* Suggested offer */}
            <div className="bg-surface-container-lowest border border-primary/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Tag size={16} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">
                  Suggested Offer
                </span>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl flex-shrink-0">{campaign.suggestedOffer.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">
                    {campaign.suggestedOffer.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {campaign.suggestedOffer.description}
                  </p>
                </div>
              </div>
              <button
                onClick={useOfferAsPromotion}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-primary/20 transition-colors"
              >
                <Tag size={16} />
                Create Promotion from This
              </button>
            </div>

            {/* Timing + reasoning */}
            <div className="p-4 bg-tertiary/5 border border-tertiary/20 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">
                  Best time to send: {campaign.bestSendTime}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {campaign.reasoning}
                </p>
              </div>
            </div>

            <button
              onClick={generateCampaign}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2.5 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
