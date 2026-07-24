'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type {
  Business,
  Location,
  OpeningHours,
  VendorKeyword,
} from '@/lib/supabase/types';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  MoreHorizontal,
  Bell,
  Loader2,
  Edit3,
  Camera,
  FileText,
  Clock,
  Tag,
  Share2,
  MapPin,
  LogOut,
  Instagram,
  Facebook,
  Globe,
  Music2,
  ExternalLink,
  Coffee,
  Croissant,
  GlassWater,
  Cake,
  Truck,
  Wheat,
  Check,
  Circle,
  ArrowLeft,
  Settings,
  Eye,
  Info,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: false, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: Settings, label: 'Settings', active: true, href: '/vendor/settings' },
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

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [hours, setHours] = useState<OpeningHours[]>([]);
  const [keywords, setKeywords] = useState<VendorKeyword[]>([]);

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

      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);

        const [hoursResult, keywordsResult] = await Promise.all([
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
        ]);

        setHours(hoursResult.data || []);
        setKeywords(keywordsResult.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading your settings...</p>
      </main>
    );
  }

  if (!business) return null;

  const ChipIcon = getChipIcon(business.business_types || []);
  const chipColor = business.chip_color || '#4a6410';
  const businessInitials = getInitials(business.legal_name);

  const hoursByDay: Record<number, OpeningHours[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  hours.forEach((h) => {
    if (hoursByDay[h.day_of_week]) hoursByDay[h.day_of_week].push(h);
  });

  const keywordsByCategory: Record<string, VendorKeyword[]> = {};
  keywords.forEach((k) => {
    if (!keywordsByCategory[k.category]) keywordsByCategory[k.category] = [];
    keywordsByCategory[k.category].push(k);
  });

  const isPhotosComplete = !!(business.logo_url && business.cover_url);
  const isAboutComplete = !!(business.description && business.description.length > 20 && business.business_types.length > 0);
  const isHoursComplete = hours.length >= 3;
  const isKeywordsComplete = keywords.length >= 3;
  const hasSocial = !!(business.instagram_handle || business.facebook_url || business.tiktok_handle || business.website_url || business.google_business_url);

  const Section = ({
    icon: Icon,
    title,
    isComplete,
    editHref,
    children,
  }: {
    icon: typeof Camera;
    title: string;
    isComplete: boolean;
    editHref: string;
    children: React.ReactNode;
  }) => (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isComplete
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-on-surface">{title}</h3>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              {isComplete ? (
                <>
                  <Check size={12} className="text-primary" />
                  Complete
                </>
              ) : (
                <>
                  <Circle size={12} />
                  Not yet
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(editHref)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-label font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          <Edit3 size={14} />
          Edit
        </button>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Grainy texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top App Bar — mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <button
          onClick={() => router.push('/vendor/dashboard')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="font-display text-lg font-bold text-primary">
          Settings
        </h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors relative">
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Settings
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Manage how your store appears and operates
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-6 p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
            <Info size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface mb-1">
              This is your admin settings view
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Customers see your store differently — a marketing-focused page designed to help them discover and order from you.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-label font-semibold text-tertiary bg-tertiary/10 hover:bg-tertiary/15 rounded-lg transition-colors">
            <Eye size={12} />
            Preview customer view
          </button>
        </div>

        {/* Business Preview Header */}
        <div className="mb-6 p-5 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center gap-4">
          <div className="flex-shrink-0">
            {business.logo_url ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container">
                <img
                  src={business.logo_url}
                  alt={business.legal_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: chipColor }}>
                <ChipIcon size={24} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-on-surface truncate">
              {business.legal_name}
            </h2>
            {business.tagline && (
              <p className="text-sm text-on-surface-variant italic mt-0.5">
                {business.tagline}
              </p>
            )}
            {business.business_types.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {business.business_types.map((type) => (
                  <span
                    key={type}
                    className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-label font-semibold uppercase tracking-wider rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* PHOTOS */}
          <Section
            icon={Camera}
            title="Photos & Identity"
            isComplete={isPhotosComplete}
            editHref="/vendor/profile/photos"
          >
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Logo
                </p>
                {business.logo_url ? (
                  <div className="aspect-square rounded-lg overflow-hidden bg-surface-container">
                    <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-surface-container flex items-center justify-center">
                    <Camera size={20} className="text-on-surface-variant/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Cover
                </p>
                {business.cover_url ? (
                  <div className="aspect-square rounded-lg overflow-hidden bg-surface-container">
                    <img src={business.cover_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-surface-container flex items-center justify-center">
                    <Camera size={20} className="text-on-surface-variant/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Chip
                </p>
                <div className="aspect-square rounded-lg bg-surface-container flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: chipColor }}>
                    <ChipIcon size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ABOUT */}
          <Section icon={FileText} title="About" isComplete={isAboutComplete} editHref="/vendor/profile/about">
            {business.tagline || business.description ? (
              <div className="space-y-2">
                {business.tagline && (
                  <p className="text-sm font-semibold text-on-surface italic">
                    &ldquo;{business.tagline}&rdquo;
                  </p>
                )}
                {business.description ? (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {business.description.length > 150
                      ? business.description.substring(0, 150) + '...'
                      : business.description}
                  </p>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">No description yet</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                Add a tagline and description to help customers understand you
              </p>
            )}
          </Section>

          {/* LOCATION */}
          <Section icon={MapPin} title="Location" isComplete={!!location} editHref="#">
            {location ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-on-surface">{location.address_line_1}</p>
                <p className="text-sm text-on-surface-variant">
                  {location.city}, {location.postcode}
                </p>
                <p className="text-xs text-on-surface-variant mt-2">
                  {business.country_code === 'AU' ? '🇦🇺 Australia' : business.country_code} · {business.currency}
                </p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">Location not set</p>
            )}
          </Section>

          {/* OPENING HOURS */}
          <Section icon={Clock} title="Opening Hours" isComplete={isHoursComplete} editHref="/vendor/profile/hours">
            {hours.length > 0 ? (
              <div className="space-y-1">
                {DAYS.map((day) => {
                  const dayHours = hoursByDay[day.value] || [];
                  return (
                    <div key={day.value} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface w-16">{day.short}</span>
                      <span className={dayHours.length === 0 ? 'text-on-surface-variant italic' : 'text-on-surface'}>
                        {dayHours.length === 0
                          ? 'Closed'
                          : dayHours.map((h) => `${formatTime(h.opens_at)} - ${formatTime(h.closes_at)}`).join(', ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">No hours set yet</p>
            )}
          </Section>

          {/* KEYWORDS */}
          <Section icon={Tag} title="Keywords" isComplete={isKeywordsComplete} editHref="/vendor/profile/keywords">
            {keywords.length > 0 ? (
              <div className="space-y-3">
                {Object.entries(keywordsByCategory).map(([category, kws]) => (
                  <div key={category}>
                    <p className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {kws.map((kw) => (
                        <span
                          key={kw.id}
                          className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-label font-semibold rounded-full"
                        >
                          {kw.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">No keywords yet</p>
            )}
          </Section>

          {/* SOCIAL */}
          <Section icon={Share2} title="Social & Web" isComplete={true} editHref="/vendor/profile/social">
            {hasSocial ? (
              <div className="space-y-2">
                {business.instagram_handle && (
                  <a
                    href={`https://instagram.com/${business.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white flex-shrink-0">
                      <Instagram size={12} />
                    </div>
                    @{business.instagram_handle}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {business.facebook_url && (
                  <a
                    href={business.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <Facebook size={12} />
                    </div>
                    <span className="truncate">Facebook Page</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {business.tiktok_handle && (
                  <a
                    href={`https://tiktok.com/@${business.tiktok_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white flex-shrink-0">
                      <Music2 size={12} />
                    </div>
                    @{business.tiktok_handle}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {business.website_url && (
                  <a
                    href={business.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Globe size={12} />
                    </div>
                    <span className="truncate">{business.website_url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {business.google_business_url && (
                  <a
                    href={business.google_business_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-white border border-outline-variant flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      G
                    </div>
                    <span className="truncate">Google Business</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">No social links added (optional)</p>
            )}
          </Section>
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
