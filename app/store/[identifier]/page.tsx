'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  SearchIcon,
  UserCircleIcon,
  StarIcon,
  MapPinIcon,
  PlusIcon,
} from '@/components/icons';
import { getVendorBySlug } from '@/lib/supabase/queries';
import type { VendorDetail } from '@/types/database';

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const resolvedParams = use(params);
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await getVendorBySlug(resolvedParams.identifier);
        if (data) {
          setVendor(data);
          // Set first category active by default
          const cats = Array.from(new Set(data.products.map(p => p.category)));
          if (cats.length > 0) setActiveCategory(cats[0]);
        }
      } catch (err) {
        console.error('Failed to load store:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [resolvedParams.identifier]);

  const addToCart = (productId: string, name: string, priceCents: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) return prev.map((i) => i.id === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: productId, name, price: priceCents, qty: 1 }];
    });
  };

  const totalCents = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f4eb]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="px-5 pt-20 text-center font-body bg-[#f6f4eb] min-h-screen">
        <p className="font-display text-lg font-bold">Vendor not found</p>
        <Link href="/home" className="mt-4 inline-block text-[#4a6410] underline">Back to Home</Link>
      </div>
    );
  }

  const primaryLoc = vendor.locations?.[0];
  const categories = Array.from(new Set(vendor.products.map(p => p.category)));

  // Determine cover image (using fallback logic if empty)
  const coverImg = vendor.cover_url || 
    (vendor.business_types?.[0]?.toLowerCase() === 'bakery' 
      ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' 
      : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800');

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-40 font-body">
      {/* ---- Floating Header ---- */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f4eb]/80 backdrop-blur-sm text-[#4a6410]">
             <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="font-display text-2xl font-extrabold text-[#4a6410] drop-shadow-sm">OGuru</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f4eb]/80 backdrop-blur-sm text-[#4a6410]">
             <SearchIcon className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm overflow-hidden border-2 border-white">
             <UserCircleIcon className="h-8 w-8 mt-2 opacity-80" />
          </div>
        </div>
      </header>

      {/* ---- Hero Image with Fade to Cream ---- */}
      <div className="relative h-[380px] w-full">
        <img src={coverImg} alt={vendor.trading_name} className="h-full w-full object-cover" />
        
        {/* Gradient that matches the cream background perfectly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f4eb] via-[#f6f4eb]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f4eb] via-black/40 to-black/10" />

        <div className="absolute bottom-6 left-5 right-5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[#a38036] px-2 py-1 shadow-sm mb-3">
             <StarIcon className="h-3 w-3 fill-black text-black" />
             <span className="font-label text-xs font-bold text-black">4.9 (500+ Reviews)</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight drop-shadow-md">
            {vendor.trading_name}
          </h1>
          {primaryLoc && (
            <div className="mt-2 flex items-center gap-1.5 text-white/90 drop-shadow-md">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span className="font-label text-sm font-medium">{primaryLoc.address_line_1}, {primaryLoc.suburb}</span>
            </div>
          )}
        </div>
      </div>

      {/* ---- Category Tabs ---- */}
      <div className="sticky top-0 z-30 bg-[#f6f4eb] px-5 py-3 shadow-[0_4px_10px_rgba(0,0,0,0.02)] border-b border-[#1b1c19]/5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 font-label text-sm font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#4a6410] text-white'
                  : 'text-[#44483a]/70 hover:bg-[#1b1c19]/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Menu List ---- */}
      <div className="px-5 pt-6">
        {categories.map((cat) => (
          <div key={cat} className={activeCategory === cat ? 'block' : 'hidden'}>
            <div className="flex items-center gap-2 mb-4">
               {/* Just a generic icon for the category header to match screenshot */}
               <span className="text-[#4a6410] text-xl">☕</span>
               <h2 className="font-display text-2xl font-extrabold text-[#4a6410]">{cat}</h2>
            </div>
            
            <div className="space-y-6">
              {vendor.products
                .filter((p) => p.category === cat)
                .map((product) => (
                  <div key={product.id} className="relative border-b border-[#1b1c19]/10 pb-6">
                    <div className="flex justify-between items-start pr-12">
                      <div className="min-w-0">
                         <div className="flex items-center gap-2">
                           <h3 className="font-display text-lg font-bold text-[#1b1c19] leading-tight">
                             {product.name}
                           </h3>
                           {/* Add top seller badge logic here if needed */}
                           {product.sort_order === 1 && (
                              <span className="rounded bg-[#a38036] px-1.5 py-0.5 font-label text-[8px] font-extrabold uppercase tracking-wider text-black">
                                Top Seller
                              </span>
                           )}
                         </div>
                         <p className="mt-1 text-sm text-[#44483a]/80 leading-relaxed pr-4">
                           {product.description}
                         </p>
                      </div>
                      <span className="font-display text-base font-bold text-[#924700] shrink-0">
                        ${(product.price_cents / 100).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product.id, product.name, product.price_cents)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#4a6410]/10 text-[#4a6410] transition hover:bg-[#4a6410]/20 active:scale-95"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---- Footer Text ---- */}
      <div className="mt-12 flex flex-col items-center px-5 text-center">
        <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
           <span className="text-blue-400 font-display text-3xl font-extrabold">G</span>
        </div>
        <h3 className="mt-4 font-display text-xl font-extrabold text-[#4a6410]">
          OGuru Verified Vendor
        </h3>
        <p className="mt-2 text-sm text-[#44483a]/80 max-w-sm">
          Ethically sourced, locally produced, and sustainably delivered via the OGuru network.
        </p>
      </div>

      {/* ---- Bottom Floating Cart CTA ---- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#f6f4eb] via-[#f6f4eb] to-transparent p-5 pt-10">
          <Link
            href="/orders"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#4a6410] py-4 shadow-lg transition active:scale-[0.98]"
          >
            <div className="relative flex items-center">
               <span className="text-white text-xl">🛒</span>
               <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#4a6410] bg-[#924700] font-label text-[10px] font-bold text-white">
                 {totalItems}
               </span>
            </div>
            <span className="font-display text-lg font-bold text-white">
              View Cart (${(totalCents / 100).toFixed(2)})
            </span>
          </Link>
        </div>
      )}
    </main>
  );
}
