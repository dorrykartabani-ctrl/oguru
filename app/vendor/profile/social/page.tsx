'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Share2,
  Loader2,
  Check,
  AlertCircle,
  Instagram,
  Facebook,
  Globe,
  Music2,
  ExternalLink,
  Info,
} from 'lucide-react';

// Helper to clean handle (remove @ if user types it)
const cleanHandle = (input: string): string => {
  return input.replace(/^@/, '').trim();
};

// Helper to ensure URL has https://
const ensureHttps = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

// Validate handle (letters, numbers, dots, underscores)
const isValidHandle = (handle: string): boolean => {
  if (!handle) return true; // Empty is OK
  return /^[a-zA-Z0-9._]+$/.test(handle);
};

// Validate URL
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty is OK
  try {
    new URL(ensureHttps(url));
    return true;
  } catch {
    return false;
  }
};

export default function SocialEditor() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for each field
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');

  // Debounce timers
  const timers = useRef<Record<string, NodeJS.Timeout>>({});

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

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!data || data.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(data);
      setInstagram(data.instagram_handle || '');
      setFacebook(data.facebook_url || '');
      setTiktok(data.tiktok_handle || '');
      setWebsite(data.website_url || '');
      setGoogleBusiness(data.google_business_url || '');
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

  const saveField = async (field: string, value: string | null) => {
    if (!business) return;

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ [field]: value || null })
      .eq('id', business.id);

    if (!updateError) {
      setBusiness({ ...business, [field]: value || null } as Business);
      showSavedIndicator();
    } else {
      setError(updateError.message);
    }
  };

  const debounceSave = (field: string, value: string | null) => {
    if (timers.current[field]) {
      clearTimeout(timers.current[field]);
    }
    timers.current[field] = setTimeout(() => {
      saveField(field, value);
    }, 800);
  };

  const handleInstagramChange = (value: string) => {
    const cleaned = cleanHandle(value);
    setInstagram(cleaned);
    if (isValidHandle(cleaned)) {
      debounceSave('instagram_handle', cleaned);
    }
  };

  const handleTiktokChange = (value: string) => {
    const cleaned = cleanHandle(value);
    setTiktok(cleaned);
    if (isValidHandle(cleaned)) {
      debounceSave('tiktok_handle', cleaned);
    }
  };

  const handleFacebookChange = (value: string) => {
    setFacebook(value);
    if (isValidUrl(value)) {
      const url = value ? ensureHttps(value) : '';
      debounceSave('facebook_url', url);
    }
  };

  const handleWebsiteChange = (value: string) => {
    setWebsite(value);
    if (isValidUrl(value)) {
      const url = value ? ensureHttps(value) : '';
      debounceSave('website_url', url);
    }
  };

  const handleGoogleBusinessChange = (value: string) => {
    setGoogleBusiness(value);
    if (isValidUrl(value)) {
      const url = value ? ensureHttps(value) : '';
      debounceSave('google_business_url', url);
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

  // Count filled fields (all optional)
  const filledCount = [
    instagram,
    facebook,
    tiktok,
    website,
    googleBusiness,
  ].filter(Boolean).length;

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
            <Share2 size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Social & Web
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Connect your online presence so customers can follow you across platforms.
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

        {/* Info Card */}
        <div className="mb-6 p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <Info size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              We don&apos;t use in-app reviews
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Customers can leave reviews on your Google, Facebook, or Instagram — link them here so customers can find you.
            </p>
          </div>
        </div>

        {/* Instagram */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white">
              <Instagram size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold text-on-surface">
                Instagram
              </h2>
              <p className="text-xs text-on-surface-variant">
                Your @handle (without the @)
              </p>
            </div>
            {instagram && isValidHandle(instagram) && (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="View profile"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              @
            </span>
            <input
              type="text"
              value={instagram}
              onChange={(e) => handleInstagramChange(e.target.value)}
              placeholder="yourbusinessname"
              className={`w-full pl-8 pr-4 py-3 bg-surface-container-lowest border rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                instagram && !isValidHandle(instagram)
                  ? 'border-error'
                  : 'border-outline-variant focus:border-primary'
              }`}
            />
          </div>
          {instagram && !isValidHandle(instagram) && (
            <p className="text-xs text-error mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              Use only letters, numbers, dots, and underscores
            </p>
          )}
        </section>

        {/* Facebook */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Facebook size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold text-on-surface">
                Facebook Page
              </h2>
              <p className="text-xs text-on-surface-variant">
                Full URL to your page
              </p>
            </div>
            {facebook && isValidUrl(facebook) && (
              <a
                href={ensureHttps(facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="Visit page"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <input
            type="url"
            value={facebook}
            onChange={(e) => handleFacebookChange(e.target.value)}
            placeholder="facebook.com/yourbusiness"
            className={`w-full px-4 py-3 bg-surface-container-lowest border rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              facebook && !isValidUrl(facebook)
                ? 'border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          {facebook && !isValidUrl(facebook) && (
            <p className="text-xs text-error mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              Enter a valid URL
            </p>
          )}
        </section>

        {/* TikTok */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
              <Music2 size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold text-on-surface">
                TikTok
              </h2>
              <p className="text-xs text-on-surface-variant">
                Your @handle (without the @)
              </p>
            </div>
            {tiktok && isValidHandle(tiktok) && (
              <a
                href={`https://tiktok.com/@${tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="View profile"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              @
            </span>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => handleTiktokChange(e.target.value)}
              placeholder="yourbusinessname"
              className={`w-full pl-8 pr-4 py-3 bg-surface-container-lowest border rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                tiktok && !isValidHandle(tiktok)
                  ? 'border-error'
                  : 'border-outline-variant focus:border-primary'
              }`}
            />
          </div>
        </section>

        {/* Website */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold text-on-surface">
                Website
              </h2>
              <p className="text-xs text-on-surface-variant">
                Your own website URL
              </p>
            </div>
            {website && isValidUrl(website) && (
              <a
                href={ensureHttps(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="Visit website"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <input
            type="url"
            value={website}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            placeholder="yourbusiness.com.au"
            className={`w-full px-4 py-3 bg-surface-container-lowest border rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              website && !isValidUrl(website)
                ? 'border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
        </section>

        {/* Google Business */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-semibold text-on-surface">
                Google Business
              </h2>
              <p className="text-xs text-on-surface-variant">
                Where customers leave Google reviews
              </p>
            </div>
            {googleBusiness && isValidUrl(googleBusiness) && (
              <a
                href={ensureHttps(googleBusiness)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="View listing"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <input
            type="url"
            value={googleBusiness}
            onChange={(e) => handleGoogleBusinessChange(e.target.value)}
            placeholder="g.page/yourbusiness"
            className={`w-full px-4 py-3 bg-surface-container-lowest border rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              googleBusiness && !isValidUrl(googleBusiness)
                ? 'border-error'
                : 'border-outline-variant focus:border-primary'
            }`}
          />
          <p className="text-xs text-on-surface-variant mt-2">
            💡 Find this by searching your business on Google, clicking &ldquo;Share&rdquo; on your Google Business listing
          </p>
        </section>

         {/* Completion status */}
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-on-primary">
            <Check size={20} />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-on-surface">
              Section complete!
            </p>
            <p className="text-xs text-on-surface-variant">
              {filledCount === 0
                ? "Optional — add links whenever you're ready"
                : `${filledCount} link${filledCount === 1 ? '' : 's'} added`}
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