'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type VendorStatus = 'open' | 'limited' | 'closed';
type VendorCategory = 'cafe' | 'pizza' | 'bakery' | 'burgers';

type Vendor = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  distance: string;
  distanceValue: number;
  eta: string;
  followers: string;
  followersValue: number;
  status: VendorStatus;
  slotsLeft?: number;
  category: VendorCategory;
  items: string[];
  socialProof?: string;
};

const VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Sage Beans Cafe',
    tagline: 'Organic Brews',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA31DNTl3zQzd6vdiErYDzRvFZglhzcXiOLbisHBtDa2Oj-yK8mYnJfScOFatORcUjJxMHezf5ppjbD-kFC36qLyENinxmYbd-g6y4VU1q49tilXiWFTro64zS87VQ6MWDb0s3SzErSKerDWcl5l2VenQPsr3FuLo-gMooC3b2h1yfiWiCHcwqVTPiM1V-sGY0dVopxCzQ34CdDTVXK1WVY0kyvJXbbJscHDvY6tT_ttvKOeXgQ46r7',
    rating: 4.8,
    distance: '0.3 mi',
    distanceValue: 0.3,
    eta: '10 min',
    followers: '1.2k',
    followersValue: 1200,
    status: 'open',
    category: 'cafe',
    items: ['Oat Flat White', 'Matcha Latte', 'Croissant'],
  },
  {
    id: '2',
    name: 'Earth & Fire Pizza',
    tagline: 'Authentic Wood-fired',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj58aGWsbq8JGUQ67nd3PEJe1go502239kIwEYbrjPyzDm_pMmOd_t50cYAhgWrLG8VwGbSm86ARTcU7KVEMOlpFJAXP75Ru6Jwbw2xnBRsG_K7SFdh1jBrk7Ed5XftTDDlipuTRNvWifhsVEfapkafPqUbo3m3dT_LxJFX9X_V9qYVyCZFQq5j3kK-vaKykClDLsMHTZWgmr9Ron37EnD7ac2PZVzz_R9S4114TTuVuuaev_eqxxK',
    rating: 4.9,
    distance: '0.4 mi',
    distanceValue: 0.4,
    eta: '15-20 min',
    followers: '2.4k',
    followersValue: 2400,
    status: 'limited',
    slotsLeft: 3,
    category: 'pizza',
    items: ['Margherita', 'Calzone', 'Tiramisu'],
  },
  {
    id: '3',
    name: 'GreenLeaf Kitchen',
    tagline: 'Fresh & Plant-forward',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJxD7JMFnuqZkPeCLJe9uTlzcuXRRL_DP7A0rgqzYjjQE29YV-97cX0aHUEEzrgQL-6SpcXDLRKOmhlDlCLvQwmRDZPpOr-WFMWr2OfmP7m40WzIto45KlDnDq4ASRUpZ4tcCR7k3wIoORl_qCC7kdVtEbszbflLCSOgRO4ZnPOVSr9WGDGwkmTsGfQpBYjCgeehRQ6a_mav29Hez7OBq-Jsxrj-jC6sul1Gw9RHFFK3N5mSO6fCg',
    rating: 4.6,
    distance: '0.9 mi',
    distanceValue: 0.9,
    eta: '20 min',
    followers: '3.1k',
    followersValue: 3100,
    status: 'open',
    category: 'cafe',
    items: ['Buddha Bowl', 'Smoothie', 'Vegan Wrap'],
    socialProof: 'Jess follows this',
  },
  {
    id: '4',
    name: 'Artisan Crust',
    tagline: 'Sourdough Special',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCR3SWabcozwsFbsFb1hgpVMZw2oH7uUeu7ZvDFSIzYgeyQb1nFfxAlRZfx1oz5JnjxxviT1lDJTv3slaAfztp4ulW0pAQNi5evCQ4Yo4sJafDcGFQ89RtqzbPQYoZPIKwY5iQd5VcMNvYrYTUgOWBtPuizi7CLSvCdiK6Y7TNq96vgBUeUzPoALUv2vBBXMTQVdW1newHEeIfzMkx3bvyarGACsUsBJT5m9xEfHUJO4GvZrcnJXOyj',
    rating: 4.7,
    distance: '1.2 mi',
    distanceValue: 1.2,
    eta: '25 min',
    followers: '680',
    followersValue: 680,
    status: 'closed',
    category: 'bakery',
    items: ['Sourdough Loaf', 'Cinnamon Roll', 'Rye Bread'],
  },
  {
    id: '5',
    name: 'The Morning Table',
    tagline: 'Breakfast favourites',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ghVSJ5pXgH_gHA7qx99PJo9R6pUwwVadfFeeWqLstS8qg9GnbXYixHHjGqk2hp7d2HM_tUCXf5B-zLuRZdcVZT8Y9pbP-DQ66hqyOX6dCYy0Yvt6Vc_e0p2ZiKaGd_X-yQnA5xALd9pLzJ7faRPeO68o1hHoBwcLdmyyf_wwptB2eoNNvJrHAxyjPfbQMPt-xG_45XrsewMt0pw1jt6inmrtNqSdVgrmqdvJl4KuF48WHLl07nBK',
    rating: 4.5,
    distance: '1.4 mi',
    distanceValue: 1.4,
    eta: '30 min',
    followers: '450',
    followersValue: 450,
    status: 'open',
    category: 'cafe',
    items: ['Full Breakfast', 'Eggs Benedict', 'Fresh Juice'],
  },
];

