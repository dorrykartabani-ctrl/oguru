'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type VendorStatus = 'open' | 'limited' | 'closed';
type VendorCategory = 'cafe' | 'pizza' | 'bakery' | 'burgers';

type Vendor = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  distance: string;
  eta: string;
  followers: string;
  status: VendorStatus;
  slotsLeft?: number;
  category: VendorCategory;
  top: string; // % position on map
  left: string;
};

const VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Earth & Fire Pizza',
    tagline: 'Authentic Wood-fired',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj58aGWsbq8JGUQ67nd3PEJe1go502239kIwEYbrjPyzDm_pMmOd_t50cYAhgWrLG8VwGbSm86ARTcU7KVEMOlpFJAXP75Ru6Jwbw2xnBRsG_K7SFdh1jBrk7Ed5XftTDDlipuTRNvWifhsVEfapkafPqUbo3m3dT_LxJFX9X_V9qYVyCZFQq5j3kK-vaKykClDLsMHTZWgmr9Ron37EnD7ac2PZVzz_R9S4114TTuVuuaev_eqxxK',
    rating: 4.9,
    distance: '0.4 mi',
    eta: '15-20 min',
    followers: '2.4k',
    status: 'open',
    category: 'pizza',
    top: '50%',
    left: '65%',
  },
  {
    id: '2',
    name: 'Sage Beans Cafe',
    tagline: 'Organic Brews',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA31DNTl3zQzd6vdiErYDzRvFZglhzcXiOLbisHBtDa2Oj-yK8mYnJfScOFatORcUjJxMHezf5ppjbD-kFC36qLyENinxmYbd-g6y4VU1q49tilXiWFTro64zS87VQ6MWDb0s3SzErSKerDWcl5l2VenQPsr3FuLo-gMooC3b2h1yfiWiCHcwqVTPiM1V-sGY0dVopxCzQ34CdDTVXK1WVY0kyvJXbbJscHDvY6tT_ttvKOeXgQ46r7',
    rating: 4.8,
    distance: '0.3 mi',
    eta: '10 min',
    followers: '1.2k',
    status: 'open',
    category: 'cafe',
    top: '35%',
    left: '25%',
  },
  {
    id: '3',
    name: 'Artisan Crust',
    tagline: 'Sourdough Special',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3SWabcozwsFbsFb1hgpVMZw2oH7uUeu7ZvDFSIzYgeyQb1nFfxAlRZfx1oz5JnjxxviT1lDJTv3slaAfztp4ulW0pAQNi5evCQ4Yo4sJafDcGFQ89RtqzbPQYoZPIKwY5iQd5VcMNvYrYTUgOWBtPuizi7CLSvCdiK6Y7TNq96vgBUeUzPoALUv2vBBXMTQVdW1newHEeIfzMkx3bvyarGACsUsBJT5m9xEfHUJO4GvZrcnJXOyj',
    rating: 4.7,
    distance: '1.2 mi',
    eta: '25 min',
    followers: '680',
    status: 'limited',
    slotsLeft: 3,
    category: 'bakery',
    top: '20%',
    left: '75%',
  },
  {
    id: '4',
    name: 'GreenLeaf Kitchen',
    tagline: 'Fresh & Plant-forward',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJxD7JMFnuqZkPeCLJe9uTlzcuXRRL_DP7A0rgqzYjjQE29YV-97cX0aHUEEzrgQL-6SpcXDLRKOmhlDlCLvQwmRDZPpOr-WFMWr2OfmP7m40WzIto45KlDnDq4ASRUpZ4tcCR7k3wIoORl_qCC7kdVtEbszbflLCSOgRO4ZnPOVSr9WGDGwkmTsGfQpBYjCgeehRQ6a_mav29Hez7OBq-Jsxrj-jC6sul1Gw9RHFFK3N5mSO6fCg',
    rating: 4.6,
    distance: '0.9 mi',
    eta: '20 min',
    followers: '3.1k',
    status: 'closed',
    category: 'cafe',
    top: '62%',
    left: '40%',
  },
];

function statusStyles(status: VendorStatus) {
  if (status === 'open') {
    return {
      pin: 'bg-primary border-white text-on-primary',
      tip: 'bg-primary',
      badge: 'bg-primary/10 text-primary',
      label: 'PRE-ORDERS OPEN',
      cta: 'bg-primary text-on-primary',
      ctaLabel: 'PRE-ORDER',
    };
  }
  if (status === 'limited') {
    return {
      pin: 'bg-tertiary border-white text-on-tertiary',
      tip: 'bg-tertiary',
      badge: 'bg-tertiary/10 text-tertiary',
      label: '3 SLOTS LEFT',
      cta: 'bg-tertiary-container text-on-tertiary-container',
      ctaLabel: 'ORDER NOW',
    };
  }
  return {
    pin: 'bg-outline border-white text-on-primary opacity-80',
    tip: 'bg-outline',
    badge: 'bg-surface-container-highest text-on-surface-variant',
    label: 'FULLY BOOKED',
    cta: 'border border-outline-variant text-on-surface-variant bg-transparent',
    ctaLabel: 'NOTIFY ME',
  };
}

