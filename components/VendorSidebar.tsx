'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Business, Profile } from '@/types/database';
import {
  HomeIcon,
  ReceiptIcon,
  CoffeeIcon,
  SparklesIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  StoreIcon,
} from '@/components/icons';

const getInitials = (name?: string | null) => {
  if (!name) return 'V';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

type NavGroup = {
  label: string;
  items: {
    icon: React.FC<{ className?: string }>;
    label: string;
    href: string;
  }[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Daily',
    items: [
      { icon: HomeIcon, label: 'Dashboard', href: '/vendor/dashboard' },
      { icon: ReceiptIcon, label: 'Insights', href: '/vendor/insights' },
      { icon: CoffeeIcon, label: 'Menu', href: '/vendor/menu' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { icon: SparklesIcon, label: 'Marketing', href: '/vendor/marketing' },
      { icon: UsersIcon, label: 'Community', href: '/vendor/community' },
      { icon: SparklesIcon, label: 'AI Assistant', href: '/vendor/ai' },
    ],
  },
];

const bottomItem = {
  icon: SettingsIcon,
  label: 'Settings',
  href: '/vendor/settings',
};

// Mobile bottom nav — 5 core destinations
const mobileNavItems = [
  { icon: HomeIcon, label: 'Home', href: '/vendor/dashboard' },
  { icon: CoffeeIcon, label: 'Menu', href: '/vendor/menu' },
  { icon: SparklesIcon, label: 'Market', href: '/vendor/marketing' },
  { icon: UsersIcon, label: 'Community', href: '/vendor/community' },
  { icon: SettingsIcon, label: 'Settings', href: '/vendor/settings' },
];

interface VendorSidebarProps {
  business?: Business | null;
  profile?: Profile | null;
}

export default function VendorSidebar({ business, profile }: VendorSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const businessName = business?.trading_name || business?.legal_name || 'My Business';
  const businessInitials = getInitials(businessName);
  const profileInitials = getInitials(profile?.full_name);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string): boolean => {
    if (href === '/vendor/dashboard') {
      return pathname === '/vendor/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[#1b1c19]/10 bg-[#f6f4eb] p-4 font-body md:flex">
        
        {/* Business Header */}
        <button
          onClick={() => router.push('/vendor/settings')}
          className="mb-6 flex items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-[#1b1c19]/5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#4a6410] bg-[#4a6410]/10 font-display text-sm font-extrabold text-[#4a6410]">
            {business?.logo_url ? (
              <img src={business.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-sm font-bold text-[#1b1c19]">
              {businessName}
            </h1>
            <p className="font-label text-[11px] text-[#44483a]/60">Vendor Dashboard</p>
          </div>
        </button>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-5 overflow-y-auto scrollbar-hide">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 font-label text-[10px] font-extrabold uppercase tracking-widest text-[#44483a]/50">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-display text-sm font-bold transition-all ${
                        active
                          ? 'bg-[#4a6410] text-white shadow-sm'
                          : 'text-[#44483a] hover:bg-[#1b1c19]/5 hover:text-[#1b1c19]'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Public Storefront Preview Link */}
        {business?.slug && (
          <div className="my-2 px-1">
            <Link
              href={`/store/${business.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl bg-[#4a6410]/10 px-3 py-2.5 font-label text-xs font-bold text-[#4a6410] transition hover:bg-[#4a6410]/20"
            >
              <StoreIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">View Public Store</span>
            </Link>
          </div>
        )}

        {/* Settings */}
        <div className="border-t border-[#1b1c19]/10 pt-3">
          <button
            onClick={() => router.push(bottomItem.href)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-display text-sm font-bold transition ${
              isActive(bottomItem.href)
                ? 'bg-[#4a6410] text-white shadow-sm'
                : 'text-[#44483a] hover:bg-[#1b1c19]/5 hover:text-[#1b1c19]'
            }`}
          >
            <bottomItem.icon className="h-5 w-5 shrink-0" />
            <span>{bottomItem.label}</span>
          </button>
        </div>

        {/* User Profile / Logout */}
        <div className="mt-3 flex items-center gap-3 border-t border-[#1b1c19]/10 pt-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4a6410] font-display text-xs font-bold text-white">
            {profileInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xs font-bold text-[#1b1c19]">
              {profile?.full_name || 'Vendor Owner'}
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]/60 hover:text-red-700 transition"
            >
              <LogOutIcon className="h-3 w-3" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#1b1c19]/10 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition ${
                  active ? 'bg-[#4a6410]/10 text-[#4a6410]' : 'text-[#44483a]/40 hover:text-[#44483a]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-label text-[10px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
