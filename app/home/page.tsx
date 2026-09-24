'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SearchIcon,
  MapPinIcon,
  SparklesIcon,
  HomeIcon,
  MapIcon,
  GiftIcon,
  ReceiptIcon,
  UserCircleIcon,
  ArrowRight,
} from '@/components/icons';
import {
  getApprovedVendorsWithLocations,
  searchVendors,
  getActivePromotions,
} from '@/lib/supabase/queries';
import type { VendorCard, PromotionCard } from '@/types/database';

/* ------------------------------------------------------------------ */
/*  Helpers & Smart Image Fallbacks                                    */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// 2026 Editorial Fallbacks: Stunning photography based on vendor type
function getCoverImage(vendor: VendorCard): string {
  const type = vendor.business_types?.[0]?.toLowerCase() || '';
  if (type === 'bakery') {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800';
  }
  if (type === 'roastery') {
    return 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800';
  }
  // Default Specialty Cafe
  return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800';
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [vendors, setVendors] = useState<VendorCard[]>([]);
  const [promotions, setPromotions] = useState<PromotionCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const isSearchMode = query.trim().length > 0;

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [vendorData, promoData] = await Promise.all([
          getApprovedVendorsWithLocations(10),
          getActivePromotions(5),
        ]);
        setVendors(vendorData);
        setPromotions(promoData);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!isSearchMode) {
      getApprovedVendorsWithLocations(10).then((data) => {
        if (data.length > 0) setVendors(data);
      });
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchVendors(query);
      setVendors(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isSearchMode]);

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body selection:bg-[#4a6410] selection:text-white">
      {/* ---- Premium Hero Section ---- */}
      <section className="relative px-5 pt-16 pb-6">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -ml-[200px] h-[400px] w-[400px] rounded-full bg-[#4a6410]/5 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#1b1c19] md:text-5xl">
            {getGreeting()}, <span className="text-[#4a6410]">Alex.</span>
          </h1>
          <p className="mt-2 text-base font-medium text-[#44483a]/70">
            {isSearchMode
              ? `Exploring ${vendors.length} spots for "${query}"`
              : 'Discover your perfect morning ritual.'}
          </p>
        </div>
      </section>

      {/* ---- Floating Search Bar ---- */}
      <section className="sticky top-4 z-40 mx-5 mt-2">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#4a6410]/20 to-[#924700]/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
          <div className="relative flex items-center rounded-3xl border border-[#1b1c19]/10 bg-white/80 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all focus-within:bg-white focus-within:shadow-[0_8px_30px_rgb(74,100,16,0.12)]">
            <div className="pl-3 pr-2">
              <SearchIcon className="h-5 w-5 text-[#4a6410]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spots, matcha, croissants..."
              className="w-full bg-transparent py-2.5 pr-4 font-body text-sm font-semibold text-[#1b1c19] placeholder:font-medium placeholder:text-[#44483a]/40 outline-none"
            />
            {isSearching && (
              <div className="pr-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
              </div>
            )}
          </div>
        </div>

        {!isSearchMode && (
          <div className="mt-4 flex items-center gap-2 px-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1b1c19]/5 px-3 py-1 font-label text-xs font-bold text-[#1b1c19] backdrop-blur-md">
              <MapPinIcon className="h-3 w-3 text-[#924700]" />
              Surry Hills, Sydney
            </span>
            <span className="font-label text-xs font-medium text-[#44483a]/50">Within 5 km</span>
          </div>
        )}
      </section>

      {/* ---- Quick Reorder (VIP Pass Style) ---- */}
      {!isSearchMode && (
        <section className="mx-5 mt-8">
          <div className="group relative overflow-hidden rounded-[28px] bg-[#1b1c19] p-5 text-[#fbf9f4] shadow-2xl transition hover:shadow-[0_20px_40px_rgba(27,28,25,0.2)] cursor-pointer">
            {/* Dark glass reflection */}
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-[50px] transition-transform duration-700 group-hover:translate-x-10" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-md">
                  ☕
                </div>
                <div>
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#fbf9f4]/60">
                    Quick Reorder
                  </p>
                  <p className="mt-0.5 font-display text-base font-bold">
                    Oat Flat White + Pastry
                  </p>
                  <p className="font-body text-xs text-[#fbf9f4]/80">
                    Old Spike Roastery
                  </p>
                </div>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a6410] text-white transition active:scale-90">
                <ArrowRight className="h-5 w-5 -rotate-45" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ---- Hot Deals (Editorial Horizontal Scroll) ---- */}
      {!isSearchMode && promotions.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-2 px-5">
            <SparklesIcon className="h-5 w-5 text-[#924700]" />
            <h2 className="font-display text-xl font-extrabold text-[#1b1c19]">
              Curated Offers
            </h2>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="relative w-64 shrink-0 overflow-hidden rounded-[28px] bg-[#fbf9f4] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#1b1c19]/5"
              >
                <div className="absolute -right-6 -top-6 text-7xl opacity-10">
                  {promo.emoji ?? '🔥'}
                </div>
                <span className="inline-block rounded-full bg-[#924700]/10 px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#924700]">
                  {promo.promotion_type.replace('_', ' ')}
                </span>
                <p className="mt-3 font-display text-lg font-bold leading-tight text-[#1b1c19]">
                  {promo.title}
                </p>
                <p className="mt-1 font-label text-xs font-semibold text-[#44483a]/70">
                  {promo.business?.trading_name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- 2026 EDITORIAL VENDOR CARDS ---- */}
      <section className="mt-10 px-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-extrabold text-[#1b1c19]">
            {isSearchMode ? 'Results' : 'Trending Nearby'}
          </h2>
          {!isSearchMode && (
            <Link
              href="/explore"
              className="rounded-full bg-[#1b1c19]/5 px-4 py-1.5 font-label text-xs font-bold text-[#1b1c19] transition hover:bg-[#1b1c19]/10"
            >
              Map View
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 w-full animate-pulse rounded-[32px] bg-[#1b1c19]/5" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="font-display text-lg font-bold text-[#1b1c19]">Nothing found here.</p>
            <p className="text-sm text-[#44483a]/60">Try a different neighborhood or craving.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={vendor.slug ? `/store/${vendor.slug}` : '#'}
                className="group relative block h-80 w-full overflow-hidden rounded-[32px] bg-[#1b1c19] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(74,100,16,0.15)]"
              >
                {/* Stunning Image Cover */}
                <img
                  src={getCoverImage(vendor)}
                  alt={vendor.trading_name}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Top Badges */}
                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur-md border border-white/20 shadow-sm">
                      {vendor.chip_icon ?? '☕'}
                    </div>
                    {vendor.business_types.length > 0 && (
                      <span className="rounded-full bg-black/40 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {vendor.business_types[0]}
                      </span>
                    )}
                  </div>
                  
                  {/* Status Indicator */}
                  {vendor.is_accepting_orders ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410] shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4a6410] animate-pulse" />
                      Open
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-white/70 backdrop-blur-md">
                      Info Only
                    </span>
                  )}
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-md">
                    {vendor.trading_name}
                  </h3>
                  
                  {vendor.tagline && (
                    <p className="mt-1 line-clamp-1 font-body text-sm font-medium text-white/80">
                      {vendor.tagline}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                    <div className="flex items-center gap-2 font-label text-xs font-semibold text-white/90">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      <span>{vendor.neighborhood}</span>
                      {vendor.distance_km !== undefined && (
                        <>
                          <span className="opacity-50">•</span>
                          <span>{vendor.distance_km.toFixed(1)} km</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-[#1b1c19]">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---- Bottom Navigation ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl shadow-[0_-10px_40px_rgb(0,0,0,0.03)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} active />
          <NavItem href="/explore" label="Explore" icon={<MapIcon className="h-5 w-5" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-5 w-5" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-5 w-5" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-5 w-5" />} />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

function NavItem({
  href, label, icon, active = false,
}: {
  href: string; label: string; icon: React.ReactNode; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition ${
        active ? 'text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]/70 hover:-translate-y-0.5'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-extrabold tracking-wider">{label}</span>
    </Link>
  );
}
