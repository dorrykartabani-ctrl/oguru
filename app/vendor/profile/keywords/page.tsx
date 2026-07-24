'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, VendorKeyword } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Tag,
  Loader2,
  Check,
  AlertCircle,
  X,
  Plus,
  Search,
  UtensilsCrossed,
  Leaf,
  Heart,
  Sparkles,
  Info,
} from 'lucide-react';

type KeywordCategory = 'cuisine' | 'dietary' | 'vibe' | 'features';

const CATEGORIES: {
  value: KeywordCategory;
  label: string;
  icon: typeof UtensilsCrossed;
  description: string;
}[] = [
  {
    value: 'cuisine',
    label: 'Cuisine',
    icon: UtensilsCrossed,
    description: 'What you serve',
  },
  {
    value: 'dietary',
    label: 'Dietary',
    icon: Leaf,
    description: 'Who you cater to',
  },
  {
    value: 'vibe',
    label: 'Vibe',
    icon: Heart,
    description: 'Your atmosphere',
  },
  {
    value: 'features',
    label: 'Features',
    icon: Sparkles,
    description: 'What you offer',
  },
];

// Suggested keywords per category
const SUGGESTED_KEYWORDS: Record<KeywordCategory, string[]> = {
  cuisine: [
    'coffee',
    'specialty coffee',
    'espresso',
    'matcha',
    'tea',
    'chai',
    'smoothies',
    'juices',
    'cold-brew',
    'pastries',
    'sourdough',
    'sandwiches',
    'salads',
    'brunch',
    'breakfast',
    'cakes',
    'donuts',
    'ice-cream',
    'chocolate',
    'wine',
    'craft-beer',
  ],
  dietary: [
    'vegan',
    'vegetarian',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'sugar-free',
    'keto-friendly',
    'organic',
    'plant-based',
    'halal',
    'kosher',
    'raw',
    'paleo',
  ],
  vibe: [
    'cozy',
    'quiet',
    'lively',
    'study-friendly',
    'work-friendly',
    'family-friendly',
    'kid-friendly',
    'date-night',
    'romantic',
    'trendy',
    'artisanal',
    'rustic',
    'modern',
    'minimalist',
    'instagrammable',
    'hidden-gem',
    'local-favorite',
  ],
  features: [
    'wifi',
    'outdoor-seating',
    'dog-friendly',
    'pet-friendly',
    'takeaway',
    'delivery',
    'catering',
    'events',
    'parking',
    'wheelchair-accessible',
    'kid-menu',
    'high-chairs',
    'gift-vouchers',
    'loyalty-program',
    'live-music',
    'open-late',
  ],
};

// Suggestions based on business type
const BUSINESS_TYPE_SUGGESTIONS: Record<string, Partial<Record<KeywordCategory, string[]>>> = {
  Café: {
    cuisine: ['coffee', 'specialty coffee', 'espresso', 'pastries', 'sandwiches'],
    vibe: ['cozy', 'work-friendly', 'study-friendly'],
    features: ['wifi', 'takeaway'],
  },
  Bakery: {
    cuisine: ['pastries', 'sourdough', 'cakes', 'donuts'],
    dietary: ['vegetarian'],
    features: ['takeaway', 'catering'],
  },
  Juice: {
    cuisine: ['smoothies', 'juices', 'cold-brew'],
    dietary: ['vegan', 'organic', 'plant-based', 'gluten-free'],
    features: ['takeaway'],
  },
  Dessert: {
    cuisine: ['cakes', 'ice-cream', 'chocolate'],
    vibe: ['family-friendly', 'trendy'],
    features: ['takeaway'],
  },
  'Food Truck': {
    features: ['takeaway', 'events'],
    vibe: ['lively'],
  },
};