function CategoryIcon({ category }: { category: VendorCategory }) {
  if (category === 'pizza') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.1 2 4.6 3.6 2.3 6.1c-.4.4-.4 1.1 0 1.5l8.7 8.7c.4.4 1.1.4 1.5 0l8.7-8.7c.4-.4.4-1.1 0-1.5C19.4 3.6 15.9 2 12 2zm-2 7c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
      </svg>
    );
  }
  if (category === 'bakery') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 11c.3-1.5-.3-3.1-1.5-4.1-1.2-1-2.9-1.3-4.4-.8-.7-1.3-2-2.1-3.5-2.1-1.7 0-3.2 1.1-3.7 2.7-1.5-.2-3 .6-3.7 1.9-.8 1.3-.7 3 .2 4.2-.9 1-1.2 2.5-.7 3.8.6 1.5 2.1 2.4 3.7 2.4H17c1.9 0 3.5-1.6 3.5-3.5 0-.7-.2-1.4-.5-2-.3-.5-.5-1-.5-1.5z" />
      </svg>
    );
  }
  // cafe default
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 21h18v-2H2v2zm6-4h10a4 4 0 0 0 0-8h-1.3A6 6 0 0 0 5 12v3a2 2 0 0 0 2 2h1zm10-6a2 2 0 1 1 0 4h-1V11h1z" />
    </svg>
  );
}

