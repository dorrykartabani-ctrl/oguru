'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ReceiptIcon,
  ClockIcon,
  CheckCircleIcon,
  CoffeeIcon,
  ArrowRight,
  HomeIcon,
  MapIcon,
  GiftIcon,
  UserCircleIcon,
  SparklesIcon,
  MapPinIcon,
  RefreshIcon,
  QrCodeIcon,
  ChevronDown,
  XIcon,
  PackageIcon,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderStage = 'confirmed' | 'preparing' | 'ready' | 'picked_up';

interface OrderItem {
  name: string;
  qty: number;
  modifier?: string;
}

interface ActiveOrder {
  id: string;
  vendor: string;
  vendorInitial: string;
  vendorColor: string;
  items: OrderItem[];
  stage: OrderStage;
  countdownSeconds: number;
  pickupCode: string;
  slotWindow: string;
  distance: string;
}

interface UpcomingOrder {
  id: string;
  vendor: string;
  vendorInitial: string;
  vendorColor: string;
  items: OrderItem[];
  scheduledFor: string;
  total: string;
}

interface PastOrder {
  id: string;
  vendor: string;
  date: string;
  items: string;
  total: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data (Phase 1 — replace with Supabase in Phase 2)             */
/* ------------------------------------------------------------------ */

const mockActiveOrder: ActiveOrder = {
  id: 'ord-live-1',
  vendor: 'Old Spike Roastery',
  vendorInitial: 'O',
  vendorColor: 'bg-[#d4e4b8] text-[#4a6410]',
  items: [
    { name: 'Oat Flat White', qty: 1, modifier: 'Extra hot' },
    { name: 'Almond Croissant', qty: 2 },
  ],
  stage: 'preparing',
  countdownSeconds: 7 * 60 + 23,
  pickupCode: 'OG-4821',
  slotWindow: '8:15 – 8:30 AM',
  distance: '0.3 mi',
};

const mockUpcoming: UpcomingOrder[] = [
  {
    id: 'ord-up-1',
    vendor: 'Pophams Bakery',
    vendorInitial: 'P',
    vendorColor: 'bg-[#fed3c7] text-[#77574d]',
    items: [
      { name: 'Matcha Latte', qty: 1, modifier: 'Oat milk' },
      { name: 'Pistachio Croissant', qty: 1 },
    ],
    scheduledFor: 'Tomorrow · 7:45 AM',
    total: '£9.80',
  },
];

const mockPast: PastOrder[] = [
  { id: 'ord-p-1', vendor: 'WatchHouse', date: 'Mon 12 May', items: '2× Flat White, 1× Banana Bread', total: '£11.40' },
  { id: 'ord-p-2', vendor: 'Old Spike Roastery', date: 'Sat 10 May', items: '1× Cortado, 1× Pain au Chocolat', total: '£7.20' },
  { id: 'ord-p-3', vendor: 'Pophams Bakery', date: 'Thu 8 May', items: '1× Oat Cappuccino, 2× Almond Croissant', total: '£10.60' },
  { id: 'ord-p-4', vendor: 'WatchHouse', date: 'Tue 6 May', items: '1× Filter Coffee', total: '£3.80' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STAGES: { key: OrderStage; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'picked_up', label: 'Picked Up' },
];

const stageIndex = (s: OrderStage) => STAGES.findIndex((st) => st.key === s);

const formatCountdown = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrdersPage() {
  const [countdown, setCountdown] = useState(mockActiveOrder.countdownSeconds);
  const [showPast, setShowPast] = useState(false);

  // Live countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isUrgent = countdown < 5 * 60;
  const currentStageIdx = stageIndex(mockActiveOrder.stage);

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body">
      {/* ---- Header ---- */}
      <header className="flex items-end justify-between px-5 pt-14 pb-2">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[#44483a]">
            Track, pick up, and reorder.
          </p>
        </div>
        {countdown > 0 && (
          <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#924700]/10 px-3 py-1 font-label text-xs font-bold text-[#924700]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#924700] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#924700]" />
            </span>
            1 active
          </span>
        )}
      </header>

      {/* ============================================================ */}
      {/*  ACTIVE ORDER                                                 */}
      {/* ============================================================ */}
      {countdown > 0 && (
        <section className="mx-5 mt-5">
          <div className="overflow-hidden rounded-3xl bg-white shadow-organic">
            {/* Vendor Header */}
            <div className="flex items-center gap-3 border-b border-[#1b1c19]/5 px-5 py-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${mockActiveOrder.vendorColor}`}
              >
                {mockActiveOrder.vendorInitial}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-base font-bold text-[#1b1c19]">
                  {mockActiveOrder.vendor}
                </h2>
                <p className="flex items-center gap-1 font-label text-xs text-[#44483a]/60">
                  <MapPinIcon className="h-3 w-3" />
                  {mockActiveOrder.distance} · Slot {mockActiveOrder.slotWindow}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#924700]/10 px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#924700]">
                Preparing
              </span>
            </div>

            {/* Items */}
            <div className="px-5 pt-4 pb-2">
              <ul className="space-y-1.5">
                {mockActiveOrder.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#1b1c19]">
                    <CoffeeIcon className="h-3.5 w-3.5 shrink-0 text-[#44483a]/40" />
                    <span className="font-semibold">{item.qty}×</span>
                    <span>{item.name}</span>
                    {item.modifier && (
                      <span className="font-label text-xs text-[#44483a]/50">
                        · {item.modifier}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Stepper */}
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center justify-between">
                {STAGES.map((stage, idx) => {
                  const isComplete = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  return (
                    <div key={stage.key} className="flex flex-1 flex-col items-center">
                      {/* Connector line + dot */}
                      <div className="flex w-full items-center">
                        {idx > 0 && (
                          <div
                            className={`h-0.5 flex-1 rounded-full transition-colors ${
                              idx <= currentStageIdx ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/10'
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isComplete
                              ? 'border-[#4a6410] bg-[#4a6410] text-white'
                              : isCurrent
                                ? 'border-[#924700] bg-[#924700]/10 text-[#924700]'
                                : 'border-[#1b1c19]/10 bg-white text-[#1b1c19]/20'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : isCurrent ? (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#924700] opacity-50" />
                              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#924700]" />
                            </span>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>
                        {idx < STAGES.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 rounded-full transition-colors ${
                              idx < currentStageIdx ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/10'
                            }`}
                          />
                        )}
                      </div>
                      {/* Label */}
                      <span
                        className={`mt-1.5 font-label text-[9px] font-semibold uppercase tracking-wider ${
                          isComplete
                            ? 'text-[#4a6410]'
                            : isCurrent
                              ? 'text-[#924700]'
                              : 'text-[#44483a]/30'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countdown + Pickup Code */}
            <div className="flex items-stretch border-t border-[#1b1c19]/5">
              {/* Countdown */}
              <div className="flex flex-1 flex-col items-center justify-center py-5">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#44483a]/50">
                  Ready in
                </span>
                <span
                  className={`mt-1 font-display text-4xl font-bold tabular-nums tracking-tight ${
                    isUrgent ? 'text-[#924700]' : 'text-[#1b1c19]'
                  }`}
                >
                  {formatCountdown(countdown)}
                </span>
                <span className="mt-0.5 font-label text-[10px] text-[#44483a]/40">
                  minutes
                </span>
              </div>

              {/* Divider */}
              <div className="w-px bg-[#1b1c19]/5" />

              {/* Pickup Code */}
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-5">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#44483a]/50">
                  Pickup Code
                </span>
                <div className="flex items-center gap-2">
                  <QrCodeIcon className="h-5 w-5 text-[#4a6410]" />
                  <span className="font-display text-2xl font-bold tracking-wider text-[#4a6410]">
                    {mockActiveOrder.pickupCode}
                  </span>
                </div>
                <span className="font-label text-[10px] text-[#44483a]/40">
                  Show at counter
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 border-t border-[#1b1c19]/5 px-5 py-4">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4a6410] py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.97]">
                <MapPinIcon className="h-4 w-4" />
                I&apos;m Here
              </button>
              <button className="flex items-center justify-center rounded-xl border border-[#1b1c19]/10 px-4 py-3 text-[#44483a]/50 transition hover:bg-[#1b1c19]/5 active:scale-[0.97]">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  UPCOMING ORDERS                                              */}
      {/* ============================================================ */}
      {mockUpcoming.length > 0 && (
        <section className="mt-8">
          <h3 className="px-5 font-display text-lg font-semibold text-[#1b1c19]">
            Upcoming
          </h3>
          <ul className="mt-3 space-y-3 px-5">
            {mockUpcoming.map((order) => (
              <li
                key={order.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-organic"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${order.vendorColor}`}
                >
                  {order.vendorInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-[#1b1c19]">
                    {order.vendor}
                  </p>
                  <p className="flex items-center gap-1 font-label text-xs text-[#44483a]/60">
                    <ClockIcon className="h-3 w-3" />
                    {order.scheduledFor}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#44483a]">
                    {order.items.map((it) => `${it.qty}× ${it.name}`).join(', ')}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-display text-sm font-bold text-[#1b1c19]">
                    {order.total}
                  </span>
                  <span className="rounded-full bg-[#4a6410]/10 px-2 py-0.5 font-label text-[10px] font-semibold text-[#4a6410]">
                    Scheduled
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============================================================ */}
      {/*  PAST ORDERS                                                  */}
      {/* ============================================================ */}
      <section className="mt-8">
        <button
          onClick={() => setShowPast(!showPast)}
          className="flex w-full items-center justify-between px-5"
        >
          <h3 className="font-display text-lg font-semibold text-[#1b1c19]">
            Past Orders
          </h3>
          <ChevronDown
            className={`h-5 w-5 text-[#44483a]/40 transition-transform ${
              showPast ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showPast && (
          <ul className="mt-3 space-y-2 px-5">
            {mockPast.map((order) => (
              <li
                key={order.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-organic"
              >
                <PackageIcon className="h-5 w-5 shrink-0 text-[#44483a]/25" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-sm font-semibold text-[#1b1c19]">
                      {order.vendor}
                    </p>
                    <span className="shrink-0 font-label text-[10px] text-[#44483a]/40">
                      {order.date}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#44483a]/60">
                    {order.items}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="font-display text-sm font-bold text-[#1b1c19]">
                    {order.total}
                  </span>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-[#4a6410]/10 px-2.5 py-1 font-label text-[10px] font-bold text-[#4a6410] transition active:scale-95">
                    <RefreshIcon className="h-3 w-3" />
                    Reorder
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---- Empty state (when no active & no upcoming) ---- */}
      {countdown === 0 && mockUpcoming.length === 0 && (
        <div className="mx-5 mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4a6410]/10">
            <CoffeeIcon className="h-8 w-8 text-[#4a6410]/40" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-[#1b1c19]">
            No active orders
          </h3>
          <p className="mt-1 max-w-[240px] text-sm text-[#44483a]/60">
            Pre-order your morning coffee and skip the queue.
          </p>
          <Link
            href="/home"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4a6410] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.97]"
          >
            Browse Cafés
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* ============================================================ */}
      {/*  BOTTOM NAVIGATION                                            */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
          <NavItem href="/explore" label="Explore" icon={<MapIcon className="h-5 w-5" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-5 w-5" />} />
          <NavItem
            href="/orders"
            label="Orders"
            icon={<ReceiptIcon className="h-5 w-5" />}
            active
          />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-5 w-5" />} />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Nav Item                                                  */
/* ------------------------------------------------------------------ */

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
      className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition ${
        active ? 'text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]/70'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
