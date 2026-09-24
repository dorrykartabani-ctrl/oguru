'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CoffeeIcon,
  SparklesIcon,
  ReceiptIcon,
  BellIcon,
  ArrowRight,
  UserCircleIcon,
  StoreIcon,
} from '@/components/icons';
import {
  getVendorBusiness,
  getVendorProducts,
  getVendorPromotions,
  getVendorPunchcards,
} from '@/lib/supabase/vendor-queries';
import type { Business, Location, Product, Promotion, Punchcard } from '@/types/database';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function VendorDashboardPage() {
  const router = useRouter();
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
  const tradingName = business?.trading_name ?? 'Café Artisan';

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body md:pb-8">
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[#1b1c19]/5 bg-[#fbf9f4]/90 px-5 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4a6410] font-display text-base font-bold text-white shadow-sm">
            {business?.chip_icon ?? '☕'}
          </div>
          <h1 className="font-display text-base font-bold text-[#1b1c19]">
            {tradingName}
          </h1>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#44483a] transition hover:bg-[#1b1c19]/5">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#924700]" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[#1b1c19]/5 bg-white p-5 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4a6410] text-xl text-white shadow-sm">
            {business?.chip_icon ?? '☕'}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base font-bold text-[#1b1c19]">
              {tradingName}
            </h1>
            <p className="font-label text-xs text-[#44483a]/60">Merchant Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <VendorNavLink href="/vendor/dashboard" label="Dashboard" icon={<HomeIcon className="h-5 w-5" />} active />
          <VendorNavLink href="/vendor/menu" label="Menu Management" icon={<CoffeeIcon className="h-5 w-5" />} />
          <VendorNavLink href="/vendor/marketing" label="Promos & Punchcards" icon={<SparklesIcon className="h-5 w-5" />} />
          <VendorNavLink href="/vendor/insights" label="Insights" icon={<ReceiptIcon className="h-5 w-5" />} />
          <VendorNavLink href="/vendor/profile" label="Business Profile" icon={<StoreIcon className="h-5 w-5" />} />
        </nav>

        <div className="mt-auto border-t border-[#1b1c19]/5 pt-4">
          <Link
            href={business?.slug ? `/store/${business.slug}` : '/home'}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-[#4a6410]/10 px-3 py-2 font-label text-xs font-semibold text-[#4a6410] transition hover:bg-[#4a6410]/20"
          >
            <StoreIcon className="h-4 w-4" />
            View Live Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-5 pt-20 md:ml-64 md:px-10 md:pt-10">
        {/* Greeting Banner */}
        <section className="mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19] md:text-4xl">
            {getGreeting()}, {business?.owner_full_name?.split(' ')[0] ?? 'Partner'} 👋
          </h2>
          <p className="mt-1 font-display text-lg font-semibold text-[#4a6410]">
            {location?.is_accepting_orders
              ? '🟢 Accepting pre-orders right now'
              : '🟠 Storefront in info-only mode'}
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Hero Bento Card — Live Opportunity */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a6410] via-[#5c7a18] to-[#3a500b] p-6 text-white shadow-organic md:col-span-8 md:p-8">
            <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-label text-xs font-semibold uppercase tracking-wider text-white">
                <SparklesIcon className="h-3.5 w-3.5" />
                Live Pre-order Engine
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight">
                {activeProducts.length} items live on your morning menu
              </h3>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">
                Foodies within 5km can reserve batch slot pickups. Keep menu availability updated in real-time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/vendor/menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-label text-xs font-bold uppercase tracking-wider text-[#4a6410] shadow-sm transition active:scale-95"
                >
                  Manage Menu
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/vendor/marketing"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 font-label text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95"
                >
                  Launch Flash Sale
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-[#1b1c19]/5 md:col-span-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold uppercase tracking-wider text-[#44483a]/60">
                  Menu Active
                </span>
                <CoffeeIcon className="h-5 w-5 text-[#4a6410]" />
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-[#1b1c19]">
                {products.length}
              </p>
              <p className="mt-1 font-label text-xs text-[#4a6410]">
                {activeProducts.length} available to pre-order
              </p>
            </div>

            <div className="mt-6 border-t border-[#1b1c19]/5 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-label text-[#44483a]/70">Active Promos</span>
                <span className="font-display font-bold text-[#924700]">
                  {promotions.length} active
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-label text-[#44483a]/70">Punchcards</span>
                <span className="font-display font-bold text-[#77574d]">
                  {punchcards.length} running
                </span>
              </div>
            </div>
          </div>

          {/* Active Campaigns Cards */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1b1c19]/5 md:col-span-6">
            <h3 className="font-display text-lg font-bold text-[#1b1c19]">
              Active Marketing Campaigns
            </h3>
            {promotions.length === 0 ? (
              <div className="mt-6 text-center py-6">
                <p className="text-xs text-[#44483a]/60">No promotions running right now.</p>
                <Link
                  href="/vendor/marketing"
                  className="mt-3 inline-block font-label text-xs font-bold text-[#4a6410] hover:underline"
                >
                  + Create your first deal
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {promotions.map((promo) => (
                  <li
                    key={promo.id}
                    className="flex items-center justify-between rounded-2xl bg-[#fbf9f4] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{promo.emoji ?? '🔥'}</span>
                      <div>
                        <p className="font-display text-sm font-bold text-[#1b1c19]">
                          {promo.title}
                        </p>
                        <p className="font-label text-xs text-[#44483a]/60 capitalize">
                          {promo.promotion_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#4a6410]/10 px-2.5 py-1 font-label text-[10px] font-bold text-[#4a6410]">
                      Live
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Punchcards Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1b1c19]/5 md:col-span-6">
            <h3 className="font-display text-lg font-bold text-[#1b1c19]">
              Loyalty Punchcards
            </h3>
            {punchcards.length === 0 ? (
              <div className="mt-6 text-center py-6">
                <p className="text-xs text-[#44483a]/60">No active digital punchcard.</p>
                <Link
                  href="/vendor/marketing"
                  className="mt-3 inline-block font-label text-xs font-bold text-[#77574d] hover:underline"
                >
                  + Launch a punchcard
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {punchcards.map((card) => (
                  <li
                    key={card.id}
                    className="flex items-center justify-between rounded-2xl bg-[#fbf9f4] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.emoji ?? '☕'}</span>
                      <div>
                        <p className="font-display text-sm font-bold text-[#1b1c19]">
                          {card.title}
                        </p>
                        <p className="font-label text-xs text-[#44483a]/60">
                          {card.punches_required} punches = {card.reward_description}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#77574d]/10 px-2.5 py-1 font-label text-[10px] font-bold text-[#77574d]">
                      Active
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <MobileVendorNavItem href="/vendor/dashboard" label="Home" icon={<HomeIcon className="h-5 w-5" />} active />
          <MobileVendorNavItem href="/vendor/menu" label="Menu" icon={<CoffeeIcon className="h-5 w-5" />} />
          <MobileVendorNavItem href="/vendor/marketing" label="Marketing" icon={<SparklesIcon className="h-5 w-5" />} />
          <MobileVendorNavItem href="/vendor/profile" label="Profile" icon={<UserCircleIcon className="h-5 w-5" />} />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

function VendorNavLink({
  href, label, icon, active = false,
}: {
  href: string; label: string; icon: React.ReactNode; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-label text-xs font-semibold transition ${
        active
          ? 'bg-[#4a6410] text-white shadow-sm'
          : 'text-[#44483a] hover:bg-[#1b1c19]/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileVendorNavItem({
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