export default function ExploreMapPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(VENDORS[0].id);
  const [query, setQuery] = useState('');
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = VENDORS.filter((v) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.tagline.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const el = cardRefs.current[selectedId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedId]);

  const selectVendor = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="bg-surface text-on-background h-screen flex flex-col overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
            className="active:scale-95 transition-transform hover:bg-primary-container/20 p-2 rounded-full"
            aria-label="Back to home"
          >
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-display font-bold text-[24px] text-primary tracking-tight">OGuru</h1>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-sm font-body">
          <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>Near Shoreditch</span>
        </div>
      </header>

      <main className="relative flex-1 w-full mt-16 overflow-hidden">
        {/* Map background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full grayscale-[0.2] contrast-[0.9] brightness-[1.05]">
            <img
              className="w-full h-full object-cover"
              alt="Neighbourhood map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFUpP_qI5QgU_B5p0SPyIojF0wyNE9gNIGtomH3fyfP2OUhXPAL1_f6502ycIP_Iterfhr2_QDOitRHl3xPPyWDkj0uko3RpNiKfdZeRxXm0uZ1nFxiWLkGk_dEbAIeodgZd6HbC1AfO_LZucb23K7ejVcYhZlAMqQTNkTQI6YjJpWnAFJMa0z1NZpY8TxQt8-XDiszRKuKdvoxTGG5wQWnamHm6lBV1p4PFAJpAqMKZF5_0Qw0rl"
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(251,249,244,0.45) 0%, transparent 12%, transparent 78%, rgba(251,249,244,0.55) 100%)',
            }}
          />
        </div>

        {/* Floating search */}
        <div className="absolute top-4 left-0 right-0 px-4 z-20">
          <div className="bg-surface/95 backdrop-blur-md rounded-xl p-1 flex items-center shadow-organic-md border border-outline-variant/30">
            <div className="flex items-center flex-1 px-3">
              <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-full font-body text-on-surface placeholder:text-on-surface-variant/60 px-3 py-2"
                placeholder="Search cafes, pizza..."
                type="text"
              />
            </div>
            <div className="h-6 w-px bg-outline-variant/30 mx-1" />
            <button className="p-3 text-primary hover:bg-primary-container/20 rounded-lg transition-colors flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              <span className="font-label text-xs uppercase tracking-wider hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {['Pre-orders', 'Open now', 'Coffee', 'Pizza', 'Bakery'].map((chip, i) => (
              <button
                key={chip}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-all ${
                  i === 0
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface/95 text-on-surface border border-outline-variant/30 backdrop-blur-md'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Pins */}
        {filtered.map((vendor) => {
          const styles = statusStyles(vendor.status);
          const selected = selectedId === vendor.id;
          return (
            <button
              key={vendor.id}
              onClick={() => selectVendor(vendor.id)}
              className="absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{ top: vendor.top, left: vendor.left }}
              aria-label={vendor.name}
            >
              <div className={`relative flex flex-col items-center transition-transform duration-200 ${selected ? 'scale-125' : 'scale-100'}`}>
                <div
                  className={`${styles.pin} p-2 rounded-full shadow-lg border-2 flex items-center justify-center ${
                    selected ? 'ring-2 ring-primary/30' : ''
                  }`}
                >
                  <CategoryIcon category={vendor.category} />
                </div>
                <div className={`w-2 h-2 ${styles.tip} rotate-45 -mt-1 shadow-sm`} />
                {selected && (
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-surface shadow-organic-sm border border-outline-variant/20">
                    <span className="text-[10px] font-label font-semibold text-on-surface whitespace-nowrap">
                      {vendor.name}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* You are here */}
        <div className="absolute z-10 top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 rounded-full bg-primary/20 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md" />
          </div>
        </div>

        {/* List toggle FAB */}
        <button
          onClick={() => router.push('/explore/list')}
          className="absolute bottom-[250px] right-4 z-30 bg-primary text-on-primary px-5 py-3 rounded-full shadow-xl flex items-center gap-2 active:scale-95 transition-transform font-label text-xs uppercase tracking-wider"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          List
        </button>

        {/* Bottom carousel */}
        <div className="absolute bottom-0 left-0 right-0 pb-20 z-20 pointer-events-none">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 px-4 py-4 pointer-events-auto snap-x snap-mandatory">
            {filtered.map((vendor) => {
              const styles = statusStyles(vendor.status);
              const selected = selectedId === vendor.id;
              return (
                <div
                  key={vendor.id}
                  ref={(el) => {
                    cardRefs.current[vendor.id] = el;
                  }}
                  onClick={() => selectVendor(vendor.id)}
                  className={`min-w-[300px] snap-center bg-surface border rounded-2xl overflow-hidden shadow-organic-md flex transition-all cursor-pointer ${
                    selected
                      ? 'border-primary shadow-organic-lg scale-[1.02]'
                      : 'border-outline-variant/20 hover:border-primary/20'
                  } ${vendor.status === 'closed' ? 'opacity-75' : ''}`}
                >
                  <div className="w-24 relative overflow-hidden flex-shrink-0">
                    <img
                      className={`w-full h-full object-cover min-h-[150px] ${
                        vendor.status === 'closed' ? 'grayscale-[0.3]' : ''
                      }`}
                      alt={vendor.name}
                      src={vendor.image}
                    />
                  </div>
                  <div className="flex-1 p-3.5 flex flex-col justify-between min-h-[150px]">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-body font-semibold text-on-surface truncate max-w-[140px]">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-0.5 bg-secondary-container/30 px-1.5 py-0.5 rounded flex-shrink-0">
                          <svg className="w-3.5 h-3.5 fill-current text-tertiary" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="text-[12px] font-bold text-on-secondary-container">
                            {vendor.rating}
                          </span>
                        </div>
                      </div>

                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2 ${styles.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="font-label text-[10px] tracking-wide uppercase">
                          {vendor.status === 'limited' && vendor.slotsLeft
                            ? `${vendor.slotsLeft} SLOTS LEFT`
                            : styles.label}
                        </span>
                      </div>

                      <p className="text-on-surface-variant text-[13px] mb-1.5">{vendor.tagline}</p>

                      <div className="flex items-center gap-1.5 text-on-surface-variant/80 text-[12px]">
                        <span>{vendor.distance}</span>
                        <span>•</span>
                        <span>{vendor.eta}</span>
                        <span>•</span>
                        <span>{vendor.followers}</span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // future: route to vendor store
                        }}
                        className={`px-4 py-1.5 rounded-lg font-label text-xs uppercase tracking-wider active:scale-95 transition-transform ${styles.cta}`}
                      >
                        {styles.ctaLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom nav — matches Home */}
      <nav className="bg-surface-container font-label text-xs fixed bottom-0 left-0 w-full z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(93,64,55,0.08)] flex justify-around items-center px-2 pb-4 pt-2 border-t border-outline-variant/10">
        <button
          onClick={() => router.push('/home')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          <span className="mt-0.5 text-[10px]">Home</span>
        </button>

        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-3.5 py-1 transition-all active:scale-90 duration-200">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="mt-0.5 text-[10px] font-semibold">Explore</span>
        </button>

        <button
          onClick={() => router.push('/gifts')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <span className="mt-0.5 text-[10px]">Gifts</span>
        </button>

        <button
          onClick={() => router.push('/orders')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="mt-0.5 text-[10px]">Orders</span>
        </button>

        <button
          onClick={() => router.push('/profile')}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90 duration-200 p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="mt-0.5 text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
