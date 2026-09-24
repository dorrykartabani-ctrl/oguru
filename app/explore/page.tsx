'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SearchIcon,
  MapPinIcon,
  ArrowLeft,
  HomeIcon,
  MapIcon,
  GiftIcon,
  ReceiptIcon,
  UserCircleIcon,
  ChevronRight,
} from '@/components/icons';
import { getMapPins } from '@/lib/supabase/queries';
import type { MapPin } from '@/types/database';

/* ------------------------------------------------------------------ */
/*  Fallback pins (Sydney) if Supabase is empty                        */
/* ------------------------------------------------------------------ */

const FALLBACK_PINS: MapPin[] = [
  { location_id: 'fl-1', business_id: 'fb-1', trading_name: 'Old Spike Roastery', chip_icon: '☕', chip_color: '#4a6410', latitude: -33.8833, longitude: 151.21, is_accepting_orders: true, neighborhood: 'Surry Hills', suburb: 'Surry Hills' },
  { location_id: 'fl-2', business_id: 'fb-2', trading_name: 'Pophams', chip_icon: '🥐', chip_color: '#924700', latitude: -33.8985, longitude: 151.1793, is_accepting_orders: true, neighborhood: 'Newtown', suburb: 'Newtown' },
  { location_id: 'fl-3', business_id: 'fb-3', trading_name: 'The Dusty Knuckle', chip_icon: '🍞', chip_color: '#77574d', latitude: -33.9107, longitude: 151.1547, is_accepting_orders: false, neighborhood: 'Marrickville', suburb: 'Marrickville' },
];

// Default center: Surry Hills, Sydney
const DEFAULT_CENTER = { lat: -33.8833, lng: 151.21 };

/* ------------------------------------------------------------------ */
/*  Pin Status Colors                                                  */
/* ------------------------------------------------------------------ */

function getPinColor(pin: MapPin): string {
  if (pin.is_accepting_orders) return '#4a6410'; // Green = Pre-orders Open
  return '#9ca3af'; // Grey = Info Only
}

function getPinLabel(pin: MapPin): string {
  if (pin.is_accepting_orders) return 'Pre-orders Open';
  return 'Info Only';
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [pins, setPins] = useState<MapPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load real pins
  useEffect(() => {
    async function loadPins() {
      try {
        const data = await getMapPins();
        setPins(data.length > 0 ? data : FALLBACK_PINS);
      } catch (err) {
        console.error('Failed to load map pins:', err);
        setPins(FALLBACK_PINS);
      } finally {
        setIsLoading(false);
      }
    }
    loadPins();
  }, []);

  return (
    <main className="relative h-screen bg-[#fbf9f4] font-body">
      {/* ---- Map Canvas Placeholder ---- */}
      {/* Replace with Leaflet/Mapbox in production */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0d8]/30 via-[#fbf9f4] to-[#d4e4b8]/20">
        {/* Grid overlay to simulate map */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1b1c19 1px, transparent 1px), linear-gradient(90deg, #1b1c19 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Rendered Pins */}
        {!isLoading &&
          pins.map((pin) => (
            <button
              key={pin.location_id}
              onClick={() => setSelectedPin(pin)}
              className="absolute z-10 flex flex-col items-center transition-transform hover:scale-110"
              style={{
                // Simple positioning based on lat/lng offset from center
                // In production, Leaflet handles this natively
                left: `${50 + (pin.longitude - DEFAULT_CENTER.lng) * 80}%`,
                top: `${50 + (pin.latitude - DEFAULT_CENTER.lat) * -80}%`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-lg shadow-md"
                style={{ backgroundColor: getPinColor(pin) + '20' }}
              >
                {pin.chip_icon ?? '📍'}
              </div>
              <div
                className="mt-0.5 h-2 w-2 rotate-45 rounded-sm"
                style={{ backgroundColor: getPinColor(pin) }}
              />
            </button>
          ))}

        {/* "You are here" marker */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -inset-3 animate-ping rounded-full bg-[#4a6410]/20" />
            <div className="relative h-4 w-4 rounded-full border-2 border-white bg-[#4a6410] shadow-md" />
          </div>
        </div>
      </div>

      {/* ---- Top Bar ---- */}
      <div className="absolute left-0 right-0 top-0 z-30 px-5 pt-14">
        <Link
          href={initialQuery ? `/home?q=${initialQuery}` : '/home'}
          className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#44483a] shadow-sm backdrop-blur-md transition hover:bg-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to List
        </Link>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#44483a]/40" />
          <input
            type="text"
            defaultValue={initialQuery}
            placeholder="Search this area..."
            className="w-full rounded-2xl border border-[#1b1c19]/5 bg-white/90 py-3 pl-11 pr-4 text-sm text-[#1b1c19] shadow-md backdrop-blur-md outline-none placeholder:text-[#44483a]/40 focus:bg-white focus:ring-2 focus:ring-[#4a6410]/10"
          />
        </div>
      </div>

      {/* ---- Selected Pin Info Card ---- */}
      {selectedPin && (
        <div className="absolute bottom-32 left-5 right-5 z-30 rounded-2xl bg-white p-4 shadow-organic">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
              style={{
                backgroundColor: selectedPin.chip_color
                  ? `${selectedPin.chip_color}18`
                  : '#f3f3f0',
              }}
            >
              {selectedPin.chip_icon ?? '☕'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-[#1b1c19]">
                {selectedPin.trading_name}
              </p>
              <div className="flex items-center gap-2 font-label text-xs text-[#44483a]/60">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: getPinColor(selectedPin) }}
                />
                {getPinLabel(selectedPin)}
                {selectedPin.neighborhood && (
                  <>
                    <span>•</span>
                    <span>{selectedPin.neighborhood}</span>
                  </>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#44483a]/30" />
          </div>
        </div>
      )}

      {/* ---- Bottom Vendor Carousel ---- */}
      <div className="absolute bottom-20 left-0 right-0 z-30">
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {pins.map((pin) => (
            <button
              key={pin.location_id}
              onClick={() => setSelectedPin(pin)}
              className={`flex w-44 shrink-0 flex-col gap-1.5 rounded-2xl p-3 shadow-sm transition ${
                selectedPin?.location_id === pin.location_id
                  ? 'bg-[#4a6410] text-white'
                  : 'bg-white text-[#1b1c19]'
              }`}
            >
              <span className="text-lg">{pin.chip_icon ?? '☕'}</span>
              <p className="truncate font-display text-xs font-bold">
                {pin.trading_name}
              </p>
              <span
                className={`font-label text-[9px] font-semibold uppercase ${
                  selectedPin?.location_id === pin.location_id
                    ? 'text-white/70'
                    : 'text-[#44483a]/50'
                }`}
              >
                {getPinLabel(pin)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Bottom Navigation ---- */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
          <NavItem href="/explore" label="Explore" icon={<MapIcon className="h-5 w-5" />} active />
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
