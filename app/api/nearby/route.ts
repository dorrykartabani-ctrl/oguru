// app/api/nearby/route.ts
// Proxies Google Places Nearby Search and merges with Oguru partner data.
// Returns a unified list of pins: Oguru partners (green) + Google places (grey).

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ---- Types ----

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ photo_reference: string }>;
}

interface NearbyResult {
  source: 'oguru' | 'google';
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_accepting_orders: boolean;
  chip_icon: string | null;
  chip_color: string | null;
  neighborhood: string | null;
  // Google-only fields
  google_place_id?: string;
  google_rating?: number;
  google_reviews?: number;
  google_photo_ref?: string;
  // Oguru-only fields
  slug?: string;
  tagline?: string;
}

// ---- Helpers ----

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

/** Haversine distance in meters between two coordinates */
function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Simple name similarity check (case-insensitive, strips punctuation) */
function namesMatch(a: string, b: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const na = normalize(a);
  const nb = normalize(b);
  return na.includes(nb) || nb.includes(na);
}

/** Map Google place types to a chip icon */
function typeToIcon(types: string[]): string {
  if (types.includes('bakery')) return '🥐';
  if (types.includes('cafe')) return '☕';
  if (types.includes('restaurant')) return '🍽️';
  if (types.includes('meal_takeaway')) return '🥡';
  return '📍';
}

// ---- Handler ----

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '-33.8833');
  const lng = parseFloat(searchParams.get('lng') ?? '151.2100');
  const radius = parseInt(searchParams.get('radius') ?? '2000'); // meters
  const query = searchParams.get('q') ?? 'cafe bakery';

  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_PLACES_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch Oguru partners from Supabase (server-side with service key)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: oguruLocations } = await supabase
      .from('locations')
      .select(`
        id,
        name,
        latitude,
        longitude,
        is_accepting_orders,
        neighborhood,
        suburb,
        businesses!inner (
          id,
          trading_name,
          tagline,
          slug,
          chip_icon,
          chip_color,
          status
        )
      `)
      .eq('is_active', true)
      .eq('businesses.status', 'approved')
      .not('latitude', 'is', null);

    const oguruPins: NearbyResult[] = (oguruLocations ?? []).map((row: any) => ({
      source: 'oguru' as const,
      id: row.id,
      name: row.businesses?.trading_name ?? row.name,
      address: '',
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      is_accepting_orders: row.is_accepting_orders ?? false,
      chip_icon: row.businesses?.chip_icon ?? '☕',
      chip_color: row.businesses?.chip_color ?? '#4a6410',
      neighborhood: row.neighborhood ?? row.suburb ?? null,
      slug: row.businesses?.slug ?? undefined,
      tagline: row.businesses?.tagline ?? undefined,
    }));

    // 2. Fetch Google Places
    const googleUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    );
    googleUrl.searchParams.set('location', `${lat},${lng}`);
    googleUrl.searchParams.set('radius', String(radius));
    googleUrl.searchParams.set('type', 'cafe');
    googleUrl.searchParams.set('keyword', query);
    googleUrl.searchParams.set('key', GOOGLE_API_KEY);

    const googleRes = await fetch(googleUrl.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    const googleData = await googleRes.json();
    const googlePlaces: GooglePlace[] = googleData.results ?? [];

    // 3. Deduplicate: remove Google places that overlap with Oguru partners
    const DEDUP_RADIUS_M = 100; // 100m threshold

    const googlePins: NearbyResult[] = googlePlaces
      .filter((place) => {
        const pLat = place.geometry.location.lat;
        const pLng = place.geometry.location.lng;

        // Check if any Oguru partner is within 100m AND has a similar name
        const isDuplicate = oguruPins.some(
          (og) =>
            distanceMeters(pLat, pLng, og.latitude, og.longitude) <
              DEDUP_RADIUS_M && namesMatch(place.name, og.name)
        );

        return !isDuplicate;
      })
      .slice(0, 30) // Limit to 30 Google results
      .map((place) => ({
        source: 'google' as const,
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        is_accepting_orders: false,
        chip_icon: typeToIcon(place.types),
        chip_color: '#9ca3af', // Grey for non-partners
        neighborhood: null,
        google_place_id: place.place_id,
        google_rating: place.rating,
        google_reviews: place.user_ratings_total,
        google_photo_ref: place.photos?.[0]?.photo_reference,
      }));

    // 4. Merge and return
    const allPins: NearbyResult[] = [...oguruPins, ...googlePins];

    return NextResponse.json({
      pins: allPins,
      meta: {
        oguru_count: oguruPins.length,
        google_count: googlePins.length,
        total: allPins.length,
        center: { lat, lng },
        radius_m: radius,
      },
    });
  } catch (err) {
    console.error('[/api/nearby] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch nearby places' },
      { status: 500 }
    );
  }
}
