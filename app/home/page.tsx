'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, SearchIcon, EyeIcon } from '@/components/icons';
import type { Profile } from '@/lib/supabase/types';

type VendorStatus = 'open' | 'limited' | 'closed';

// Shared Mock Data
const VENDORS = [
  {
    id: '1',
    name: 'Sage Beans Cafe',
    tagline: 'Organic Brews',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA31DNTl3zQzd6vdiErYDzRvFZglhzcXiOLbisHBtDa2Oj-yK8mYnJfScOFatORcUjJxMHezf5ppjbD-kFC36qLyENinxmYbd-g6y4VU1q49tilXiWFTro64zS87VQ6MWDb0s3SzErSKerDWcl5l2VenQPsr3FuLo-gMooC3b2h1yfiWiCHcwqVTPiM1V-sGY0dVopxCzQ34CdDTVXK1WVY0kyvJXbbJscHDvY6tT_ttvKOeXgQ46r7',
    rating: 4.8,
    distance: '0.3 mi',
    eta: '10 min',
    followers: '1.2k',
    status: 'open' as VendorStatus,
    items: ['Oat Flat White', 'Matcha Latte', 'Croissant'],
  },
  {
    id: '2',
    name: 'Earth & Fire Pizza',
    tagline: 'Authentic Wood-fired',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj58aGWsbq8JGUQ67nd3PEJe1go502239kIwEYbrjPyzDm_pMmOd_t50cYAhgWrLG8VwGbSm86ARTcU7KVEMOlpFJAXP75Ru6Jwbw2xnBRsG_K7SFdh1jBrk7Ed5XftTDDlipuTRNvWifhsVEfapkafPqUbo3m3dT_LxJFX9X_V9qYVyCZFQq5j3kK-vaKykClDLsMHTZWgmr9Ron37EnD7ac2PZVzz_R9S4114TTuVuuaev_eqxxK',
    rating: 4.9,
    distance: '0.4 mi',
    eta: '15-20 min',
    followers: '2.4k',
    status: 'limited' as VendorStatus,
    slotsLeft: 3,
    items: ['Margherita', 'Calzone', 'Tiramisu'],
  },
  {
    id: '3',
    name: 'Bistro Verde',
    tagline: 'Fresh & Plant-forward',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJxD7JMFnuqZkPeCLJe9uTlzcuXRRL_DP7A0rgqzYjjQE29YV-97cX0aHUEEzrgQL-6SpcXDLRKOmhlDlCLvQwmRDZPpOr-WFMWr2OfmP7m40WzIto45KlDnDq4ASRUpZ4tcCR7k3wIoORl_qCC7kdVtEbszbflLCSOgRO4ZnPOVSr9WGDGwkmTsGfQpBYjCgeehRQ6a_mav29Hez7OBq-Jsxrj-jC6sul1Gw9RHFFK3N5mSO6fCg',
    rating: 4.7,
    distance: '0.8 mi',
    eta: '20 min',
    followers: '3.1k',
    status: 'open' as VendorStatus,
    items: ['Buddha Bowl', 'Smoothie', 'Vegan Wrap'],
  }
];

