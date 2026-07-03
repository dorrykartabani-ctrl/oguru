'use client';

import { useRouter } from 'next/navigation';
import {
  Bell,
  Sun,
  Sparkles,
  ArrowRight,
  ArrowUp,
  TrendingUp,
  Gift,
  UserPlus,
  Megaphone,
  PlusCircle,
  BarChart3,
  MessageSquare,
  Home,
  ShoppingBag,
  UtensilsCrossed,
  MoreHorizontal,
  Plus,
  ChevronRight,
  Coffee,
  Croissant,
  ShoppingCart,
} from 'lucide-react';

const orders = [
  {
    id: '#847',
    customer: 'Sarah M.',
    items: 'Oat Flat White + Croissant',
    time: '8:00 AM',
    status: 'preparing',
    isGift: false,
    icon: Coffee,
  },
  {
    id: '#846',
    customer: 'James L.',
    items: '2x Avocado Toast',
    time: '7:55 AM',
    status: 'pending',
    isGift: false,
    icon: Croissant,
  },
  {
    id: '#845',
    customer: 'Emma R.',
    items: 'Matcha Latte',
    time: '7:45 AM',
    status: 'preparing',
    isGift: true,
    icon: Coffee,
  },
];

const stats = [
  {
    label: 'Live Orders',
    value: '12',
    change: '+3',
    trend: 'up',
    color: 'primary',
  },
  {
    label: 'Revenue',
    value: '£186',
    change: '+12%',
    trend: 'up',
    color: 'primary',
  },
  {
    label: 'Followers',
    value: '2,847',
    change: '+12',
    trend: 'up',
    color: 'primary',
  },
  {
    label: 'Gifts Pending',
    value: '8',
    change: '',
    trend: 'gift',
    color: 'secondary',
  },
];

const quickActions = [
  { icon: Megaphone, label: 'Promo' },
  { icon: PlusCircle, label: 'Product' },
  { icon: BarChart3, label: 'Insights' },
  { icon: MessageSquare, label: 'Chat' },
];

const recommendations = [
  {
    icon: UserPlus,
    label: 'Send win-back offer',
    subtext: '3 top customers away',
    bg: 'bg-primary text-on-primary',
  },
  {
    icon: TrendingUp,
    label: 'Boost afternoon sales',
    subtext: 'Post before 2pm',
    bg: 'bg-secondary-container text-on-secondary-container',
  },
];

