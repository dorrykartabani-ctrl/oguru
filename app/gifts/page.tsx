'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GiftIcon,
  HomeIcon,
  MapIcon,
  ReceiptIcon,
  UserCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  HourglassIcon,
  XIcon,
  ChevronDown,
  ArchiveIcon,
  MoreVerticalIcon,
  CalendarIcon,
  PlusIcon,
} from '@/components/icons';

// --- Types & Mock Data ---
type Tab = 'Received' | 'Sent';
type SentFilter = 'All' | 'Pending' | 'Claimed' | 'Expired';

export default function GiftsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Received');
  const [sentFilter, setSentFilter] = useState<SentFilter>('All');

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-32 font-body selection:bg-[#4a6410] selection:text-white relative">
      
      {/* ---- Top Header ---- */}
      <header className="sticky top-0 z-40 bg-[#f6f4eb] pt-12 pb-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex h-10 w-10 items-center justify-center rounded-full text-[#4a6410] hover:bg-[#1b1c19]/5 transition">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="font-display text-2xl font-extrabold text-[#4a6410]">Gifts</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1c19] font-label text-[10px] font-bold text-white shadow-sm">
              3
            </span>
            <button className="text-[#4a6410] hover:opacity-70 transition">
              <GiftIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* ---- Top Tabs ---- */}
        <div className="mt-4 flex border-b border-[#1b1c19]/10 px-5">
          {(['Received', 'Sent'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 font-display text-base font-bold transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-[#4a6410] text-[#4a6410]'
                  : 'border-b-2 border-transparent text-[#44483a]/50 hover:text-[#44483a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* ========================================================= */}
      {/* RECEIVED TAB */}
      {/* ========================================================= */}
      {activeTab === 'Received' && (
        <div className="animate-fade-in">
          {/* Alert Banner */}
          <div className="flex items-center gap-2 bg-[#d4e4b8]/40 px-5 py-3">
            <AlertTriangleIcon className="h-5 w-5 text-[#4a6410]" />
            <span className="font-label text-xs font-extrabold text-[#1b1c19]">
              1 gift expires in 3 days!
            </span>
          </div>

          <div className="px-5 pt-6 space-y-6">
            {/* Summary Card */}
            <div className="flex items-center gap-4 rounded-xl border-l-4 border-[#4a6410] bg-[#ebe8db] p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4a6410] text-white shadow-sm">
                <GiftIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#1b1c19] leading-tight">
                  You have 2 unclaimed gifts!
                </h2>
                <p className="mt-0.5 font-label text-sm font-bold text-[#4a6410]">Worth $12.50</p>
                <p className="mt-1 font-label text-[9px] font-extrabold uppercase tracking-wider text-[#1b1c19]">
                  Claim them before they expire
                </p>
              </div>
            </div>

            {/* Filter / Sort Row */}
            <div className="flex items-center gap-4 border-b border-[#1b1c19]/5 pb-4">
              <button className="flex items-center gap-2 rounded-md bg-[#ebe8db] px-3 py-1.5 font-label text-[11px] font-bold text-[#1b1c19]">
                <span className="text-[#44483a]/60 font-semibold uppercase tracking-wider">Filter:</span> All Gifts
                <ChevronDown className="h-3 w-3" />
              </button>
              <button className="flex items-center gap-2 rounded-md bg-[#ebe8db] px-3 py-1.5 font-label text-[11px] font-bold text-[#1b1c19]">
                <span className="text-[#44483a]/60 font-semibold uppercase tracking-wider">Sort:</span> Newest
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* Gift Card 1 (New) */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#1b1c19]/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-[#1b1c19]/10 bg-[#ebe8db]">
                    <img src="https://i.pravatar.cc/150?u=john" alt="John Smith" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">From John Smith</p>
                    <p className="font-label text-[10px] font-bold uppercase tracking-wider text-[#44483a]/60">2 hours ago</p>
                  </div>
                </div>
                <span className="rounded bg-blue-100 px-2 py-0.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
                  New
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f6f4eb] p-4 border border-[#1b1c19]/5">
                <div className="flex items-center gap-3">
                  <div className="text-[#4a6410] text-2xl">☕</div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">Caramel Latte</p>
                    <p className="font-body text-xs text-[#44483a]/70">Brew Haven Cafe</p>
                  </div>
                </div>
                <span className="font-display text-base font-extrabold text-[#4a6410]">$6.50</span>
              </div>

              <p className="mt-4 font-body text-sm italic text-[#44483a]/90">
                &quot;Happy Birthday! Hope this brightens your day! - John&quot;
              </p>

              <div className="mt-5">
                <div className="flex justify-between font-label text-[10px] font-extrabold uppercase tracking-wider text-[#1b1c19] mb-1.5">
                  <span>Expires in 58 days</span>
                  <span>95%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ebe8db]">
                  <div className="h-full w-[95%] bg-[#4a6410] rounded-full" />
                </div>
              </div>

              <button className="mt-5 w-full rounded-lg bg-[#4a6410] py-3.5 font-label text-sm font-extrabold text-white shadow-sm transition active:scale-[0.98]">
                Claim Gift
              </button>
            </div>

            {/* Gift Card 2 (Expiring Soon) */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#1b1c19]/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-[#1b1c19]/10 bg-[#ebe8db]">
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah M." className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">From Sarah M.</p>
                    <p className="font-label text-[10px] font-bold uppercase tracking-wider text-[#44483a]/60">Feb 10, 2025</p>
                  </div>
                </div>
                <span className="rounded bg-[#d4e4b8]/50 px-2 py-0.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
                  Unclaimed
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f6f4eb] p-4 border border-[#1b1c19]/5">
                <div className="flex items-center gap-3">
                  <div className="text-[#4a6410] text-2xl">🥐</div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">Butter Croissant</p>
                    <p className="font-body text-xs text-[#44483a]/70">Crust & Crumb</p>
                  </div>
                </div>
                <span className="font-display text-base font-extrabold text-[#4a6410]">$4.50</span>
              </div>

              <p className="mt-4 font-body text-sm italic text-[#44483a]/90">
                &quot;You deserve a treat! - Sarah&quot;
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-red-600">
                <HourglassIcon className="h-4 w-4" />
                <span className="font-label text-[10px] font-extrabold uppercase tracking-wider">
                  Expires in 3 days
                </span>
              </div>

              <button className="mt-4 w-full rounded-lg bg-[#4a6410] py-3.5 font-label text-sm font-extrabold text-white shadow-sm transition active:scale-[0.98]">
                Claim Gift
              </button>
            </div>

            {/* Gift Card 3 (Claimed/Past) */}
            <div className="rounded-2xl bg-[#ebe8db]/50 p-5 border border-[#1b1c19]/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1c19]/10 text-[#44483a]/50">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">From Alex R.</p>
                    <p className="font-label text-[10px] font-bold uppercase tracking-wider text-[#44483a]/60">Jan 20, 2025</p>
                  </div>
                </div>
                <span className="rounded bg-[#1b1c19]/10 px-2 py-0.5 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
                  Claimed
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl grayscale opacity-50">🍊</div>
                  <div>
                    <p className="font-display text-sm font-bold text-[#44483a]/60">Juice Pack</p>
                    <p className="font-body text-xs text-[#44483a]/50">Pure Press</p>
                  </div>
                </div>
                <span className="font-display text-base font-extrabold text-[#44483a]/50">$12.00</span>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#1b1c19]/5">
                <div className="flex items-center gap-1.5 text-[#4a6410]">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="font-label text-[10px] font-bold">Reordered Feb 12</span>
                </div>
                <button className="font-label text-xs font-bold text-[#4a6410] underline underline-offset-2">
                  Thank Alex
                </button>
              </div>
            </div>

            {/* Archived Dropdown */}
            <button className="flex w-full items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1b1c19] text-white">
                  <ArchiveIcon className="h-3 w-3" />
                </div>
                <span className="font-display text-sm font-bold text-[#1b1c19]">Archived Gifts</span>
              </div>
              <ChevronDown className="h-5 w-5 text-[#1b1c19]" />
            </button>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'Sent' && (
        <div className="animate-fade-in px-5 pt-6 pb-20 space-y-8">
          
          {/* Top Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col justify-between rounded-xl bg-[#ebe8db] p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Success Rate</p>
                  <p className="mt-1 font-display text-5xl font-extrabold text-[#4a6410]">67%</p>
                </div>
                <p className="font-body text-xs text-[#1b1c19] mt-2">8 of 12 claimed</p>
              </div>
            </div>
            
            <div className="rounded-xl bg-[#ebe8db] p-4">
              <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Total Gifts</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#1b1c19]">12</p>
            </div>
            <div className="rounded-xl bg-[#ebe8db] p-4">
              <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Total Value</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#1b1c19]">$87.50</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2">
            {(['All (12)', 'Pending (4)', 'Claimed (7)', 'Expired (1)'] as SentFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setSentFilter(f)}
                className={`shrink-0 rounded-full px-4 py-1.5 font-label text-xs font-bold transition-all ${
                  sentFilter === f
                    ? 'bg-[#4a6410] text-white'
                    : 'bg-[#ebe8db] text-[#44483a] hover:bg-[#1b1c19]/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Recent Activity List */}
          <div>
            <h3 className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60 mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {/* Item 1 - Pending */}
              <div className="bg-white rounded-r-xl border-l-[4px] border-[#a38036] shadow-sm p-5 pr-2 flex justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">To: Sarah M.</p>
                    <p className="font-body text-[11px] text-[#44483a]/60">Feb 10, 2025</p>
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#1b1c19] leading-tight">Caramel Latte</h4>
                  <p className="font-body text-xs text-[#44483a]/80 mb-4">Brew Haven Cafe • $6.50</p>
                  
                  <div className="flex items-center gap-2 bg-[#fdf5e6] rounded-md px-3 py-2 mb-3">
                    <HourglassIcon className="h-4 w-4 text-[#a38036]" />
                    <p className="font-body text-xs text-[#a38036]">Waiting to be claimed • Expires in 58 days</p>
                  </div>
                  
                  <button className="w-full rounded-md bg-[#ebe8db] py-2.5 font-label text-xs font-extrabold text-[#4a6410] transition active:scale-[0.98]">
                    Resend Notification
                  </button>
                </div>
              </div>

              {/* Item 2 - Claimed */}
              <div className="bg-white rounded-r-xl border-l-[4px] border-[#4a6410] shadow-sm p-5 pr-2 flex justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-[#ebe8db]">
                        <img src="https://i.pravatar.cc/150?u=john" alt="John D." className="h-full w-full object-cover" />
                      </div>
                      <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">To: John D.</p>
                    </div>
                    <p className="font-body text-[11px] text-[#44483a]/60">Feb 8, 2025</p>
                  </div>
                  
                  <h4 className="font-display text-lg font-bold text-[#1b1c19] leading-tight">Butter Croissant</h4>
                  <p className="font-body text-xs text-[#44483a]/80 mb-4">Crust & Crumb • $4.50</p>
                  
                  <div className="flex items-center gap-1.5 text-[#4a6410] mb-2">
                    <CheckCircleIcon className="h-4 w-4" />
                    <p className="font-label text-xs font-bold">Claimed on Feb 9</p>
                  </div>
                  
                  <p className="font-body text-sm italic text-[#44483a]/90">
                    &quot;John says thanks! 😋 &quot;
                  </p>
                </div>
              </div>

              {/* Item 3 - Expired */}
              <div className="bg-[#ebe8db]/50 rounded-r-xl border-l-[4px] border-[#9ca3af] p-5 pr-2 flex justify-between">
                <div className="flex-1 pr-4 opacity-70">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">To: Alex R.</p>
                    <p className="font-body text-[11px] text-[#44483a]/60">Dec 1, 2024</p>
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#1b1c19] leading-tight">Juice Pack</h4>
                  <p className="font-body text-xs text-[#44483a]/80 mb-4">Pure Press • $12.00</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#44483a]/60">
                      <XIcon className="h-4 w-4" />
                      <p className="font-body text-xs">Expired unclaimed</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#4a6410]">
                      <ReceiptIcon className="h-4 w-4" />
                      <p className="font-body text-xs">Refunded to Visa ••••1234</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gifting Stats */}
          <div>
            <h3 className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60 mb-4">
              Your Gifting Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center bg-[#ebe8db] rounded-xl p-4 aspect-square relative">
                {/* Mock Diamond Chart */}
                <div className="w-24 h-24 border-[12px] border-[#ebe8db] border-t-[#4a6410] border-l-[#4a6410] border-b-[#4a6410] rotate-45 rounded-sm bg-white flex items-center justify-center shadow-sm">
                  <span className="font-display text-lg font-bold text-[#1b1c19] -rotate-45 block">8/12</span>
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-[#f6f4eb] border border-[#1b1c19]/10 rounded-xl p-3 shadow-sm">
                  <p className="font-label text-[9px] font-extrabold uppercase tracking-wider text-[#924700]">Hot Tip</p>
                  <p className="font-body text-xs text-[#1b1c19] mt-1">Best day to send: <span className="font-bold text-[#4a6410]">Fridays</span> (85% claimed)</p>
                </div>
                <div className="bg-[#f6f4eb] border border-[#1b1c19]/10 rounded-xl p-3 shadow-sm">
                  <p className="font-label text-[9px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Fan Favorite</p>
                  <p className="font-body text-xs text-[#1b1c19] mt-1 font-bold">Caramel Latte <span className="font-normal text-[#44483a]/70">(5 sent)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Gifts */}
          <div>
            <h3 className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60 mb-4">
              Scheduled Gifts
            </h3>
            <div className="bg-[#fed3c7]/60 rounded-xl p-5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 bg-[#1b1c19]/10 rounded-lg flex items-center justify-center text-[#924700]">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#1b1c19]">Coffee for Mom</h4>
                <p className="font-body text-xs text-[#924700] mb-3">Feb 20 (Mother&apos;s Birthday)</p>
                <div className="flex items-center gap-4">
                  <button className="font-label text-xs font-bold text-[#1b1c19] underline underline-offset-2">Edit</button>
                  <button className="font-label text-xs font-bold text-red-600 underline underline-offset-2">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Button (Only on Sent tab based on screenshot layout) */}
          <button className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4a6410] text-white shadow-lg transition active:scale-90 hover:bg-[#3b500b]">
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION (Standard Oguru pattern) */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} active />
          <NavItem href="/explore" label="Favs" icon={<HeartIcon className="h-6 w-6" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-6 w-6" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-6 w-6" />} />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
      
    </main>
  );
}

// --- Internal Nav Component ---
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