function statusConfig(status: VendorStatus, slotsLeft?: number) {
  if (status === 'open') {
    return { badge: 'bg-primary/10 text-primary', label: 'PRE-ORDERS OPEN', cta: 'bg-primary text-on-primary', ctaLabel: 'PRE-ORDER' };
  }
  if (status === 'limited') {
    return { badge: 'bg-tertiary/10 text-tertiary', label: slotsLeft ? `${slotsLeft} SLOTS LEFT` : 'LIMITED SLOTS', cta: 'bg-tertiary-container text-on-tertiary-container', ctaLabel: 'ORDER NOW' };
  }
  return { badge: 'bg-surface-container-highest text-on-surface-variant', label: 'FULLY BOOKED', cta: 'border border-outline-variant/40 text-on-surface-variant bg-transparent', ctaLabel: 'NOTIFY ME' };
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & View State
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(!!initialQuery);
  const [activeChips, setActiveChips] = useState<string[]>(['pre-orders']);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, [router, supabase]);

  // Sync URL when searching
  const handleMapToggle = () => {
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  const results = useMemo(() => {
    let list = [...VENDORS];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.items.some(item => item.toLowerCase().includes(q)));
    }
    if (activeChips.includes('pre-orders')) {
      list = list.filter((v) => v.status === 'open' || v.status === 'limited');
    }
    return list;
  }, [query, activeChips]);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Foodie';
  const greeting = (() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  })();

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24 relative flex flex-col">
      {/* Texture Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2377574d' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
      />

      {/* --- TOP HEADER (Adapts based on state) --- */}
      {isSearching ? (
        // ACTIVE SEARCH HEADER (List View Controls)
        <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/15 pt-2">
          <div className="flex items-center gap-2 px-4 pb-2">
            <button onClick={() => { setIsSearching(false); setQuery(''); router.replace('/home'); }} className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <div className="relative flex-grow">
              <SearchIcon className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none font-body text-base text-on-surface placeholder:text-outline shadow-inner"
                placeholder="Search vendors, items..."
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-on-surface-variant text-sm font-body">{results.length} results</span>
            
            <div className="flex items-center bg-surface-container-highest rounded-lg p-0.5">
              <button className="p-1.5 rounded-md bg-primary text-on-primary transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button onClick={handleMapToggle} className="p-1.5 rounded-md text-on-surface-variant hover:text-primary transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </button>
            </div>
          </div>
        </header>
      ) : (
        // DEFAULT HOME HEADER
        <header className="sticky top-0 w-full z-40 bg-surface-container-low border-b border-outline-variant/10 flex justify-between items-center px-4 py-2 bg-surface/90 backdrop-blur-md">
          <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
            <svg className="w-6 h-6 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="font-display font-bold text-[24px] text-primary tracking-tight">OGuru</h1>
          <button onClick={() => router.push('/profile')} className="w-10 h-10 rounded-full overflow-hidden hover:bg-surface-container-high transition-colors active:scale-95 duration-150 border border-outline-variant/30">
            <img src={profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuA1u7SefxC3RqJUXmpzf2MURoIzP93BwI8ABe0_tpeWXwl7NqCutQJUW2PpdzU2uiiuukVekxfp216JTrc-lGophi3VZQszU7GSNBncgCscZPPf4imcm3Fy03WocmqsBGeCrSLVzq42ZESSQWNF9R5cHMNysDzYrWMNKNlTdLoqWtRyT22Jj8IY7iJHpNj_iqNUJfmzNzcU-QC-dpXaFCoVtgd_F74R2vqxNKilJ5ou9UYMWca9LRXI"} alt="User avatar" className="w-full h-full object-cover" />
          </button>
        </header>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-8 max-w-lg mx-auto w-full relative z-10">
        
        {/* ONLY SHOW IF NOT SEARCHING */}
        {!isSearching && (
          <>
            <section className="flex flex-col gap-1">
              {loading ? (
                <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse mb-1" />
              ) : (
                <h2 className="font-display font-bold text-[28px] text-on-surface leading-tight">
                  {greeting}, {firstName}
                </h2>
              )}
              <p className="font-body text-on-surface-variant text-base">What are you pre-ordering today?</p>
            </section>

            <section className="flex flex-col gap-3">
              <div 
                onClick={() => setIsSearching(true)}
                className="relative w-full shadow-[0_4px_16px_rgba(93,64,55,0.06)] rounded-full overflow-hidden flex items-center bg-surface-container-lowest border border-outline-variant/20 transition-colors cursor-pointer"
              >
                <SearchIcon className="w-5 h-5 text-outline ml-4" />
                <div className="w-full bg-transparent border-none py-3 px-3 text-on-surface-variant font-body text-base">
                  Search vendors, items...
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-secondary font-body text-sm">
                <svg className="w-4 h-4 text-secondary fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>Near Shoreditch • Within 1 mile</span>
              </div>
            </section>

            {/* Quick Reorder */}
            <section className="flex flex-col gap-4">
              <h3 className="font-display font-bold text-xl text-on-surface">Quick Reorder</h3>
              <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-organic-md border border-outline-variant/20 relative">
                <div className="h-32 w-full bg-surface-container-high relative">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ghVSJ5pXgH_gHA7qx99PJo9R6pUwwVadfFeeWqLstS8qg9GnbXYixHHjGqk2hp7d2HM_tUCXf5B-zLuRZdcVZT8Y9pbP-DQ66hqyOX6dCYy0Yvt6Vc_e0p2ZiKaGd_X-yQnA5xALd9pLzJ7faRPeO68o1hHoBwcLdmyyf_wwptB2eoNNvJrHAxyjPfbQMPt-xG_45XrsewMt0pw1jt6inmrtNqSdVgrmqdvJl4KuF48WHLl07nBK" alt="Artisan Latte" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex flex-col">
                    <span className="font-body text-sm text-white/90">Cafe Artisan</span>
                    <span className="font-display font-bold text-xl text-white">Artisan Latte</span>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-surface-container-lowest">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    PRE-ORDERS OPEN
                  </div>
                  <button className="bg-primary text-on-primary font-label text-xs uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm">
                    REORDER
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- DYNAMIC RESULTS / TRENDING FEED --- */}
        <section className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-xl text-on-surface">
            {isSearching ? 'Search Results' : 'Trending Near You'}
          </h3>
          <div className="flex flex-col gap-4">
            
            {results.map((vendor) => {
              const styles = statusConfig(vendor.status, vendor.slotsLeft);
              return (
                <div key={vendor.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-organic border border-outline-variant/20 flex gap-3 p-3 cursor-pointer hover:shadow-organic-md transition-shadow">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high relative">
                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display font-bold text-lg text-on-surface leading-tight">{vendor.name}</h4>
                        <div className="flex items-center gap-0.5 text-secondary font-label text-xs">
                          <svg className="w-3.5 h-3.5 fill-current text-tertiary" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                          <span className="font-bold">{vendor.rating}</span>
                        </div>
                      </div>
                      <p className="font-body text-sm text-on-surface-variant mt-0.5">{vendor.distance}</p>
                    </div>
                    <div className={`${styles.badge} px-2.5 py-0.5 rounded-full font-label text-[10px] font-semibold uppercase tracking-wider inline-block self-start`}>
                      {styles.label}
                    </div>
                  </div>
                </div>
              );
            })}

            {results.length === 0 && (
              <div className="text-center py-10 text-on-surface-variant">
                No vendors found. Try a different search.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 5-Tab Bottom Navigation */}
      <nav className="bg-surface-container font-label text-xs fixed bottom-0 left-0 w-full z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(93,64,55,0.08)] flex justify-around items-center px-2 pb-4 pt-2 border-t border-outline-variant/10">
        
        {/* 1. Home / List (Active) */}
        <button onClick={() => { setIsSearching(false); setQuery(''); }} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-3.5 py-1 transition-all active:scale-90 duration-200">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          <span className="mt-0.5 text-[10px] font-semibold">Home</span>
        </button>

        {/* 2. Explore (Map) */}
        <button onClick={handleMapToggle} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span className="mt-0.5 text-[10px]">Map</span>
        </button>

        {/* 3. Gifts */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
          <span className="mt-0.5 text-[10px]">Gifts</span>
        </button>

        {/* 4. Orders */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <span className="mt-0.5 text-[10px]">Orders</span>
        </button>

        {/* 5. Profile */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="mt-0.5 text-[10px]">Profile</span>
        </button>

      </nav>
    </div>
  );
}

export default function HomeWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <HomeContent />
    </Suspense>
  );
}