export default function KeywordsEditor() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [keywords, setKeywords] = useState<VendorKeyword[]>([]);
  const [activeCategory, setActiveCategory] = useState<KeywordCategory>('cuisine');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { data: keywordsData } = await supabase
        .from('vendor_keywords')
        .select('*')
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: true });

      setKeywords(keywordsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSavedIndicator = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const addKeyword = async (keyword: string, category: KeywordCategory) => {
    if (!business) return;

    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;

    // Check for duplicate
    if (keywords.some((k) => k.keyword.toLowerCase() === trimmed)) {
      return;
    }

    setSaving(true);

    const { data, error: insertError } = await supabase
      .from('vendor_keywords')
      .insert({
        business_id: business.id,
        keyword: trimmed,
        category,
      })
      .select()
      .single();

    if (!insertError && data) {
      setKeywords([...keywords, data]);
      showSavedIndicator();
    } else if (insertError) {
      setError(insertError.message);
    }

    setSaving(false);
  };

  const removeKeyword = async (keywordId: string) => {
    setSaving(true);

    const { error: deleteError } = await supabase
      .from('vendor_keywords')
      .delete()
      .eq('id', keywordId);

    if (!deleteError) {
      setKeywords(keywords.filter((k) => k.id !== keywordId));
      showSavedIndicator();
    } else {
      setError(deleteError.message);
    }

    setSaving(false);
  };

  const addCustomKeyword = async () => {
    if (!customInput.trim()) return;
    await addKeyword(customInput, activeCategory);
    setCustomInput('');
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

  const totalKeywords = keywords.length;
  const isComplete = totalKeywords >= 3;
  const activeCategoryConfig = CATEGORIES.find((c) => c.value === activeCategory)!;

  // Get suggestions for active category
  const allSuggestions = SUGGESTED_KEYWORDS[activeCategory];
  const businessTypeSuggestions = business.business_types
    .flatMap((type) => BUSINESS_TYPE_SUGGESTIONS[type]?.[activeCategory] || [])
    .filter((v, i, arr) => arr.indexOf(v) === i);

  // Filter suggestions
  const filteredSuggestions = allSuggestions.filter((s) => {
    if (searchQuery && !s.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Hide already-added
    return !keywords.some(
      (k) => k.keyword.toLowerCase() === s.toLowerCase()
    );
  });

  // Keywords in active category
  const categoryKeywords = keywords.filter((k) => k.category === activeCategory);

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/settings')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to settings</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 text-sm min-w-[80px] justify-end">
            {savedIndicator && (
              <span className="flex items-center gap-1.5 text-primary font-semibold text-xs animate-fade-in">
                <Check size={14} />
                Saved
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Tag size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Keywords
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Help customers discover you. We match customers to vendors based on
            these keywords.
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

        {/* Your keywords (all categories) */}
        {keywords.length > 0 && (
          <section className="mb-6 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold text-sm text-on-surface">
                Your keywords ({totalKeywords})
              </p>
              {totalKeywords >= 3 && (
                <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <Check size={12} />
                  Good to go
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-full text-xs font-label font-semibold"
                >
                  {kw.keyword}
                  <button
                    onClick={() => removeKeyword(kw.id)}
                    disabled={saving}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Category Tabs */}
        <section className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.value;
              const count = keywords.filter((k) => k.category === cat.value)
                .length;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    {count > 0 && (
                      <span
                        className={`text-xs font-bold ${
                          isActive ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                  <p
                    className={`font-display font-semibold text-sm ${
                      isActive ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Category-specific content */}
        <section className="mb-8">
          {/* Suggested for your business type */}
          {businessTypeSuggestions.length > 0 && (
            <div className="mb-5 p-4 bg-secondary-container/40 border border-secondary/20 rounded-xl">
              <p className="text-xs font-label font-semibold text-on-secondary-container uppercase tracking-wider mb-3">
                💡 Recommended for {business.business_types.join(', ')}
              </p>
              <div className="flex flex-wrap gap-2">
                {businessTypeSuggestions.map((suggestion) => {
                  const isAdded = keywords.some(
                    (k) =>
                      k.keyword.toLowerCase() === suggestion.toLowerCase()
                  );
                  if (isAdded) return null;
                  return (
                    <button
                      key={suggestion}
                      onClick={() => addKeyword(suggestion, activeCategory)}
                      disabled={saving}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-secondary/30 hover:border-secondary hover:bg-secondary/10 rounded-full text-xs font-semibold text-on-secondary-container transition-colors"
                    >
                      <Plus size={12} />
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeCategoryConfig.label.toLowerCase()} keywords...`}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* All suggestions in category */}
          <div className="mb-5">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              {activeCategoryConfig.label} keywords
            </p>
            {filteredSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addKeyword(suggestion, activeCategory)}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant hover:border-primary/40 hover:bg-primary/5 rounded-full text-xs font-semibold text-on-surface transition-colors"
                  >
                    <Plus size={12} className="text-primary" />
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                {searchQuery
                  ? 'No suggestions match your search. Try adding a custom keyword below.'
                  : 'All suggestions in this category have been added.'}
              </p>
            )}
          </div>

          {/* Custom keyword input */}
          <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Add custom keyword
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomKeyword();
                  }
                }}
                placeholder="e.g., artisanal, homemade..."
                className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={addCustomKeyword}
                disabled={saving || !customInput.trim()}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Category keyword pills (in current category only) */}
        {categoryKeywords.length > 0 && (
          <section className="mb-8">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Your {activeCategoryConfig.label.toLowerCase()} keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {categoryKeywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary"
                >
                  {kw.keyword}
                  <button
                    onClick={() => removeKeyword(kw.id)}
                    disabled={saving}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Tip card */}
        <div className="mb-6 p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <Info size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              How keywords help you
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Customers add their preferences (like &ldquo;vegan&rdquo;,
              &ldquo;study-friendly&rdquo;). OGuru matches them to vendors with
              similar keywords. More relevant keywords = more matching customers.
            </p>
          </div>
        </div>

        {/* Completion status */}
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isComplete
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {isComplete ? <Check size={20} /> : <Tag size={18} />}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-on-surface">
              {isComplete
                ? 'Section complete!'
                : `Add ${3 - totalKeywords} more keyword${
                    3 - totalKeywords === 1 ? '' : 's'
                  } to complete`}
            </p>
            <p className="text-xs text-on-surface-variant">
              {isComplete
                ? `${totalKeywords} keywords help match you to customers`
                : `${totalKeywords} of 3 minimum added`}
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Changes auto-save · Back to settings when done
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}