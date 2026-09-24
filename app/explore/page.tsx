'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
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
  StarIcon,
  ShareIcon,
  ExternalLinkIcon,
  SendIcon,
  XIcon,
  CheckCircleIcon,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NearbyPin {
  source: 'oguru' | 'google';
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_accepting_orders: boolean;
  chip_icon: string | null;
  chip_color: string | null;
  neighborhood: string | null;
  slug?: string;
  tagline?: string;
  google_place_id?: string;
  google_rating?: number;
  google_reviews?: number;
  google_photo_ref?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_CENTER = { lat: -33.8833, lng: 151.21 };

function getPinColor(pin: NearbyPin): string {
  if (pin.source === 'oguru' && pin.is_accepting_orders) return '#4a6410';
  if (pin.source === 'oguru') return '#924700';
  return '#9ca3af';
}

function getPinLabel(pin: NearbyPin): string {
  if (pin.source === 'oguru' && pin.is_accepting_orders) return 'Pre-orders Open';
  if (pin.source === 'oguru') return 'Limited Slots';
  return 'Info Only';
}

function getPinBg(pin: NearbyPin): string {
  if (pin.source === 'oguru' && pin.is_accepting_orders) return 'bg-[#4a6410]/15';
  if (pin.source === 'oguru') return 'bg-[#924700]/15';
  return 'bg-[#9ca3af]/15';
}

/* ------------------------------------------------------------------ */
/*  Inner Component (needs useSearchParams inside Suspense)            */
/* ------------------------------------------------------------------ */

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [pins, setPins] = useState<NearbyPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<NearbyPin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ oguru_count: 0, google_count: 0, total: 0 });

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<NearbyPin | null>(null);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteShareUrl, setInviteShareUrl] = useState('');

  // Load nearby data
  const loadPins = useCallback(async (q?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        lat: String(DEFAULT_CENTER.lat),
        lng: String(DEFAULT_CENTER.lng),
        radius: '3000',
        q: q || 'cafe bakery',
      });
      const res = await fetch(`/api/nearby?${params}`);
      const data = await res.json();

      if (data.pins && data.pins.length > 0) {
        setPins(data.pins);
        setMeta(data.meta);
      } else {
        // Fallback if API fails or returns empty
        setPins([]);
      }
    } catch (err) {
      console.error('Failed to load nearby pins:', err);
      setPins([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPins(initialQuery);
  }, [initialQuery, loadPins]);

  // Invite handler
  const handleInvite = async () => {
    if (!inviteTarget) return;
    setInviteStatus('sending');

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: inviteTarget.name,
          business_type: 'café',
          google_place_id: inviteTarget.google_place_id,
          notes: 'Invited from Oguru map explore view',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setInviteStatus('sent');
        setInviteMessage(data.message);
        setInviteShareUrl(data.share_url);
      } else {
        setInviteStatus('error');
        setInviteMessage(data.error ?? 'Something went wrong');
      }
    } catch {
      setInviteStatus('error');
      setInviteMessage('Network error. Try again.');
    }
  };

  const openInviteModal = (pin: NearbyPin) => {
    setInviteTarget(pin);
    setInviteStatus('idle');
    setInviteMessage('');
    setInviteShareUrl('');
    setShowInviteModal(true);
  };

  // Separate pins for rendering
  const oguruPins = pins.filter((p) => p.source === 'oguru');
  const googlePins = pins.filter((p) => p.source === 'google');

  return (
    <main className="relative h-screen bg-[#fbf9f4] font-body">
      {/* ============================================================ */}
      {/*  MAP CANVAS                                                   */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0d8]/30 via-[#fbf9f4] to-[#d4e4b8]/20">
        {/* Grid overlay */}
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
              key={`${pin.source}-${pin.id}`}
              onClick={() => setSelectedPin(pin)}
              className={`absolute z-10 flex flex-col items-center transition-transform hover:scale-125 ${
                selectedPin?.id === pin.id ? 'z-20 scale-125' : ''
              }`}
              style={{
                left: `${50 + (pin.longitude - DEFAULT_CENTER.lng) * 80}%`,
                top: `${50 + (pin.latitude - DEFAULT_CENTER.lat) * -80}%`,
              }}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base shadow-md ${
                  pin.source === 'oguru'
                    ? 'border-white'
                    : 'border-white/70'
                }`}
                style={{
                  backgroundColor:
                    pin.source === 'oguru'
                      ? `${getPinColor(pin)}25`
                      : '#f3f4f6',
                }}
              >
                {pin.chip_icon ?? '📍'}
              </div>
              <div
                className="mt-0.5 h-1.5 w-1.5 rotate-45 rounded-sm"
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

      {/* ============================================================ */}
      {/*  TOP BAR                                                      */}
      {/* ============================================================ */}
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

        {/* Pin Legend */}
        {!isLoading && (
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/80 px-3 py-1.5 backdrop-blur-md">
            <span className="flex items-center gap-1 font-label text-[10px] text-[#44483a]/60">
              <span className="h-2 w-2 rounded-full bg-[#4a6410]" />
              Oguru ({meta.oguru_count})
            </span>
            <span className="flex items-center gap-1 font-label text-[10px] text-[#44483a]/60">
              <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
              Nearby ({meta.google_count})
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  SELECTED PIN INFO CARD                                       */}
      {/* ============================================================ */}
      {selectedPin && (
        <div className="absolute bottom-32 left-4 right-4 z-30 overflow-hidden rounded-2xl bg-white shadow-organic">
          <div className="flex items-start gap-3 p-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${getPinBg(selectedPin)}`}
            >
              {selectedPin.chip_icon ?? '📍'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-sm font-bold text-[#1b1c19]">
                  {selectedPin.name}
                </p>
                {selectedPin.source === 'oguru' && (
                  <span className="shrink-0 rounded-full bg-[#4a6410]/10 px-1.5 py-0.5 font-label text-[8px] font-bold uppercase text-[#4a6410]">
                    Partner
                  </span>
                )}
              </div>

              {selectedPin.tagline && (
                <p className="mt-0.5 truncate text-xs text-[#44483a]/70">
                  {selectedPin.tagline}
                </p>
              )}

              <div className="mt-1 flex items-center gap-2 font-label text-[10px] text-[#44483a]/50">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: getPinColor(selectedPin) }}
                />
                {getPinLabel(selectedPin)}
                {selectedPin.address && (
                  <>
                    <span>•</span>
                    <span className="truncate">{selectedPin.address}</span>
                  </>
                )}
              </div>

              {/* Google rating */}
              {selectedPin.google_rating && (
                <div className="mt-1 flex items-center gap-1">
                  <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-label text-[10px] font-semibold text-[#1b1c19]">
                    {selectedPin.google_rating}
                  </span>
                  <span className="font-label text-[10px] text-[#44483a]/40">
                    ({selectedPin.google_reviews})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex border-t border-[#1b1c19]/5">
            {selectedPin.source === 'oguru' ? (
              <>
                <Link
                  href={selectedPin.slug ? `/vendor/${selectedPin.slug}` : '#'}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[#4a6410] transition hover:bg-[#4a6410]/5"
                >
                  View Menu
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="w-px bg-[#1b1c19]/5" />
                <button className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[#924700] transition hover:bg-[#924700]/5">
                  Pre-order
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openInviteModal(selectedPin)}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[#4a6410] transition hover:bg-[#4a6410]/5"
                >
                  <SendIcon className="h-3.5 w-3.5" />
                  Invite to Oguru
                </button>
                <div className="w-px bg-[#1b1c19]/5" />
                <button className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[#44483a]/50 transition hover:bg-[#1b1c19]/5">
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Directions
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  BOTTOM VENDOR CAROUSEL                                       */}
      {/* ============================================================ */}
      <div className="absolute bottom-20 left-0 right-0 z-30">
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 w-44 shrink-0 animate-pulse rounded-2xl bg-white/60"
              />
            ))
          ) : (
            <>
              {/* Oguru Partners first */}
              {oguruPins.map((pin) => (
                <button
                  key={`og-${pin.id}`}
                  onClick={() => setSelectedPin(pin)}
                  className={`flex w-44 shrink-0 flex-col gap-1 rounded-2xl p-3 shadow-sm transition ${
                    selectedPin?.id === pin.id
                      ? 'bg-[#4a6410] text-white'
                      : 'bg-white text-[#1b1c19]'
                  }`}
                >
                  <span className="text-lg">{pin.chip_icon ?? '☕'}</span>
                  <p className="truncate font-display text-xs font-bold">
                    {pin.name}
                  </p>
                  <span
                    className={`font-label text-[9px] font-semibold uppercase ${
                      selectedPin?.id === pin.id
                        ? 'text-white/70'
                        : 'text-[#4a6410]/60'
                    }`}
                  >
                    {getPinLabel(pin)}
                  </span>
                </button>
              ))}

              {/* Google Places */}
              {googlePins.slice(0, 10).map((pin) => (
                <button
                  key={`gg-${pin.id}`}
                  onClick={() => setSelectedPin(pin)}
                  className={`flex w-44 shrink-0 flex-col gap-1 rounded-2xl border border-dashed p-3 transition ${
                    selectedPin?.id === pin.id
                      ? 'border-[#4a6410] bg-[#4a6410]/5 text-[#1b1c19]'
                      : 'border-[#1b1c19]/10 bg-white/80 text-[#1b1c19]'
                  }`}
                >
                  <span className="text-lg opacity-60">
                    {pin.chip_icon ?? '📍'}
                  </span>
                  <p className="truncate font-display text-xs font-bold opacity-70">
                    {pin.name}
                  </p>
                  <span className="font-label text-[9px] font-semibold uppercase text-[#9ca3af]">
                    Invite to Oguru
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  INVITE MODAL                                                 */}
      {/* ============================================================ */}
      {showInviteModal && inviteTarget && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-t-3xl bg-[#fbf9f4] p-6 shadow-2xl">
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#1b1c19]/10" />

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1b1c19]">
                  Invite to Oguru
                </h3>
                <p className="mt-1 text-sm text-[#44483a]">
                  Help {inviteTarget.name} join the pre-order revolution.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-full p-1 text-[#44483a]/40 hover:bg-[#1b1c19]/5"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Vendor Info */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9ca3af]/10 text-xl">
                {inviteTarget.chip_icon ?? '📍'}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-[#1b1c19]">
                  {inviteTarget.name}
                </p>
                <p className="font-label text-xs text-[#44483a]/60">
                  {inviteTarget.address}
                </p>
              </div>
            </div>

            {/* Status */}
            {inviteStatus === 'idle' && (
              <button
                onClick={handleInvite}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a6410] py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <SendIcon className="h-4 w-4" />
                Send Invite
              </button>
            )}

            {inviteStatus === 'sending' && (
              <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a6410]/60 py-3.5 text-sm font-semibold text-white">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </div>
            )}

            {inviteStatus === 'sent' && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 rounded-2xl bg-[#4a6410]/10 p-4">
                  <CheckCircleIcon className="h-5 w-5 text-[#4a6410]" />
                  <p className="font-body text-sm font-semibold text-[#4a6410]">
                    {inviteMessage}
                  </p>
                </div>
                {inviteShareUrl && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#1b1c19]/10 bg-white px-3 py-2">
                    <span className="min-w-0 flex-1 truncate font-label text-xs text-[#44483a]">
                      {inviteShareUrl}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(inviteShareUrl)}
                      className="shrink-0 rounded-lg bg-[#4a6410] px-3 py-1 font-label text-[10px] font-bold text-white transition active:scale-95"
                    >
                      Copy
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-full rounded-2xl border border-[#1b1c19]/10 py-3 text-sm font-semibold text-[#44483a] transition hover:bg-[#1b1c19]/5"
                >
                  Done
                </button>
              </div>
            )}

            {inviteStatus === 'error' && (
              <div className="mt-5 space-y-3">
                <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  {inviteMessage}
                </p>
                <button
                  onClick={() => setInviteStatus('idle')}
                  className="w-full rounded-2xl bg-[#4a6410] py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Safe area */}
            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  BOTTOM NAVIGATION                                            */}
      {/* ============================================================ */}
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

/* ------------------------------------------------------------------ */
/*  Page Wrapper (Suspense boundary for useSearchParams)               */
/* ------------------------------------------------------------------ */

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#fbf9f4]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav Item                                                           */
/* ------------------------------------------------------------------ */

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
