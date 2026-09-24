'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  CoffeeIcon,
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRight,
  CheckCircleIcon,
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
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await getVendorBySlug(resolvedParams.identifier);
        setVendor(data);
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
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, name, price: priceCents, qty: 1 }];
    });
  };

  const totalCents = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf9f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="mx-auto max-w-md px-5 pt-20 text-center font-body">
        <p className="font-display text-lg font-bold text-[#1b1c19]">Vendor not found</p>
        <Link href="/home" className="mt-4 inline-block font-label text-xs font-bold text-[#4a6410]">
          ← Back to Oguru Home
        </Link>
      </div>
    );
  }

  const primaryLoc = vendor.locations?.[0];

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-32 font-body">
      {/* Cover / Header */}
      <section className="relative bg-gradient-to-br from-[#4a6410] via-[#5c7a18] to-[#3a500b] px-5 pt-14 pb-10 text-white shadow-md">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-md">
              {vendor.chip_icon ?? '☕'}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {vendor.trading_name}
              </h1>
              {vendor.tagline && (
                <p className="mt-0.5 text-xs text-white/80">{vendor.tagline}</p>
              )}
            </div>
          </div>

          {primaryLoc && (
            <div className="mt-4 flex items-center gap-2 font-label text-xs text-white/80">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span>{primaryLoc.address_line_1}, {primaryLoc.suburb}</span>
            </div>
          )}
        </div>
      </section>

      {/* Menu Catalog */}
      <section className="mx-auto max-w-2xl px-5 pt-6">
        <h2 className="font-display text-lg font-bold text-[#1b1c19]">Pre-order Catalog</h2>

        <ul className="mt-4 space-y-3">
          {vendor.products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1 pr-4">
                <p className="font-display text-sm font-bold text-[#1b1c19]">{product.name}</p>
                {product.description && (
                  <p className="mt-0.5 truncate text-xs text-[#44483a]/70">
                    {product.description}
                  </p>
                )}
                <p className="mt-1 font-display text-sm font-bold text-[#4a6410]">
                  ${(product.price_cents / 100).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => addToCart(product.id, product.name, product.price_cents)}
                className="rounded-xl bg-[#4a6410]/10 px-4 py-2 font-label text-xs font-bold text-[#4a6410] transition hover:bg-[#4a6410] hover:text-white active:scale-95"
              >
                + Add
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky Cart Drawer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white p-4 shadow-2xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div>
              <p className="font-label text-xs text-[#44483a]/60">
                {cart.reduce((s, i) => sum + i.qty, 0)} items selected
              </p>
              <p className="font-display text-xl font-bold text-[#1b1c19]">
                ${(totalCents / 100).toFixed(2)}
              </p>
            </div>

            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4a6410] px-6 py-3 font-label text-xs font-bold text-white shadow-sm transition active:scale-95"
            >
              Reserve Slot & Pay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
