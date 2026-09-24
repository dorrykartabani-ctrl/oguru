'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  UserCircleIcon,
  HeartIcon,
  CoffeeIcon,
  SparklesIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  ChevronRight,
  StoreIcon,
  ShieldCheckIcon,'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  BellIcon,
  SettingsIcon,
  EditIcon,
  MapPinIcon,
  CreditCardIcon,
  UtensilsIcon,
  BadgeIcon,
  CompassIcon,
  UserPlusIcon,
  UsersIcon,
  HelpCircleIcon,
  ChevronRight,
  HomeIcon,
  ReceiptIcon,
  GiftIcon,
  UserCircleIcon,
  HeartIcon,
} from '@/components/icons';

export default function ProfilePage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-28 font-body selection:bg-[#4a6410] selection:text-white">
      {/* ---- Top Header ---- */}
      <header className="sticky top-0 z-40 bg-[#f6f4eb]/90 pt-12 pb-4 backdrop-blur-md">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex items-center justify-center text-[#4a6410]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="font-display text-xl font-extrabold text-[#4a6410]">Account</h1>
          </div>
          <div className="flex items-center gap-4 text-[#4a6410]">
            <div className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#924700]" />
            </div>
            <SettingsIcon className="h-5 w-5" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5">
        {/* ---- Profile Identity ---- */}
        <section className="mt-4 flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl shadow-md border border-[#1b1c19]/10 bg-[#ebe8db]">
            <img
              src="https://i.pravatar.cc/300?u=alex"
              alt="Alex Rivera"
              className="h-full w-full object-cover"
            />
          </div>
          
          <p className="mt-4 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">
            Premium Member
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#4a6410]">
            Alex Rivera (Al)
          </h2>
          <div className="mt-1 flex items-center justify-center gap-1 font-body text-xs text-[#44483a]/80">
            <MapPinIcon className="h-3 w-3" />
            <span>Sydney, AU</span>
          </div>
          <p className="mt-1 font-body text-[11px] text-[#44483a]/50">
            Member since Feb 2025
          </p>

          <button className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#ebe8db] px-4 py-2 font-label text-[11px] font-bold text-[#4a6410] transition hover:bg-[#1b1c19]/5">
            <EditIcon className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </section>

        {/* ---- Gradient Membership Card ---- */}
        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#924700] via-[#b66614] to-[#a38036] p-6 text-white shadow-organic">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black/10 blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <BadgeIcon className="h-5 w-5 text-white" />
                <h3 className="font-display text-lg font-extrabold tracking-wide">
                  OGURU+ MEMBER
                </h3>
              </div>
              <p className="mt-1 font-label text-[10px] font-medium text-white/80">
                Active since Jan 2025
              </p>

              <div className="mt-6">
                <p className="font-label text-[9px] font-extrabold uppercase tracking-wider text-white/70">
                  Savings This Month
                </p>
                <p className="font-display text-4xl font-extrabold tracking-tight">
                  $47.50
                </p>
              </div>

              <button className="mt-4 font-label text-[11px] font-bold underline underline-offset-4 hover:text-white/90">
                Manage Subscription &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* ---- Quick Stats Row ---- */}
        <section className="mt-4 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-[#ebe8db] p-5">
            <div>
              <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Total Orders</p>
              <p className="font-display text-2xl font-extrabold text-[#4a6410]">47</p>
            </div>
            {/* Minimalist Bar Chart Graphic */}
            <div className="flex items-end gap-1 h-8">
              <div className="w-1.5 h-3 bg-[#4a6410]/30 rounded-sm" />
              <div className="w-1.5 h-4 bg-[#4a6410]/50 rounded-sm" />
              <div className="w-1.5 h-6 bg-[#4a6410]/70 rounded-sm" />
              <div className="w-1.5 h-8 bg-[#4a6410] rounded-sm" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#ebe8db] p-5">
            <div>
              <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Favorite Vendors</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border border-[#ebe8db] bg-[#1b1c19] text-center text-xs leading-5">☕</div>
                  <div className="h-6 w-6 rounded-full border border-[#ebe8db] bg-[#924700] text-center text-xs leading-5">🥐</div>
                  <div className="h-6 w-6 rounded-full border border-[#ebe8db] bg-white text-center text-xs leading-5">🥗</div>
                </div>
                <span className="font-label text-[11px] font-bold text-[#4a6410]">+12 Others</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#ebe8db] p-5">
            <div>
              <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60">Gifts Sent</p>
              <p className="font-display text-2xl font-extrabold text-[#4a6410]">8</p>
            </div>
            <GiftIcon className="h-6 w-6 text-[#924700]" />
          </div>
        </section>

        {/* ========================================================= */}
        {/* LIST GROUPS                                               */}
        {/* ========================================================= */}

        <div className="mt-8 space-y-8">
          
          {/* ---- PERSONAL INFO ---- */}
          <div>
            <h3 className="mb-2 px-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
              Personal Info
            </h3>
            <div className="h-px w-full bg-[#1b1c19]/10 mb-2" />

            <ListItem icon={<CreditCardIcon />} title="Payment Methods" subtitle="3 Saved Cards" />
            <ListItem icon={<MapPinIcon />} title="Saved Addresses" subtitle="Home, Work" />
            
            <button className="flex w-full items-center justify-between py-4 px-1 group transition-colors hover:bg-[#1b1c19]/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="text-[#1b1c19]"><UtensilsIcon className="h-5 w-5" /></div>
                <div className="text-left">
                  <p className="font-display text-sm font-semibold text-[#1b1c19]">Dietary Preferences</p>
                  <div className="mt-1 flex gap-1.5">
                    <span className="rounded bg-[#d4e4b8]/50 px-1.5 py-0.5 font-label text-[9px] font-bold uppercase text-[#4a6410]">Vegan</span>
                    <span className="rounded bg-[#ebe8db] px-1.5 py-0.5 font-label text-[9px] font-bold uppercase text-[#44483a]">Gluten-Free</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1b1c19]/40 group-hover:text-[#1b1c19]" />
            </button>

            <button className="flex w-full items-center justify-between py-4 px-1 group transition-colors hover:bg-[#1b1c19]/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="text-[#1b1c19]"><BadgeIcon className="h-5 w-5" /></div>
                <div className="text-left">
                  <p className="font-display text-sm font-semibold text-[#1b1c19]">Membership</p>
                  <p className="font-label text-[11px] text-[#44483a]/60">OGuru+ Active</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1b1c19]/40 group-hover:text-[#1b1c19]" />
            </button>
          </div>

          {/* ---- PERMISSIONS ---- */}
          <div>
            <h3 className="mb-2 px-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
              Permissions
            </h3>
            <div className="h-px w-full bg-[#1b1c19]/10 mb-2" />

            <div className="flex items-center justify-between py-4 px-1">
              <div className="flex items-center gap-4">
                <BellIcon className="h-5 w-5 text-[#1b1c19]" />
                <span className="font-display text-sm font-semibold text-[#1b1c19]">Notifications</span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/15'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#f6f4eb] shadow ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 px-1">
              <div className="flex items-center gap-4">
                <CompassIcon className="h-5 w-5 text-[#1b1c19]" />
                <span className="font-display text-sm font-semibold text-[#1b1c19]">Location</span>
              </div>
              <button
                onClick={() => setLocationEnabled(!locationEnabled)}
                className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  locationEnabled ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/15'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#f6f4eb] shadow ring-0 transition duration-200 ease-in-out ${
                    locationEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ---- ACTIVITIES ---- */}
          <div>
            <h3 className="mb-2 px-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#4a6410]">
              Activities
            </h3>
            <div className="h-px w-full bg-[#1b1c19]/10 mb-2" />

            <ListItem icon={<UserPlusIcon />} title="Invite Friend" subtitle="Get $5 credit" />
            <ListItem icon={<UsersIcon />} title="Community" />
            <ListItem icon={<HelpCircleIcon />} title="Help Centre" />

            <div className="mt-4 flex gap-4 px-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#44483a]/40">
              <a href="#" className="hover:text-[#1b1c19]">Privacy Policy</a>
              <a href="#" className="hover:text-[#1b1c19]">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* ---- SIGN OUT ---- */}
        <div className="mt-12 mb-10 border-t border-[#1b1c19]/10 pt-8 text-center">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full rounded-xl border border-red-700 bg-transparent py-3.5 font-label text-sm font-extrabold tracking-wide text-red-700 transition active:scale-[0.98] disabled:opacity-50 hover:bg-red-50"
          >
            {isLoggingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
          <p className="mt-4 font-label text-[9px] font-extrabold uppercase tracking-wider text-[#44483a]/40">
            DELETE ACCOUNT FOREVER
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-6 w-6" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-6 w-6" />} />
          <NavItem href="/favorites" label="Favs" icon={<HeartIcon className="h-6 w-6" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-6 w-6" />} />
          <NavItem href="/profile" label="Profile" icon={<UserCircleIcon className="h-6 w-6" />} active />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

// --- Reusable Internal Components ---

function ListItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <button className="flex w-full items-center justify-between py-4 px-1 group transition-colors hover:bg-[#1b1c19]/5 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="text-[#1b1c19]">{icon}</div>
        <div className="text-left">
          <p className="font-display text-sm font-semibold text-[#1b1c19]">{title}</p>
          {subtitle && (
            <p className="mt-0.5 font-label text-[11px] text-[#44483a]/60">{subtitle}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-[#1b1c19]/40 group-hover:text-[#1b1c19]" />
    </button>
  );
}

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition ${
        active ? 'bg-[#4a6410]/10 text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]/70'
      }`}
    >
      {icon}
      <span className="font-label text-[10px] font-bold">{label}</span>
    </Link>
  );
}
  MapPinIcon,
  HomeIcon,
  MapIcon,
  GiftIcon,
  ReceiptIcon,
  CheckCircleIcon,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Dietary Preset Options                                             */
/* ------------------------------------------------------------------ */

const DIETARY_OPTIONS = [
  { id: 'oat_milk', label: 'Oat Milk Only', emoji: '🌾' },
  { id: 'gluten_free', label: 'Gluten-Free', emoji: '🍞' },
  { id: 'vegan', label: '100% Plant-Based', emoji: '🌱' },
  { id: 'decaf', label: 'Decaf Friendly', emoji: '🌙' },
  { id: 'nut_free', label: 'Nut Allergy', emoji: '🥜' },
];

/* ------------------------------------------------------------------ */
/*  Mock Saved Cafés                                                  */
/* ------------------------------------------------------------------ */

const SAVED_CAFES = [
  {
    id: 'sc-1',
    name: 'WatchHouse Spitalfields',
    distance: '0.2 mi',
    badge: 'Specialty Roaster',
    slots: 'Open slots',
    initial: 'W',
    color: 'bg-[#fed3c7] text-[#77574d]',
  },
  {
    id: 'sc-2',
    name: 'Pophams Bakery',
    distance: '0.6 mi',
    badge: 'Artisan Pastry',
    slots: 'Limited left',
    initial: 'P',
    color: 'bg-[#d4e4b8] text-[#4a6410]',
  },
  {
    id: 'sc-3',
    name: 'The Dusty Knuckle',
    distance: '1.1 mi',
    badge: 'Sourdough & Bakes',
    slots: 'Open slots',
    initial: 'D',
    color: 'bg-[#fde2c8] text-[#924700]',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const router = useRouter();
  const [activePreferences, setActivePreferences] = useState<string[]>([
    'oat_milk',
    'vegan',
  ]);
  const [notifications, setNotifications] = useState({
    slotAlerts: true,
    giftTreats: true,
    morningReminder: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Toggle Dietary Tag
  const togglePreference = (id: string) => {
    setActivePreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body">
      {/* ============================================================ */}
      {/*  HEADER & USER AVATAR CARD                                   */}
      {/* ============================================================ */}
      <header className="px-5 pt-14 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
          Profile
        </h1>
        <p className="mt-1 text-sm text-[#44483a]">
          Your taste profile, saved spots & settings.
        </p>
      </header>

      <section className="mx-5 mt-2">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-organic">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4e4b8] to-[#4a6410] font-display text-2xl font-bold text-white shadow-sm">
            AC
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#4a6410] text-[10px] text-white">
              <SparklesIcon className="h-3 w-3" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-display text-lg font-bold text-[#1b1c19]">
                Alex Chen
              </h2>
            </div>
            <p className="truncate font-body text-xs text-[#44483a]/70">
              alex.chen@example.com
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#4a6410]/10 px-2.5 py-0.5 font-label text-[10px] font-bold text-[#4a6410]">
              <ShieldCheckIcon className="h-3 w-3" />
              Oguru Artisan Explorer
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OGURU WALLET / TREAT CREDITS                                */}
      {/* ============================================================ */}
      <section className="mx-5 mt-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#77574d] via-[#5c3e35] to-[#3a251e] p-6 text-white shadow-organic">
          {/* Subtle decorative background circle */}
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-wider text-white/70">
                Treat Balance
              </span>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                £15.00
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <GiftIcon className="h-6 w-6 text-[#fed3c7]" />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-label text-xs text-white/70">
              1 free pastry perk active
            </span>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 font-label text-xs font-semibold text-white transition hover:bg-white/30 active:scale-95"
            >
              Send Gift
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  DIETARY & TASTE PREFERENCES                                 */}
      {/* ============================================================ */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-5">
          <h3 className="font-display text-lg font-semibold text-[#1b1c19]">
            Dietary Preferences
          </h3>
          <span className="font-label text-xs text-[#44483a]/60">
            Auto-filtered in menus
          </span>
        </div>

        <p className="px-5 mt-1 text-xs text-[#44483a]/70">
          We&apos;ll badge compatible items and flag default milk choices during checkout.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 px-5">
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = activePreferences.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => togglePreference(opt.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 font-label text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? 'border border-[#4a6410] bg-[#4a6410] text-white shadow-sm'
                    : 'border border-[#1b1c19]/10 bg-white text-[#44483a] hover:border-[#1b1c19]/20'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
                {isSelected && <CheckCircleIcon className="h-3.5 w-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SAVED ARTISAN SPOTS                                         */}
      {/* ============================================================ */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4 text-[#924700]" />
            <h3 className="font-display text-lg font-semibold text-[#1b1c19]">
              Saved Spots ({SAVED_CAFES.length})
            </h3>
          </div>
          <Link
            href="/explore"
            className="font-label text-xs font-semibold text-[#4a6410] hover:underline"
          >
            View Map
          </Link>
        </div>

        <ul className="mt-3 space-y-2.5 px-5">
          {SAVED_CAFES.map((cafe) => (
            <li
              key={cafe.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-organic"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold ${cafe.color}`}
              >
                {cafe.initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-[#1b1c19]">
                  {cafe.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 font-label text-xs text-[#44483a]/60">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {cafe.distance}
                  </span>
                  <span>•</span>
                  <span>{cafe.badge}</span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#4a6410]/10 px-2 py-0.5 font-label text-[10px] font-semibold text-[#4a6410]">
                {cafe.slots}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================================================ */}
      {/*  PAYMENT & PREFERENCES LIST                                  */}
      {/* ============================================================ */}
      <section className="mt-8 px-5">
        <h3 className="font-display text-lg font-semibold text-[#1b1c19]">
          Settings & Notifications
        </h3>

        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm divide-y divide-[#1b1c19]/5">
          {/* Payment Method */}
          <div className="flex items-center justify-between p-4 transition hover:bg-[#fbf9f4]/50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b1c19]/5 text-[#44483a]">
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#1b1c19]">
                  Payment Method
                </p>
                <p className="font-label text-xs text-[#44483a]/60">
                  Apple Pay • Visa ending in 4242
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#44483a]/30" />
          </div>

          {/* Slot Notification Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4a6410]/10 text-[#4a6410]">
                <BellIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#1b1c19]">
                  Pre-order Batch Alerts
                </p>
                <p className="font-label text-xs text-[#44483a]/60">
                  Notify when fresh morning slots release
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setNotifications((n) => ({ ...n, slotAlerts: !n.slotAlerts }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.slotAlerts ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/15'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifications.slotAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Treat Gifting Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#924700]/10 text-[#924700]">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#1b1c19]">
                  Friend Treat Notifications
                </p>
                <p className="font-label text-xs text-[#44483a]/60">
                  When a friend sends you a drink
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setNotifications((n) => ({ ...n, giftTreats: !n.giftTreats }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.giftTreats ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/15'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifications.giftTreats ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MERCHANT PORTAL CONVERSION SWITCH                           */}
      {/* ============================================================ */}
      <section className="mx-5 mt-6">
        <Link
          href="/login/vendor"
          className="flex items-center justify-between rounded-3xl border border-[#4a6410]/20 bg-[#4a6410]/5 p-4 transition hover:bg-[#4a6410]/10 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a6410] text-white">
              <StoreIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[#1b1c19]">
                Own a Specialty Café or Bakery?
              </p>
              <p className="font-label text-xs text-[#44483a]">
                Switch to Merchant Portal or apply
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#4a6410]" />
        </Link>
      </section>

      {/* ============================================================ */}
      {/*  LOGOUT BUTTON                                               */}
      {/* ============================================================ */}
      <section className="mx-5 mt-8 mb-4">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 py-3.5 text-sm font-semibold text-red-700 transition hover:bg-red-100/60 active:scale-[0.98] disabled:opacity-50"
        >
          <LogOutIcon className="h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Log Out of Oguru'}
        </button>
        <p className="mt-3 text-center font-label text-[10px] text-[#44483a]/40">
          Oguru v1.0.4 • Organic Tech System
        </p>
      </section>

      {/* ============================================================ */}
      {/*  BOTTOM NAVIGATION                                            */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1b1c19]/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <NavItem href="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
          <NavItem href="/explore" label="Explore" icon={<MapIcon className="h-5 w-5" />} />
          <NavItem href="/gifts" label="Gifts" icon={<GiftIcon className="h-5 w-5" />} />
          <NavItem href="/orders" label="Orders" icon={<ReceiptIcon className="h-5 w-5" />} />
          <NavItem
            href="/profile"
            label="Profile"
            icon={<UserCircleIcon className="h-5 w-5" />}
            active
          />
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Nav Item                                                  */
/* ------------------------------------------------------------------ */

function NavItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
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
