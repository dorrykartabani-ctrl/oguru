'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  SearchIcon,
  ArrowRight,
  CoffeeIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  HomeIcon,
  MapIcon,
  GiftIcon,
  ReceiptIcon,
  UserCircleIcon,
  HeartIcon,
} from '@/components/icons';
import {
  getApprovedVendorsWithLocations,
  searchVendors,
  getActivePromotions,
} from '@/lib/supabase/queries';
import type { VendorCard, PromotionCard } from '@/types/database';

/* ------------------------------------------------------------------ */
/*  Fallback mock data (shown while loading or if Supabase is empty)   */
/* ------------------------------------------------------------------ */

const FALLBACK_VENDORS: VendorCard[] = [
  {
    id: 'mock-1', trading_name: 'Old Spike Roastery', tagline: 'Small-batch roastery, big flavour.',
    slug: 'old-spike-roastery', logo_url: null, chip_icon: '☕', chip_color: '#4a6410',
    business_types: ['café', 'roastery'], location_id: 'ml-1', location_name: 'Old Spike — Surry Hills',
    neighborhood: 'Surry Hills', suburb: 'Surry Hills', latitude: -33.8833, longitude: 151.21,
    is_accepting_orders: true,
  },
  {
    id: 'mock-2', trading_name: 'Pophams', tagline: 'Hand-laminated, heart-made.',
    slug: 'pophams', logo_url: null, chip_icon: '🥐', chip_color: '#924700',
    business_types: ['bakery', 'café'], location_id: 'ml-2', location_name: 'Pophams — Newtown',
    neighborhood: 'Newtown', suburb: 'Newtown', latitude: -33.8985, longitude: 151.1793,
    is_accepting_orders: true,
  },
  {
    id: 'mock-3', trading_name: 'The Dusty Knuckle', tagline: 'Slow-fermented, soul-warming.',
    slug: 'the-dusty-knuckle', logo_url: null, chip_icon: '🍞', chip_color: '#77574d',
    business_types: ['bakery', 'café'], location_id: 'ml-3', location_name: 'Dusty Knuckle — Marrickville',
    neighborhood: 'Marrickville', suburb: 'Marrickville', latitude: -33.9107, longitude: 151.1547,
    is_accepting_orders: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

  // Initial data load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [vendorData, promoData] = await Promise.all([
          getApprovedVendorsWithLocations(10),
          getActivePromotions(5),
        ]);
        setVendors(vendorData.length > 0 ? vendorData : FALLBACK_VENDORS);
        setPromotions(promoData);
      } catch (err) {
        console.error('Failed to load home data:', err);
        setVendors(FALLBACK_VENDORS);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isSearchMode) {
      // Reset to trending when search cleared
      getApprovedVendorsWithLocations(10).then((data) => {
        if (data.length > 0) setVendors(data);
      });
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchVendors(query);
      setVendors(results.length > 0 ? results : []);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isSearchMode]);

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body">
      {/* ---- Header ---- */}
      <header className="px-5 pt-14 pb-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
          {getGreeting()}, Alex
        </h1>
        <p className="mt-1 text-sm text-[#44483a]">
          {isSearchMode
            ? `${vendors.length} result${vendors.length !== 1 ? 's' : ''} for "${query}"`
            : 'What are you craving this morning?'}
        </p>
      </header>

      {/* ---- Search Bar ---- */}
      <section className="mx-5 mt-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#44483a]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cafés, bakeries, pastries..."
            className="w-full rounded-2xl border border-[#1b1c19]/10 bg-white py-3.5 pl-12 pr-4 font-body text-sm text-[#1b1c19] shadow-sm outline-none transition placeholder:text-[#44483a]/40 focus:border-[#4a6410]/40 focus:ring-2 focus:ring-[#4a6410]/10"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
            </div>
          )}
        </div>

        {/* Location chip */}
        {!isSearchMode && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4a6410]/10 px-3 py-1 font-label text-xs font-semibold text-[#4a6410]">
              <MapPinIcon className="h-3 w-3" />
              Near Surry Hills
            </span>
            <span className="font-label text-xs text-[#44483a]/50">• Within 5 km</span>
          </div>
        )}
      </section>

      {/* ---- Hot Deals (only in feed mode, if promotions exist) ---- */}
      {!isSearchMode && promotions.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center gap-2 px-5">
            <SparklesIcon className="h-4 w-4 text-[#924700]" />
            <h2 className="font-display text-lg font-semibold text-[#1b1c19]">
              Hot Deals
            </h2>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="w-56 shrink-0 rounded-2xl bg-gradient-to-br from-[#924700]/10 to-[#fed3c7]/40 p-4 shadow-sm"
              >
                <span className="text-2xl">{promo.emoji ?? '🔥'}</span>
                <p className="mt-2 font-display text-sm font-bold text-[#1b1c19]">
                  {promo.title}
                </p>
                <p className="mt-0.5 font-label text-xs text-[#44483a]/60">
                  {promo.business?.trading_name}
                </p>
                {promo.sale_price_cents && promo.original_price_cents && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-[#924700]">
                      {formatPrice(promo.sale_price_cents)}
                    </span>
                    <span className="font-label text-xs text-[#44483a]/40 line-through">
                      {formatPrice(promo.original_price_cents)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- Quick Reorder (feed mode only) ---- */}
      {!isSearchMode && (
        <section className="mx-5 mt-6">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4e4b8] text-lg">
                ☕
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#1b1c19]">
                  Oat Flat White + Almond Croissant
                </p>
                <p className="font-label text-xs text-[#44483a]/60">
                  Old Spike Roastery · Last ordered yesterday
                </p>
              </div>
            </div>
            <button className="rounded-xl bg-[#4a6410] px-4 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-95">
              Reorder
            </button>
          </div>
        </section>
      )}

      {/* ---- Vendor List (Trending or Search Results) ---- */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-display text-lg font-semibold text-[#1b1c19]">
            {isSearchMode ? 'Search Results' : 'Trending Near You'}
          </h2>
          {!isSearchMode && (
            <Link
              href="/explore"
              className="font-label text-xs font-semibold text-[#4a6410] hover:underline"
            >
              View Map
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="mt-4 space-y-3 px-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#1b1c19]/5" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="mt-8 px-5 text-center">
            <p className="font-body text-sm text-[#44483a]/50">
              No vendors found. Try a different search.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3 px-5">
            {vendors.map((vendor) => (
              <li key={vendor.id}>
                <Link
                  href={vendor.slug ? `/vendor/${vendor.slug}` : '#'}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-organic active:scale-[0.99]"
                >
                  {/* Avatar / Chip */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{
                      backgroundColor: vendor.chip_color
                        ? `${vendor.chip_color}18`
                        : '#f3f3f0',
                    }}
                  >
                    {vendor.chip_icon ?? '☕'}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-sm font-bold text-[#1b1c19]">
                        {vendor.trading_name}
                      </p>
                      {vendor.is_accepting_orders && (
                        <span className="shrink-0 rounded-full bg-[#4a6410]/10 px-2 py-0.5 font-label text-[9px] font-bold uppercase text-[#4a6410]">
                          Open
                        </span>
                      )}
                      {!vendor.is_accepting_orders && (
                        <span className="shrink-0 rounded-full bg-[#1b1c19]/5 px-2 py-0.5 font-label text-[9px] font-bold uppercase text-[#44483a]/40">
                          Info Only
                        </span>
                      )}
                    </div>
                    {vendor.tagline && (
                      <p className="mt-0.5 truncate font-body text-xs text-[#44483a]/70">
                        {vendor.tagline}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2 font-label text-[10px] text-[#44483a]/50">
                      {vendor.neighborhood && (
                        <span className="flex items-center gap-0.5">
                          <MapPinIcon className="h-2.5 w-2.5" />
                          {vendor.neighborhood}
                        </span>
                      )}
                      {vendor.distance_km !== undefined && (
                        <>
                          <span>•</span>
                          <span>{vendor.distance_km.toFixed(1)} km</span>
                        </>
                      )}
                      {vendor.business_types.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="capitalize">
                            {vendor.business_types[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[#44483a]/20" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---- Bottom Navigation ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl">
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
        active ? 'text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]/70'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
