'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  SearchIcon,
  HeartIcon,
  HomeIcon,
  GiftIcon,
  ReceiptIcon,
  UserCircleIcon,
  ArrowRight,
  CoffeeIcon,
  ChevronDown,
  MapPinIcon,
} from '@/components/icons';
import { getApprovedVendorsWithLocations } from '@/lib/supabase/queries';
import { getFavoriteBusinessIds, toggleFavorite } from '@/lib/favorites';
import type { VendorCard } from '@/types/database';

function getCoverImage(vendor: VendorCard): string {
  if (vendor.logo_url) return vendor.logo_url;
  const type = vendor.business_types?.[0]?.toLowerCase() || '';
  if (type === 'bakery')
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600';
  if (type === 'produce' || type.includes('juice'))
    return 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&q=80&w=600';
  return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600';
}

const FILTERS = ['ALL', 'COFFEE', 'BAKERY', 'JUICE'];

export default function FavoritesPage() {
  const [vendors, setVendors] = useState<VendorCard[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allVendors, favIds] = await Promise.all([
          getApprovedVendorsWithLocations(24),
          getFavoriteBusinessIds(),
        ]);
        setVendors(allVendors);
        // Seed demo favorites if empty so UI isn't blank on first visit
        if (favIds.length === 0 && allVendors.length > 0) {
          const seeded = allVendors.slice(0, Math.min(4, allVendors.length)).map((v) => v.id);
          setFavoriteIds(seeded);
        } else {
          setFavoriteIds(favIds);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleFav = async (e: React.MouseEvent, businessId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = await toggleFavorite(businessId);
    setFavoriteIds((prev) =>
      nowFav ? [...prev, businessId] : prev.filter((id) => id !== businessId)
    );
  };

  const savedVendors = vendors.filter((v) => favoriteIds.includes(v.id));
  const suggested = vendors.filter((v) => !favoriteIds.includes(v.id)).slice(0, 4);

  const filtered = savedVendors.filter((v) => {
    if (activeFilter === 'ALL') return true;
    const t = (v.business_types || []).join(' ').toLowerCase();
    if (activeFilter === 'COFFEE') return t.includes('café') || t.includes('cafe') || t.includes('coffee') || t.includes('roastery');
    if (activeFilter === 'BAKERY') return t.includes('bakery');
    if (activeFilter === 'JUICE') return t.includes('juice') || t.includes('produce');
    return true;
  });

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-28 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between pt-12 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4a6410] transition hover:bg-[#1b1c19]/5"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="font-display text-xl font-extrabold text-[#4a6410]">
              Saved Vendors
            </h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#4a6410] transition hover:bg-[#1b1c19]/5">
            <SearchIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Your Usual Order */}
        <section className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
              Your Usual Order
            </span>
            <span className="rounded-md bg-[#4a6410]/15 px-2 py-0.5 font-label text-[9px] font-extrabold uppercase tracking-wider text-[#4a6410]">
              Open Now
            </span>
          </div>
          <Link
            href="/home"
            className="flex items-center justify-between rounded-2xl bg-[#4a6410] p-4 text-white shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <CoffeeIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base font-bold leading-tight">
                  Caramel Latte
                </p>
                <p className="font-label text-[10px] font-bold uppercase tracking-wider text-white/70">
                  The Roasted Bean
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 font-label text-xs font-extrabold">
              Order Your Usual
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </section>

        {/* Filters */}
        <section className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => {
            const count =
              f === 'ALL'
                ? savedVendors.length
                : savedVendors.filter((v) => {
                    const t = (v.business_types || []).join(' ').toLowerCase();
                    if (f === 'COFFEE') return t.includes('café') || t.includes('cafe') || t.includes('coffee') || t.includes('roastery');
                    if (f === 'BAKERY') return t.includes('bakery');
                    if (f === 'JUICE') return t.includes('juice') || t.includes('produce');
                    return false;
                  }).length;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 rounded-full px-4 py-1.5 font-label text-xs font-bold transition-all ${
                  activeFilter === f
                    ? 'bg-[#4a6410] text-white shadow-sm'
                    : 'bg-[#ebe8db] text-[#44483a] hover:bg-[#1b1c19]/10'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </section>

        {/* Meta row */}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
            {filtered.length} Vendors Found
          </span>
          <button className="flex items-center gap-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
            Sort: Recent
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Saved vendor cards — 2 cols mobile, 3–4 desktop */}
        <section className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-[#ebe8db]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <HeartIcon className="mx-auto h-10 w-10 text-[#44483a]/25" />
              <p className="mt-3 font-display text-lg font-bold text-[#1b1c19]">
                No saved vendors yet
              </p>
              <p className="mt-1 text-sm text-[#44483a]/60">
                Tap the heart on any vendor card to follow them.
              </p>
              <Link
                href="/home"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#4a6410] px-5 py-3 font-label text-xs font-bold text-white"
              >
                Discover vendors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((vendor) => (
                <VendorFavCard
                  key={vendor.id}
                  vendor={vendor}
                  isFavorite={favoriteIds.includes(vendor.id)}
                  onToggle={handleToggleFav}
                />
              ))}
            </div>
          )}
        </section>

        {/* You Might Also Like */}
        {suggested.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-extrabold text-[#1b1c19]">
              You Might Also Like
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {suggested.map((vendor) => (
                <VendorFavCard
                  key={vendor.id}
                  vendor={vendor}
                  isFavorite={false}
                  onToggle={handleToggleFav}
                  showMeta={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} />
          <NavItem href="/favorites" label="Favs" icon={<HeartIcon className="h-6 w-6" />} active />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-6 w-6" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-6 w-6" />} />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

function VendorFavCard({
  vendor,
  isFavorite,
  onToggle,
  showMeta = true,
}: {
  vendor: VendorCard;
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent, id: string) => void;
  showMeta?: boolean;
}) {
  return (
    <Link
      href={vendor.slug ? `/store/${vendor.slug}` : '#'}
      className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe8db]">
        <img
          src={getCoverImage(vendor)}
          alt={vendor.trading_name ?? 'Vendor'}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Favorite heart */}
        <button
          onClick={(e) => onToggle(e, vendor.id)}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#924700] shadow-sm backdrop-blur-sm transition active:scale-90"
          aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <HeartIcon
            className={`h-4.5 w-4.5 ${isFavorite ? 'fill-[#924700] text-[#924700]' : 'text-[#924700]'}`}
          />
        </button>

        {/* Open / Closed */}
        <span
          className={`absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5 font-label text-[9px] font-extrabold uppercase tracking-wider ${
            vendor.is_accepting_orders
              ? 'bg-[#4a6410] text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {vendor.is_accepting_orders ? 'Open' : 'Closed'}
        </span>
      </div>

      {showMeta && (
        <div className="p-3">
          <h3 className="font-display text-sm font-bold text-[#1b1c19] line-clamp-1">
            {vendor.trading_name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 font-label text-[10px] font-semibold text-[#44483a]/60">
            <MapPinIcon className="h-3 w-3" />
            {vendor.distance_km !== undefined
              ? `${vendor.distance_km.toFixed(1)} mi`
              : vendor.neighborhood || 'Nearby'}
            <span className="opacity-40">•</span>
            <span>Last: recent</span>
          </p>
        </div>
      )}
    </Link>
  );
}

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
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
