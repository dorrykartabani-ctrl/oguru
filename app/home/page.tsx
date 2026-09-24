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
  const [isLoading, setIsLoading] = useState(true);

  const isSearchMode = query.trim().length > 0;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (isSearchMode) {
          const results = await searchVendors(query);
          setVendors(results);
        } else {
          const data = await getApprovedVendorsWithLocations(20);
          setVendors(data);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    const timer = setTimeout(loadData, isSearchMode ? 300 : 0);
    return () => clearTimeout(timer);
  }, [query, isSearchMode]);

  // Apply pill filters locally
  const filteredVendors = vendors.filter((v) => {
    if (activeFilter === 'All') return true;
    return v.business_types?.some((t) => t.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-28 font-body">
      {/* ---- Header ---- */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <MenuIcon className="h-6 w-6 text-[#4a6410]" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <span className="font-display text-[10px] font-bold tracking-widest">OG</span>
            </div>
            <span className="font-display text-2xl font-extrabold text-[#4a6410]">OGuru</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-lg bg-[#4a6410]/15 px-3 py-2 font-label text-sm font-bold text-[#4a6410] transition hover:bg-[#4a6410]/25"
          >
            <MapIcon className="h-4 w-4" /> Map View
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm overflow-hidden">
             {/* Mock Avatar placeholder matching screenshot */}
             <UserCircleIcon className="h-8 w-8 mt-2 opacity-80" />
          </div>
        </div>
      </header>

      {/* ---- Search Bar ---- */}
      <section className="px-5 mt-2">
        <div className="flex items-center rounded-2xl bg-[#ebe8db] px-4 py-3.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4a6410]/20">
          <SearchIcon className="h-5 w-5 text-[#44483a]/60" />
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
      <section className="mt-5 px-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-xl px-4 py-1.5 font-label text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#4a6410] text-white shadow-sm'
                  : 'border border-[#1b1c19]/10 bg-white text-[#44483a] hover:bg-[#f6f4eb]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* ---- Title Row ---- */}
      <div className="mt-6 flex items-end justify-between px-5 mb-4">
        <h2 className="font-display text-[22px] font-extrabold text-[#1b1c19]">
          {isSearchMode ? 'Search Results' : 'Nearby Vendors'}
        </h2>
        <span className="font-label text-sm font-bold text-[#924700]">
          {filteredVendors.length} found
        </span>
      </div>

      {/* ---- Vendor Cards ---- */}
      <section className="px-5">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-72 w-full animate-pulse rounded-[32px] bg-[#ebe8db]" />
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-display text-lg font-bold text-[#1b1c19]">No vendors found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={vendor.slug ? `/store/${vendor.slug}` : '#'}
                className="group relative block overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image Half */}
                <div className="relative h-[200px] w-full bg-[#ebe8db]">
                  <img
                    src={getCoverImage(vendor)}
                    alt={vendor.trading_name}
                    className="h-full w-full object-cover"
                  />
                  {/* Rating Badge */}
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 shadow-sm">
                    <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-label text-[11px] font-extrabold text-[#1b1c19]">4.9</span>
                  </div>
                  {/* Top Rated Badge */}
                  <div className="absolute bottom-4 left-4 rounded-md bg-[#4a6410]/90 px-2.5 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                    Top Rated
                  </div>
                </div>

                {/* Content Half */}
                <div className="relative p-5">
                  <div className="flex items-start justify-between pr-14">
                    <h3 className="font-display text-xl font-bold text-[#2d1b14] leading-tight">
                      {vendor.trading_name}
                    </h3>
                    {vendor.is_accepting_orders ? (
                      <span className="shrink-0 rounded-md bg-[#4a6410]/10 px-2 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
                        Open
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-md bg-[#1b1c19]/5 px-2 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
                        Closed
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-label text-sm font-semibold text-[#44483a]/60">
                    <span className="capitalize">{vendor.business_types?.[0] || 'Artisan'}</span>
                    {vendor.tagline && ` • ${vendor.tagline.split(' ')[0]}...`}
                    {vendor.distance_km !== undefined && (
                       <span className="float-right">{vendor.distance_km.toFixed(1)} MILES AWAY</span>
                    )}
                  </p>

                  {/* Add Button */}
                  <button className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a6410] text-white shadow-sm transition active:scale-95">
                    <PlusIcon className="h-6 w-6" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---- Bottom Navigation (Matching Screenshot layout) ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} active />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} />
          <NavItem href="/explore" label="Favs" icon={<HeartIcon className="h-6 w-6" />} />
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