type SortKey =
  | 'best-match'
  | 'nearest'
  | 'most-followed'
  | 'highest-rated'
  | 'fastest-pickup';

const SORT_LABELS: Record<SortKey, string> = {
  'best-match': 'Best match',
  nearest: 'Nearest',
  'most-followed': 'Most followed',
  'highest-rated': 'Highest rated',
  'fastest-pickup': 'Fastest pickup',
};

function statusConfig(status: VendorStatus, slotsLeft?: number) {
  if (status === 'open') {
    return {
      badge: 'bg-primary/10 text-primary',
      label: 'PRE-ORDERS OPEN',
      cta: 'bg-primary text-on-primary',
      ctaLabel: 'PRE-ORDER',
    };
  }
  if (status === 'limited') {
    return {
      badge: 'bg-tertiary/10 text-tertiary',
      label: slotsLeft ? `${slotsLeft} SLOTS LEFT` : 'LIMITED SLOTS',
      cta: 'bg-tertiary-container text-on-tertiary-container',
      ctaLabel: 'ORDER NOW',
    };
  }
  return {
    badge: 'bg-surface-container-highest text-on-surface-variant',
    label: 'FULLY BOOKED',
    cta: 'border border-outline-variant/40 text-on-surface-variant bg-transparent',
    ctaLabel: 'NOTIFY ME',
  };
}

