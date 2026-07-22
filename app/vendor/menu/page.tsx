'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, Product } from '@/lib/supabase/types';
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Megaphone,
  MoreHorizontal,
  Bell,
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Upload,
  Plus,
  Gift,
  Pin,
  MoreVertical,
  Leaf,
  Wheat,
  Nut,
  Milk,
  ChevronDown,
  Loader2,
  LogOut,
  RefreshCw,
  LayoutTemplate,
  Pencil,
  MessageCircle,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: true, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

const setupOptions = [
  {
    icon: RefreshCw,
    title: 'Sync from POS',
    subtitle: 'Import from Square, Toast, Lightspeed, Clover',
    time: '2 min',
    highlight: true,
    href: '/vendor/menu/sync',
  },
  {
    icon: FileSpreadsheet,
    title: 'Import a CSV file',
    subtitle: 'Upload your existing menu spreadsheet',
    time: '3 min',
    highlight: false,
    href: '/vendor/menu/import',
  },
  {
    icon: LayoutTemplate,
    title: 'Use a template',
    subtitle: 'Café · Bakery · Custom starting points',
    time: '15 min',
    highlight: false,
    href: '/vendor/menu/templates',
  },
  {
    icon: Pencil,
    title: 'Build from scratch',
    subtitle: 'Full control with reusable blocks',
    time: '45 min',
    highlight: false,
    href: '/vendor/menu/product/new',
  },
  {
    icon: MessageCircle,
    title: 'Not sure? Chat with our assistant',
    subtitle: 'Get a personalised recommendation',
    time: 'Chat',
    highlight: false,
    href: '#',
  },
];

type DietaryTag = 'vegan' | 'gf' | 'dairy-free' | 'nut-warning';

const dietaryConfig: Record<
  string,
  { label: string; icon: typeof Leaf; bg: string; text: string; iconColor: string }
> = {
  vegan: {
    label: 'Vegan',
    icon: Leaf,
    bg: 'bg-primary/10',
    text: 'text-primary',
    iconColor: 'text-primary',
  },
  gf: {
    label: 'GF',
    icon: Wheat,
    bg: 'bg-secondary-container/60',
    text: 'text-secondary',
    iconColor: 'text-secondary',
  },
  'dairy-free': {
    label: 'Dairy-free',
    icon: Milk,
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    iconColor: 'text-blue-700',
  },
  'nut-warning': {
    label: 'Contains nuts',
    icon: Nut,
    bg: 'bg-tertiary-container/30',
    text: 'text-tertiary',
    iconColor: 'text-tertiary',
  },
};

// Format currency
const formatPrice = (cents: number, currency: string = 'AUD') => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

// Get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

