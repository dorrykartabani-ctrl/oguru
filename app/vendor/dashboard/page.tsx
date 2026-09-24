'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CoffeeIcon,
  SparklesIcon,
  ArrowRight,
  ServerIcon,
  LinkIcon,
  HeartIcon,
  ReceiptIcon,
} from '@/components/icons';
import {
  getVendorBusiness,
  getVendorProducts,
  getVendorPromotions,
  getVendorPunchcards,
} from '@/lib/supabase/vendor-queries';
import type { Business, Location, Product, Promotion, Punchcard } from '@/lib/supabase/types';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function VendorDashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [punchcards, setPunchcards] = useState<Punchcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { business: biz, location: loc } = await getVendorBusiness();
        if (biz) {
          setBusiness(biz);
          setLocation(loc);
          const [prods, promos, cards] = await Promise.all([
            getVendorProducts(biz.id),
            getVendorPromotions(biz.id),
            getVendorPunchcards(biz.id),
          ]);
          setProducts(prods);
          setPromotions(promos);
          setPunchcards(cards);
        }
      } catch (err) {
        console.error('Failed to load vendor dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const activeProducts = products.filter((p) => p.is_available);
  const hasExternalPos = !!location?.pos_preorder_url;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f4eb] pb-28 pt-20 md:ml-64 md:pt-10">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a6410]/20 border-t-[#4a6410]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-28 pt-20 font-body md:ml-64 md:pt-10">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        
        {/* ---- Greeting Banner ---- */}
        <section className="mb-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1b1c19] md:text-4xl">
            {getGreeting()}, {business?.owner_full_name?.split(' ')[0] ?? 'Partner'} 👋
          </h2>
          <div className="mt-2 flex items-center gap-2">
            {location?.is_accepting_orders ? (
              <span className="flex items-center gap-1.5 rounded-md bg-[#4a6410]/10 px-2.5 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4a6410]" />
                Storefront Open
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md bg-[#1b1c19]/5 px-2.5 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
                Storefront Closed
              </span>
            )}
          </div>
        </section>

        {/* ---- Primary Action Hero ---- */}
        <section className="mb-8">
          {hasExternalPos ? (
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#4a6410] via-[#5c7a18] to-[#3a500b] p-8 text-white shadow-organic">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 max-w-lg">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                  <ServerIcon className="h-3.5 w-3.5" />
                  POS Sync Active
                </span>
                <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight">
                  Customers are routing directly to {location.pos_system || 'your POS'}.
                </h3>
                <p className="mt-2 text-sm font-medium text-white/80">
                  Oguru is handling discovery. Pre-orders are bypassing our cart and landing straight on your existing tablet.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/vendor/menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-label text-xs font-extrabold uppercase tracking-wider text-[#4a6410] shadow-sm transition active:scale-95"
                  >
                    Manage Routing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#924700] via-[#b66614] to-[#a38036] p-8 text-white shadow-organic">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 max-w-lg">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm">
                  <CoffeeIcon className="h-3.5 w-3.5" />
                  Manual Menu Active
                </span>
                <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight">
                  {activeProducts.length} items live on your morning menu.
                </h3>
                <p className="mt-2 text-sm font-medium text-white/80">
                  You are currently managing orders through the Oguru Dashboard. Want to connect your POS directly?
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/vendor/menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-label text-xs font-extrabold uppercase tracking-wider text-[#924700] shadow-sm transition active:scale-95"
                  >
                    Manage Menu
                  </Link>
                  <Link
                    href="/vendor/menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 font-label text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Connect POS
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ---- Quick Stats Grid ---- */}
        <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-[28px] bg-white p-6 shadow-sm border border-[#1b1c19]/5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe8db] text-[#4a6410]">
                <CoffeeIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold text-[#1b1c19]">{products.length}</p>
            <p className="mt-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
              Total Menu Items
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm border border-[#1b1c19]/5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe8db] text-[#924700]">
                <SparklesIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold text-[#1b1c19]">{promotions.length}</p>
            <p className="mt-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
              Active Promos
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm border border-[#1b1c19]/5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe8db] text-[#77574d]">
                <ReceiptIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold text-[#1b1c19]">{punchcards.length}</p>
            <p className="mt-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/50">
              Live Punchcards
            </p>
          </div>

          <div className="rounded-[28px] bg-[#4a6410] p-6 shadow-sm text-white">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <HeartIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold">24</p>
            <p className="mt-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-white/70">
              Local Followers
            </p>
          </div>
        </section>

        {/* ---- Active Campaigns Grid (No Lists) ---- */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-xl font-extrabold text-[#1b1c19]">
              Active Campaigns
            </h3>
            <Link href="/vendor/marketing" className="font-label text-xs font-bold text-[#4a6410] hover:underline">
              View All &rarr;
            </Link>
          </div>

          {promotions.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-sm border border-[#1b1c19]/5">
              <SparklesIcon className="mx-auto h-8 w-8 text-[#44483a]/30" />
              <p className="mt-3 font-display text-base font-bold text-[#1b1c19]">No active promos</p>
              <Link href="/vendor/marketing" className="mt-4 inline-block rounded-xl bg-[#ebe8db] px-4 py-2 font-label text-xs font-bold text-[#1b1c19] transition hover:bg-[#1b1c19]/10">
                Create Offer
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {promotions.map((promo) => (
                <div key={promo.id} className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-sm border border-[#1b1c19]/5 transition hover:shadow-md">
                  <div className="absolute -right-4 -top-4 text-7xl opacity-5">{promo.emoji ?? '🔥'}</div>
                  <span className="inline-block rounded-md bg-[#924700]/10 px-2 py-1 font-label text-[9px] font-extrabold uppercase tracking-wider text-[#924700]">
                    {promo.promotion_type.replace('_', ' ')}
                  </span>
                  <h4 className="mt-3 font-display text-lg font-bold text-[#1b1c19] leading-tight">
                    {promo.title}
                  </h4>
                  {promo.description && (
                    <p className="mt-1 font-body text-xs text-[#44483a]/70 line-clamp-2">
                      {promo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ---- Active Punchcards Grid (No Lists) ---- */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-xl font-extrabold text-[#1b1c19]">
              Loyalty Punchcards
            </h3>
            <Link href="/vendor/marketing" className="font-label text-xs font-bold text-[#4a6410] hover:underline">
              Manage &rarr;
            </Link>
          </div>

          {punchcards.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-sm border border-[#1b1c19]/5">
              <ReceiptIcon className="mx-auto h-8 w-8 text-[#44483a]/30" />
              <p className="mt-3 font-display text-base font-bold text-[#1b1c19]">No active punchcards</p>
              <Link href="/vendor/marketing" className="mt-4 inline-block rounded-xl bg-[#ebe8db] px-4 py-2 font-label text-xs font-bold text-[#1b1c19] transition hover:bg-[#1b1c19]/10">
                Launch Punchcard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {punchcards.map((card) => (
                <div key={card.id} className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-sm border border-[#1b1c19]/5 transition hover:shadow-md">
                  <span className="inline-block rounded-md bg-[#77574d]/10 px-2 py-1 font-label text-[9px] font-extrabold uppercase tracking-wider text-[#77574d]">
                    Live Punchcard
                  </span>
                  <h4 className="mt-3 font-display text-lg font-bold text-[#1b1c19] leading-tight">
                    {card.title}
                  </h4>
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#ebe8db] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-[#77574d] shadow-sm">
                      {card.punches_required}
                    </div>
                    <p className="font-body text-xs font-semibold text-[#1b1c19] leading-tight">
                      Punches unlocks <br />
                      <span className="font-bold text-[#77574d]">{card.reward_description}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
