'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GiftIcon,
  HeartIcon,
  SendIcon,
  CoffeeIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRight,
  HomeIcon,
  MapIcon,
  ReceiptIcon,
  UserCircleIcon,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Mock Data (Phase 1 — replace with Supabase queries in Phase 2)    */
/* ------------------------------------------------------------------ */

const giftCards = [
  { id: 'gc-1', amount: 5, label: 'A Coffee', emoji: '☕' },
  { id: 'gc-2', amount: 10, label: 'Coffee & Pastry', emoji: '🥐' },
  { id: 'gc-3', amount: 25, label: 'Week of Mornings', emoji: '🌅' },
  { id: 'gc-4', amount: 0, label: 'Custom', emoji: '✨' },
];

type GiftStatus = 'delivered' | 'pending' | 'redeemed';

interface GiftActivity {
  id: string;
  type: 'sent' | 'received';
  friendName: string;
  friendInitial: string;
  friendColor: string;
  item: string;
  vendor: string;
  status: GiftStatus;
  timestamp: string;
  message?: string;
}

const mockActivity: GiftActivity[] = [
  {
    id: 'g-1',
    type: 'sent',
    friendName: 'Priya',
    friendInitial: 'P',
    friendColor: 'bg-[#fed3c7] text-[#77574d]',
    item: 'Oat Flat White',
    vendor: 'Old Spike Roastery',
    status: 'delivered',
    timestamp: '2h ago',
    message: 'Good luck with the pitch today! ☕',
  },
  {
    id: 'g-2',
    type: 'received',
    friendName: 'Marcus',
    friendInitial: 'M',
    friendColor: 'bg-[#d4e4b8] text-[#4a6410]',
    item: 'Almond Croissant',
    vendor: 'Pophams Bakery',
    status: 'redeemed',
    timestamp: 'Yesterday',
    message: 'You deserved this after last week 🙌',
  },
  {
    id: 'g-3',
    type: 'sent',
    friendName: 'Jade',
    friendInitial: 'J',
    friendColor: 'bg-[#fde2c8] text-[#924700]',
    item: 'Matcha Latte + Banana Bread',
    vendor: 'WatchHouse',
    status: 'pending',
    timestamp: '3d ago',
  },
  {
    id: 'g-4',
    type: 'received',
    friendName: 'Tomás',
    friendInitial: 'T',
    friendColor: 'bg-[#d6d9f0] text-[#3b3f7a]',
    item: '£10 Gift Card',
    vendor: 'Oguru',
    status: 'redeemed',
    timestamp: '1w ago',
    message: 'Happy birthday!! 🎂',
  },
];

const statusConfig: Record<GiftStatus, { label: string; dot: string; bg: string }> = {
  delivered: { label: 'Delivered', dot: 'bg-[#4a6410]', bg: 'bg-[#e8f0d8] text-[#4a6410]' },
  pending: { label: 'Pending', dot: 'bg-[#924700]', bg: 'bg-[#fef0e0] text-[#924700]' },
  redeemed: { label: 'Redeemed', dot: 'bg-[#77574d]', bg: 'bg-[#f3e8e4] text-[#77574d]' },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function GiftsPage() {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  const filteredActivity = mockActivity.filter((g) => g.type === activeTab);

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body">
      {/* ---- Header ---- */}
      <header className="px-5 pt-14 pb-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
          Gifts
        </h1>
        <p className="mt-1 font-body text-sm text-[#44483a]">
          Share the love, one cup at a time.
        </p>
      </header>

      {/* ---- Send-a-Treat Hero Card ---- */}
      <section className="mx-5 mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#fed3c7] via-[#fde8df] to-[#fbf9f4] p-6 shadow-organic">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
            <GiftIcon className="h-7 w-7 text-[#924700]" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-[#1b1c19]">
              Send a Treat
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#44483a]">
              Surprise a friend with their favourite morning order. They&apos;ll get a link to redeem at their nearest partner café.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4a6410] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.97]">
              <CoffeeIcon className="h-4 w-4" />
              Choose a Treat
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ---- Gift Cards Horizontal Scroll ---- */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-5">
          <h3 className="font-display text-lg font-semibold text-[#1b1c19]">
            Gift Cards
          </h3>
          <span className="font-label text-xs uppercase tracking-wider text-[#44483a]/60">
            Instant delivery
          </span>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {giftCards.map((gc) => (
            <button
              key={gc.id}
              className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border border-[#1b1c19]/5 bg-white p-5 shadow-sm transition hover:shadow-organic active:scale-[0.97]"
            >
              <span className="text-3xl">{gc.emoji}</span>
              <span className="font-display text-xl font-bold text-[#1b1c19]">
                {gc.amount > 0 ? `£${gc.amount}` : '£—'}
              </span>
              <span className="font-label text-xs text-[#44483a]">
                {gc.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---- How It Works (compact) ---- */}
      <section className="mx-5 mt-8 rounded-2xl border border-dashed border-[#4a6410]/20 bg-[#4a6410]/5 px-5 py-4">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-[#4a6410]">
          <SparklesIcon className="h-4 w-4" />
          How gifting works
        </h3>
        <ol className="mt-3 space-y-2 font-body text-xs leading-relaxed text-[#44483a]">
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4a6410] text-[10px] font-bold text-white">
              1
            </span>
            Pick a drink, pastry, or gift card amount.
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4a6410] text-[10px] font-bold text-white">
              2
            </span>
            Add a personal message (optional, but encouraged).
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4a6410] text-[10px] font-bold text-white">
              3
            </span>
            Send via link, SMS, or WhatsApp — they redeem in-app.
          </li>
        </ol>
      </section>

      {/* ---- Activity Feed ---- */}
      <section className="mt-8">
        {/* Tab Switcher */}
        <div className="flex gap-1 px-5">
          {(['sent', 'received'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 font-label text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === tab
                  ? 'bg-[#4a6410] text-white shadow-sm'
                  : 'bg-[#1b1c19]/5 text-[#44483a] hover:bg-[#1b1c19]/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <ul className="mt-4 space-y-3 px-5">
          {filteredActivity.length === 0 && (
            <li className="py-12 text-center font-body text-sm text-[#44483a]/50">
              No {activeTab} gifts yet. Be the first!
            </li>
          )}

          {filteredActivity.map((gift) => {
            const status = statusConfig[gift.status];
            return (
              <li
                key={gift.id}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-organic"
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${gift.friendColor}`}
                >
                  {gift.friendInitial}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-[#1b1c19]">
                      {gift.type === 'sent' ? 'To ' : 'From '}
                      {gift.friendName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label text-[10px] font-semibold ${status.bg}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate font-body text-sm text-[#1b1c19]">
                    {gift.item}
                  </p>
                  <p className="font-label text-xs text-[#44483a]/60">
                    {gift.vendor} · {gift.timestamp}
                  </p>

                  {gift.message && (
                    <p className="mt-1.5 rounded-lg bg-[#fbf9f4] px-3 py-1.5 font-body text-xs italic text-[#44483a]">
                      &ldquo;{gift.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Action Chevron */}
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#44483a]/30" />
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- Bottom Navigation Bar ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
          <NavItem href="/explore" label="Explore" icon={<MapIcon className="h-5 w-5" />} />
          <NavItem
            href="/gifts"
            label="Gifts"
            icon={<GiftIcon className="h-5 w-5" />}
            active
          />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-5 w-5" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-5 w-5" />} />
        </div>
        {/* Safe area spacer for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Nav Item                                                 */
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
        active
          ? 'text-[#4a6410]'
          : 'text-[#44483a]/40 hover:text-[#44483a]/70'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
