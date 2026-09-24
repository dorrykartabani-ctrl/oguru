// types/database.ts
// Auto-mapped from Supabase public schema — Oguru

export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type UserRole = 'customer' | 'vendor';

export interface Profile {
  id: string; // UUID, references auth.users
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  legal_name: string;
  trading_name: string | null;
  registration_number: string;
  owner_full_name: string;
  owner_role: string;
  owner_email: string;
  owner_phone: string;
  business_email: string;
  business_phone: string;
  country_code: string;
  currency: string;
  timezone: string;
  status: BusinessStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  verification_doc_url: string | null;
  verification_doc_name: string | null;
  description: string | null;
  story: string | null;
  tagline: string | null;
  business_types: string[];
  logo_url: string | null;
  cover_url: string | null;
  gallery_urls: string[];
  chip_icon: string | null;
  chip_color: string | null;
  instagram_handle: string | null;
  facebook_url: string | null;
  tiktok_handle: string | null;
  website_url: string | null;
  google_business_url: string | null;
  profile_completion_pct: number;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  business_id: string;
  name: string;
  is_primary: boolean;
  address_line_1: string;
  address_line_2: string | null;
  suburb: string | null;
  city: string;
  state: string | null;
  postcode: string;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  business_type: string | null;
  location_phone: string | null;
  location_email: string | null;
  opening_hours: Record<string, unknown>;
  is_active: boolean;
  is_accepting_orders: boolean;
  pos_system: string | null;
  pos_synced_at: string | null;
  neighborhood: string | null;
  access_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  id: string;
  location_id: string;
  day_of_week: number; // 0=Sun, 1=Mon ... 6=Sat
  opens_at: string | null; // "HH:MM:SS"
  closes_at: string | null;
  is_closed: boolean;
  shift_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  location_id: string;
  business_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  is_giftable: boolean;
  dietary_tags: string[];
  pos_item_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerKeyword {
  id: string;
  user_id: string;
  keyword: string;
  weight: number;
  created_at: string;
}

// ---- Composite / Joined Types (for UI consumption) ----

export interface VendorWithLocation extends Business {
  locations: Location[];
}

export interface VendorCard {
  id: string;
  trading_name: string;
  tagline: string | null;
  slug: string | null;
  logo_url: string | null;
  chip_icon: string | null;
  chip_color: string | null;
  business_types: string[];
  location_name: string;
  neighborhood: string | null;
  suburb: string | null;
  latitude: number | null;
  longitude: number | null;
  is_accepting_orders: boolean;
  distance_meters?: number; // computed at query time
}

export interface ProductWithVendor extends Product {
  business: Pick<Business, 'trading_name' | 'slug' | 'logo_url'>;
  location: Pick<Location, 'name' | 'neighborhood'>;
}
