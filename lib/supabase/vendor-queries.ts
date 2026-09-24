// lib/supabase/vendor-queries.ts
import { createClient } from '@/lib/supabase/client';
import type {
  Business,
  Product,
  Promotion,
  Punchcard,
  Location,
} from '@/types/database';

const supabase = createClient();

// ============================================================
// 1. FETCH LOGGED-IN VENDOR'S BUSINESS & LOCATION
// ============================================================

export async function getVendorBusiness(): Promise<{
  business: Business | null;
  location: Location | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { business: null, location: null };

  const { data: business, error: bErr } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (bErr || !business) {
    console.error('[vendor-queries] getVendorBusiness error:', bErr?.message);
    return { business: null, location: null };
  }

  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('business_id', business.id)
    .eq('is_primary', true)
    .maybeSingle();

  return { business, location: location ?? null };
}

// ============================================================
// 2. MENU MANAGEMENT (PRODUCTS)
// ============================================================

export async function getVendorProducts(businessId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('[vendor-queries] getVendorProducts error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function toggleProductAvailability(
  productId: string,
  isAvailable: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) {
    console.error('[vendor-queries] toggleProductAvailability error:', error.message);
    return false;
  }
  return true;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('[vendor-queries] createProduct error:', error.message);
    return null;
  }
  return data;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('[vendor-queries] deleteProduct error:', error.message);
    return false;
  }
  return true;
}

// ============================================================
// 3. MARKETING & LOYALTY (PROMOTIONS & PUNCHCARDS)
// ============================================================

export async function getVendorPromotions(businessId: string): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[vendor-queries] getVendorPromotions error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getVendorPunchcards(businessId: string): Promise<Punchcard[]> {
  const { data, error } = await supabase
    .from('punchcards')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[vendor-queries] getVendorPunchcards error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function createPromotion(promo: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'order_count'>): Promise<Promotion | null> {
  const { data, error } = await supabase
    .from('promotions')
    .insert({ ...promo, view_count: 0, order_count: 0 })
    .select()
    .single();

  if (error) {
    console.error('[vendor-queries] createPromotion error:', error.message);
    return null;
  }
  return data;
}

export async function createPunchcard(card: Omit<Punchcard, 'id' | 'created_at' | 'updated_at'>): Promise<Punchcard | null> {
  const { data, error } = await supabase
    .from('punchcards')
    .insert(card)
    .select()
    .single();

  if (error) {
    console.error('[vendor-queries] createPunchcard error:', error.message);
    return null;
  }
  return data;
}
