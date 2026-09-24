// lib/supabase/queries.ts
// Production query layer for Oguru — all Supabase reads go through here.

import { createClient } from '@/lib/supabase/client';
import type {
  VendorCard,
  MapPin,
  Product,
  GiftableProduct,
  PromotionCard,
  Profile,
  VendorDetail,
} from '@/types/database';

const supabase = createClient();

// ============================================================
// 1. APPROVED VENDORS + PRIMARY LOCATIONS (for /home & /explore)
// ============================================================

export async function getApprovedVendorsWithLocations(
  limit = 20
): Promise<VendorCard[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      id,
      trading_name,
      tagline,
      slug,
      logo_url,
      chip_icon,
      chip_color,
      business_types,
      locations!inner (
        id,
        name,
        neighborhood,
        suburb,
        latitude,
        longitude,
        is_accepting_orders,
        is_primary,
        is_active
      )
    `)
    .eq('status', 'approved')
    .eq('locations.is_primary', true)
    .eq('locations.is_active', true)
    .order('profile_completion_pct', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[queries] getApprovedVendorsWithLocations:', error.message);
    return [];
  }

  // Flatten the nested locations array into a single VendorCard per row
  return (data ?? []).map((row: any) => {
    const loc = row.locations?.[0];
    return {
      id: row.id,
      trading_name: row.trading_name,
      tagline: row.tagline,
      slug: row.slug,
      logo_url: row.logo_url,
      chip_icon: row.chip_icon,
      chip_color: row.chip_color,
      business_types: row.business_types ?? [],
      location_id: loc?.id ?? '',
      location_name: loc?.name ?? '',
      neighborhood: loc?.neighborhood ?? null,
      suburb: loc?.suburb ?? null,
      latitude: loc?.latitude ? Number(loc.latitude) : null,
      longitude: loc?.longitude ? Number(loc.longitude) : null,
      is_accepting_orders: loc?.is_accepting_orders ?? false,
    };
  });
}
/** Fetch vendors matched to a customer's onboarding keywords */
export async function getPersonalizedVendors(
  userId: string,
  limit = 10
): Promise<VendorCard[]> {
  const { data, error } = await supabase.rpc('get_personalized_vendors', {
    target_user_id: userId,
    result_limit: limit,
  });

  if (error || !data || data.length === 0) {
    // Fall back to default approved vendors if no keyword match exists yet
    return getApprovedVendorsWithLocations(limit);
  }

  return data.map((row: any) => ({
    id: row.business_id,
    trading_name: row.trading_name,
    tagline: row.tagline,
    slug: row.slug,
    logo_url: row.logo_url,
    chip_icon: row.chip_icon,
    chip_color: row.chip_color,
    business_types: row.business_types ?? [],
    location_id: '',
    location_name: '',
    neighborhood: null,
    suburb: null,
    latitude: null,
    longitude: null,
    is_accepting_orders: true,
  }));
}
// ============================================================
// 2. MAP PINS (lightweight for /explore Leaflet rendering)
// ============================================================

export async function getMapPins(): Promise<MapPin[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      id,
      business_id,
      name,
      latitude,
      longitude,
      is_accepting_orders,
      neighborhood,
      suburb,
      businesses!inner (
        id,
        trading_name,
        chip_icon,
        chip_color,
        status
      )
    `)
    .eq('is_active', true)
    .eq('businesses.status', 'approved')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    console.error('[queries] getMapPins:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    location_id: row.id,
    business_id: row.business_id,
    trading_name: row.businesses?.trading_name ?? 'Unknown',
    chip_icon: row.businesses?.chip_icon ?? null,
    chip_color: row.businesses?.chip_color ?? null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    is_accepting_orders: row.is_accepting_orders ?? false,
    neighborhood: row.neighborhood ?? null,
    suburb: row.suburb ?? null,
  }));
}

// ============================================================
// 3. SEARCH VENDORS (full-text across multiple tables)
// ============================================================

