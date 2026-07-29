'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type {
  Business,
  Location,
  OpeningHours,
  VendorKeyword,
  Product,
  Promotion,
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
  MapPin,
  Gift,
  Heart,
  Share2,
  Clock,
  Instagram,
  Facebook,
  Music2,
  Globe,
  Store,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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

const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'pm' : 'am';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return minutes === '00' ? `${displayHour}${period}` : `${displayHour}:${minutes}${period}`;
};

const formatPrice = (cents: number, currency: string = 'AUD') => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
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
        return { isOpen: true, message: `Open until ${formatTime(shift.closes_at)}` };
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
        return { isOpen: false, message: `Opens today at ${formatTime(firstShift.opens_at)}` };
      } else if (i > 0) {
        return { isOpen: false, message: `Opens ${dayName} at ${formatTime(firstShift.opens_at)}` };
      }
    }
  }

  return { isOpen: false, message: 'Closed' };
};

const getTimeContext = (isOpen: boolean): string | null => {
  if (!isOpen) return null;
  const hour = new Date().getHours();
  if (hour < 10) return 'Fresh coffee ready ☕';
  if (hour < 12) return 'Morning brew time ☕';
  if (hour < 14) return 'Lunch specials on now 🥗';
  if (hour < 17) return 'Perfect afternoon stop ✨';
  return 'Evening treats await 🌙';
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
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalNotes, setModalNotes] = useState('');
  const [expandedStory, setExpandedStory] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
        const [hoursResult, keywordsResult, productsResult, promotionsResult] = await Promise.all([
          supabase.from('opening_hours').select('*').eq('location_id', locationData.id).order('day_of_week').order('shift_order'),
          supabase.from('vendor_keywords').select('*').eq('business_id', businessData.id),
          supabase.from('products').select('*').eq('location_id', locationData.id).eq('is_available', true).order('sort_order'),
          supabase.from('promotions').select('*').eq('business_id', businessData.id).eq('is_active', true),
        ]);
        setHours(hoursResult.data || []);
        setKeywords(keywordsResult.data || []);
        setProducts(productsResult.data || []);
        setPromotions(promotionsResult.data || []);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleActionRequireAuth = async (action: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert(`Please log in to ${action}`);
      router.push('/login');
      return false;
    }
    return true;
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
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/store/${business?.slug || business?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business?.legal_name || 'OGuru', text: business?.tagline || '', url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalNotes('');
  };

  const handleAddToCart = async () => {
    const canProceed = await handleActionRequireAuth('order');
    if (canProceed) {
      alert(`Added ${modalQuantity}x ${selectedProduct?.name} to cart!`);
      setSelectedProduct(null);
    }
  };

  const handlePromoOrder = async () => {
    const canProceed = await handleActionRequireAuth('order');
    if (canProceed) alert('Order flow coming soon!');
  };

  // Categories & filtered products
  const { categories, filteredProducts } = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(products.map(p => p.category)))];
    const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
    return { categories: cats, filteredProducts: filtered };
  }, [products, activeCategory]);

  const productsByCategory: Record<string, Product[]> = {};
  filteredProducts.forEach((p) => {
    if (!productsByCategory[p.category]) productsByCategory[p.category] = [];
    productsByCategory[p.category].push(p);
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading...</p>
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
          <h1 className="font-display text-2xl font-bold text-on-surface mb-2">Store not found</h1>
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to home
          </button>
        </div>
      </main>
    );
  }

  const ChipIcon = getChipIcon(business.business_types || []);
  const chipColor = business.chip_color || '#4a6410';

  const hoursByDay: Record<number, OpeningHours[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  hours.forEach((h) => { if (hoursByDay[h.day_of_week]) hoursByDay[h.day_of_week].push(h); });

  const openStatus = getOpenStatus(hoursByDay);
  const timeContext = getTimeContext(openStatus.isOpen);
  const currentDay = new Date().getDay();

  const storyText = business.description || '';
  const storyPreview = storyText.length > 200 ? storyText.substring(0, 200) + '...' : storyText;

  return (
    <main className="min-h-screen bg-surface">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <ArrowLeft size={20} className="text-on-surface" />
          </button>
          <div className="flex items-center gap-1">
            <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              {copiedLink ? <CheckCircle2 size={20} className="text-primary" /> : <Share2 size={20} className="text-on-surface" />}
            </button>
            <button onClick={handleFollow} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isFollowed ? 'text-primary' : 'text-on-surface hover:bg-surface-container'}`}>
              <Heart size={20} fill={isFollowed ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTAINED CONTENT — Everything within max-w-3xl */}
      <div className="max-w-3xl mx-auto">
        {/* HERO — Cover with name overlay */}
        <section className="relative rounded-b-3xl overflow-hidden">
          {business.cover_url ? (
            <div className="relative h-64 md:h-72">
              <img src={business.cover_url} alt="" className="w-full h-full object-cover" />
              {/* Dark gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="relative h-64 md:h-72" style={{ background: `linear-gradient(135deg, ${chipColor}, ${chipColor}dd)` }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <ChipIcon size={120} className="text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

                   {/* Name overlay on cover */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-end gap-3">
              {/* Logo — rounded square with thick primary border */}
              <div className="flex-shrink-0">
                {business.logo_url ? (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 border-primary bg-white shadow-organic-lg">
                    <img src={business.logo_url} alt={business.legal_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-primary flex items-center justify-center shadow-organic-lg" style={{ backgroundColor: chipColor }}>
                    <ChipIcon size={28} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name only — no dot */}
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">
                  {business.legal_name}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content padding */}
        <div className="px-4 md:px-6">
          {/* Status Bar — Compact */}
          <section className="py-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? 'bg-primary animate-pulse' : 'bg-error'}`} />
              <span className={`font-semibold ${openStatus.isOpen ? 'text-primary' : 'text-error'}`}>
                {openStatus.message}
              </span>
            </div>
            {location?.neighborhood && (
              <>
                <span className="text-on-surface-variant/40">·</span>
                <span className="text-on-surface-variant">{location.neighborhood}</span>
              </>
            )}
            {business.business_types.length > 0 && (
              <>
                <span className="text-on-surface-variant/40">·</span>
                <span className="text-on-surface-variant">
                  {business.business_types.join(', ')}
                </span>
              </>
            )}
          </section>

          {timeContext && (
            <p className="text-sm text-tertiary font-medium -mt-2 mb-4">
              {timeContext}
            </p>
          )}

          {/* Vibe Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {keywords.slice(0, 6).map((kw) => (
                <span key={kw.id} className="text-xs text-primary/80 font-medium">
                  #{kw.keyword.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={handleDirections} className="flex flex-col items-center justify-center gap-1 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:text-primary active:scale-95 transition-all">
              <MapPin size={18} />
              <span className="text-[11px] font-label font-semibold uppercase tracking-wider">Directions</span>
            </button>
            <button onClick={handleGift} className="flex flex-col items-center justify-center gap-1 py-3 bg-secondary text-on-secondary rounded-xl hover:opacity-90 active:scale-95 transition-all">
              <Gift size={18} />
              <span className="text-[11px] font-label font-semibold uppercase tracking-wider">Gift</span>
            </button>
            <button onClick={handleFollow} className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl active:scale-95 transition-all ${isFollowed ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant hover:border-primary hover:text-primary'}`}>
              <Heart size={18} fill={isFollowed ? 'currentColor' : 'none'} />
              <span className="text-[11px] font-label font-semibold uppercase tracking-wider">
                {isFollowed ? 'Following' : 'Follow'}
              </span>
            </button>
          </div>

          {/* PROMOTIONS — Only if exists */}
          {promotions.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-tertiary" />
                <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">
                  Active Deals
                </h2>
              </div>
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <button key={promo.id} onClick={handlePromoOrder} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-5 text-left hover:shadow-organic-md transition-all active:scale-[0.98]">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{promo.emoji || '🎉'}</span>
                          <h3 className="font-display text-lg font-bold">{promo.title}</h3>
                        </div>
                        {promo.description && <p className="text-sm opacity-90">{promo.description}</p>}
                      </div>
                      {promo.sale_price_cents && (
                        <div className="text-right flex-shrink-0">
                          {promo.original_price_cents && (
                            <p className="text-xs opacity-70 line-through">
                              {formatPrice(promo.original_price_cents, business.currency)}
                            </p>
                          )}
                          <p className="font-display text-xl font-bold">
                            {formatPrice(promo.sale_price_cents, business.currency)}
                          </p>
                        </div>
                      )}
                      {promo.discount_percentage && (
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
                          {promo.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {promo.ends_at && (
                        <p className="text-xs opacity-80 flex items-center gap-1">
                          <Clock size={12} />
                          Ends {new Date(promo.ends_at).toLocaleDateString()}
                        </p>
                      )}
                      <span className="ml-auto text-sm font-label font-semibold uppercase tracking-wider">
                        Order Now →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* MENU */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl font-bold text-on-surface">Menu</h2>
              <span className="text-xs text-on-surface-variant">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Category Tabs */}
            {categories.length > 2 && (
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0 pb-3 mb-3 border-b border-outline-variant/50">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = cat === 'all' ? products.length : products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-label font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                      <span className={`ml-1.5 text-[10px] ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Menu Items */}
            {Object.keys(productsByCategory).length > 0 ? (
              <div className="space-y-5">
                {Object.entries(productsByCategory).map(([category, items]) => (
                  <div key={category}>
                    {activeCategory === 'all' && (
                      <h3 className="font-label text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                        {category}
                      </h3>
                    )}
                    <div className="space-y-0.5">
                      {items.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => openProductModal(product)}
                          className="w-full flex items-baseline justify-between py-2.5 px-2 hover:bg-surface-container-low rounded-lg transition-colors group text-left"
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-base text-on-surface group-hover:text-primary transition-colors">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                          <span className="font-display font-semibold text-on-surface flex-shrink-0 tabular-nums">
                            {formatPrice(product.price_cents, business.currency)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center">
                <p className="text-on-surface-variant italic">Menu coming soon</p>
              </div>
            )}
          </section>

          {/* GIFT VOUCHER */}
          <section className="mb-6">
            <button onClick={handleGift} className="w-full bg-primary text-on-primary rounded-2xl p-4 flex items-center gap-4 hover:opacity-90 active:scale-[0.99] transition-all text-left shadow-organic-sm">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Gift size={22} fill="currentColor" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold">Send a Gift Voucher</p>
                <p className="text-sm opacity-90">From {formatPrice(1000, business.currency)}</p>
              </div>
              <span className="font-label text-xs font-semibold uppercase tracking-wider opacity-90">
                Send →
              </span>
            </button>
          </section>

          {/* HOURS */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">Hours</h2>
            </div>
            {hours.length > 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
                {(() => {
                  const todayHours = hoursByDay[currentDay] || [];
                  const todayDay = DAYS.find(d => d.value === currentDay);
                  return (
                    <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold text-on-surface">{todayDay?.full}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Today</p>
                      </div>
                      <span className={`text-sm font-semibold ${openStatus.isOpen ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {todayHours.length === 0 ? 'Closed' : todayHours.map((h) => `${formatTime(h.opens_at)} – ${formatTime(h.closes_at)}`).join(', ')}
                      </span>
                    </div>
                  );
                })()}
                <button onClick={() => setShowAllHours(!showAllHours)} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-primary hover:bg-surface-container-low transition-colors">
                  <span className="font-label font-semibold text-xs uppercase tracking-wider">
                    {showAllHours ? 'Hide' : 'All hours'}
                  </span>
                  {showAllHours ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showAllHours && (
                  <div className="border-t border-outline-variant">
                    {DAYS.filter(d => d.value !== currentDay).map((day) => {
                      const dayHours = hoursByDay[day.value] || [];
                      return (
                        <div key={day.value} className="flex items-center justify-between px-4 py-2.5 border-b border-outline-variant last:border-b-0">
                          <span className="text-sm font-medium text-on-surface">{day.full}</span>
                          <span className={`text-sm ${dayHours.length === 0 ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                            {dayHours.length === 0 ? 'Closed' : dayHours.map((h) => `${formatTime(h.opens_at)} – ${formatTime(h.closes_at)}`).join(', ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">Hours not set</p>
            )}
          </section>

          {/* LOCATION */}
          {location && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-primary" />
                <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">Where</h2>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4">
                <p className="font-display font-semibold text-on-surface">{location.address_line_1}</p>
                {location.address_line_2 && <p className="text-sm text-on-surface-variant">{location.address_line_2}</p>}
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {[location.suburb, location.city, location.state, location.postcode].filter(Boolean).join(', ')}
                </p>
                {location.access_notes && (
                  <div className="mt-3 pt-3 border-t border-outline-variant">
                    <p className="text-sm text-on-surface leading-relaxed">💡 {location.access_notes}</p>
                  </div>
                )}
                <button onClick={handleDirections} className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
                  <MapPin size={14} /> Get Directions
                </button>
              </div>
            </section>
          )}

          {/* STORY */}
          {business.description && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📖</span>
                <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">About</h2>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
                {business.tagline && (
                  <p className="text-base text-primary font-display italic mb-3">
                    &ldquo;{business.tagline}&rdquo;
                  </p>
                )}
                <p className="text-on-surface leading-relaxed whitespace-pre-line">
                  {expandedStory ? storyText : storyPreview}
                </p>
                {storyText.length > 200 && (
                  <button onClick={() => setExpandedStory(!expandedStory)} className="mt-3 text-sm font-label font-semibold text-primary hover:underline">
                    {expandedStory ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* SOCIALS */}
          {(business.instagram_handle || business.facebook_url || business.tiktok_handle || business.website_url || business.google_business_url) && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-primary" />
                <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">Find Us</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {business.instagram_handle && (
                  <a href={`https://instagram.com/${business.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <Instagram size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-on-surface truncate">@{business.instagram_handle}</span>
                  </a>
                )}
                {business.facebook_url && (
                  <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <Facebook size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-on-surface truncate">Facebook</span>
                  </a>
                )}
                {business.tiktok_handle && (
                  <a href={`https://tiktok.com/@${business.tiktok_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <Music2 size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-on-surface truncate">@{business.tiktok_handle}</span>
                  </a>
                )}
                {business.website_url && (
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <Globe size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-on-surface truncate">Website</span>
                  </a>
                )}
                {business.google_business_url && (
                  <a href={business.google_business_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-colors">
                    <span className="font-bold text-primary flex-shrink-0 text-sm">G</span>
                    <span className="text-sm font-semibold text-on-surface truncate">Google</span>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 md:px-6 py-8 border-t border-outline-variant">
        <div className="text-center">
          <p className="text-xs text-on-surface-variant">
            Powered by <span className="font-display font-semibold text-primary">OGuru</span>
          </p>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)} />
          <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 p-0 md:p-4 pointer-events-none">
            <div className="bg-surface w-full md:max-w-md md:rounded-2xl rounded-t-3xl shadow-organic-lg pointer-events-auto animate-slide-up md:animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="md:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-outline-variant rounded-full" />
              </div>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors z-10">
                <X size={16} className="text-on-surface" />
              </button>
              <div className="p-6">
                <div className="w-full h-32 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <ChipIcon size={40} className="text-primary/40" />
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface mb-1">{selectedProduct.name}</h3>
                <p className="font-display text-lg font-semibold text-primary mb-3">
                  {formatPrice(selectedProduct.price_cents, business.currency)}
                </p>
                {selectedProduct.description && (
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{selectedProduct.description}</p>
                )}
                <div className="mb-4 p-3 bg-surface-container-low border border-outline-variant rounded-lg text-center">
                  <p className="text-xs text-on-surface-variant">Size, milk, and add-on options coming soon</p>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    Special requests
                  </label>
                  <textarea value={modalNotes} onChange={(e) => setModalNotes(e.target.value)} placeholder="Extra hot, no sugar..." rows={2} className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm resize-none focus:outline-none focus:border-primary" />
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-full p-1">
                    <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="font-display font-bold text-lg w-6 text-center">{modalQuantity}</span>
                    <button onClick={() => setModalQuantity(modalQuantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button onClick={handleAddToCart} className="w-full bg-primary text-on-primary py-4 rounded-xl font-label font-bold text-sm uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-organic">
                  Add to Cart · {formatPrice(selectedProduct.price_cents * modalQuantity, business.currency)}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
    </main>
  );
}