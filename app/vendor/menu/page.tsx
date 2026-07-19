'use client';

import { useRouter } from 'next/navigation';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  MoreHorizontal,
  Bell,
  RefreshCw,
  LayoutTemplate,
  Pencil,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: true, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

const options = [
  {
    icon: RefreshCw,
    title: 'Sync from POS',
    subtitle: 'Import from Square, Toast, Lightspeed, Clover',
    time: '2 min',
    highlight: true,
    href: '/vendor/menu/sync',
  },
  {
    icon: LayoutTemplate,
    title: 'Use a template',
    subtitle: 'Café · Bakery · Custom starting points',
    time: '15 min',
    highlight: false,
    href: '/vendor/menu/templates',
  },
  {
    icon: Pencil,
    title: 'Build from scratch',
    subtitle: 'Full control with reusable blocks',
    time: '45 min',
    highlight: false,
    href: '/vendor/menu/product/new',
  },
  {
    icon: MessageCircle,
    title: 'Not sure? Chat with our assistant',
    subtitle: 'Get a personalised recommendation',
    time: 'Chat',
    highlight: false,
    href: '#',
  },
];

export default function VendorMenuEmptyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Top App Bar — mobile only */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="OGuru" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="font-display text-lg font-bold text-primary">
            Café Artisan
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary-container" />
        </button>
      </header>

      {/* Side Navigation — tablet + desktop */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="OGuru" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-base text-primary font-bold leading-tight">
              Café Artisan
            </h1>
            <p className="text-xs text-on-surface-variant">Vendor Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium text-left ${
                  item.active
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
            SM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Sarah Miller</p>
            <p className="text-xs text-on-surface-variant truncate">Owner</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-12 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
              Step 1 of 3 — Setting up your store
            </span>
            <span className="text-xs font-label font-semibold text-primary">
              33%
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: '33%' }}
            />
          </div>
        </div>

        {/* Header */}
        <section className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight tracking-tight mb-2">
            Let&apos;s build your menu
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed">
            Choose how you&apos;d like to start. You can switch approaches anytime.
          </p>
        </section>

        {/* Options — Clean rows */}
        <div className="space-y-3">
          {options.map((option, i) => {
            const Icon = option.icon;
            return (
              <button
                key={i}
                onClick={() => option.href !== '#' && router.push(option.href)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left group ${
                  option.highlight
                    ? 'bg-primary-container border-primary text-white hover:brightness-105'
                    : 'bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-surface-container-low'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    option.highlight
                      ? 'bg-white/20'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon size={22} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-display font-semibold text-base md:text-lg leading-tight mb-0.5 ${
                      option.highlight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    {option.title}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      option.highlight
                        ? 'text-white/80'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {option.subtitle}
                  </p>
                </div>

                {/* Time chip */}
                <span
                  className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label font-semibold uppercase tracking-wider flex-shrink-0 ${
                    option.highlight
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {option.time}
                </span>

                {/* Arrow */}
                <ArrowRight
                  size={20}
                  className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                    option.highlight ? 'text-white' : 'text-on-surface-variant'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation — Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)]">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all active:scale-90 ${
                  item.active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} fill={item.active ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-label font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
