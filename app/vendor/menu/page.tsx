'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CoffeeIcon,
  XIcon,
  UploadIcon,
  LinkIcon,
  ServerIcon,
  CheckCircleIcon,
} from '@/components/icons';
import { getVendorBusiness, getVendorProducts } from '@/lib/supabase/vendor-queries';
import type { Business, Location, Product } from '@/types/database';

export default function VendorMenuPage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'pos'>('pos');
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // POS State
  const [posSystem, setPosSystem] = useState('');
  const [posUrl, setPosUrl] = useState('');
  const [isSavingPos, setIsSavingPos] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      const { business: biz, location: loc } = await getVendorBusiness();
      if (biz && loc) {
        setBusiness(biz);
        setLocation(loc);
        setPosSystem(loc.pos_system ?? '');
        setPosUrl(loc.pos_preorder_url ?? '');
        const prods = await getVendorProducts(biz.id);
        setProducts(prods);
      }
    }
    loadMenu();
  }, []);

  const savePosSettings = async () => {
    if (!location) return;
    setIsSavingPos(true);
    const supabase = createClient();
    
    await supabase
      .from('locations')
      .update({ pos_system: posSystem, pos_preorder_url: posUrl })
      .eq('id', location.id);
      
    setIsSavingPos(false);
    alert('POS Settings Saved! Customers will now be routed here.');
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] pb-28 font-body md:pb-10">
      <header className="px-5 pt-14 pb-4 md:px-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b1c19]">
          Menu & Pre-orders
        </h1>
        <p className="mt-1 text-sm text-[#44483a]">
          Connect your POS or manage items manually.
        </p>
      </header>

      {/* Tabs */}
      <div className="mx-5 mb-6 flex gap-2 rounded-2xl bg-[#1b1c19]/5 p-1 md:mx-10 md:max-w-md">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 font-label text-xs font-bold transition ${
            activeTab === 'pos' ? 'bg-white text-[#1b1c19] shadow-sm' : 'text-[#44483a]/60'
          }`}
        >
          <ServerIcon className="h-4 w-4" />
          POS Integration
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 font-label text-xs font-bold transition ${
            activeTab === 'manual' ? 'bg-white text-[#1b1c19] shadow-sm' : 'text-[#44483a]/60'
          }`}
        >
          <CoffeeIcon className="h-4 w-4" />
          Manual Editor
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-5 md:px-10">
        {activeTab === 'pos' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* POS Link Configuration */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1b1c19]/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4a6410]/10 text-[#4a6410]">
                <LinkIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#1b1c19]">
                Direct Pre-order Link
              </h2>
              <p className="mt-1 text-xs text-[#44483a]/70">
                Route customers directly from Oguru to your existing Square, Toast, or Lightspeed checkout page.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="font-label text-xs font-bold text-[#44483a]">POS Provider</label>
                  <select
                    value={posSystem}
                    onChange={(e) => setPosSystem(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#fbf9f4] p-3 text-sm outline-none"
                  >
                    <option value="">Select Provider...</option>
                    <option value="Square">Square</option>
                    <option value="Toast">Toast</option>
                    <option value="Lightspeed">Lightspeed</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Other">Other / Custom Link</option>
                  </select>
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-[#44483a]">Live Checkout URL</label>
                  <input
                    type="url"
                    value={posUrl}
                    onChange={(e) => setPosUrl(e.target.value)}
                    placeholder="https://order.toasttab.com/online/your-cafe"
                    className="mt-1 w-full rounded-xl border border-[#1b1c19]/10 bg-[#fbf9f4] p-3 text-sm outline-none"
                  />
                </div>
                <button
                  onClick={savePosSettings}
                  disabled={isSavingPos}
                  className="w-full rounded-xl bg-[#4a6410] py-3 font-label text-xs font-bold text-white transition active:scale-95 disabled:opacity-50"
                >
                  {isSavingPos ? 'Saving...' : 'Save Routing Settings'}
                </button>
              </div>
            </div>

            {/* CSV Upload */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1b1c19]/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#924700]/10 text-[#924700]">
                <UploadIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#1b1c19]">
                Sync Menu Display
              </h2>
              <p className="mt-1 text-xs text-[#44483a]/70">
                Upload your POS item export (CSV) so foodies can browse your menu inside Oguru before clicking your checkout link.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1b1c19]/20 bg-[#fbf9f4] py-10 px-5 text-center transition hover:border-[#4a6410]/40 hover:bg-[#4a6410]/5 cursor-pointer">
                <UploadIcon className="h-8 w-8 text-[#44483a]/40" />
                <p className="mt-3 font-display text-sm font-bold text-[#1b1c19]">
                  Tap to upload CSV
                </p>
                <p className="mt-1 text-[10px] text-[#44483a]/60">
                  Supports Square, Toast, and generic formats.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
           <div className="rounded-3xl bg-white p-6 text-center shadow-sm border border-[#1b1c19]/5">
             <CoffeeIcon className="mx-auto h-12 w-12 text-[#44483a]/30" />
             <p className="mt-4 font-display text-base font-bold text-[#1b1c19]">Manual mode is active</p>
             <p className="mt-1 text-xs text-[#44483a]/70 max-w-sm mx-auto">
               You are currently using Oguru's built-in menu editor. If you configure a POS link, we will automatically disable the manual cart.
             </p>
             {/* Note: The old map-through of products code goes here if you want to keep manual CRUD */}
           </div>
        )}
      </div>
    </main>
  );
}
