'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CoffeeIcon,
  CheckCircleIcon,
  XIcon,
  SparklesIcon,
  ArrowRight,
  HomeIcon,
  UserCircleIcon,
} from '@/components/icons';
import {
  getVendorBusiness,
  getVendorProducts,
  toggleProductAvailability,
  createProduct,
  deleteProduct,
} from '@/lib/supabase/vendor-queries';
import type { Business, Product, Location } from '@/types/database';

export default function VendorMenuPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceDollars, setPriceDollars] = useState('5.50');
  const [category, setCategory] = useState('Coffee');
  const [isGiftable, setIsGiftable] = useState(true);
  const [dietaryTags, setDietaryTags] = useState<string[]>(['vegetarian']);

  useEffect(() => {
    async function loadMenu() {
      try {
        const { business: biz, location: loc } = await getVendorBusiness();
        if (biz) {
          setBusiness(biz);
          setLocation(loc);
          const prods = await getVendorProducts(biz.id);
          setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const handleToggle = async (productId: string, current: boolean) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_available: !current } : p))
    );
    await toggleProductAvailability(productId, !current);
  };

  const handleDelete = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await deleteProduct(productId);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !location) return;

    const priceCents = Math.round(parseFloat(priceDollars) * 100);

    const newProd = await createProduct({
      business_id: business.id,
      location_id: location.id,
      name,
      description,
      price_cents: priceCents,
      category,
      is_available: true,
      is_giftable: isGiftable,
      dietary_tags: dietaryTags,
      image_url: null,
      pos_item_id: null,
      sort_order: products.length + 1,
    });

    if (newProd) {
      setProducts((prev) => [...prev, newProd]);
      setShowAddModal(false);
      setName('');
      setDescription('');
    }
  };

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body md:pb-10">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-14 pb-4 md:px-10">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
            Menu Management
          </h1>
          <p className="mt-1 text-sm text-[#44483a]">
            {products.length} items total · Live pre-order catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#4a6410] px-4 py-2.5 font-label text-xs font-bold text-white shadow-sm transition active:scale-95"
        >
          + Add Item
        </button>
      </header>

      {/* Menu Categories */}
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        {loading ? (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#1b1c19]/5" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-12 text-center">
            <CoffeeIcon className="mx-auto h-12 w-12 text-[#44483a]/30" />
            <p className="mt-3 font-display text-base font-semibold text-[#1b1c19]">
              Your menu is empty
            </p>
            <p className="mt-1 text-xs text-[#44483a]">
              Add your signature coffee or bakes to start receiving pre-orders.
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <section key={cat} className="mt-8">
              <h2 className="font-display text-lg font-bold text-[#1b1c19] border-b border-[#1b1c19]/10 pb-2">
                {cat}
              </h2>
              <ul className="mt-3 space-y-3">
                {products
                  .filter((p) => p.category === cat)
                  .map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base font-bold text-[#1b1c19]">
                            {product.name}
                          </p>
                          {product.is_giftable && (
                            <span className="rounded-full bg-[#fed3c7] px-2 py-0.5 font-label text-[9px] font-bold text-[#77574d]">
                              Giftable 🎁
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-0.5 truncate text-xs text-[#44483a]/70">
                            {product.description}
                          </p>
                        )}
                        <p className="mt-1 font-display text-sm font-bold text-[#4a6410]">
                          ${(product.price_cents / 100).toFixed(2)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Availability Toggle */}
                        <button
                          onClick={() => handleToggle(product.id, product.is_available)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            product.is_available ? 'bg-[#4a6410]' : 'bg-[#1b1c19]/15'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              product.is_available ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-[#44483a]/30 hover:text-red-600 transition"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">
          <form
            onSubmit={handleAddProduct}
            className="w-full max-w-md rounded-3xl bg-[#fbf9f4] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#1b1c19]">
                Add Menu Item
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <XIcon className="h-5 w-5 text-[#44483a]" />
              </button>
            </div>

            <div>
              <label className="font-label text-xs font-bold text-[#44483a]">Item Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cardamom Bun"
                className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-white p-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="font-label text-xs font-bold text-[#44483a]">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Laminated, pearl sugar crust"
                className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-white p-3 text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label text-xs font-bold text-[#44483a]">Price ($)</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  value={priceDollars}
                  onChange={(e) => setPriceDollars(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-white p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="font-label text-xs font-bold text-[#44483a]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-white p-3 text-sm outline-none"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Pastry">Pastry</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Breakfast">Breakfast</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white p-3">
              <span className="font-label text-xs font-semibold text-[#1b1c19]">
                Enable Social Gifting 🎁
              </span>
              <input
                type="checkbox"
                checked={isGiftable}
                onChange={(e) => setIsGiftable(e.target.checked)}
                className="h-4 w-4 rounded accent-[#4a6410]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4a6410] py-3.5 font-label text-xs font-bold text-white shadow-sm transition active:scale-98"
            >
              Save to Menu
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
