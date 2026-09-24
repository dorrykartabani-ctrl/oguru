'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  CoffeeIcon,
  MapPinIcon,
  ArrowRight,
  ExternalLinkIcon,
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

  // Internal cart state (only used if no external POS link)
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await getVendorBySlug(resolvedParams.identifier);
        setVendor(data);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [resolvedParams.identifier]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf9f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="px-5 pt-20 text-center font-body">
        <p className="font-display text-lg font-bold">Vendor not found</p>
      </div>
    );
  }

  const primaryLoc = vendor.locations?.[0];
  
  // Magic routing detection
  const hasExternalPos = !!primaryLoc?.pos_preorder_url;
  const posProviderName = primaryLoc?.pos_system || 'Live Ordering';
  
  const addToCart = (productId: string, name: string, priceCents: number) => {
    if (hasExternalPos) return; // Cart disabled for external POS
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) return prev.map((i) => i.id === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: productId, name, price: priceCents, qty: 1 }];
    });
  };

  const totalCents = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-32 font-body">
      {/* Cover / Header */}
      <section className="bg-gradient-to-br from-[#4a6410] via-[#5c7a18] to-[#3a500b] px-5 pt-14 pb-10 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
              {vendor.chip_icon ?? '☕'}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{vendor.trading_name}</h1>
              {vendor.tagline && <p className="mt-0.5 text-xs text-white/80">{vendor.tagline}</p>}
            </div>
          </div>
          {primaryLoc && (
            <div className="mt-4 flex items-center gap-2 font-label text-xs text-white/80">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span>{primaryLoc.address_line_1}, {primaryLoc.suburb}</span>
            </div>
          )}

          {/* Direct POS CTA directly in header */}
          {hasExternalPos && primaryLoc.pos_preorder_url && (
             <a
               href={primaryLoc.pos_preorder_url}
               target="_blank"
               rel="noopener noreferrer"
               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-label text-xs font-bold text-[#4a6410] transition hover:bg-white/90 active:scale-95"
             >
               Order via {posProviderName}
               <ExternalLinkIcon className="h-4 w-4" />
             </a>
          )}
        </div>
      </section>

      {/* Menu Catalog (Read-only if external POS) */}
      <section className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#1b1c19]">Menu Preview</h2>
          {hasExternalPos && (
             <span className="rounded-full bg-[#1b1c19]/5 px-2.5 py-1 font-label text-[10px] font-bold text-[#44483a]/60">
               Ordering handled by {posProviderName}
             </span>
          )}
        </div>

        <ul className="mt-4 space-y-3">
          {vendor.products.map((product) => (
            <li key={product.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <div className="min-w-0 flex-1 pr-4">
                <p className="font-display text-sm font-bold text-[#1b1c19]">{product.name}</p>
                {product.description && <p className="mt-0.5 truncate text-xs text-[#44483a]/70">{product.description}</p>}
                <p className="mt-1 font-display text-sm font-bold text-[#4a6410]">
                  ${(product.price_cents / 100).toFixed(2)}
                </p>
              </div>

              {!hasExternalPos && (
                <button
                  onClick={() => addToCart(product.id, product.name, product.price_cents)}
                  className="rounded-xl bg-[#4a6410]/10 px-4 py-2 font-label text-xs font-bold text-[#4a6410] active:scale-95"
                >
                  + Add
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky Bottom Actions */}
      {hasExternalPos && primaryLoc?.pos_preorder_url ? (
        // External POS Sticky Bar
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white p-4 shadow-2xl">
          <div className="mx-auto max-w-2xl">
            <a
              href={primaryLoc.pos_preorder_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a6410] py-3.5 font-label text-sm font-bold text-white shadow-sm transition active:scale-95"
            >
              Order via {posProviderName}
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : cart.length > 0 ? (
        // Native Internal Cart Sticky Bar
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white p-4 shadow-2xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div>
              <p className="font-label text-xs text-[#44483a]/60">
                {cart.reduce((s, i) => s + i.qty, 0)} items selected
              </p>
              <p className="font-display text-xl font-bold text-[#1b1c19]">
                ${(totalCents / 100).toFixed(2)}
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4a6410] px-6 py-3 font-label text-xs font-bold text-white active:scale-95"
            >
              Reserve Slot & Pay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
