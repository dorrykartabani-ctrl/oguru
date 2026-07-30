'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type {
  Business,
  Location,
  OpeningHours,
  VendorKeyword,
  Profile,
} from '@/lib/supabase/types';
import VendorSidebar from '@/components/VendorSidebar';
import {
  Loader2,
  Edit3,
  Camera,
  FileText,
  Clock,
  Tag,
  Share2,
  MapPin,
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
  Eye,
  Info,
  Bell,
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

const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
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
  const [profile, setProfile] = useState<Profile | null>(null);
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

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) setProfile(profileData);

      const { data: businessData } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
      if (!businessData || businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }
      setBusiness(businessData);

      const { data: locationData } = await supabase.from('locations').select('*').eq('business_id', businessData.id).eq('is_primary', true).single();
      if (locationData) {
        setLocation(locationData);
        const [hoursResult, keywordsResult] = await Promise.all([
          supabase.from('opening_hours').select('*').eq('location_id', locationData.id).order('day_of_week').order('shift_order'),
          supabase.from('vendor_keywords').select('*').eq('business_id', businessData.id),
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
  hours.forEach((h) => { if (hoursByDay[h.day_of_week]) hoursByDay[h.day_of_week].push(h); });

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
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-on-surface">{title}</h3>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              {isComplete ? <><Check size={12} className="text-primary" />Complete</> : <><Circle size={12} />Not yet</>}
            </p>
          </div>
        </div>
        <button onClick={() => router.push(editHref)} className="flex items-center gap-2 px-3 py-2 text-sm font-label font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
          <Edit3 size={14} />Edit
        </button>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <button onClick={() => router.push('/vendor/dashboard')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm">
          <ArrowLeft size={18} />Back
        </button>
        <h1 className="font-display text-lg font-bold text-primary">Settings</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <VendorSidebar business={business} profile={profile} />

      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Settings</h1>
          <p className="text-base text-on-surface-variant mt-2">Manage how your store appears and operates</p>
        </div>

        <div className="mb-6 p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
              <Info size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface mb-1">This is your admin settings view</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Customers see your store as a beautiful marketing page. Keep these sections up to date to build trust and show up better in search.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Section icon={Camera} title="Photos" isComplete={isPhotosComplete} editHref="/vendor/profile/photos">
            {business.logo_url || business.cover_url ? (
              <div className="flex gap-3">
                {business.logo_url && (
                  <img src={business.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-outline-variant" />
                )}
                {business.cover_url && (
                  <img src={business.cover_url} alt="Cover" className="flex-1 h-16 rounded-xl object-cover border border-outline-variant" />
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Add a logo and cover photo so customers recognize your store.</p>
            )}
          </Section>

          <Section icon={FileText} title="About" isComplete={isAboutComplete} editHref="/vendor/profile/about">
            {business.description ? (
              <p className="text-sm text-on-surface-variant line-clamp-2">{business.description}</p>
            ) : (
              <p className="text-sm text-on-surface-variant">Tell customers what makes your store special.</p>
            )}
            {business.business_types.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {business.business_types.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-low rounded-full text-xs text-on-surface-variant">
                    <ChipIcon size={12} style={{ color: chipColor }} />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Section>

          <Section icon={MapPin} title="Location" isComplete={!!location} editHref="/vendor/profile/address">
            {location ? (
              <p className="text-sm text-on-surface-variant">
                {location.address_line_1}
                {location.suburb ? `, ${location.suburb}` : ''}, {location.city} {location.postcode}
              </p>
            ) : (
              <p className="text-sm text-on-surface-variant">Add your store address so customers can find you.</p>
            )}
          </Section>

          <Section icon={Clock} title="Opening Hours" isComplete={isHoursComplete} editHref="/vendor/profile/hours">
            {hours.length > 0 ? (
              <div className="space-y-1">
                {DAYS.map((day) => {
                  const dayHours = hoursByDay[day.value] || [];
                  return (
                    <div key={day.value} className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant w-10">{day.short}</span>
                      {dayHours.length === 0 ? (
                        <span className="text-on-surface-variant/60">Closed</span>
                      ) : (
                        <span className="text-on-surface">
                          {dayHours
                            .map((h) => (h.is_closed ? 'Closed' : `${formatTime(h.opens_at)} – ${formatTime(h.closes_at)}`))
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Set your opening hours so customers know when to visit.</p>
            )}
          </Section>

          <Section icon={Tag} title="Search Keywords" isComplete={isKeywordsComplete} editHref="/vendor/profile/keywords">
            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(keywordsByCategory).map(([category, kws]) =>
                  kws.map((k) => (
                    <span key={k.id} className="px-2 py-1 bg-surface-container-low rounded-full text-xs text-on-surface-variant">
                      {k.keyword}
                    </span>
                  ))
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Add keywords to help customers discover you in search.</p>
            )}
          </Section>

          <Section icon={Share2} title="Social & Web" isComplete={hasSocial} editHref="/vendor/profile/social">
            {hasSocial ? (
              <div className="flex flex-wrap gap-3">
                {business.instagram_handle && (
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Instagram size={14} />@{business.instagram_handle}
                  </span>
                )}
                {business.facebook_url && (
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Facebook size={14} />Facebook
                  </span>
                )}
                {business.tiktok_handle && (
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Music2 size={14} />@{business.tiktok_handle}
                  </span>
                )}
                {business.website_url && (
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Globe size={14} />Website
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Link your social accounts and website.</p>
            )}
          </Section>
        </div>

        <button
          onClick={() => window.open(`/store/${business.slug || business.id}`, '_blank')}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
        >
          <Eye size={16} />
          View Public Store Page
          <ExternalLink size={14} />
        </button>
      </div>
    </main>
  );
}