export default function VendorMenuPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Menu list view state
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Auth check
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Load business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!businessData) {
        router.push('/vendor/apply');
        return;
      }

      if (businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(businessData);

      // Load location
      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);

        // Load products for this location
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('location_id', locationData.id)
          .order('sort_order', { ascending: true });

        setProducts(productsData || []);
      }
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !currentValue })
      .eq('id', productId);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_available: !currentValue } : p
        )
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading your menu...</p>
      </main>
    );
  }

  if (!business || !location) {
    return null;
  }

  const businessInitials = getInitials(business.legal_name);
  const hasProducts = products.length > 0;

  // Categories for filter tabs (if we have products)
  const categoryList = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const categoriesWithCount = categoryList.map((cat) => ({
    name: cat,
    count: cat === 'All' ? products.length : products.filter((p) => p.category === cat).length,
  }));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Shared shell (nav + sidebar)
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <>
      {/* Top App Bar — mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
            {businessInitials}
          </div>
          <h1 className="font-display text-lg font-bold text-primary truncate max-w-[180px]">
            {business.legal_name}
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary-container" />
        </button>
      </header>

      {/* Side Navigation — tablet+ */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
            {businessInitials}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base text-primary font-bold leading-tight truncate">
              {business.legal_name}
            </h1>
            <p className="text-xs text-on-surface-variant">Vendor Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-medium text-left ${
                  item.active
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-2 font-label"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {children}

      {/* Bottom Navigation — Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_20px_rgba(93,64,55,0.08)]">
        <div className="flex justify-around items-center h-20 pb-safe px-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all active:scale-90 ${
                  item.active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} fill={item.active ? 'currentColor' : 'none'} />
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

  // ═════════════════════════════════════════
  // EMPTY STATE — No products yet
  // ═════════════════════════════════════════
  if (!hasProducts) {
    return (
      <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
        <Shell>
          <div className="md:ml-64 pt-20 md:pt-12 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                  Step 1 of 3 — Setting up your store
                </span>
                <span className="text-xs font-label font-semibold text-primary">
                  33%
                </span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: '33%' }}
                />
              </div>
            </div>

            {/* Header */}
            <section className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight tracking-tight mb-2">
                Let&apos;s build your menu
              </h1>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Choose how you&apos;d like to start. You can switch approaches anytime.
              </p>
            </section>

            {/* Options — Clean rows */}
            <div className="space-y-3">
              {setupOptions.map((option, i) => {
                const Icon = option.icon;
                return (
                  <button
                    key={i}
                    onClick={() => option.href !== '#' && router.push(option.href)}
                    className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left group ${
                      option.highlight
                        ? 'bg-primary-container border-primary text-white hover:brightness-105'
                        : 'bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:bg-surface-container-low'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        option.highlight ? 'bg-white/20' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-display font-semibold text-base md:text-lg leading-tight mb-0.5 ${
                          option.highlight ? 'text-white' : 'text-on-surface'
                        }`}
                      >
                        {option.title}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          option.highlight ? 'text-white/80' : 'text-on-surface-variant'
                        }`}
                      >
                        {option.subtitle}
                      </p>
                    </div>

                    <span
                      className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label font-semibold uppercase tracking-wider flex-shrink-0 ${
                        option.highlight
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {option.time}
                    </span>

                    <ArrowRight
                      size={20}
                      className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                        option.highlight ? 'text-white' : 'text-on-surface-variant'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </Shell>
      </main>
    );
  }

  // ═════════════════════════════════════════
  // PRODUCT LIST — Vendor has products
  // ═════════════════════════════════════════
  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      <Shell>
        <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight tracking-tight">
                Menu
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} · {location.city}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/vendor/menu/import')}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container transition-colors text-sm font-label font-semibold"
              >
                <Upload size={16} />
                Import CSV
              </button>
              <button
                onClick={() => router.push('/vendor/menu/product/new')}
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:opacity-90 transition-all text-sm font-label font-semibold shadow-sm active:scale-[0.98]"
              >
                <Plus size={16} />
                Add Product
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Search + Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
              />
            </div>

            <div className="flex gap-2">
              <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm hover:bg-surface-container transition-colors">
                <span>All availability</span>
                <ChevronDown size={14} />
              </button>

              <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm hover:bg-surface-container transition-colors">
                <SlidersHorizontal size={14} />
                <span>Dietary</span>
              </button>

              <button className="md:hidden flex items-center justify-center w-10 h-10 bg-surface-container-lowest border border-outline-variant rounded-xl">
                <SlidersHorizontal size={18} className="text-on-surface-variant" />
              </button>

              <div className="flex bg-surface-container-high p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-surface-container-lowest shadow-sm text-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-surface-container-lowest shadow-sm text-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          {categoriesWithCount.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {categoriesWithCount.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full whitespace-nowrap font-label font-semibold text-xs uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] ${isActive ? 'opacity-80' : 'text-on-surface-variant opacity-60'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Gift Voucher Pinned Row */}
          <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-4 md:p-5 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
              <Gift size={24} fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-display font-semibold text-base md:text-lg text-on-secondary-container">
                  Gift Voucher
                </h3>
                <Pin size={12} className="text-secondary" fill="currentColor" />
              </div>
              <p className="text-xs md:text-sm text-on-secondary-container/70">
                From {formatPrice(1000, business.currency)} · Auto-enabled
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor/menu/voucher')}
              className="px-3 md:px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all flex-shrink-0"
            >
              Configure
            </button>
          </div>

          {/* Product Rows */}
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                currency={business.currency}
                onToggle={() => toggleAvailability(product.id, product.is_available)}
                onClick={() => router.push(`/vendor/menu/product/${product.id}`)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-on-surface-variant">
                No products found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </Shell>
    </main>
  );
}

// ────────────────────────────────────────
// PRODUCT ROW COMPONENT
// ────────────────────────────────────────
function ProductRow({
  product,
  currency,
  onToggle,
  onClick,
}: {
  product: Product;
  currency: string;
  onToggle: () => void;
  onClick: () => void;
}) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer hover:border-primary/40 hover:shadow-organic-sm transition-all ${
        !product.is_available ? 'opacity-60' : ''
      }`}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
        <UtensilsCrossed size={20} className="text-on-surface-variant/40" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-on-surface text-sm md:text-base truncate">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-on-surface-variant">{product.category}</span>
          {product.dietary_tags?.length > 0 &&
            product.dietary_tags.slice(0, 2).map((tag) => {
              const config = dietaryConfig[tag];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}
                >
                  <Icon size={10} className={config.iconColor} />
                  {config.label}
                </span>
              );
            })}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-display font-bold text-on-surface text-sm md:text-base">
          {new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
          }).format(product.price_cents / 100)}
        </p>
      </div>

      <button
        onClick={handleToggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          product.is_available ? 'bg-primary' : 'bg-surface-container-highest'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            product.is_available ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <button
        onClick={(e) => e.stopPropagation()}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
}
