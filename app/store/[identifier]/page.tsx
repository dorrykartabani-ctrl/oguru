'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type {
  Business,
  Location,
  OpeningHours,
  VendorKeyword,
  Product,
} from '@/lib/supabase/types';
import {
  ArrowLeft,
  Loader2,
  Coffee,
  Croissant,
  GlassWater,
  Cake,
  Truck,
  Wheat,
  ShoppingBag,
  MapPin,
  Gift,
  Heart,
  Share2,
  Clock,
  BookOpen,
  Instagram,
  Facebook,
  Music2,
  Globe,
  ExternalLink,
  UtensilsCrossed,
  Info,
  Store,
} from 'lucide-react';

type TabId = 'hours' | 'location' | 'story' | 'socials';

const TABS: { id: TabId; label: string; icon: typeof Clock }[] = [
  { id: 'hours', label: 'Hours', icon: Clock },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'socials', label: 'Socials', icon: Share2 },
];

const DAYS = [
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' },
  { value: 0, short: 'Sun', full: 'Sunday' },
];

const getChipIcon = (businessTypes: string[]) => {
  if (businessTypes.includes('Bakery')) return Croissant;
  if (businessTypes.includes('Juice')) return GlassWater;
  if (businessTypes.includes('Dessert')) return Cake;
  if (businessTypes.includes('Food Truck')) return Truck;
  if (businessTypes.includes('Café')) return Coffee;
  return Wheat;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${minutes}${period}`;
};

const formatPrice = (cents: number, currency: string) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency || 'AUD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const getOpenStatus = (
  hoursByDay: Record<number, OpeningHours[]>
): { isOpen: boolean; message: string } => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

  const todayShifts = hoursByDay[currentDay] || [];

  for (const shift of todayShifts) {
    if (shift.opens_at && shift.closes_at) {
      if (currentTime >= shift.opens_at && currentTime <= shift.closes_at) {
        return {
          isOpen: true,
          message: `Open until ${formatTime(shift.closes_at)}`,
        };
      }
    }
  }

  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const dayShifts = hoursByDay[checkDay] || [];

    if (dayShifts.length > 0) {
      const firstShift = dayShifts[0];
      const dayName = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS.find(d => d.value === checkDay)?.short;

      if (i === 0 && firstShift.opens_at && currentTime < firstShift.opens_at) {
        return {
          isOpen: false,
          message: `Opens today at ${formatTime(firstShift.opens_at)}`,
        };
      } else if (i > 0) {
        return {
          isOpen: false,
          message: `Opens ${dayName} at ${formatTime(firstShift.opens_at)}`,
        };
      }
    }
  }

  return { isOpen: false, message: 'Closed' };
};

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const identifier = params.identifier as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [hours, setHours] = useState<OpeningHours[]>([]);
  const [keywords, setKeywords] = useState<VendorKeyword[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('hours');
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    loadData();
  }, [identifier]);

  const loadData = async () => {
    try {
      let businessData = null;

      const { data: bySlug } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', identifier)
        .eq('status', 'approved')
        .maybeSingle();

      if (bySlug) {
        businessData = bySlug;
      } else {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        if (isUuid) {
          const { data: byId } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', identifier)
            .eq('status', 'approved')
            .maybeSingle();
          businessData = byId;
        }
      }

      if (!businessData) {
        setNotFound(true);
        return;
      }

      setBusiness(businessData);

      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);

        const [hoursResult, keywordsResult, productsResult] = await Promise.all([
          supabase
            .from('opening_hours')
            .select('*')
            .eq('location_id', locationData.id)
            .order('day_of_week')
            .order('shift_order'),
          supabase
            .from('vendor_keywords')
            .select('*')
            .eq('business_id', businessData.id),
          supabase
            .from('products')
            .select('*')
            .eq('location_id', locationData.id)
            .eq('is_available', true)
            .order('sort_order')
            .limit(6),
        ]);

        setHours(hoursResult.data || []);
        setKeywords(keywordsResult.data || []);
        setProducts(productsResult.data || []);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleActionRequireAuth = async (action: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert(`Please log in to ${action}`);
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleOrder = async () => {
    const canProceed = await handleActionRequireAuth('order');
    if (canProceed) alert('Order flow coming soon!');
  };

  const handleGift = async () => {
    const canProceed = await handleActionRequireAuth('send a gift');
    if (canProceed) alert('Gift flow coming soon!');
  };

  const handleFollow = async () => {
    const canProceed = await handleActionRequireAuth('follow this vendor');
    if (canProceed) setIsFollowed(!isFollowed);
  };

  const handleDirections = () => {
    if (!location) return;
    const address = `${location.address_line_1}, ${location.city}, ${location.postcode}`;
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/store/${business?.slug || business?.id}`;
    const shareTitle = business?.legal_name || 'OGuru';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: business?.tagline || `Check out ${shareTitle} on OGuru`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading store...</p>
      </main>
    );
  }

  if (notFound || !business) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4">
            <Store size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface mb-2">
            Store not found
          </h1>
          <p className="text-on-surface-variant mb-6">
            This vendor doesn&apos;t exist or is no longer active on OGuru.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} />
            Back to home
          </button>
        </div>
      </main>
    );
  }

  const ChipIcon = getChipIcon(business.business_types || []);
  const chipColor = business.chip_color || '#4a6410';

  const hoursByDay: Record<number, OpeningHours[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  hours.forEach((h) => {
    if (hoursByDay[h.day_of_week]) hoursByDay[h.day_of_week].push(h);
  });

  const openStatus = getOpenStatus(hoursByDay);
  const currentDay = new Date().getDay();

  return (
    <main className="min-h-screen bg-surface">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <ArrowLeft size={18} className="text-on-surface" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <Share2 size={18} className="text-on-surface" />
            </button>
            <button
              onClick={handleFollow}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isFollowed ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'
              }`}
            >
              <Heart size={18} fill={isFollowed ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Cover */}
      <section className="relative">
        {business.cover_url ? (
          <div className="h-64 md:h-80 lg:h-96 overflow-hidden">
            <img src={business.cover_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/30 via-secondary-container to-tertiary/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: chipColor }}>
              <ChipIcon size={64} className="text-white" />
            </div>
          </div>
        )}
      </section>

      {/* Business Header */}
      <section className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex items-start gap-4 -mt-12 md:-mt-16 relative z-10 mb-4">
          <div className="flex-shrink-0">
            {business.logo_url ? (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-surface bg-surface shadow-organic-md">
                <img src={business.logo_url} alt={business.legal_name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-surface bg-surface flex items-center justify-center shadow-organic-md">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: chipColor }}>
                  <ChipIcon size={36} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface leading-tight">
            {business.legal_name}
          </h1>

          {business.tagline && (
            <p className="text-base md:text-lg text-on-surface-variant mt-1">
              {business.tagline}
            </p>
          )}

          {business.business_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {business.business_types.map((type) => (
                <span key={type} className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-label font-semibold uppercase tracking-wider rounded-full">
                  {type}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? 'bg-primary animate-pulse' : 'bg-error'}`} />
              <span className={`font-semibold ${openStatus.isOpen ? 'text-primary' : 'text-on-surface-variant'}`}>
                {openStatus.message}
              </span>
            </div>

            {location?.neighborhood && (
              <>
                <span className="text-on-surface-variant">·</span>
                <span className="text-on-surface-variant">{location.neighborhood}</span>
              </>
            )}

            {location && (
              <>
                <span className="text-on-surface-variant">·</span>
                <span className="text-on-surface-variant">{location.city}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
          <button
            onClick={handleOrder}
            className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 md:py-3.5 bg-primary text-on-primary rounded-xl font-label font-semibold text-xs md:text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <ShoppingBag size={18} />
            Order
          </button>

          <button
            onClick={handleDirections}
            className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 md:py-3.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl font-label font-semibold text-xs md:text-sm uppercase tracking-wider hover:border-primary/40 hover:shadow-organic-sm active:scale-95 transition-all"
          >
            <MapPin size={18} />
            Directions
          </button>

          <button
            onClick={handleGift}
            className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 md:py-3.5 bg-secondary-container text-on-secondary-container rounded-xl font-label font-semibold text-xs md:text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Gift size={18} />
            Gift
          </button>

          <button
            onClick={handleFollow}
            className={`flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 md:py-3.5 rounded-xl font-label font-semibold text-xs md:text-sm uppercase tracking-wider active:scale-95 transition-all shadow-sm ${
              isFollowed
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary/40 hover:shadow-organic-sm'
            }`}
          >
            <Heart size={18} fill={isFollowed ? 'currentColor' : 'none'} />
            {isFollowed ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Keywords */}
        {keywords.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span key={kw.id} className="inline-block px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-label font-medium rounded-full">
                  #{kw.keyword.replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* MENU SECTION */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-semibold text-on-surface">Menu</h2>
          {products.length > 0 && (
            <button onClick={() => alert('Full menu coming soon!')} className="text-sm font-label font-semibold text-primary hover:underline">
              View all →
            </button>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-4 flex flex-col justify-between hover:shadow-organic transition-shadow cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-on-secondary mb-3">
                  <Gift size={22} fill="currentColor" />
                </div>
                <h4 className="font-display font-semibold text-sm text-on-secondary-container">Gift Voucher</h4>
                <p className="text-xs text-on-secondary-container/70 mt-1">
                  From {formatPrice(1000, business.currency)}
                </p>
              </div>
              <button onClick={handleGift} className="mt-3 text-xs font-label font-semibold text-secondary uppercase tracking-wider text-left">
                Send →
              </button>
            </div>

            {products.map((product) => (
              <div
                key={product.id}
                onClick={handleOrder}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col justify-between hover:border-primary/40 hover:shadow-organic transition-all cursor-pointer"
              >
                <div>
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
                    <UtensilsCrossed size={24} className="text-on-surface-variant/40" />
                  </div>
                  <h4 className="font-display font-semibold text-sm text-on-surface truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{product.category}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-display font-bold text-primary">
                    {formatPrice(product.price_cents, business.currency)}
                  </p>
                  <ShoppingBag size={14} className="text-on-surface-variant" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center">
            <UtensilsCrossed size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant">Menu coming soon</p>
          </div>
        )}
      </section>

      {/* SUB TABS */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 mb-10">
        <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-hide border-b border-outline-variant">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-label font-semibold text-sm uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-on-surface'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 min-h-[200px]">
          {activeTab === 'hours' && (
            <div>
              {hours.length > 0 ? (
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const dayHours = hoursByDay[day.value] || [];
                    const isToday = day.value === currentDay;
                    return (
                      <div key={day.value} className={`flex items-center justify-between py-2 px-3 rounded-lg ${isToday ? 'bg-primary/5' : ''}`}>
                        <span className={`text-sm ${isToday ? 'font-display font-bold text-primary' : 'font-medium text-on-surface'}`}>
                          {day.full}
                          {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider">Today</span>}
                        </span>
                        <span className={`text-sm ${dayHours.length === 0 ? 'text-on-surface-variant italic' : isToday ? 'text-primary font-semibold' : 'text-on-surface'}`}>
                          {dayHours.length === 0 ? 'Closed' : dayHours.map((h) => `${formatTime(h.opens_at)} – ${formatTime(h.closes_at)}`).join(', ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant italic text-center py-8">Opening hours not set</p>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              {location ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-on-surface">{location.address_line_1}</p>
                      {location.address_line_2 && <p className="text-sm text-on-surface-variant">{location.address_line_2}</p>}
                      <p className="text-sm text-on-surface-variant">
                        {[location.suburb, location.city, location.state, location.postcode].filter(Boolean).join(', ')}
                      </p>
                      {location.neighborhood && <p className="text-xs text-primary mt-2 font-semibold">📍 {location.neighborhood}</p>}
                    </div>
                  </div>

                  {location.access_notes && (
                    <div className="p-3 bg-tertiary/5 border border-tertiary/20 rounded-xl flex items-start gap-2">
                      <Info size={16} className="text-tertiary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-on-surface">{location.access_notes}</p>
                    </div>
                  )}

                  <button
                    onClick={handleDirections}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
                  >
                    <MapPin size={16} />
                    Get Directions
                  </button>
                </div>
              ) : (
                <p className="text-on-surface-variant italic text-center py-8">Location not available</p>
              )}
            </div>
          )}

          {activeTab === 'story' && (
            <div>
              {business.description ? (
                <div className="space-y-4">
                  {business.tagline && (
                    <p className="text-lg text-on-surface font-display italic">&ldquo;{business.tagline}&rdquo;</p>
                  )}
                  <p className="text-on-surface leading-relaxed whitespace-pre-line">{business.description}</p>
                  {business.story && (
                    <div className="pt-4 border-t border-outline-variant">
                      <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Our Story</p>
                      <p className="text-on-surface leading-relaxed whitespace-pre-line">{business.story}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-on-surface-variant italic text-center py-8">No story yet</p>
              )}
            </div>
          )}

          {activeTab === 'socials' && (
            <div>
              {business.instagram_handle || business.facebook_url || business.tiktok_handle || business.website_url || business.google_business_url ? (
                <div className="space-y-3">
                  {business.instagram_handle && (
                    <a href={`https://instagram.com/${business.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white flex-shrink-0">
                        <Instagram size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-on-surface">Instagram</p>
                        <p className="text-sm text-on-surface-variant">@{business.instagram_handle}</p>
                      </div>
                      <ExternalLink size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {business.facebook_url && (
                    <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        <Facebook size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-on-surface">Facebook</p>
                        <p className="text-sm text-on-surface-variant truncate">View page</p>
                      </div>
                      <ExternalLink size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {business.tiktok_handle && (
                    <a href={`https://tiktok.com/@${business.tiktok_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white flex-shrink-0">
                        <Music2 size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-on-surface">TikTok</p>
                        <p className="text-sm text-on-surface-variant">@{business.tiktok_handle}</p>
                      </div>
                      <ExternalLink size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {business.website_url && (
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Globe size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-on-surface">Website</p>
                        <p className="text-sm text-on-surface-variant truncate">{business.website_url.replace(/^https?:\/\//, '')}</p>
                      </div>
                      <ExternalLink size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {business.google_business_url && (
                    <a href={business.google_business_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant flex items-center justify-center flex-shrink-0 font-bold text-sm">G</div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-on-surface">Google</p>
                        <p className="text-sm text-on-surface-variant">View on Google</p>
                      </div>
                      <ExternalLink size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-on-surface-variant italic text-center py-8">No social links yet</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 md:px-6 py-8 border-t border-outline-variant">
        <div className="text-center">
          <p className="text-xs text-on-surface-variant">
            Powered by <span className="font-display font-semibold text-primary">OGuru</span>
          </p>
          <button onClick={() => router.push('/vendor')} className="text-xs text-on-surface-variant hover:text-primary transition-colors mt-2">
            Are you a vendor? Get started →
          </button>
        </div>
      </footer>
    </main>
  );
}
