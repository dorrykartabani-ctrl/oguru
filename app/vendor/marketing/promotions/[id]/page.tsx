'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, Promotion, PromotionType } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertCircle,
  Check,
  Trash2,
  Clock,
  DollarSign,
  Package,
} from 'lucide-react';

const EMOJI_OPTIONS = ['🎉', '🔥', '⭐', '💰', '🍕', '🍔', '☕', '🥐', '🎁', '🎂', '🍰', '🥗', '🍜', '🥤', '🧊', '✨', '🌟', '💎', '👑', '🎊'];

const PROMOTION_TYPES: {
  value: PromotionType;
  label: string;
  description: string;
  icon: typeof DollarSign;
}[] = [
  {
    value: 'fixed_amount',
    label: 'Fixed Price Deal',
    description: 'Set a special price (e.g., "Cheeseburger Meal $4.95")',
    icon: DollarSign,
  },
  {
    value: 'bundle',
    label: 'Bundle Deal',
    description: 'Combo pricing (e.g., "Coffee + Muffin $8")',
    icon: Package,
  },
];

export default function PromotionEditorPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-primary animate-spin mb-4" />
          <p className="text-on-surface-variant">Loading...</p>
        </main>
      }
    >
      <PromotionEditorInner />
    </Suspense>
  );
}

function PromotionEditorInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const promoId = params.id as string;
  const isNew = promoId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎉');
  const [promotionType, setPromotionType] = useState<PromotionType>('fixed_amount');
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadData();
  }, [promoId]);

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

      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      setLocation(locationData);

      // Load existing promo if editing
      if (!isNew) {
        const { data: promoData, error: promoError } = await supabase
          .from('promotions')
          .select('*')
          .eq('id', promoId)
          .single();

        if (promoError || !promoData) {
          router.push('/vendor/marketing/promotions');
          return;
        }

        setTitle(promoData.title);
        setDescription(promoData.description || '');
        setEmoji(promoData.emoji || '🎉');
        setPromotionType(promoData.promotion_type);
        setOriginalPrice(
          promoData.original_price_cents
            ? (promoData.original_price_cents / 100).toFixed(2)
            : ''
        );
        setSalePrice(
          promoData.sale_price_cents ? (promoData.sale_price_cents / 100).toFixed(2) : ''
        );
        setStartsAt(promoData.starts_at ? promoData.starts_at.substring(0, 16) : '');
        setEndsAt(promoData.ends_at ? promoData.ends_at.substring(0, 16) : '');
        setIsActive(promoData.is_active);
      } else {
        // Prefill from AI-generated offer, if passed via query params
        // (e.g. from the AI Campaign Generator's "Create Promotion" button)
        const prefillTitle = searchParams.get('title');
        const prefillDescription = searchParams.get('description');
        const prefillEmoji = searchParams.get('emoji');

        if (prefillTitle) setTitle(prefillTitle);
        if (prefillDescription) setDescription(prefillDescription);
        if (prefillEmoji) setEmoji(prefillEmoji);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = (): string | null => {
    if (!title.trim()) return 'Title is required';
    if (!salePrice.trim()) return 'Sale price is required';
    const salePriceNum = parseFloat(salePrice);
    if (isNaN(salePriceNum) || salePriceNum <= 0) return 'Sale price must be a valid number';
    if (originalPrice) {
      const originalPriceNum = parseFloat(originalPrice);
      if (isNaN(originalPriceNum) || originalPriceNum <= 0) return 'Original price must be valid';
      if (originalPriceNum <= salePriceNum) return 'Original price must be higher than sale price';
    }
    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      return 'End date must be after start date';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSaving(true);

    try {
      if (!business || !location) throw new Error('Business data missing');

      const promoData = {
        business_id: business.id,
        location_id: location.id,
        title: title.trim(),
        description: description.trim() || null,
        emoji,
        promotion_type: promotionType,
        original_price_cents: originalPrice ? Math.round(parseFloat(originalPrice) * 100) : null,
        sale_price_cents: Math.round(parseFloat(salePrice) * 100),
        discount_percentage: null,
        discount_amount_cents:
          originalPrice
            ? Math.round(parseFloat(originalPrice) * 100) - Math.round(parseFloat(salePrice) * 100)
            : null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        is_active: isActive,
      };

      if (isNew) {
        const { error: insertError } = await supabase
          .from('promotions')
          .insert(promoData);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('promotions')
          .update(promoData)
          .eq('id', promoId);
        if (updateError) throw updateError;
      }

      router.push('/vendor/marketing/promotions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setError(message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(true);

    const { error: deleteError } = await supabase
      .from('promotions')
      .delete()
      .eq('id', promoId);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
    } else {
      router.push('/vendor/marketing/promotions');
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

  // Calculate savings
  const savingsAmount =
    originalPrice && salePrice
      ? parseFloat(originalPrice) - parseFloat(salePrice)
      : 0;
  const savingsPercent =
    originalPrice && salePrice
      ? Math.round(((parseFloat(originalPrice) - parseFloat(salePrice)) / parseFloat(originalPrice)) * 100)
      : 0;

  const inputClass =
    'w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

  const labelClass =
    'block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider';

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/marketing/promotions')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to promotions</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                onClick={handleDelete}
                disabled={deleting || saving}
                className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10 rounded-lg font-label font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || deleting}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 md:px-6 py-2 rounded-xl font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  {isNew ? 'Create' : 'Save'}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Sparkles size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            {isNew ? 'New Promotion' : 'Edit Promotion'}
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            {isNew
              ? 'Create a deal to drive customer orders'
              : 'Update your promotion details'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-on-error-container/60 hover:text-on-error-container"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Preview */}
        {title && salePrice && (
          <div className="mb-8">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Preview
            </p>
            <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-5 shadow-organic-md">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{emoji}</span>
                    <h3 className="font-display text-lg font-bold">{title}</h3>
                  </div>
                  {description && (
                    <p className="text-sm opacity-90">{description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {originalPrice && (
                    <p className="text-xs opacity-70 line-through">
                      ${parseFloat(originalPrice).toFixed(2)}
                    </p>
                  )}
                  <p className="font-display text-xl font-bold">
                    ${parseFloat(salePrice).toFixed(2)}
                  </p>
                </div>
              </div>
              {savingsAmount > 0 && (
                <p className="text-xs opacity-90 mt-2">
                  Save ${savingsAmount.toFixed(2)} ({savingsPercent}% off)
                </p>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-2 text-center italic">
              This is how customers will see your promotion
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Promotion Type */}
          <section>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROMOTION_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = promotionType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setPromotionType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <p
                      className={`font-display font-semibold ${
                        isSelected ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {type.label}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Emoji */}
          <section>
            <label className={labelClass}>Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEmoji(option)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    emoji === option
                      ? 'bg-primary/10 border-2 border-primary scale-110'
                      : 'bg-surface-container-lowest border-2 border-outline-variant hover:border-primary/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          {/* Title */}
          <section>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cheeseburger Meal Deal"
              maxLength={60}
              className={inputClass}
            />
            <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
              {title.length}/60 characters
            </p>
          </section>

          {/* Description */}
          <section>
            <label className={labelClass}>
              Description{' '}
              <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Includes fries and a drink. Available all week!"
              rows={2}
              maxLength={150}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
              {description.length}/150 characters
            </p>
          </section>

          {/* Pricing */}
          <section>
            <label className={labelClass}>Pricing</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-2">
                  Original price{' '}
                  <span className="italic">(optional)</span>
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="12.50"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-primary font-semibold mb-2">
                  Sale price *
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="4.95"
                    className={`${inputClass} pl-8 border-primary/40`}
                  />
                </div>
              </div>
            </div>
            {savingsAmount > 0 && (
              <p className="text-xs text-primary mt-2 font-semibold">
                💰 Customers save ${savingsAmount.toFixed(2)} ({savingsPercent}% off)
              </p>
            )}
          </section>

          {/* Dates */}
          <section>
            <label className={labelClass}>
              Duration{' '}
              <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
                (optional)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-2">Start</p>
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-2">End</p>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 flex items-start gap-1.5">
              <Clock size={12} className="mt-0.5 flex-shrink-0" />
              Leave blank for ongoing promotion. Set an end date to create urgency.
            </p>
          </section>

          {/* Active Toggle */}
          <section className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-display font-semibold text-on-surface">
                  Active
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isActive
                    ? 'Visible on your store page'
                    : 'Paused — not shown to customers'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                    isActive ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </section>
        </div>

        {/* Bottom Save */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={() => router.push('/vendor/marketing/promotions')}
            className="px-6 py-3 border-2 border-outline-variant text-on-surface rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || deleting || !title || !salePrice}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-organic disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={18} />
                {isNew ? 'Create Promotion' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
