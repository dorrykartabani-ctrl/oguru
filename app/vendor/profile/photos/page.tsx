'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
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

// Chip color palette
const chipColors = [
  { name: 'Sage Green', value: '#4a6410', class: 'bg-primary' },
  { name: 'Earth Brown', value: '#77574d', class: 'bg-secondary' },
  { name: 'Fire Orange', value: '#924700', class: 'bg-tertiary' },
  { name: 'Golden', value: '#c99700', class: 'bg-yellow-600' },
  { name: 'Sky Blue', value: '#2b6cb0', class: 'bg-blue-600' },
  { name: 'Deep Purple', value: '#6b46c1', class: 'bg-purple-600' },
];

// Get chip icon based on business type
const getChipIcon = (businessTypes: string[]) => {
  if (businessTypes.includes('Bakery')) return Croissant;
  if (businessTypes.includes('Juice')) return GlassWater;
  if (businessTypes.includes('Dessert')) return Cake;
  if (businessTypes.includes('Food Truck')) return Truck;
  if (businessTypes.includes('Café')) return Coffee;
  return Wheat;
};

export default function PhotosEditorPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const uploadImage = async (
    file: File,
    type: 'logo' | 'cover'
  ): Promise<string | null> => {
    if (!business) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return null;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vendor-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('vendor-photos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      return null;
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setLogoUploading(true);
    setError(null);

    const url = await uploadImage(file, 'logo');

    if (url) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ logo_url: url })
        .eq('id', business.id);

      if (!updateError) {
        setBusiness({ ...business, logo_url: url });
        showSavedIndicator();
      } else {
        setError(updateError.message);
      }
    }

    setLogoUploading(false);
    e.target.value = '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setCoverUploading(true);
    setError(null);

    const url = await uploadImage(file, 'cover');

    if (url) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ cover_url: url })
        .eq('id', business.id);

      if (!updateError) {
        setBusiness({ ...business, cover_url: url });
        showSavedIndicator();
      } else {
        setError(updateError.message);
      }
    }

    setCoverUploading(false);
    e.target.value = '';
  };

  const removeLogo = async () => {
    if (!business) return;
    setSaving(true);
    const { error } = await supabase
      .from('businesses')
      .update({ logo_url: null })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, logo_url: null });
      showSavedIndicator();
    }
    setSaving(false);
  };

  const removeCover = async () => {
    if (!business) return;
    setSaving(true);
    const { error } = await supabase
      .from('businesses')
      .update({ cover_url: null })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, cover_url: null });
      showSavedIndicator();
    }
    setSaving(false);
  };

  const selectChipColor = async (color: string) => {
    if (!business) return;
    setSaving(true);
    const { error } = await supabase
      .from('businesses')
      .update({ chip_color: color })
      .eq('id', business.id);

    if (!error) {
      setBusiness({ ...business, chip_color: color });
      showSavedIndicator();
    }
    setSaving(false);
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

  const ChipIcon = getChipIcon(business.business_types || []);
  const activeChipColor = business.chip_color || '#4a6410';

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

          {/* Saved indicator */}
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
            <Camera size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Photos & Identity
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            How your store appears to customers.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-error-container">
                Upload failed
              </p>
              <p className="text-sm text-on-error-container/80 mt-0.5">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-on-error-container/60 hover:text-on-error-container"
            >
              ✕
            </button>
          </div>
        )}

        {/* Logo Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Logo
            </h2>
            {business.logo_url && (
              <button
                onClick={removeLogo}
                disabled={saving}
                className="text-xs text-error hover:underline flex items-center gap-1 font-label"
              >
                <Trash2 size={12} />
                Remove
              </button>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-4">
            Square image works best. This appears next to your business name.
          </p>

          <div className="flex items-start gap-4">
            {/* Logo preview */}
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUploading ? (
                <Loader2 size={32} className="text-primary animate-spin" />
              ) : business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={32} className="text-outline-variant" />
              )}
            </div>

            {/* Upload button */}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="flex items-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                {business.logo_url ? 'Replace logo' : 'Upload logo'}
              </button>
              <p className="text-xs text-on-surface-variant mt-2">
                JPG, PNG, or WebP. Max 10MB.
              </p>
            </div>
          </div>
        </section>

        {/* Cover Photo Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Cover photo
            </h2>
            {business.cover_url && (
              <button
                onClick={removeCover}
                disabled={saving}
                className="text-xs text-error hover:underline flex items-center gap-1 font-label"
              >
                <Trash2 size={12} />
                Remove
              </button>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-4">
            Wide photo shown at the top of your store page.
          </p>

          <div className="relative w-full h-48 md:h-64 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest overflow-hidden flex items-center justify-center">
            {coverUploading ? (
              <Loader2 size={40} className="text-primary animate-spin" />
            ) : business.cover_url ? (
              <img
                src={business.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Camera size={40} className="text-outline-variant mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant">
                  No cover photo yet
                </p>
              </div>
            )}
          </div>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={coverUploading}
            className="mt-4 flex items-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <Upload size={16} />
            {business.cover_url ? 'Replace cover' : 'Upload cover'}
          </button>
          <p className="text-xs text-on-surface-variant mt-2">
            Landscape orientation works best. Max 10MB.
          </p>
        </section>

        {/* Chip Section */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-3">
            Your map chip
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            This icon marks your location on the map. Icon is assigned based on your business type. Choose a color to stand out.
          </p>

          {/* Chip preview */}
          <div className="flex items-center gap-4 mb-6 p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-organic-md"
              style={{ backgroundColor: activeChipColor }}
            >
              <ChipIcon size={28} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-on-surface">
                {business.legal_name}
              </p>
              <p className="text-sm text-on-surface-variant">
                Preview on map
              </p>
            </div>
          </div>

          {/* Color picker */}
          <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Choose your color
          </p>
          <div className="grid grid-cols-6 gap-3">
            {chipColors.map((color) => {
              const isActive = business.chip_color === color.value;
              return (
                <button
                  key={color.value}
                  onClick={() => selectChipColor(color.value)}
                  disabled={saving}
                  className={`aspect-square rounded-full ${color.class} shadow-organic-sm transition-all hover:scale-110 active:scale-95 ${
                    isActive ? 'ring-4 ring-offset-2 ring-primary/40' : ''
                  }`}
                  title={color.name}
                >
                  {isActive && (
                    <Check size={20} className="text-white mx-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {!business.business_types?.length && (
            <p className="text-xs text-on-surface-variant mt-4 italic">
              Tip: Set your business type in the &quot;About&quot; section to customize your icon.
            </p>
          )}
        </section>
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
