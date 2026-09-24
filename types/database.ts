// types/database.ts
// Complete Oguru database schema — mapped from Supabase public schema

// ============================================================
// ENUMS
// ============================================================

export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type UserRole = 'customer' | 'vendor';
export type PromotionType =
  | 'percentage_off'
  | 'fixed_amount_off'
  | 'buy_x_get_y'
  | 'free_item'
  | 'flash_sale';

// ============================================================
// CORE TABLES
// ============================================================

export interface Profile {
  id: string;
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
  pos_preorder_url: string | null;
  neighborhood: string | null;
  access_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  id: string;
  location_id: string;
  day_of_week: number;
  opens_at: string | null;
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

// ============================================================
// SEARCH & DISCOVERY
// ============================================================

export interface CustomerKeyword {
  id: string;
  user_id: string;
  keyword: string;
  weight: number;
  created_at: string;
}

export interface VendorKeyword {
  id: string;
  business_id: string;
  keyword: string;
  category: string | null;
  created_at: string;
}

// ============================================================
// MARKETING & LOYALTY
// ============================================================

export interface Promotion {
  id: string;
  business_id: string;
  location_id: string;
  title: string;
  description: string | null;
  promotion_type: PromotionType;
  original_price_cents: number | null;
  sale_price_cents: number | null;
  discount_percentage: number | null;
  discount_amount_cents: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  emoji: string | null;
  is_featured: boolean;
  view_count: number;
  order_count: number;
  created_at: string;
  updated_at: string;
}

export interface Punchcard {
  id: string;
  business_id: string;
  location_id: string | null;
  title: string;
  description: string | null;
  item_scope: string | null;
  eligible_product_ids: string[];
  punches_required: number;
  reward_description: string;
  emoji: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PunchcardMember {
  id: string;
  punchcard_id: string;
  business_id: string;
  customer_phone: string;
  customer_name: string | null;
  punches_count: number;
  rewards_redeemed: number;
  last_punch_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WaitlistSignup {
  id: string;
  email: string;
  country_code: string;
  business_name: string | null;
  business_type: string | null;
  notes: string | null;
  created_at: string;
}

// ============================================================
// COMPOSITE / UI-READY TYPES
// ============================================================

export interface VendorCard {
  id: string;
  trading_name: string;
  tagline: string | null;
  slug: string | null;
  logo_url: string | null;
  chip_icon: string | null;
  chip_color: string | null;
  business_types: string[];
  location_id: string;
  location_name: string;
  neighborhood: string | null;
  suburb: string | null;
  latitude: number | null;
  longitude: number | null;
  is_accepting_orders: boolean;
  distance_km?: number;
}

export interface VendorDetail extends Business {
  locations: (Location & { opening_hours: OpeningHours[] })[];
  products: Product[];
  active_promotions: Promotion[];
  active_punchcards: Punchcard[];
}

export interface MapPin {
  location_id: string;
  business_id: string;
  trading_name: string;
  chip_icon: string | null;
  chip_color: string | null;
  latitude: number;
  longitude: number;
  is_accepting_orders: boolean;
  neighborhood: string | null;
  suburb: string | null;
}

export interface GiftableProduct extends Product {
  business: Pick<Business, 'trading_name' | 'slug' | 'logo_url' | 'chip_icon'>;
  location_name: string;
}

export interface PromotionCard extends Promotion {
  business: Pick<Business, 'trading_name' | 'slug' | 'chip_icon' | 'chip_color'>;
  location_name: string;
}