export default function ExploreListPage() {
  const router = useRouter();
  const [query, setQuery] = useState('coffee');
  const [sort, setSort] = useState<SortKey>('best-match');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeChips, setActiveChips] = useState<string[]>(['pre-orders']);
  const [followed, setFollowed] = useState<Record<string, boolean>>({
    '2': true,
  });

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const results = useMemo(() => {
    let list = [...VENDORS];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.items.some((item) => item.toLowerCase().includes(q))
      );
    }

    if (activeChips.includes('pre-orders')) {
      list = list.filter((v) => v.status === 'open' || v.status === 'limited');
    }
    if (activeChips.includes('open-now')) {
      list = list.filter((v) => v.status !== 'closed');
    }
    if (activeChips.includes('top-rated')) {
      list = list.filter((v) => v.rating >= 4.7);
    }

    switch (sort) {
      case 'nearest':
        list.sort((a, b) => a.distanceValue - b.distanceValue);
        break;
      case 'most-followed':
        list.sort((a, b) => b.followersValue - a.followersValue);
        break;
      case 'highest-rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'fastest-pickup':
        list.sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
        break;
      default:
        // best match: open first, then distance, then followers
        list.sort((a, b) => {
          const statusScore = (s: VendorStatus) =>
            s === 'open' ? 0 : s === 'limited' ? 1 : 2;
          const byStatus = statusScore(a.status) - statusScore(b.status);
          if (byStatus !== 0) return byStatus;
          const byDistance = a.distanceValue - b.distanceValue;
          if (byDistance !== 0) return byDistance;
          return b.followersValue - a.followersValue;
        });
    }

    return list;
  }, [query, sort, activeChips]);

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24 relative flex flex-col">
      {/* Sticky top controls */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/15">
        {/* Search row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <button
            onClick={() => router.push('/home')}
            className="p-2 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="Back"
          >
            <svg className="w-5 h-5 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative flex-grow">
            <svg className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body text-[15px] text-on-surface placeholder:text-outline shadow-inner"
              placeholder="Search vendors, items..."
              type="text"
            />
          </div>

          <button className="relative p-2.5 rounded-xl hover:bg-surface-container-high active:scale-95 transition-all border border-outline-variant/20">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 px-4 pb-2">
          <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <button className="flex items-center gap-1 text-on-surface-variant text-sm font-body hover:text-primary transition-colors">
            <span>Near Shoreditch</span>
            <span className="text-outline">·</span>
            <span>Within 1 mile</span>
            <svg className="w-4 h-4 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Chips */}
        <div className="px-4 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            {[
              { id: 'pre-orders', label: 'Pre-orders' },
              { id: 'open-now', label: 'Open now' },
              { id: 'top-rated', label: 'Top rated' },
              { id: 'nearest', label: 'Nearest' },
              { id: 'vegan', label: 'Vegan' },
            ].map((chip) => {
              const active = activeChips.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  className={`px-3.5 py-2 rounded-full font-label text-xs uppercase tracking-wider transition-all active:scale-95 ${
                    active
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-highest text-on-surface'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort + count + map toggle */}
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-on-surface-variant text-sm font-body">
            {results.length} results
          </span>

          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 text-on-surface text-sm font-body font-medium hover:text-primary transition-colors"
            >
              <span>{SORT_LABELS[sort]}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-organic-lg border border-outline-variant/15 overflow-hidden z-50">
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-body hover:bg-surface-container-high transition-colors flex items-center justify-between"
                  >
                    <span>{SORT_LABELS[key]}</span>
                    {sort === key && (
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-surface-container-highest rounded-lg p-0.5">
            <button className="p-1.5 rounded-md bg-primary text-on-primary transition-all" aria-label="List view">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => router.push('/explore')}
              className="p-1.5 rounded-md text-on-surface-variant hover:text-primary transition-all"
              aria-label="Map view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="flex-1 px-4 pt-3 max-w-lg mx-auto w-full">
        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container-high mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="font-display font-semibold text-lg text-on-surface mb-1">No vendors found</p>
            <p className="text-on-surface-variant text-sm mb-4">
              Try adjusting your filters or expanding your search area.
            </p>
            <button
              onClick={() => {
                setActiveChips([]);
                setQuery('');
              }}
              className="text-primary font-label text-xs uppercase tracking-wider hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          results.map((vendor) => {
            const styles = statusConfig(vendor.status, vendor.slotsLeft);
            const isFollowed = !!followed[vendor.id];

            return (
              <div
                key={vendor.id}
                className={`bg-surface rounded-2xl border border-outline-variant/10 shadow-organic mb-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform ${
                  vendor.status === 'closed' ? 'opacity-70' : ''
                }`}
              >
                <div className="flex">
                  {/* Image */}
                  <div className={`w-[100px] flex-shrink-0 relative overflow-hidden ${vendor.status === 'closed' ? 'grayscale-[0.3]' : ''}`}>
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover min-h-[152px]"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <svg className="w-3 h-3 fill-current text-tertiary" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-[11px] font-bold text-on-surface">{vendor.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between min-h-[152px]">
                    <div>
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="font-body font-semibold text-[15px] text-on-surface leading-tight pr-2">
                          {vendor.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFollowed((prev) => ({
                              ...prev,
                              [vendor.id]: !prev[vendor.id],
                            }));
                          }}
                          className="flex-shrink-0 p-1 -mr-1 -mt-0.5 rounded-full hover:bg-surface-container-high transition-colors"
                          aria-label={isFollowed ? 'Unfollow' : 'Follow'}
                        >
                          <svg
                            className={`w-5 h-5 ${isFollowed ? 'fill-primary text-primary' : 'fill-none text-on-surface-variant'}`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2 ${styles.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="font-label text-[11px] tracking-wide uppercase">
                          {styles.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px] font-body mb-2">
                        <span>{vendor.distance}</span>
                        <span className="text-outline-variant">·</span>
                        {vendor.status !== 'closed' && (
                          <>
                            <span>{vendor.eta}</span>
                            <span className="text-outline-variant">·</span>
                          </>
                        )}
                        <span>{vendor.followers}</span>
                      </div>

                      <p className="text-on-surface-variant text-[12px] font-body">
                        {vendor.items.map((item, i) => (
                          <span key={item}>
                            {i === 0 ? (
                              <span className="text-on-surface font-medium">{item}</span>
                            ) : (
                              item
                            )}
                            {i < vendor.items.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </p>

                      {vendor.socialProof && (
                        <p className="text-[11px] text-secondary font-body mt-1.5">
                          {vendor.socialProof}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end mt-2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className={`px-4 py-1.5 rounded-lg font-label text-xs uppercase tracking-wider active:scale-95 transition-transform ${styles.cta}`}
                      >
                        {styles.ctaLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {results.length > 0 && (
          <div className="text-center py-8">
            <p className="text-on-surface-variant text-sm font-body mb-2">
              That&apos;s everything nearby
            </p>
            <button className="text-primary font-label text-xs uppercase tracking-wider hover:underline">
              Expand to 5 miles
            </button>
          </div>
        )}
      </main>

      {/* Bottom nav */}
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
