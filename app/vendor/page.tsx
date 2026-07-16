'use client';

import { useRouter } from 'next/navigation';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  MoreHorizontal,
  Bell,
  Zap,
  Cake,
  ArrowRight,
  TrendingUp,
  CloudRain,
  Sandwich,
  Gift,
  Brain,
  Clock,
  Sparkles,
} from 'lucide-react';

const stats = [
  {
    label: 'Followers',
    value: '1,240',
    change: '+12 this week',
    trend: 'up',
  },
  {
    label: 'Nearby',
    value: '42',
    change: 'active right now',
    trend: 'neutral',
  },
  {
    label: 'Gifts Sent',
    value: '18',
    change: 'processed this week',
    trend: 'neutral',
  },
  {
    label: 'Regulars',
    value: '85',
    change: 'loyal visitors',
    trend: 'accent',
  },
];

const birthdays = [
  { name: 'Alex', initials: 'AL', color: '#77574d' },
  { name: 'Emma', initials: 'EM', color: '#4a6410' },
  { name: 'Marcus', initials: 'MA', color: '#924700' },
];

const campaigns = [
  {
    icon: CloudRain,
    name: 'Rainy Day Promo',
    subtext: 'Active during drizzle',
    orders: 47,
  },
  {
    icon: Sandwich,
    name: 'Weekend Brunch',
    subtext: 'Sat & Sun morning',
    orders: 23,
  },
];

