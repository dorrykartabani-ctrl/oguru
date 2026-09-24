'use client';

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
