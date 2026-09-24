'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  GiftIcon,
  HeartIcon,
  ReceiptIcon,
  UserCircleIcon,
  QrCodeIcon,
  ClockIcon,
  MapPinIcon,
  RefreshIcon,
  XIcon,
  CheckCircleIcon,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type OrderTab = 'Active' | 'Past';

interface OrderItem {
  qty: number;
  name: string;
  price: number;
  modifier?: string;
}

interface OrderCard {
  id: string;
  vendor: string;
  vendorLogo: string;
  coverImage: string;
  pickupTime: string;
  date: string;
  total: number;
  items: OrderItem[];
  orderNumber: string;
}

const ACTIVE_ORDERS: OrderCard[] = [
  {
    id: 'ord-101',
    vendor: 'The Roasted Bean',
    vendorLogo: '☕',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    pickupTime: '09:30 AM',
    date: 'Today',
    total: 12.50,
    orderNumber: 'TRB-8492',
    items: [
      { qty: 1, name: 'Caramel Latte', price: 6.50, modifier: 'Oat Milk' },
      { qty: 1, name: 'Almond Croissant', price: 6.00 },
    ],
  },
];

const PAST_ORDERS: OrderCard[] = [
  {
    id: 'ord-098',
    vendor: 'Hearth & Grain',
    vendorLogo: '🥐',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    pickupTime: '08:15 AM',
    date: 'Oct 12, 2023',
    total: 8.50,
    orderNumber: 'HG-1102',
    items: [
      { qty: 1, name: 'Sourdough Loaf', price: 8.50 },
    ],
  },
  {
    id: 'ord-091',
    vendor: 'Pure Press',
    vendorLogo: '🥤',
    coverImage: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&q=80&w=800',
    pickupTime: '12:00 PM',
    date: 'Oct 05, 2023',
    total: 18.00,
    orderNumber: 'PP-3391',
    items: [
      { qty: 2, name: 'Green Detox Juice', price: 9.00 },
    ],
  },
  {
    id: 'ord-084',
    vendor: 'The Roasted Bean',
    vendorLogo: '☕',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    pickupTime: '09:30 AM',
    date: 'Sep 28, 2023',
    total: 6.50,
    orderNumber: 'TRB-7721',
    items: [
      { qty: 1, name: 'Caramel Latte', price: 6.50, modifier: 'Oat Milk' },
    ],
  }
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>('Active');
  const [selectedTicket, setSelectedTicket] = useState<OrderCard | null>(null);

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-32 font-body selection:bg-[#4a6410] selection:text-white">
      
      {/* ---- Header & Tabs ---- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <h1 className="font-display text-3xl font-extrabold text-[#1b1c19] md:text-4xl">
          Your Orders
        </h1>

        <div className="mt-6 flex gap-3">
          {(['Active', 'Past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 font-label text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#4a6410] text-white shadow-sm'
                  : 'bg-[#ebe8db] text-[#44483a] hover:bg-[#1b1c19]/10'
              }`}
            >
              {tab} {tab === 'Active' && ACTIVE_ORDERS.length > 0 && `(${ACTIVE_ORDERS.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVE ORDERS (Wallet Pass Style) */}
      {/* ========================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
        {activeTab === 'Active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVE_ORDERS.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebe8db]">
                  <ReceiptIcon className="h-8 w-8 text-[#44483a]/40" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-[#1b1c19]">No active orders</p>
                <p className="mt-1 text-sm text-[#44483a]/60">Your upcoming pickups will appear here.</p>
                <Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4a6410] px-5 py-2.5 font-label text-xs font-bold text-white transition active:scale-95">
                  Browse Vendors
                </Link>
              </div>
            ) : (
              ACTIVE_ORDERS.map((order) => (
                <div key={order.id} className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm border border-[#1b1c19]/5 transition hover:shadow-md">
                  
                  {/* Top Half: Cover Image & Status */}
                  <div className="relative h-32 w-full bg-[#ebe8db]">
                    <img src={order.coverImage} alt={order.vendor} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg backdrop-blur-md border border-white/20">
                        {order.vendorLogo}
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-white drop-shadow-md">
                          {order.vendor}
                        </p>
                        <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                          {order.orderNumber}
                        </p>
                      </div>
                    </div>

                    <div className="absolute right-4 top-4 rounded-md bg-[#4a6410] px-2.5 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                      Confirmed
                    </div>
                  </div>

                  {/* Middle: Order Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between rounded-2xl bg-[#f6f4eb] p-4 border border-[#1b1c19]/5">
                      <div>
                        <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
                          Scheduled Pickup
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[#4a6410]">
                          <ClockIcon className="h-5 w-5" />
                          <span className="font-display text-xl font-extrabold">{order.pickupTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 px-2">
                      <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
                        Order Summary
                      </p>
                      <p className="mt-1 font-body text-sm font-semibold text-[#1b1c19]">
                        {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Action / QR Toggle */}
                  <div className="border-t border-dashed border-[#1b1c19]/10 p-5 pt-4">
                    <button 
                      onClick={() => setSelectedTicket(order)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a6410] py-3.5 font-label text-sm font-bold text-white shadow-sm transition active:scale-95 hover:bg-[#3b500b]"
                    >
                      <QrCodeIcon className="h-5 w-5" />
                      Show Pickup Code
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PAST ORDERS (Grid Layout / No Lists) */}
        {/* ========================================================= */}
        {activeTab === 'Past' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PAST_ORDERS.map((order) => (
              <div key={order.id} className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-sm border border-[#1b1c19]/5 transition hover:shadow-md">
                
                {/* Image Top */}
                <div className="relative h-28 w-full bg-[#ebe8db]">
                  <img src={order.coverImage} alt={order.vendor} className="h-full w-full object-cover" />
                  <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                    <span className="text-sm">{order.vendorLogo}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-[#1b1c19] line-clamp-1">
                      {order.vendor}
                    </h3>
                    <span className="shrink-0 font-display text-sm font-bold text-[#924700]">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
                    {order.date}
                  </p>
                  
                  <p className="mt-1 font-body text-xs text-[#44483a]/70 line-clamp-2">
                    {order.items.map(i => i.name).join(', ')}
                  </p>

                  <div className="mt-auto pt-4 flex gap-2">
                    <button 
                      onClick={() => setSelectedTicket(order)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ebe8db] text-[#44483a] transition hover:bg-[#1b1c19]/10"
                    >
                      <ReceiptIcon className="h-4 w-4" />
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4a6410]/10 font-label text-xs font-bold text-[#4a6410] transition hover:bg-[#4a6410]/20 active:scale-95">
                      <RefreshIcon className="h-3.5 w-3.5" />
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TICKET / RECEIPT MODAL */}
      {/* ========================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-[#f6f4eb] shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-[#4a6410] p-5 pb-8 text-center text-white relative">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-sm backdrop-blur-md border border-white/20">
                {selectedTicket.vendorLogo}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold">{selectedTicket.vendor}</h3>
              <p className="font-label text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                Order #{selectedTicket.orderNumber}
              </p>
            </div>

            {/* Ticket Jagged Edge Effect */}
            <div className="relative -mt-3 h-6 w-full flex items-center overflow-hidden">
               <div className="absolute -left-3 h-6 w-6 rounded-full bg-black/40" />
               <div className="w-full border-t-2 border-dashed border-[#1b1c19]/20" />
               <div className="absolute -right-3 h-6 w-6 rounded-full bg-black/40" />
            </div>

            {/* Receipt Body */}
            <div className="p-6 pt-2">
              {activeTab === 'Active' && (
                <div className="mb-6 flex flex-col items-center justify-center">
                  <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#1b1c19]/5">
                    {/* Fake QR code for UI purposes */}
                    <QrCodeIcon className="h-32 w-32 text-[#1b1c19]" />
                  </div>
                  <p className="mt-3 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
                    Scan at counter to pickup
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1b1c19]/10 pb-2">
                  <span className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]">Item</span>
                  <span className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]">Price</span>
                </div>
                
                {selectedTicket.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-body text-sm font-bold text-[#1b1c19]">
                        {item.qty}x {item.name}
                      </p>
                      {item.modifier && (
                        <p className="font-body text-xs text-[#44483a]/70">
                          {item.modifier}
                        </p>
                      )}
                    </div>
                    <p className="font-display text-sm font-bold text-[#1b1c19]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-[#1b1c19]/10 pt-4">
                  <span className="font-display text-base font-bold text-[#1b1c19]">Total Paid</span>
                  <span className="font-display text-xl font-extrabold text-[#924700]">
                    ${selectedTicket.total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {activeTab === 'Past' && (
                <button 
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a6410] py-3.5 font-label text-sm font-bold text-white shadow-sm transition active:scale-95"
                >
                  <RefreshIcon className="h-5 w-5" />
                  Reorder These Items
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} />
          <NavItem href="/favorites" label="Favs" icon={<HeartIcon className="h-6 w-6" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-6 w-6" />} active />
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
