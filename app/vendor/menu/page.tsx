'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: false, href: '/vendor/dashboard' },
  { icon: BarChart3, label: 'Insights', active: false, href: '#' },
  { icon: UtensilsCrossed, label: 'Menu', active: true, href: '/vendor/menu' },
  { icon: Megaphone, label: 'Marketing', active: false, href: '#' },
  { icon: MoreHorizontal, label: 'More', active: false, href: '#' },
];

const categories = [
  { name: 'All', count: 47 },
  { name: 'Hot Drinks', count: 12 },
  { name: 'Cold Drinks', count: 8 },
  { name: 'Food', count: 15 },
  { name: 'Bakery', count: 7 },
  { name: 'Gifts', count: 5 },
];

type DietaryTag = 'vegan' | 'gf' | 'dairy-free' | 'nut-warning';

const dietaryConfig: Record<
  DietaryTag,
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  dietary: DietaryTag[];
};

const products: Product[] = [
  {
    id: '1',
    name: 'Oat Milk Flat White',
    category: 'Hot Drinks',
    price: 4.5,
    available: true,
    dietary: ['vegan'],
  },
  {
    id: '2',
    name: 'Matcha Latte',
    category: 'Hot Drinks',
    price: 4.8,
    available: true,
    dietary: ['vegan'],
  },
  {
    id: '3',
    name: 'Iced Americano',
    category: 'Cold Drinks',
    price: 3.8,
    available: false,
    dietary: [],
  },
  {
    id: '4',
    name: 'Sourdough Toast',
    category: 'Food',
    price: 6.5,
    available: true,
    dietary: ['gf'],
  },
  {
    id: '5',
    name: 'Almond Croissant',
    category: 'Bakery',
    price: 3.2,
    available: true,
    dietary: ['nut-warning'],
  },
  {
    id: '6',
    name: 'Cold Brew',
    category: 'Cold Drinks',
    price: 4.2,
    available: true,
    dietary: ['vegan'],
  },
  {
    id: '7',
    name: 'Avocado Smash',
    category: 'Food',
    price: 8.5,
    available: true,
    dietary: ['vegan', 'gf'],
  },
];

export default function VendorMenuListPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState(products);

  const filteredProducts = productList.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAvailability = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface pb-24 md:pb-8">
      {/* Top App Bar — mobile only */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="OGuru" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="font-display text-lg font-bold text-primary">
            Café Artisan
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary-container" />
        </button>
      </header>

      {/* Side Navigation — tablet + desktop */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-4 bg-surface-container-low border-r border-outline-variant w-64 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="OGuru" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-base text-primary font-bold leading-tight">
              Café Artisan
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

        <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
            SM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Sarah Miller</p>
            <p className="text-xs text-on-surface-variant truncate">Owner</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface leading-tight tracking-tight">
              Menu
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {productList.length} products · Last synced with Square 3 min ago
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
          {/* Search */}
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

          {/* Filter buttons + view toggle */}
          <div className="flex gap-2">
            {/* Availability filter */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm hover:bg-surface-container transition-colors">
              <span>All availability</span>
              <ChevronDown size={14} />
            </button>

            {/* Dietary filter */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm hover:bg-surface-container transition-colors">
              <SlidersHorizontal size={14} />
              <span>Dietary</span>
            </button>

            {/* Mobile all-filters button */}
            <button className="md:hidden flex items-center justify-center w-10 h-10 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <SlidersHorizontal size={18} className="text-on-surface-variant" />
            </button>

            {/* View toggle */}
            <div className="flex bg-surface-container-high p-1 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-surface-container-lowest shadow-sm text-primary'
                    : 'text-on-surface-variant'
                }`}
                aria-label="List view"
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
                aria-label="Grid view"
              >
                <Grid3x3 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => {
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
                <span
                  className={`text-[10px] ${
                    isActive
                      ? 'opacity-80'
                      : 'text-on-surface-variant opacity-60'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pinned Gift Voucher */}
        <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-4 md:p-5 flex items-center gap-4 mb-4 hover:bg-secondary-container/50 transition-colors">
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
              From £10 · Auto-enabled · Redeemable at checkout
            </p>
          </div>

          <button
            onClick={() => router.push('/vendor/menu/voucher')}
            className="px-3 md:px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all flex-shrink-0"
          >
            Configure
          </button>
        </div>

        {/* Product List or Grid */}
        {viewMode === 'list' ? (
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <ProductListRow
                key={product.id}
                product={product}
                onToggle={() => toggleAvailability(product.id)}
                onClick={() =>
                  router.push(`/vendor/menu/product/${product.id}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductGridCard
                key={product.id}
                product={product}
                onToggle={() => toggleAvailability(product.id)}
                onClick={() =>
                  router.push(`/vendor/menu/product/${product.id}`)
                }
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-on-surface-variant">
              No products found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

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
    </main>
  );
}

// ────────────────────────────────────────
// PRODUCT ROW COMPONENT (List View)
// ────────────────────────────────────────
function ProductListRow({
  product,
  onToggle,
  onClick,
}: {
  product: Product;
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
        !product.available ? 'opacity-60' : ''
      }`}
    >
      {/* Placeholder image */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
        <UtensilsCrossed size={20} className="text-on-surface-variant/40" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-on-surface text-sm md:text-base truncate">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-on-surface-variant">
            {product.category}
          </span>
          {product.dietary.length > 0 &&
            product.dietary.map((tag) => {
              const config = dietaryConfig[tag];
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

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-display font-bold text-on-surface text-sm md:text-base">
          £{product.price.toFixed(2)}
        </p>
      </div>

      {/* Availability toggle */}
      <button
        onClick={handleToggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          product.available ? 'bg-primary' : 'bg-surface-container-highest'
        }`}
        aria-label={product.available ? 'Available' : 'Out of stock'}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            product.available ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      {/* Menu button */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
        aria-label="More actions"
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
}

// ────────────────────────────────────────
// PRODUCT CARD COMPONENT (Grid View)
// ────────────────────────────────────────
function ProductGridCard({
  product,
  onToggle,
  onClick,
}: {
  product: Product;
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
      className={`bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-organic transition-all group ${
        !product.available ? 'opacity-60' : ''
      }`}
    >
      {/* Image area */}
      <div className="relative h-32 md:h-36 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <UtensilsCrossed size={32} className="text-on-surface-variant/30" />
        {!product.available && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-full text-[9px] font-label font-bold uppercase tracking-wider">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-display font-semibold text-on-surface text-sm leading-tight flex-1 pr-2">
            {product.name}
          </h4>
          <p className="font-display font-bold text-primary text-sm">
            £{product.price.toFixed(2)}
          </p>
        </div>

        <p className="text-xs text-on-surface-variant mb-2">
          {product.category}
        </p>

        {product.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.dietary.slice(0, 2).map((tag) => {
              const config = dietaryConfig[tag];
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-label font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}
                >
                  {config.label}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
          <button
            onClick={handleToggle}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              product.available ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                product.available ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
