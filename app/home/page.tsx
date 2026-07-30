'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

export default function FoodieHome() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")`,
        }}
      />

      {/* Top bar */}
      <header className="fixed top-0 w-full z-40 bg-surface/95 backdrop-blur-md flex justify-between items-center px-margin-mobile h-16">
        <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
        <h1 className="font-headline-lg-mobile text-xl font-bold text-primary tracking-tight">
          OGuru
        </h1>
        <button
          onClick={handleLogout}
          className="p-2 -mr-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
          aria-label="Log out"
        >
          <span className="material-symbols-outlined text-on-surface-variant">logout</span>
        </button>
      </header>

      <main className="min-h-screen bg-surface pt-20 pb-24 px-margin-mobile max-w-lg mx-auto">

        {/* Greeting */}
        <section className="mb-6">
          {loading ? (
            <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse mb-2" />
          ) : (
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background leading-tight mb-1">
              {greeting}, <span className="text-primary">{firstName}</span>
            </h2>
          )}
          <p className="text-on-surface-variant font-body-md opacity-80 text-sm">
            What are you pre-ordering today?
          </p>
        </section>

        {/* Location + Search */}
        <section className="mb-8">
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="material-symbols-outlined text-primary text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <button className="text-on-surface-variant text-sm font-body-md hover:text-primary transition-colors flex items-center gap-1">
              <span>Near Shoreditch</span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </button>
          </div>

          <button
            onClick={() => router.push('/explore')}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-surface-container-low text-left shadow-inner hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-outline">search</span>
            <span className="text-outline font-body-md">Search vendors, items, or areas</span>
          </button>
        </section>

        {/* Quick Reorder */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-headline-lg-mobile text-xl text-on-surface font-semibold">
              Quick Reorder
            </h3>
            <button className="text-primary font-label-sm text-label-sm uppercase tracking-wider hover:underline">
              View all
            </button>
          </div>

          {/* Empty state for new users */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/15 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-fixed/40 mx-auto mb-3 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shopping_bag
              </span>
            </div>
            <p className="font-body-md text-on-surface font-semibold mb-1">
              Your reorders will appear here
            </p>
            <p className="text-on-surface-variant text-sm mb-4">
              Once you place your first order, we&apos;ll make it easy to order again.
            </p>
            <button
              onClick={() => router.push('/explore')}
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-sm text-label-sm uppercase tracking-wider active:scale-95 transition-transform"
            >
              <span>Explore vendors</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Trending near you */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-headline-lg-mobile text-xl text-on-surface font-semibold">
              Trending Near You
            </h3>
            <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
              Hot
            </span>
          </div>

          <div
            onClick={() => router.push('/explore')}
            className="group relative bg-surface rounded-2xl overflow-hidden border border-outline-variant/10 shadow-[0_4px_12px_rgba(93,64,55,0.08)] hover:shadow-[0_6px_16px_rgba(93,64,55,0.12)] transition-all cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKDity17rhWvVuyMJF2bg4oPH4aJ4z5yZtTINcjNaj83tuquPhZ1LIlal34pqKOa5jWGmf-M8AzN9XxF8arR37qW59SGTiDkB0a3rUl8Rw21vVloxh6RZMHu2n8BkfJ85X6Fl0CRDvvahx3IjmdIkVoxB2QmMRsu4jLvlEvhMGLwHVUSj1Az70JLZpX7EGiFxwFx__2s_BfZelCHMlblRkXT825xB80QeLJBBBWuDgXa655VArsK-T"
                alt="The Hearth Pizzeria"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <span
                  className="material-symbols-outlined text-tertiary text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-label-sm text-on-surface text-[12px]">4.9</span>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary-fixed/95 backdrop-blur px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-label-sm text-[10px] text-primary tracking-wide">
                  PRE-ORDERS OPEN
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-body-lg text-on-surface font-semibold mb-1">
                The Hearth Pizzeria
              </h4>
              <div className="flex items-center gap-3 text-on-surface-variant text-sm">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>0.4 mi</span>
                </div>
                <span className="text-outline-variant">·</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>20 min</span>
                </div>
                <span className="text-outline-variant">·</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  <span>2.4k</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 pb-safe bg-surface-container-high z-40 rounded-t-xl shadow-[0_-4px_12px_rgba(93,64,55,0.08)]">
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 transition-transform active:scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            home
          </span>
          <span className="font-label-sm text-[10px]">Home</span>
        </button>
        <button
          onClick={() => router.push('/explore')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="font-label-sm text-[10px]">Explore</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-label-sm text-[10px]">Orders</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
}