export async function searchVendors(query: string): Promise<VendorCard[]> {
  if (!query.trim()) return getApprovedVendorsWithLocations();

  const ilike = `%${query.trim()}%`;

  // Primary search: business name, tagline, description
  const { data: businessResults, error: bErr } = await supabase
    .from('businesses')
    .select(`
      id,
      trading_name,
      tagline,
      slug,
      logo_url,
      chip_icon,
      chip_color,
      business_types,
      locations!inner (
        id, name, neighborhood, suburb,
        latitude, longitude, is_accepting_orders,
        is_primary, is_active
      )
    `)
    .eq('status', 'approved')
    .eq('locations.is_primary', true)
    .eq('locations.is_active', true)
    .or(
      `trading_name.ilike.${ilike},tagline.ilike.${ilike},description.ilike.${ilike}`
    )
    .limit(20);

  if (bErr) {
    console.error('[queries] searchVendors (business):', bErr.message);
  }

  // Secondary search: location name, neighborhood, suburb
  const { data: locationResults, error: lErr } = await supabase
    .from('locations')
    .select(`
      id, name, neighborhood, suburb,
      latitude, longitude, is_accepting_orders, is_primary, is_active,
      businesses!inner (
        id, trading_name, tagline, slug, logo_url,
        chip_icon, chip_color, business_types, status
      )
    `)
    .eq('is_active', true)
    .eq('is_primary', true)
    .eq('businesses.status', 'approved')
    .or(`name.ilike.${ilike},neighborhood.ilike.${ilike},suburb.ilike.${ilike}`)
    .limit(20);

  if (lErr) {
    console.error('[queries] searchVendors (location):', lErr.message);
  }

  // Tertiary search: vendor_keywords
  const { data: keywordResults, error: kErr } = await supabase
    .from('vendor_keywords')
    .select(`
      business_id,
      businesses!inner (
        id, trading_name, tagline, slug, logo_url,
        chip_icon, chip_color, business_types, status,
        locations!inner (
          id, name, neighborhood, suburb,
          latitude, longitude, is_accepting_orders,
          is_primary, is_active
        )
      )
    `)
    .ilike('keyword', ilike)
    .eq('businesses.status', 'approved')
    .limit(20);

  if (kErr) {
    console.error('[queries] searchVendors (keywords):', kErr.message);
  }

  // Merge and deduplicate by business ID
  const seen = new Set<string>();
  const merged: VendorCard[] = [];

  const flatten = (rows: any[], source: 'business' | 'location' | 'keyword') => {
    for (const row of rows ?? []) {
      let biz: any, loc: any;

      if (source === 'business') {
        biz = row;
        loc = row.locations?.[0];
      } else if (source === 'location') {
        biz = row.businesses;
        loc = row;
      } else {
        biz = row.businesses;
        loc = biz?.locations?.[0];
      }

      if (!biz || !loc || seen.has(biz.id)) continue;
      seen.add(biz.id);

      merged.push({
        id: biz.id,
        trading_name: biz.trading_name,
        tagline: biz.tagline,
        slug: biz.slug,
        logo_url: biz.logo_url,
        chip_icon: biz.chip_icon,
        chip_color: biz.chip_color,
        business_types: biz.business_types ?? [],
        location_id: loc.id,
        location_name: loc.name,
        neighborhood: loc.neighborhood ?? null,
        suburb: loc.suburb ?? null,
        latitude: loc.latitude ? Number(loc.latitude) : null,
        longitude: loc.longitude ? Number(loc.longitude) : null,
        is_accepting_orders: loc.is_accepting_orders ?? false,
      });
    }
  };

  flatten(businessResults ?? [], 'business');
  flatten(locationResults ?? [], 'location');
  flatten(keywordResults ?? [], 'keyword');

  return merged;
}

// ============================================================
// 4. PRODUCTS BY LOCATION (for menu screens)
// ============================================================

export async function getProductsByLocation(
  locationId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('location_id', locationId)
    .eq('is_available', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('[queries] getProductsByLocation:', error.message);
    return [];
  }

  return data ?? [];
}

// ============================================================
// 5. GIFTABLE PRODUCTS (for /gifts treat picker)
// ============================================================

export async function getGiftableProducts(
  limit = 30
): Promise<GiftableProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses!inner (
        trading_name, slug, logo_url, chip_icon
      ),
      location:locations!inner (
        name
      )
    `)
    .eq('is_giftable', true)
    .eq('is_available', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[queries] getGiftableProducts:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    ...row,
    business: row.business,
    location_name: row.location?.name ?? '',
  }));
}

// ============================================================
// 6. ACTIVE PROMOTIONS (for /home hot deals section)
// ============================================================

export async function getActivePromotions(
  limit = 10
): Promise<PromotionCard[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select(`
      *,
      business:businesses!inner (
        trading_name, slug, chip_icon, chip_color
      ),
      location:locations!inner (
        name
      )
    `)
    .eq('is_active', true)
    .or('ends_at.is.null,ends_at.gt.now()')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[queries] getActivePromotions:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    ...row,
    business: row.business,
    location_name: row.location?.name ?? '',
  }));
}

// ============================================================
// 7. USER PROFILE (for /profile)
// ============================================================

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[queries] getUserProfile:', error.message);
    return null;
  }

  return data;
}

// ============================================================
// 8. VENDOR DETAIL BY SLUG (for future /vendor/[slug] page)
// ============================================================

export async function getVendorBySlug(
  slug: string
): Promise<VendorDetail | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      locations (
        *,
        opening_hours (*)
      ),
      products (
        *
      ),
      active_promotions:promotions (
        *
      ),
      active_punchcards:punchcards (
        *
      )
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error) {
    console.error('[queries] getVendorBySlug:', error.message);
    return null;
  }

  return data as unknown as VendorDetail;
}

// ============================================================
// 9. NEARBY VENDORS (Haversine distance — no PostGIS needed)
// ============================================================

export async function getNearbyVendors(
  lat: number,
  lng: number,
  radiusKm = 5,
  limit = 20
): Promise<VendorCard[]> {
  // Haversine formula in plain SQL (works without PostGIS extension)
  const { data, error } = await supabase.rpc('get_nearby_vendors', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    result_limit: limit,
  });

  // If the RPC function doesn't exist yet, fall back to the basic query
  if (error) {
    console.warn(
      '[queries] getNearbyVendors RPC not found, falling back to basic query:',
      error.message
    );
    return getApprovedVendorsWithLocations(limit);
  }

  return (data ?? []).map((row: any) => ({
    id: row.business_id,
    trading_name: row.trading_name,
    tagline: row.tagline,
    slug: row.slug,
    logo_url: row.logo_url,
    chip_icon: row.chip_icon,
    chip_color: row.chip_color,
    business_types: row.business_types ?? [],
    location_id: row.location_id,
    location_name: row.location_name,
    neighborhood: row.neighborhood ?? null,
    suburb: row.suburb ?? null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    is_accepting_orders: row.is_accepting_orders ?? false,
    distance_km: Number(row.distance_km),
  }));
}