export default function VendorDashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface pb-24 md:pb-8">
      {/* Grainy texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-40 bg-surface-container-low/95 backdrop-blur-md shadow-organic-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="OGuru"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-display text-2xl font-bold text-primary tracking-tight">
              OGuru
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: ShoppingBag, label: 'Orders' },
              { icon: UtensilsCrossed, label: 'Menu' },
              { icon: Megaphone, label: 'Marketing' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href="#"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm font-semibold uppercase tracking-wider transition-colors ${
                    item.active
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary" />
            </button>
            <button className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label text-sm font-semibold uppercase tracking-wider hover:bg-primary-container transition-all active:scale-95">
              <Plus size={18} />
              New Product
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-6 md:py-10 space-y-6 md:space-y-10">
        {/* Greeting */}
        <section className="flex justify-between items-start md:items-end gap-4">
          <div className="space-y-2 flex-1">
            <p className="font-label text-xs font-semibold text-secondary uppercase tracking-widest">
              Good morning, Sarah
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-on-surface tracking-tight leading-tight">
              Your store is blooming today
            </h1>
            <div className="w-24 h-1 bg-primary-container rounded-full mt-3" />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container text-on-surface px-3 py-2 rounded-full border border-outline-variant flex-shrink-0">
            <Sun size={16} className="text-tertiary" />
            <span className="font-label text-xs font-semibold uppercase tracking-wider">
              18°C
            </span>
          </div>
        </section>

        {/* AI Insight Card + Stats — Tablet: side by side, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* AI Insight — full width mobile, 7 cols desktop */}
          <div className="lg:col-span-7">
            <div className="relative bg-secondary-container rounded-2xl p-6 md:p-8 overflow-hidden shadow-organic border border-secondary/10">
              <div className="relative z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full w-fit mb-4">
                  <Sparkles size={16} className="text-tertiary" />
                  <span className="font-label text-xs font-semibold text-tertiary uppercase tracking-wider">
                    AI Insight
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-on-secondary-container mb-2 leading-tight">
                  Rush expected at 6:00 PM today
                </h2>
                <p className="text-sm md:text-base text-on-secondary-container/80 mb-6 leading-relaxed max-w-md">
                  Local concert nearby + warm weather forecast means higher foot traffic than usual.
                </p>
                <button className="inline-flex items-center gap-2 bg-white text-secondary px-5 py-2.5 rounded-lg font-label text-sm font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors active:scale-95 group">
                  Prepare a promotion
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              {/* Decorative background icon */}
              <Megaphone
                size={140}
                className="absolute -right-6 -bottom-6 text-secondary/10"
              />
            </div>
          </div>

          {/* Stats — 2x2 mobile, 2x2 desktop (in the 5-col area) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest border border-outline/10 rounded-2xl p-4 md:p-5 shadow-organic-sm hover:shadow-organic transition-all active:scale-[0.98] cursor-pointer"
                >
                  <p className="font-label text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="font-display text-2xl md:text-3xl font-semibold text-on-surface">
                      {stat.value}
                    </span>
                    {stat.trend === 'up' ? (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        <ArrowUp size={10} />
                        {stat.change}
                      </span>
                    ) : (
                      <Gift
                        size={20}
                        className="text-secondary"
                        fill="currentColor"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Order Queue */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-label text-xs font-semibold text-outline uppercase tracking-widest">
                Live Order Queue
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-on-surface mt-1">
                Pending fulfilment
              </h3>
            </div>
            <button className="text-primary text-sm font-label font-semibold uppercase tracking-wider hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((order) => {
              const OrderIcon = order.icon;
              const statusStyles = {
                preparing:
                  'bg-primary-container/20 text-primary border-primary/20',
                pending:
                  'bg-surface-container-highest text-on-surface-variant border-outline/20',
                new: 'bg-tertiary/10 text-tertiary border-tertiary/20',
              };
              return (
                <div
                  key={order.id}
                  className="bg-surface-container-lowest border border-outline/10 rounded-2xl p-4 flex items-center gap-4 hover:shadow-organic hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-surface-container rounded-xl flex items-center justify-center text-primary font-display font-bold flex-shrink-0">
                    <OrderIcon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-on-surface text-sm md:text-base truncate">
                        {order.id} — {order.customer}
                      </h4>
                      {order.isGift && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-label font-bold text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded uppercase">
                          <Gift size={10} />
                          Gift
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-on-surface-variant truncate mt-0.5">
                      {order.items} • {order.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider border ${
                        statusStyles[order.status as keyof typeof statusStyles]
                      }`}
                    >
                      {order.status}
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-outline group-hover:text-primary transition-colors hidden md:block"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Recommendations + Quick Actions grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Growth Recommendations */}
          <section className="lg:col-span-7">
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Growth Recommendations
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {recommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <button
                    key={i}
                    className={`${rec.bg} rounded-2xl p-5 md:p-6 h-36 md:h-40 flex flex-col justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-organic-sm`}
                  >
                    <Icon size={28} />
                    <div>
                      <p className="font-semibold text-base md:text-lg leading-tight mb-1">
                        {rec.label}
                      </p>
                      <p className="text-xs opacity-80">{rec.subtext}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="lg:col-span-5">
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Quick Actions
            </p>
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="flex flex-col items-center gap-2 group py-2"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-active:scale-90 transition-all">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-label font-semibold text-on-surface uppercase tracking-wider">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Weekly Forecast */}
        <section className="bg-surface-container-lowest border border-outline/10 rounded-2xl p-6 md:p-8 shadow-organic-sm">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 mb-6">
            <div>
              <p className="font-label text-xs font-semibold text-outline uppercase tracking-widest mb-1">
                Weekly Forecast
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-on-surface">
                Upward trend
              </h3>
            </div>
            <span className="text-xs font-label font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              +15% vs last week
            </span>
          </div>

          <div className="h-24 md:h-32 w-full flex items-end justify-between gap-1 md:gap-2">
            <div className="w-full bg-primary/10 rounded-t-lg transition-all" style={{ height: '40%' }} />
            <div className="w-full bg-primary/20 rounded-t-lg transition-all" style={{ height: '60%' }} />
            <div className="w-full bg-primary/30 rounded-t-lg transition-all" style={{ height: '50%' }} />
            <div className="w-full bg-primary/40 rounded-t-lg transition-all" style={{ height: '80%' }} />
            <div className="w-full bg-primary/60 rounded-t-lg transition-all" style={{ height: '70%' }} />
            <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-lg transition-all shadow-organic" style={{ height: '95%' }} />
            <div className="w-full bg-surface-container-highest rounded-t-lg transition-all" style={{ height: '30%' }} />
          </div>
          <div className="flex justify-between mt-3 font-label text-xs font-semibold text-outline px-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span className="text-primary font-bold">S</span>
            <span>S</span>
          </div>
        </section>
      </div>

      {/* Bottom Navigation — Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(93,64,55,0.08)] rounded-t-2xl">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: ShoppingBag, label: 'Orders' },
            { icon: UtensilsCrossed, label: 'Menu' },
            { icon: Megaphone, label: 'Marketing' },
            { icon: MoreHorizontal, label: 'More' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href="#"
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all active:scale-90 ${
                  item.active
                    ? 'bg-primary-container/20 text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} fill={item.active ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-label font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button — Mobile only */}
      <button className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl shadow-organic-lg flex items-center justify-center active:scale-90 transition-transform z-40">
        <Plus size={24} />
      </button>
    </main>
  );
}
