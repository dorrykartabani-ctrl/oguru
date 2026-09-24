'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SearchIcon,
  MapIcon,
  MenuIcon,
  StarIcon,
  PlusIcon,
  HomeIcon,
  GiftIcon,
  HeartIcon,
  ReceiptIcon,
  UserCircleIcon,
} from '@/components/icons';
import { getApprovedVendorsWithLocations, searchVendors } from '@/lib/supabase/queries';
import { getFavoriteBusinessIds, toggleFavorite } from '@/lib/favorites';
import type { VendorCard } from '@/types/database';

function getCoverImage(vendor: VendorCard): string {
  if (vendor.logo_url) return vendor.logo_url;
  const type = vendor.business_types?.[0]?.toLowerCase() || '';
  if (type === 'bakery') return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800';
  if (type === 'produce' || type === 'grocery') return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
  return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800';
}

const FILTERS = ['All', 'Produce', 'Artisan', 'Dairy', 'Coffee', 'Bakery'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [vendors, setVendors] = useState<VendorCard[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSearchMode = query.trim().length > 0;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [data, favIds] = await Promise.all([
          isSearchMode ? searchVendors(query) : getApprovedVendorsWithLocations(20),
          getFavoriteBusinessIds(),
        ]);
        setVendors(data);
        setFavoriteIds(favIds);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    const timer = setTimeout(loadData, isSearchMode ? 300 : 0);
    return () => clearTimeout(timer);
  }, [query, isSearchMode]);

  const handleFavoriteClick = async (e: React.MouseEvent, businessId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = await toggleFavorite(businessId);
    setFavoriteIds((prev) =>
      nowFav ? [...prev, businessId] : prev.filter((id) => id !== businessId)
    );
  };

  const filteredVendors = vendors.filter((v) => {
    if (activeFilter === 'All') return true;
    return v.business_types?.some((t) => t.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-28 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Header ---- */}
        <header className="flex items-center justify-between pt-8 pb-4 md:pt-10">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-1.5 hover:bg-[#1b1c19]/5 transition">
              <MenuIcon className="h-6 w-6 text-[#4a6410]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white shadow-sm">
                <span className="font-display text-[10px] font-bold tracking-widest">OG</span>
              </div>
              <span className="font-display text-2xl font-extrabold text-[#4a6410]">OGuru</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 rounded-xl bg-[#4a6410]/15 px-3.5 py-2 font-label text-sm font-bold text-[#4a6410] transition hover:bg-[#4a6410]/25"
            >
              <MapIcon className="h-4 w-4" /> Map View
            </Link>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal-600 text-white shadow-sm">
              <UserCircleIcon className="mt-2 h-8 w-8 opacity-80" />
            </div>
          </div>
        </header>

        {/* ---- Search Bar ---- */}
        <section className="mt-2">
          <div className="flex items-center rounded-2xl bg-[#ebe8db] px-4 py-3.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4a6410]/20 shadow-sm">
            <SearchIcon className="h-5 w-5 text-[#44483a]/60 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organic vendors..."
              className="ml-3 w-full bg-transparent font-body text-base text-[#1b1c19] placeholder:text-[#44483a]/50 outline-none"
            />
          </div>
        </section>

        {/* ---- Filter Pills ---- */}
        <section className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-xl px-4 py-2 font-label text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-[#4a6410] text-white shadow-sm'
                    : 'border border-[#1b1c19]/10 bg-white text-[#44483a] hover:bg-[#ebe8db]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* ---- Title Row ---- */}
        <div className="mt-8 flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#1b1c19]">
            {isSearchMode ? 'Search Results' : 'Nearby Vendors'}
          </h2>
          <span className="font-label text-sm font-bold text-[#924700]">
            {filteredVendors.length} found
          </span>
        </div>

        {/* ---- Vendor Grid ---- */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 w-full animate-pulse rounded-[32px] bg-[#ebe8db]" />
              ))}
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="mt-12 text-center py-12">
              <p className="font-display text-lg font-bold text-[#1b1c19]">No vendors found.</p>
              <p className="text-sm text-[#44483a]/60 mt-1">Try searching for something else or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVendors.map((vendor) => {
                const isFav = favoriteIds.includes(vendor.id);
                return (
                  <Link
                    key={vendor.id}
                    href={vendor.slug ? `/store/${vendor.slug}` : '#'}
                    className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    {/* Image Half */}
                    <div className="relative h-48 sm:h-52 w-full bg-[#ebe8db] overflow-hidden">
                      <img
                        src={getCoverImage(vendor)}
                        alt={vendor.trading_name ?? 'Vendor cover'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Favorite Button (Top Right) */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, vendor.id)}
                        className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#924700] shadow-sm backdrop-blur-sm transition active:scale-90"
                        aria-label={isFav ? 'Unfavorite vendor' : 'Favorite vendor'}
                      >
                        <HeartIcon
                          className={`h-4.5 w-4.5 ${
                            isFav ? 'fill-[#924700] text-[#924700]' : 'text-[#924700]'
                          }`}
                        />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute left-3.5 top-3.5 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                        <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-label text-[11px] font-extrabold text-[#1b1c19]">4.9</span>
                      </div>

                      {/* Top Rated Badge */}
                      <div className="absolute bottom-3.5 left-3.5 rounded-md bg-[#4a6410]/90 px-2.5 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                        Top Rated
                      </div>
                    </div>

                    {/* Content Half */}
                    <div className="relative p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between pr-10">
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[#2d1b14] leading-tight line-clamp-1">
                            {vendor.trading_name}
                          </h3>
                          {vendor.is_accepting_orders ? (
                            <span className="shrink-0 rounded-md bg-[#4a6410]/10 px-2 py-0.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
                              Open
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-md bg-[#1b1c19]/5 px-2 py-0.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
                              Closed
                            </span>
                          )}
                        </div>
                        
                        <p className="mt-1.5 font-label text-xs sm:text-sm font-semibold text-[#44483a]/60 line-clamp-1">
                          <span className="capitalize">{vendor.business_types?.[0] || 'Artisan'}</span>
                          {vendor.tagline && ` • ${vendor.tagline}`}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 flex items-center justify-between">
                        <span className="font-label text-xs font-bold uppercase tracking-wider text-[#44483a]/50">
                          {vendor.distance_km !== undefined
                            ? `${vendor.distance_km.toFixed(1)} miles away`
                            : vendor.neighborhood || 'Local Partner'}
                        </span>

                        {/* Add Button */}
                        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4a6410] text-white shadow-sm transition active:scale-95 group-hover:bg-[#3b500b]">
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ---- Bottom Navigation ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} active />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} />
          <NavItem href="/favorites" label="Favs" icon={<HeartIcon className="h-6 w-6" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-6 w-6" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-6 w-6" />} />
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
      className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition ${
        active ? 'bg-[#4a6410]/10 text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]/70'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-bold">{label}</span>
    </Link>
  );
}
