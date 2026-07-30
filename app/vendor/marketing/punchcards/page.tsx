'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Punchcard, Product } from '@/lib/supabase/types';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  Settings,
  Loader2,
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
  Bell,
  Users,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: false, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: true, href: '/vendor/marketing' },
  { icon: Settings, label: 'Settings', active: false, href: '/vendor/settings' },
];

export default function PunchcardsListPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [punchcards, setPunchcards] = useState<Punchcard[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

      const { data: punchcardData } = await supabase
        .from('punchcards')
        .select('*')
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: false });

      setPunchcards(punchcardData || []);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessData.id);
      setProducts(productsData || []);

      // Load member counts per punchcard (for the "X customers enrolled" line)
      if (punchcardData && punchcardData.length > 0) {
        const { data: memberRows } = await supabase
          .from('punchcard_members')
          .select('punchcard_id')
          .in('punchcard_id', punchcardData.map((p) => p.id));

        const counts: Record<string, number> = {};
        (memberRows || []).forEach((row: { punchcard_id: string }) => {
          counts[row.punchcard_id] = (counts[row.punchcard_id] || 0) + 1;
        });
        setMemberCounts(counts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (card: Punchcard) => {
    setActionLoading(card.id);

    const { error } = await supabase
      .from('punchcards')
      .update({ is_active: !card.is_active })
      .eq('id', card.id);

    if (!error) {
      setPunchcards((prev) =>
        prev.map((p) => (p.id === card.id ? { ...p, is_active: !p.is_active } : p))
      );
    }

    setActionLoading(null);
  };

  const deleteCard = async (card: Punchcard) => {
    if (!confirm(`Delete "${card.title}"? This will also remove all customer progress on this card.`)) return;
    setActionLoading(card.id);

    const { error } = await supabase.from('punchcards').delete().eq('id', card.id);

    if (!error) {
      setPunchcards((prev) => prev.filter((p) => p.id !== card.id));
    }

    setActionLoading(null);
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

  const activeCards = punchcards.filter((p) => p.is_active);
  const pausedCards = punchcards.filter((p) => !p.is_active);

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Top App Bar — mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <button
          onClick={() => router.push('/vendor/marketing')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="font-display text-lg font-bold text-primary">Punchcards</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <div className="md:ml-0 md:pt-8 pt-20 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/vendor/marketing')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm mb-3"
            >
              <ArrowLeft size={16} />
              Back to Marketing
            </button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              Digital Punchcards
            </h1>
            <p className="text-base text-on-surface-variant mt-2">
              Reward loyal customers automatically
            </p>
          </div>
          <button
            onClick={() => router.push('/vendor/marketing/punchcards/new')}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={18} />
            New Punchcard
          </button>
        </div>

        {/* Mobile create button */}
        <button
          onClick={() => router.push('/vendor/marketing/punchcards/new')}
          className="md:hidden w-full flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all mb-6"
        >
          <Plus size={18} />
          New Punchcard
        </button>

        {/* Stats */}
        {punchcards.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Eye size={12} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Active</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">{activeCards.length}</p>
            </div>
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-4">
              <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                <EyeOff size={12} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Paused</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">{pausedCards.length}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {punchcards.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <CreditCard size={28} />
            </div>
            <h3 className="font-display text-xl font-semibold text-on-surface mb-2">
              No punchcards yet
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              Create a digital punchcard to reward repeat customers — no physical card needed.
            </p>
            <button
              onClick={() => router.push('/vendor/marketing/punchcards/new')}
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Create First Punchcard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {punchcards.map((card) => (
              <div
                key={card.id}
                className={`bg-surface-container-lowest border rounded-2xl p-5 transition-all ${
                  card.is_active ? 'border-primary/40 shadow-organic-sm' : 'border-outline-variant'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{card.emoji || '🎟️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-display font-bold text-lg text-on-surface">
                          {card.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${
                            card.is_active
                              ? 'bg-primary/10 text-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {card.is_active ? 'Live' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        Buy {card.punches_required}, get {card.reward_description.toLowerCase()}
                      </p>
                      <p className="text-xs text-on-surface-variant/70 mt-0.5">
                        {card.eligible_product_ids?.length > 0
                          ? `Applies to: ${card.eligible_product_ids
                              .map((id) => products.find((p) => p.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')}`
                          : 'Applies to any item'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
                  <Users size={12} />
                  <span>{memberCounts[card.id] || 0} customer{memberCounts[card.id] === 1 ? '' : 's'} enrolled</span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-outline-variant">
                  <button
                    onClick={() => router.push(`/vendor/marketing/punchcards/${card.id}/members`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-label font-semibold text-xs uppercase tracking-wider"
                  >
                    <Users size={14} />
                    Members
                  </button>
                  <button
                    onClick={() => router.push(`/vendor/marketing/punchcards/${card.id}`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg hover:border-primary hover:text-primary transition-colors font-label font-semibold text-xs uppercase tracking-wider"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => toggleStatus(card)}
                    disabled={actionLoading === card.id}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      card.is_active
                        ? 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {actionLoading === card.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : card.is_active ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCard(card)}
                    disabled={actionLoading === card.id}
                    className="flex items-center justify-center px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              How punchcards work
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Active punchcards appear on your store page. When a customer visits, open their card under
              &quot;Members&quot; and tap to add a punch — once they reach the target, mark their reward as redeemed.
            </p>
          </div>
        </div>
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
                  item.active ? 'bg-primary-container/40 text-primary' : 'text-on-surface-variant'
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
