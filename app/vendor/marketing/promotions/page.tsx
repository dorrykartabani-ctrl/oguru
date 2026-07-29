'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Promotion } from '@/lib/supabase/types';
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
  Clock,
  Sparkles,
  Tag,
  Bell,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: false, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: true, href: '/vendor/marketing' },
  { icon: Settings, label: 'Settings', active: false, href: '/vendor/settings' },
];

const formatPrice = (cents: number, currency: string = 'AUD') => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
};

const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
};

// Check if promo is currently active based on dates
const isPromoLive = (promo: Promotion): boolean => {
  if (!promo.is_active) return false;
  const now = new Date();
  if (promo.starts_at && new Date(promo.starts_at) > now) return false;
  if (promo.ends_at && new Date(promo.ends_at) < now) return false;
  return true;
};

const getPromoStatus = (promo: Promotion): { label: string; color: string; bg: string } => {
  if (!promo.is_active) {
    return { label: 'Paused', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' };
  }
  const now = new Date();
  if (promo.starts_at && new Date(promo.starts_at) > now) {
    return { label: 'Scheduled', color: 'text-tertiary', bg: 'bg-tertiary/10' };
  }
  if (promo.ends_at && new Date(promo.ends_at) < now) {
    return { label: 'Expired', color: 'text-error', bg: 'bg-error/10' };
  }
  return { label: 'Live', color: 'text-primary', bg: 'bg-primary/10' };
};

export default function PromotionsListPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
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

      const { data: promoData } = await supabase
        .from('promotions')
        .select('*')
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: false });

      setPromotions(promoData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePromoStatus = async (promo: Promotion) => {
    setActionLoading(promo.id);

    const { error } = await supabase
      .from('promotions')
      .update({ is_active: !promo.is_active })
      .eq('id', promo.id);

    if (!error) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, is_active: !p.is_active } : p))
      );
    }

    setActionLoading(null);
  };

  const deletePromo = async (promo: Promotion) => {
    if (!confirm(`Delete "${promo.title}"?`)) return;
    setActionLoading(promo.id);

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', promo.id);

    if (!error) {
      setPromotions((prev) => prev.filter((p) => p.id !== promo.id));
    }

    setActionLoading(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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

  const businessInitials = getInitials(business.legal_name);
  const livePromotions = promotions.filter(isPromoLive);
  const pausedPromotions = promotions.filter((p) => !p.is_active);
  const scheduledPromotions = promotions.filter(
    (p) => p.is_active && p.starts_at && new Date(p.starts_at) > new Date()
  );
  const expiredPromotions = promotions.filter(
    (p) => p.is_active && p.ends_at && new Date(p.ends_at) < new Date()
  );

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
        <h1 className="font-display text-lg font-bold text-primary">Promotions</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
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
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-2 font-label"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant mb-4">
          <button
            onClick={() => router.push('/vendor/marketing')}
            className="hover:text-primary transition-colors"
          >
            Marketing
          </button>
          <span>·</span>
          <span className="text-on-surface">Promotions</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              Promotions
            </h1>
            <p className="text-base text-on-surface-variant mt-2">
              Create time-limited deals to drive sales
            </p>
          </div>
          <button
            onClick={() => router.push('/vendor/marketing/promotions/new')}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-organic"
          >
            <Plus size={18} />
            New Promotion
          </button>
        </div>

        {/* Stats Summary */}
        {promotions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Live</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">
                {livePromotions.length}
              </p>
            </div>
            <div className="bg-tertiary/5 border border-tertiary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-tertiary mb-1">
                <Clock size={12} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Scheduled</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">
                {scheduledPromotions.length}
              </p>
            </div>
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-4">
              <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                <EyeOff size={12} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Paused</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">
                {pausedPromotions.length}
              </p>
            </div>
            <div className="bg-error/5 border border-error/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-error mb-1">
                <AlertCircle size={12} />
                <span className="text-xs font-label font-semibold uppercase tracking-wider">Expired</span>
              </div>
              <p className="font-display text-2xl font-bold text-on-surface">
                {expiredPromotions.length}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {promotions.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Tag size={28} />
            </div>
            <h3 className="font-display text-xl font-semibold text-on-surface mb-2">
              No promotions yet
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              Create your first promotion to drive orders. Deals appear prominently on your store page.
            </p>
            <button
              onClick={() => router.push('/vendor/marketing/promotions/new')}
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Create First Promotion
            </button>
          </div>
        ) : (
          /* Promotion List */
          <div className="space-y-3">
            {promotions.map((promo) => {
              const status = getPromoStatus(promo);
              const isLive = isPromoLive(promo);
              return (
                <div
                  key={promo.id}
                  className={`bg-surface-container-lowest border rounded-2xl p-5 transition-all ${
                    isLive ? 'border-primary/40 shadow-organic-sm' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{promo.emoji || '🎉'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display font-bold text-lg text-on-surface">
                            {promo.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        {promo.description && (
                          <p className="text-sm text-on-surface-variant">
                            {promo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price/Discount Display */}
                    <div className="text-right flex-shrink-0">
                      {promo.sale_price_cents ? (
                        <>
                          {promo.original_price_cents && (
                            <p className="text-xs text-on-surface-variant line-through">
                              {formatPrice(promo.original_price_cents, business.currency)}
                            </p>
                          )}
                          <p className="font-display text-xl font-bold text-primary">
                            {formatPrice(promo.sale_price_cents, business.currency)}
                          </p>
                        </>
                      ) : promo.discount_percentage ? (
                        <div className="bg-primary text-on-primary px-3 py-1 rounded-full text-sm font-bold">
                          {promo.discount_percentage}% OFF
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Dates */}
                  {(promo.starts_at || promo.ends_at) && (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
                      <Clock size={12} />
                      <span>
                        {promo.starts_at && promo.ends_at
                          ? `${formatDateShort(promo.starts_at)} - ${formatDateShort(promo.ends_at)}`
                          : promo.starts_at
                            ? `Starts ${formatDateShort(promo.starts_at)}`
                            : `Until ${formatDateShort(promo.ends_at!)}`}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-outline-variant">
                    <button
                      onClick={() => router.push(`/vendor/marketing/promotions/${promo.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg hover:border-primary hover:text-primary transition-colors font-label font-semibold text-xs uppercase tracking-wider"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => togglePromoStatus(promo)}
                      disabled={actionLoading === promo.id}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-label font-semibold text-xs uppercase tracking-wider transition-colors ${
                        promo.is_active
                          ? 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {actionLoading === promo.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : promo.is_active ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {promo.is_active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deletePromo(promo)}
                      disabled={actionLoading === promo.id}
                      className="flex items-center justify-center px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              How promotions work
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Active promotions appear prominently on your store page and can drive impulse orders. Set an end date to create urgency, or leave open-ended for ongoing deals.
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