const recommendations = [
  {
    icon: Brain,
    title: '12 lapsed customers',
    description:
      "Regulars who haven't visited in 14 days. Re-engage with a 'Miss You' coffee.",
    cta: 'Generate outreach',
    bg: 'bg-primary text-on-primary',
    ctaClass: 'bg-white/20 hover:bg-white/30',
  },
  {
    icon: Clock,
    title: 'Cold brew timing',
    description:
      "Temps hitting 22°C tomorrow. Perfect time to launch the 'Summer Chill' special.",
    cta: 'Schedule now',
    bg: 'bg-secondary-container text-on-secondary-container',
    ctaClass: 'bg-tertiary-container text-white',
  },
  {
    icon: Sparkles,
    title: 'Matcha trending',
    description:
      'Local influencers are posting about ceremonial matcha. Share your prep story.',
    cta: 'View insights',
    bg: 'bg-surface-container-low border border-outline-variant text-on-surface',
    ctaClass: 'border border-outline text-on-surface-variant hover:bg-surface-variant',
  },
];

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: BarChart3, label: 'Insights' },
  { icon: UtensilsCrossed, label: 'Menu' },
  { icon: Megaphone, label: 'Marketing' },
  { icon: MoreHorizontal, label: 'More' },
];

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const greeting = getGreeting();

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Grainy texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top App Bar (mobile visible, hides on tablet+) */}
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

      {/* Side Navigation (tablet + desktop only) */}
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
              <a
                key={i}
                href="#"
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium ${
                  item.active
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
            SM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Sarah Miller</p>
            <p className="text-xs text-on-surface-variant truncate">
              Owner
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
        {/* Greeting */}
        <section className="mb-6 md:mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight">
            {greeting}, Sarah.
          </h2>
          <p className="font-display text-2xl md:text-3xl font-semibold text-primary mt-1 leading-tight">
            Your community is growing 🌱
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* HERO CARD — Today's Opportunity */}
          <div className="md:col-span-8 bg-primary-container text-on-primary-container p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-organic hover:shadow-organic-md transition-shadow">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} fill="currentColor" />
                <span className="font-label text-xs font-semibold uppercase tracking-wider">
                  Today&apos;s Opportunity
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 leading-tight">
                Rush expected at 6pm — local concert nearby + warm weather
              </h3>
              <p className="text-on-primary-container/80 mb-6 text-sm md:text-base leading-relaxed">
                Our AI predicts a 40% surge in cold brew and light snack orders between 5:30 PM and 7:00 PM.
              </p>
              <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
                Prepare for rush
              </button>
            </div>

            {/* Decorative background icon */}
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <Zap size={140} />
            </div>
          </div>

          {/* BIRTHDAYS CARD */}
          <div className="md:col-span-4 bg-secondary-container text-on-secondary-container p-6 md:p-8 rounded-2xl border border-outline-variant flex flex-col justify-between shadow-organic-sm hover:shadow-organic transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Cake size={22} />
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-4 leading-tight">
                3 birthdays today
              </h3>
              <div className="flex -space-x-3 mb-4">
                {birthdays.map((person, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white border-2 border-secondary-container font-bold text-xs"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </div>
                ))}
              </div>
              <p className="text-sm">Alex, Emma, and Marcus are celebrating.</p>
            </div>
            <button className="mt-4 text-on-secondary-container font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all group">
              Send birthday coffee to all
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* COMMUNITY STATS 2x2 GRID */}
          <div className="md:col-span-6 grid grid-cols-2 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-surface-container p-4 md:p-5 rounded-xl border border-outline-variant hover:shadow-organic transition-shadow active:scale-[0.98]"
              >
                <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="font-display text-2xl md:text-3xl font-semibold text-on-surface">
                  {stat.value}
                </p>
                <p
                  className={`text-xs mt-2 flex items-center gap-1 ${
                    stat.trend === 'up'
                      ? 'text-primary font-semibold'
                      : stat.trend === 'accent'
                        ? 'text-tertiary font-semibold'
                        : 'text-on-surface-variant'
                  }`}
                >
                  {stat.trend === 'up' && <TrendingUp size={12} />}
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* ACTIVE CAMPAIGNS */}
          <div className="md:col-span-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex flex-col justify-between shadow-organic-sm hover:shadow-organic transition-shadow">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-4">
                Your active campaigns
              </h3>
              <div className="space-y-3">
                {campaigns.map((campaign, i) => {
                  const Icon = campaign.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 md:p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base">
                            {campaign.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {campaign.subtext}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">
                        {campaign.orders}{' '}
                        <span className="text-xs font-normal">orders</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="mt-6 text-on-surface-variant text-sm font-semibold underline underline-offset-4 decoration-outline-variant hover:text-primary transition-colors text-left">
              View all campaigns
            </button>
          </div>

          {/* WEEKLY CHART */}
          <div className="md:col-span-8 bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant shadow-organic-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  This week
                </p>
                <h3 className="font-display text-xl md:text-2xl font-semibold">
                  Engagement at a glance
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-full">
                <TrendingUp size={16} />
                <span className="text-sm">15% up</span>
              </div>
            </div>
            <div className="h-32 md:h-40 flex items-end gap-2 md:gap-3">
              <div
                className="flex-1 bg-outline-variant rounded-t-lg transition-all hover:bg-primary/40"
                style={{ height: '40%' }}
              />
              <div
                className="flex-1 bg-outline-variant rounded-t-lg transition-all hover:bg-primary/40"
                style={{ height: '60%' }}
              />
              <div
                className="flex-1 bg-primary rounded-t-lg"
                style={{ height: '85%' }}
              />
              <div
                className="flex-1 bg-outline-variant rounded-t-lg transition-all hover:bg-primary/40"
                style={{ height: '45%' }}
              />
              <div
                className="flex-1 bg-outline-variant rounded-t-lg transition-all hover:bg-primary/40"
                style={{ height: '70%' }}
              />
              <div
                className="flex-1 bg-gradient-to-t from-primary to-primary-container rounded-t-lg shadow-organic"
                style={{ height: '95%' }}
              />
              <div
                className="flex-1 bg-tertiary-container/40 rounded-t-lg"
                style={{ height: '30%' }}
              />
            </div>
            <div className="flex justify-between mt-3 px-1 font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-primary">Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* GIFT ACTIVATIONS */}
          <div className="md:col-span-4 bg-surface p-6 md:p-8 rounded-2xl border-2 border-tertiary-container/40 shadow-organic-sm hover:shadow-organic transition-shadow flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-tertiary-container/10 rounded-full flex items-center justify-center mb-4">
              <Gift
                size={32}
                className="text-tertiary-container"
                fill="currentColor"
              />
            </div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-on-surface mb-2">
              8 gifts waiting
            </h3>
            <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">
              Customers heading your way to redeem their gifts.
            </p>
            <button className="w-full py-2.5 border-2 border-tertiary-container text-tertiary-container rounded-lg font-label font-semibold text-sm uppercase tracking-wider hover:bg-tertiary-container hover:text-white transition-colors">
              Check pickup list
            </button>
          </div>

          {/* AI RECOMMENDATIONS — Horizontal scroll on mobile, grid on desktop */}
          <div className="md:col-span-12 mt-2">
            <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 md:mb-4">
              AI Recommendations
            </p>
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible -mx-4 md:mx-0 px-4 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {recommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <div
                    key={i}
                    className={`${rec.bg} min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink p-5 rounded-2xl relative overflow-hidden shadow-organic-sm hover:shadow-organic transition-shadow`}
                  >
                    <div className="absolute top-3 right-3 opacity-20">
                      <Icon size={40} />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-display font-bold text-base md:text-lg mb-2 pr-8">
                        {rec.title}
                      </h4>
                      <p
                        className={`text-sm mb-4 leading-relaxed ${
                          rec.bg.includes('text-on-primary')
                            ? 'text-white/80'
                            : 'opacity-80'
                        }`}
                      >
                        {rec.description}
                      </p>
                      <button
                        className={`text-xs font-label font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${rec.ctaClass}`}
                      >
                        {rec.cta}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation — Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)]">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href="#"
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all active:scale-90 ${
                  item.active
                    ? 'bg-primary-container/40 text-primary'
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
    </main>
  );
}