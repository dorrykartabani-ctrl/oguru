'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/supabase/types';
import {
  ArrowLeft,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  Coffee,
  Croissant,
  GlassWater,
  Cake,
  Truck,
  Wheat,
} from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'Café', icon: Coffee, description: 'Coffee & drinks' },
  { value: 'Bakery', icon: Croissant, description: 'Bread & pastries' },
  { value: 'Juice', icon: GlassWater, description: 'Juice & smoothies' },
  { value: 'Dessert', icon: Cake, description: 'Sweet treats' },
  { value: 'Food Truck', icon: Truck, description: 'Mobile vendor' },
  { value: 'Other', icon: Wheat, description: 'Something else' },
];

const TAGLINE_MAX = 60;
const DESCRIPTION_MAX = 500;

export default function AboutEditorPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (local)
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  // Debounce timers
  const taglineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!data) {
        router.push('/vendor/apply');
        return;
      }

      if (data.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(data);
      setTagline(data.tagline || '');
      setDescription(data.description || '');
      setBusinessTypes(data.business_types || []);
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

  const saveTagline = async (value: string) => {
    if (!business) return;
    const { error } = await supabase
      .from('businesses')
      .update({ tagline: value || null })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, tagline: value || null });
      showSavedIndicator();
    } else {
      setError(error.message);
    }
  };

  const saveDescription = async (value: string) => {
    if (!business) return;
    const { error } = await supabase
      .from('businesses')
      .update({ description: value || null })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, description: value || null });
      showSavedIndicator();
    } else {
      setError(error.message);
    }
  };

  const saveBusinessTypes = async (types: string[]) => {
    if (!business) return;
    const { error } = await supabase
      .from('businesses')
      .update({ business_types: types })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, business_types: types });
      showSavedIndicator();
    } else {
      setError(error.message);
    }
  };

  const handleTaglineChange = (value: string) => {
    setTagline(value);
    if (taglineTimerRef.current) clearTimeout(taglineTimerRef.current);
    taglineTimerRef.current = setTimeout(() => saveTagline(value), 800);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
    descriptionTimerRef.current = setTimeout(() => saveDescription(value), 800);
  };

  const toggleBusinessType = (type: string) => {
    const newTypes = businessTypes.includes(type)
      ? businessTypes.filter((t) => t !== type)
      : [...businessTypes, type];
    setBusinessTypes(newTypes);
    saveBusinessTypes(newTypes);
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

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/dashboard')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to dashboard</span>
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
            <FileText size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            About Your Business
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Help customers understand what makes you special.
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

        {/* Business Types */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-1">
            What kind of business are you?
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Pick one or more. This sets your icon on the customer map.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = businessTypes.includes(type.value);
              return (
                <button
                  key={type.value}
                  onClick={() => toggleBusinessType(type.value)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p
                    className={`font-display font-semibold text-sm ${
                      isSelected ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {type.value}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>

          {businessTypes.length > 0 && (
            <p className="text-xs text-on-surface-variant mt-3 italic">
              Your chip icon will show as:{' '}
              <strong className="text-primary">
                {businessTypes[0]} icon
              </strong>{' '}
              on the map.
            </p>
          )}
        </section>

        {/* Tagline */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Tagline
            </h2>
            <span className="text-xs text-on-surface-variant">
              {tagline.length}/{TAGLINE_MAX}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mb-3">
            One line that captures what you&apos;re about.
          </p>

          <input
            type="text"
            value={tagline}
            onChange={(e) => handleTaglineChange(e.target.value.slice(0, TAGLINE_MAX))}
            placeholder="e.g., Sydney's freshest hand-crafted coffee"
            className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />

          <p className="text-xs text-on-surface-variant mt-2">
            💡 Tip: Keep it short and memorable. This appears on your card in
            search results.
          </p>
        </section>

        {/* Description */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              About your business
            </h2>
            <span
              className={`text-xs ${
                description.length < 20
                  ? 'text-tertiary'
                  : 'text-on-surface-variant'
              }`}
            >
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mb-3">
            Tell customers your story. What do you do? What makes you unique?
          </p>

          <textarea
            value={description}
            onChange={(e) =>
              handleDescriptionChange(e.target.value.slice(0, DESCRIPTION_MAX))
            }
            rows={6}
            placeholder="Founded in 2020, we're passionate about ethically sourced beans from small farmers around the world..."
            className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />

          {description.length > 0 && description.length < 20 && (
            <p className="text-xs text-tertiary mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              Write at least 20 characters to complete this section
            </p>
          )}

          <p className="text-xs text-on-surface-variant mt-2">
            💡 Tip: Mention your specialty, your values, or your history. This
            builds trust with new customers.
          </p>
        </section>

        {/* Completion status */}
        <div className="mt-10 p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              businessTypes.length > 0 &&
              tagline &&
              description &&
              description.length >= 20
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {businessTypes.length > 0 &&
            tagline &&
            description &&
            description.length >= 20 ? (
              <Check size={20} />
            ) : (
              <FileText size={18} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-on-surface">
              {businessTypes.length > 0 &&
              tagline &&
              description &&
              description.length >= 20
                ? 'Section complete!'
                : 'Keep going...'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {businessTypes.length === 0 && '• Pick at least one business type'}
              {businessTypes.length > 0 && !tagline && '• Add a tagline'}
              {businessTypes.length > 0 &&
                tagline &&
                (!description || description.length < 20) &&
                '• Write a description (20+ characters)'}
              {businessTypes.length > 0 &&
                tagline &&
                description &&
                description.length >= 20 &&
                'All fields filled in nicely'}
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Changes auto-save · Back to dashboard when done
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
