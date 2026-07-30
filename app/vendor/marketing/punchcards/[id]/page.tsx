'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, Punchcard, Product } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Trash2,
  CreditCard,
  Search,
} from 'lucide-react';

const EMOJI_OPTIONS = ['🎟️', '☕', '🥐', '🍕', '🍔', '🍰', '🥗', '🍜', '🥤', '🧊', '⭐', '🔥', '🎁', '👑'];

export default function PunchcardEditorPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const cardId = params.id as string;
  const isNew = cardId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎟️');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [punchesRequired, setPunchesRequired] = useState('8');
  const [rewardDescription, setRewardDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadData();
  }, [cardId]);

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

      if (locationData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('location_id', locationData.id)
          .eq('is_available', true)
          .order('sort_order', { ascending: true });
        setProducts(productsData || []);
      }

      if (!isNew) {
        const { data: cardData, error: cardError } = await supabase
          .from('punchcards')
          .select('*')
          .eq('id', cardId)
          .single();

        if (cardError || !cardData) {
          router.push('/vendor/marketing/punchcards');
          return;
        }

        setTitle(cardData.title);
        setDescription(cardData.description || '');
        setEmoji(cardData.emoji || '🎟️');
        setSelectedProductIds(cardData.eligible_product_ids || []);
        setPunchesRequired(String(cardData.punches_required));
        setRewardDescription(cardData.reward_description);
        setIsActive(cardData.is_active);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleCategory = (categoryProductIds: string[]) => {
    const allSelected = categoryProductIds.every((id) => selectedProductIds.includes(id));
    setSelectedProductIds((prev) =>
      allSelected
        ? prev.filter((id) => !categoryProductIds.includes(id))
        : Array.from(new Set([...prev, ...categoryProductIds]))
    );
  };

  const validate = (): string | null => {
    if (!title.trim()) return 'Title is required';
    const punches = parseInt(punchesRequired, 10);
    if (isNaN(punches) || punches < 2) return 'Punches required must be at least 2';
    if (punches > 50) return 'Punches required must be 50 or fewer';
    if (!rewardDescription.trim()) return 'Describe the reward customers get';
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
      if (!business) throw new Error('Business data missing');

      const cardData = {
        business_id: business.id,
        location_id: location?.id || null,
        title: title.trim(),
        description: description.trim() || null,
        eligible_product_ids: selectedProductIds,
        punches_required: parseInt(punchesRequired, 10),
        reward_description: rewardDescription.trim(),
        emoji,
        is_active: isActive,
      };

      if (isNew) {
        const { error: insertError } = await supabase.from('punchcards').insert(cardData);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('punchcards')
          .update(cardData)
          .eq('id', cardId);
        if (updateError) throw updateError;
      }

      router.push('/vendor/marketing/punchcards');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setError(message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This will also remove all customer progress on this card.`)) return;
    setDeleting(true);

    const { error: deleteError } = await supabase.from('punchcards').delete().eq('id', cardId);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
    } else {
      router.push('/vendor/marketing/punchcards');
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

  const inputClass =
    'w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

  const labelClass =
    'block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider';

  const punchesNum = parseInt(punchesRequired, 10) || 0;

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/marketing/punchcards')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to punchcards</span>
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
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <CreditCard size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            {isNew ? 'New Punchcard' : 'Edit Punchcard'}
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            {isNew ? 'Reward customers for coming back' : 'Update your punchcard details'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-on-error-container/60 hover:text-on-error-container">
              ✕
            </button>
          </div>
        )}

        {/* Live Preview */}
        {title && rewardDescription && (
          <div className="mb-8">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Preview
            </p>
            <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-5 shadow-organic-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{emoji}</span>
                <h3 className="font-display text-lg font-bold">{title}</h3>
              </div>
              {description && <p className="text-sm opacity-90 mb-3">{description}</p>}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {Array.from({ length: punchesNum || 0 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-on-primary/40 flex items-center justify-center text-xs"
                  >
                    {i === 0 ? emoji : ''}
                  </div>
                ))}
              </div>
              <p className="text-xs opacity-90">
                Buy {punchesNum || '?'}, get {rewardDescription.toLowerCase()}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {selectedProductIds.length > 0
                  ? `Applies to: ${selectedProductIds
                      .map((id) => products.find((p) => p.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')}`
                  : 'Applies to any item'}
              </p>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 text-center italic">
              This is how customers will see your punchcard
            </p>
          </div>
        )}

        <div className="space-y-6">
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
              placeholder="e.g., Coffee Lovers Card"
              maxLength={60}
              className={inputClass}
            />
            <p className="text-xs text-on-surface-variant mt-1.5 ml-1">{title.length}/60 characters</p>
          </section>

          {/* Description */}
          <section>
            <label className={labelClass}>
              Description{' '}
              <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., For our regulars who can't get enough coffee"
              rows={2}
              maxLength={150}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-on-surface-variant mt-1.5 ml-1">{description.length}/150 characters</p>
          </section>

          {/* Eligible items */}
          <section>
            <label className={labelClass}>
              Which menu items count?{' '}
              <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
                (leave none selected for "any item")
              </span>
            </label>

            {selectedProductIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedProductIds.map((id) => {
                  const p = products.find((prod) => prod.id === id);
                  if (!p) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={() => toggleProduct(id)}
                        className="hover:text-error"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {products.length === 0 ? (
              <p className="text-sm text-on-surface-variant p-4 bg-surface-container-low rounded-xl">
                No menu items found yet — add some in Menu first, or leave this card open to any item.
              </p>
            ) : (
              <>
                {products.length > 6 && (
                  <div className="relative mb-3">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search menu items"
                      className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                  {Object.entries(
                    products
                      .filter((p) => p.name.toLowerCase().includes(productSearch.trim().toLowerCase()))
                      .reduce<Record<string, Product[]>>((acc, p) => {
                        acc[p.category] = acc[p.category] || [];
                        acc[p.category].push(p);
                        return acc;
                      }, {})
                  ).map(([category, items]) => {
                    const categoryIds = items.map((p) => p.id);
                    const allSelected = categoryIds.every((id) => selectedProductIds.includes(id));
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                            {category}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleCategory(categoryIds)}
                            className="text-xs font-label font-semibold text-primary hover:underline"
                          >
                            {allSelected ? 'Deselect all' : 'Select all'}
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {items.map((product) => {
                            const isSelected = selectedProductIds.includes(product.id);
                            return (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-colors text-left ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                                }`}
                              >
                                <span className="text-sm text-on-surface">{product.name}</span>
                                <div
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected ? 'bg-primary border-primary' : 'border-outline-variant'
                                  }`}
                                >
                                  {isSelected && <Check size={12} className="text-on-primary" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* Punches required + reward */}
          <section>
            <label className={labelClass}>Reward</label>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-2">Punches needed</p>
                <input
                  type="number"
                  min={2}
                  max={50}
                  value={punchesRequired}
                  onChange={(e) => setPunchesRequired(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <p className="text-xs text-primary font-semibold mb-2">Reward *</p>
                <input
                  type="text"
                  value={rewardDescription}
                  onChange={(e) => setRewardDescription(e.target.value)}
                  placeholder="e.g., 1 free coffee"
                  maxLength={80}
                  className={`${inputClass} border-primary/40`}
                />
              </div>
            </div>
          </section>

          {/* Active Toggle */}
          <section className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-display font-semibold text-on-surface">Active</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isActive ? 'Visible on your store page' : 'Paused — not shown to customers'}
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
            onClick={() => router.push('/vendor/marketing/punchcards')}
            className="px-6 py-3 border-2 border-outline-variant text-on-surface rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || deleting || !title || !rewardDescription}
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
                {isNew ? 'Create Punchcard' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
