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
  Clock,
  ArrowRight,
  Info,
  Sparkles,
  ShieldCheck,
  Cloud,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: true, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

const posOptions = [
  { name: 'Square', color: '#000000' },
  { name: 'Toast', color: '#F16521' },
  { name: 'Lightspeed', color: '#e93d3b' },
  { name: 'Clover', color: '#009b00' },
];

const templateTags = ['Café', 'Bakery', 'Custom'];

export default function VendorMenuEmptyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Grainy texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

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

      {/* Side Navigation — tablet and desktop */}
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
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">

        {/* Progress Indicator */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-label font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                Step 1 of 3
              </span>
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                Setting up your store
              </span>
            </div>
            <span className="text-xs font-label font-semibold text-primary">
              33%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: '33%' }}
            />
          </div>
        </div>

        {/* Welcome Header */}
        <section className="mb-8 md:mb-10">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-on-surface leading-tight tracking-tight mb-3">
            Let&apos;s build your menu
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            This is what customers will see. Choose how you&apos;d like to start.
          </p>
          <p className="text-sm text-primary/70 italic mt-2">
            You can switch approaches at any time.
          </p>
        </section>

        {/* Three Paths — Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 mb-6 md:mb-8">

          {/* PATH 1: POS SYNC — Hero card, primary green */}
          <section className="lg:col-span-8 relative bg-primary-container text-white rounded-2xl p-6 md:p-8 overflow-hidden shadow-organic-md hover:shadow-organic-lg transition-shadow min-h-[320px] flex flex-col justify-between">
            {/* Background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <RefreshCw size={28} />
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Clock size={14} />
                  <span className="font-label text-xs font-semibold uppercase tracking-wider">
                    ~2 minutes
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                Sync from POS
              </h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md mb-6">
                Import your existing menu instantly from Square, Toast, Lightspeed, and more. OGuru handles categories, variants, and pricing automatically.
              </p>
            </div>

            <div className="relative z-10">
              <p className="text-xs font-label font-semibold opacity-70 uppercase tracking-widest mb-3">
                Supported Platforms
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                {posOptions.map((pos, i) => (
                  <div
                    key={i}
                    className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 text-on-surface"
                  >
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: pos.color }}
                    />
                    <span className="font-bold text-xs md:text-sm">
                      {pos.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/vendor/menu/sync')}
                className="bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-xl font-label font-bold uppercase tracking-wider text-sm hover:bg-surface-container-lowest active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Connect POS
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          {/* PATH 2: TEMPLATE — peach/secondary container */}
          <section className="lg:col-span-4 bg-secondary-container text-on-secondary-container rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-organic-sm hover:shadow-organic transition-shadow min-h-[320px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-on-secondary-container/10 rounded-xl flex items-center justify-center">
                  <LayoutTemplate size={24} />
                </div>
                <div className="flex items-center gap-1.5 text-on-secondary-container/60">
                  <Clock size={14} />
                  <span className="font-label text-xs font-semibold uppercase tracking-wider">
                    ~15 min
                  </span>
                </div>
              </div>

              <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 text-secondary">
                Use a Template
              </h3>
              <p className="text-sm md:text-base opacity-90 leading-relaxed mb-5">
                Pre-built menu structures with common products, sizes, and add-ons for your business type.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {templateTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/60 rounded-full text-xs font-label font-semibold uppercase tracking-wider text-secondary border border-secondary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/vendor/menu/templates')}
              className="w-full bg-secondary text-white px-4 py-3 md:py-4 rounded-xl font-label font-bold uppercase tracking-wider text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Browse Templates
            </button>
          </section>

          {/* PATH 3: BUILD FROM SCRATCH — subtle white card, full width */}
          <section className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-organic-sm hover:shadow-organic transition-shadow">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center flex-shrink-0">
                  <Pencil size={22} className="text-secondary" />
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant/60">
                  <Clock size={14} />
                  <span className="font-label text-xs font-semibold uppercase tracking-wider">
                    ~45 minutes
                  </span>
                </div>
              </div>

              <h3 className="font-display text-xl md:text-2xl font-semibold text-on-surface mb-2">
                Build from Scratch
              </h3>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-4 max-w-2xl">
                Full control — build every product, category, and option yourself. Create reusable blocks (Size, Milk, Add-ons) and apply them across multiple products.
              </p>

              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-primary/80 bg-primary/5 px-3 py-1.5 rounded-lg">
                <Info size={14} />
                <span>Best for unique businesses with artisanal workflows</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/vendor/menu/product/new')}
              className="w-full md:w-auto border-2 border-secondary text-secondary px-6 md:px-8 py-3 md:py-4 rounded-xl font-label font-bold uppercase tracking-wider text-sm hover:bg-secondary/5 active:scale-[0.98] transition-all whitespace-nowrap flex-shrink-0"
            >
              Start Building
            </button>
          </section>
        </div>

        {/* Help Card — dark inverse */}
        <div className="relative bg-inverse-surface text-inverse-on-surface rounded-2xl p-5 md:p-6 shadow-organic overflow-hidden mb-6 md:mb-8">
          {/* Accent bar left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container rounded-l-2xl" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pl-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,211,198,0.3)]">
                <Sparkles size={22} className="text-on-secondary-container" />
              </div>
              <div>
                <h4 className="font-display text-base md:text-lg font-semibold text-inverse-on-surface leading-tight">
                  Not sure which to choose?
                </h4>
                <p className="text-sm text-inverse-on-surface/70 leading-relaxed mt-1 max-w-lg">
                  Chat with our setup assistant to analyse your business type and get a personalised recommendation.
                </p>
              </div>
            </div>

            <button className="w-full md:w-auto bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-xl font-label font-bold uppercase tracking-wider text-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0">
              <HelpCircle size={18} />
              Get Help
            </button>
          </div>
        </div>

        {/* Trust Indicators — desktop only */}
        <div className="hidden md:flex justify-center items-center gap-8 pb-8 opacity-60 text-on-surface-variant">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-xs font-label uppercase tracking-wider">
              Secure POS Handshake
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-xs font-label uppercase tracking-wider">
              AI-Powered Optimisation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud size={16} />
            <span className="text-xs font-label uppercase tracking-wider">
              Cloud Backup Active
            </span>
          </div>
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
