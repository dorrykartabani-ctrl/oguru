'use client';

import { useRouter } from 'next/navigation';
import {
  Sparkles,
  TrendingUp,
  Megaphone,
  Gift,
  BarChart3,
  UserCheck,
  RefreshCw,
  Check,
  Lightbulb,
  ShoppingBag,
  Menu,
} from 'lucide-react';

export default function VendorLandingPage() {
  const router = useRouter();

  return (
    <main className="bg-surface text-on-background min-h-screen">
      {/* Top Nav */}
      <header className="bg-surface-container-low/95 backdrop-blur-md sticky top-0 z-50 shadow-sm w-full">
        <nav className="flex justify-between items-center px-4 md:px-10 py-2 w-full max-w-[1280px] mx-auto h-20">
          <button
            onClick={() => router.push('/get-started')}
            className="flex items-center gap-3"
          >
            <img src="/logo.png" alt="OGuru" className="h-12 w-auto" />
            <span className="font-display text-2xl font-bold text-primary hidden sm:inline">
              OGuru
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-label font-semibold text-on-surface-variant">
            <a href="#platform" className="hover:text-primary transition-colors">
              Platform
            </a>
            <a href="#how" className="hover:text-primary transition-colors">
              How it works
            </a>
            <button
              onClick={() => router.push('/vendor/apply')}
              className="bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-primary-container transition-all shadow-md text-sm"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 text-on-surface-variant">
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Hero — Full-width background image */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-cafe.jpg')",
          }}
        />

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Subtle organic texture on top */}
        <div className="absolute inset-0 organic-grain opacity-10" />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32 lg:py-40 min-h-[600px] md:min-h-[700px] flex items-center">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-label font-semibold uppercase tracking-wider">
              <Sparkles size={16} />
              AI-powered local growth
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight tracking-tight">
              Grow your local business with{' '}
              <span className="text-primary-fixed italic">AI-powered</span>{' '}
              marketing
            </h1>

            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Bridge the gap between your craft and local customers. Let smart insights, automated campaigns, and community-driven discovery do the heavy lifting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => router.push('/vendor/apply')}
                className="bg-primary text-on-primary font-label font-bold px-8 py-4 rounded-xl text-base shadow-2xl hover:scale-105 transition-transform active:scale-95"
              >
                Join the Network
              </button>
              <button
                onClick={() => router.push('/vendor/demo')}
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-label font-bold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-colors"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-surface pointer-events-none" />
      </section>

      {/* Social Proof */}
      <section className="bg-surface-container py-12 border-y border-outline/5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-75">
            <p className="text-xs font-label font-semibold text-on-surface-variant tracking-widest uppercase text-center md:text-left">
              Trusted by local artisans and vendors
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 grayscale opacity-40">
              <span className="font-display font-bold text-lg md:text-xl">Cafés</span>
              <span className="font-display font-bold text-lg md:text-xl">Bakeries</span>
              <span className="font-display font-bold text-lg md:text-xl">Roasters</span>
              <span className="font-display font-bold text-lg md:text-xl">Farmers</span>
              <span className="font-display font-bold text-lg md:text-xl">Makers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid — Core Features */}
      <section id="platform" className="py-16 md:py-24 bg-surface">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-on-surface">
              Precision tools for modern vendors
            </h2>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
              Our &ldquo;Organic Tech&rdquo; approach combines the warmth of the local market with the analytical power of high-level logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Smart Insights — wide card */}
            <div className="md:col-span-8 bento-card bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline/5 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3 size={24} />
                </div>
                <h3 className="font-display font-semibold text-2xl text-on-surface">
                  Smart Insights
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  See what&apos;s coming before it happens. Our smart assistant watches trends, weather, and local events so you&apos;re always prepared for the busy moments.
                </p>
              </div>
              <div className="flex-1 w-full h-40 md:h-48 bg-white/50 rounded-2xl border border-outline/5 overflow-hidden p-4">
                <div className="w-full h-full flex items-end gap-2">
                  <div className="w-1/6 bg-primary/20 h-[30%] rounded-t-lg" />
                  <div className="w-1/6 bg-primary/30 h-[45%] rounded-t-lg" />
                  <div className="w-1/6 bg-primary/40 h-[20%] rounded-t-lg" />
                  <div className="w-1/6 bg-primary/60 h-[80%] rounded-t-lg animate-pulse" />
                  <div className="w-1/6 bg-primary/40 h-[60%] rounded-t-lg" />
                  <div className="w-1/6 bg-primary/20 h-[40%] rounded-t-lg" />
                </div>
              </div>
            </div>

            {/* Automated Campaigns */}
            <div className="md:col-span-4 bento-card bg-secondary-container rounded-3xl p-6 md:p-8 border border-outline/5 flex flex-col justify-between min-h-[280px]">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
                <Megaphone size={24} />
              </div>
              <div className="mt-8 space-y-4">
                <h3 className="font-display font-semibold text-2xl text-on-secondary-container">
                  Automated Campaigns
                </h3>
                <p className="text-on-secondary-container/80 leading-relaxed">
                  Reach lapsed customers with AI-optimised messaging that converts — without spending your day writing captions.
                </p>
              </div>
            </div>

            {/* Gifting Drives Growth */}
            <div className="md:col-span-6 bento-card bg-surface-container-highest rounded-3xl p-6 md:p-8 border border-outline/5">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
                <Gift size={24} />
              </div>
              <h3 className="font-display font-semibold text-2xl text-on-surface mb-3">
                Gifting Drives Growth
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Your customers gift your products to friends, introducing you to new audiences organically. Word of mouth, amplified.
              </p>
            </div>

            {/* Customer CRM */}
            <div className="md:col-span-6 bento-card bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline/5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <UserCheck size={24} />
              </div>
              <h3 className="font-display font-semibold text-2xl text-on-surface mb-3">
                Know Your Regulars
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                See who your top customers are, what they love, and when they haven&apos;t visited in a while. Bring them back with a tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 mx-auto">
              <div className="relative mx-auto border-on-surface bg-on-background border-[14px] rounded-[2.5rem] h-[520px] md:h-[600px] w-[260px] md:w-[300px] shadow-2xl">
                <div className="h-[32px] w-[3px] bg-outline absolute -left-[17px] top-[72px] rounded-l-lg" />
                <div className="h-[46px] w-[3px] bg-outline absolute -left-[17px] top-[124px] rounded-l-lg" />
                <div className="h-[46px] w-[3px] bg-outline absolute -left-[17px] top-[178px] rounded-l-lg" />
                <div className="h-[64px] w-[3px] bg-outline absolute -right-[17px] top-[142px] rounded-r-lg" />

                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
                  <div className="px-6 py-6 md:py-8 bg-primary text-white space-y-1">
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold font-label">
                      Good morning,
                    </p>
                    <h4 className="font-display font-semibold text-lg">
                      Café Artisan
                    </h4>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="bg-secondary-container p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={14} className="text-primary" />
                        <span className="text-[10px] font-bold text-on-secondary-container font-label">
                          AI INSIGHT
                        </span>
                      </div>
                      <p className="text-sm font-bold text-on-secondary-container leading-tight">
                        Rush expected at 6:00 PM
                      </p>
                      <p className="text-[10px] text-on-secondary-container/70 mt-1">
                        Local concert nearby + warm weather
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container p-3 rounded-xl border border-outline/5">
                        <p className="text-[8px] uppercase font-bold text-on-surface-variant font-label">
                          Live Orders
                        </p>
                        <p className="text-xl font-bold text-primary font-display">
                          12
                        </p>
                      </div>
                      <div className="bg-surface-container p-3 rounded-xl border border-outline/5">
                        <p className="text-[8px] uppercase font-bold text-on-surface-variant font-label">
                          Active Promos
                        </p>
                        <p className="text-xl font-bold text-tertiary font-display">
                          3
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-outline/10 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center">
                          <ShoppingBag size={14} className="text-tertiary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold">New follower</p>
                          <p className="text-[8px] text-on-surface-variant">
                            Sarah started following you
                          </p>
                        </div>
                      </div>
                      <button className="bg-primary text-white text-[10px] px-2 py-1 rounded-md font-label font-semibold">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-on-surface leading-tight tracking-tight">
                Your entire business in the{' '}
                <span className="text-primary italic">palm of your hand</span>
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                The OGuru Vendor Dashboard is more than a tool — it&apos;s a digital partner that understands your business better than a spreadsheet ever could.
              </p>
              <ul className="space-y-4">
                {[
                  'Live orders and pickup queue at a glance',
                  'AI writes your marketing so you don\'t have to',
                  'Follower CRM to bring back regulars',
                  'Gift orders drive new customer discovery',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="text-base text-on-surface">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 md:py-24 bg-surface">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-on-surface">
              Go live in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-[2px] bg-outline/10 -z-10" />

            {[
              {
                icon: UserCheck,
                title: '1. Apply',
                desc: 'Tell us about your business and your values. Takes under 5 minutes.',
                filled: false,
              },
              {
                icon: RefreshCw,
                title: '2. Sync your menu',
                desc: 'Import from your POS or add products manually. AI helps write descriptions.',
                filled: false,
              },
              {
                icon: TrendingUp,
                title: '3. Grow',
                desc: 'Open your doors to the OGuru community. Watch orders flow in.',
                filled: true,
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center space-y-4 group">
                  <div
                    className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border border-outline/5 shadow-sm group-hover:scale-110 transition-transform ${
                      step.filled
                        ? 'bg-primary text-on-primary shadow-lg'
                        : 'bg-surface-container text-primary'
                    }`}
                  >
                    <Icon size={32} />
                  </div>
                  <h4 className="font-display font-semibold text-xl">
                    {step.title}
                  </h4>
                  <p className="text-on-surface-variant">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 max-w-[1280px] mx-auto px-4 md:px-10 mb-12">
        <div className="relative bg-on-surface text-on-primary rounded-[2rem] md:rounded-[3rem] overflow-hidden p-8 md:p-16 lg:p-24 text-center space-y-6 md:space-y-8">
          <div className="absolute inset-0 organic-grain" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-50" />

          <div className="relative z-10 space-y-6">
            <h2 className="font-display font-bold text-3xl md:text-5xl max-w-3xl mx-auto leading-tight tracking-tight text-white">
              Join the OGuru network today
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Secure your spot in the future of local commerce. Free during beta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => router.push('/vendor/apply')}
                className="w-full sm:w-auto bg-primary text-on-primary font-label font-bold px-10 py-5 rounded-2xl text-base shadow-xl hover:bg-primary-container transition-colors"
              >
                Get Started Now
              </button>
              <button
                onClick={() => router.push('/vendor/demo')}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 font-label font-bold px-10 py-5 rounded-2xl text-base hover:bg-white/20 transition-colors"
              >
                Speak with an Agent
              </button>
            </div>
            <p className="text-xs font-label text-white/50 uppercase tracking-widest pt-2">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-highest py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="OGuru" className="h-8 w-auto" />
              <span className="font-display text-xl font-bold text-on-surface">
                OGuru
              </span>
            </div>
            <p className="text-on-surface-variant text-sm">
              The organic tech platform for local artisans.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: ['Dashboard', 'Marketing Suite', 'Analytics'],
            },
            {
              title: 'Company',
              links: ['About Us', 'Sustainability', 'Contact'],
            },
            {
              title: 'Support',
              links: ['Help Centre', 'Terms', 'Privacy'],
            },
          ].map((section, i) => (
            <div key={i} className="space-y-4">
              <p className="text-xs font-label font-bold text-on-surface uppercase tracking-wider">
                {section.title}
              </p>
              <ul className="space-y-2 text-on-surface-variant text-sm">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-10 mt-12 md:mt-16 pt-8 border-t border-outline/10 text-center text-on-surface-variant text-xs font-label uppercase tracking-widest">
          © 2024 OGuru. Locally sourced tech for global growth.
        </div>
      </footer>
    </main>
  );
}
