'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { Business, Profile } from '@/lib/supabase/types';
import {
  LayoutDashboard,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  Users,
  Sparkles,
  Settings,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
};

type NavGroup = {
  label: string;
  items: {
    icon: typeof LayoutDashboard;
    label: string;
    href: string;
  }[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Daily',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/vendor/dashboard' },
      { icon: BarChart3, label: 'Insights', href: '/vendor/insights' },
      { icon: UtensilsCrossed, label: 'Menu', href: '/vendor/menu' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { icon: Megaphone, label: 'Marketing', href: '/vendor/marketing' },
      { icon: Users, label: 'Community', href: '/vendor/community' },
      { icon: Sparkles, label: 'AI Assistant', href: '/vendor/ai' },
    ],
  },
];

const bottomItem = {
  icon: Settings,
  label: 'Settings',
  href: '/vendor/settings',
};

// Mobile bottom nav — 5 most important items only
const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/vendor/dashboard' },
  { icon: UtensilsCrossed, label: 'Menu', href: '/vendor/menu' },
  { icon: Megaphone, label: 'Market', href: '/vendor/marketing' },
  { icon: Users, label: 'Community', href: '/vendor/community' },
  { icon: Settings, label: 'Settings', href: '/vendor/settings' },
];

interface VendorSidebarProps {
  business: Business;
  profile?: Profile | null;
}

export default function VendorSidebar({ business, profile }: VendorSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const businessInitials = getInitials(business.legal_name);
  const profileInitials = profile?.full_name ? getInitials(profile.full_name) : 'V';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Check if a nav item is active based on the pathname
  const isActive = (href: string): boolean => {
    if (href === '/vendor/dashboard') {
      return pathname === '/vendor/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        {/* Business Header */}
        <button
          onClick={() => router.push('/vendor/settings')}
          className="flex items-center gap-3 mb-6 px-2 py-2 rounded-lg hover:bg-surface-container transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-display font-bold text-sm overflow-hidden flex-shrink-0">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              businessInitials
            )}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-sm text-primary font-bold leading-tight truncate">
              {business.legal_name}
            </h1>
            <p className="text-xs text-on-surface-variant">Vendor Dashboard</p>
          </div>
        </button>

        {/* Nav Groups */}
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-label font-semibold text-on-surface-variant/60 uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all font-medium text-left text-sm ${
                        active
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings — bottom before user */}
        <div className="pt-4 border-t border-outline-variant">
          <button
            onClick={() => router.push(bottomItem.href)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all font-medium text-left text-sm ${
              isActive(bottomItem.href)
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
            }`}
          >
            <bottomItem.icon size={18} />
            <span>{bottomItem.label}</span>
          </button>
        </div>

        {/* User Profile */}
        {profile && (
          <div className="mt-3 pt-3 border-t border-outline-variant flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs flex-shrink-0">
              {profileInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-on-surface">
                {profile.full_name || 'Vendor'}
              </p>
              <button
                onClick={handleLogout}
                className="text-[10px] text-on-surface-variant hover:text-primary transition-colors font-label uppercase tracking-wider flex items-center gap-1"
              >
                <LogOut size={10} />
                Log out
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)]">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-full transition-all active:scale-90 ${
                  active
                    ? 'bg-primary-container/40 text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={20} fill={active ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-label font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
