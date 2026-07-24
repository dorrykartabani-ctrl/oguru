export type BusinessStatus =
  | 'draft'
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'suspended'
  | 'rejected';

export type UserRole = 'customer' | 'vendor' | 'admin';

export type PosSystem =
  | 'square'
  | 'toast'
  | 'lightspeed'
  | 'clover'
  | 'kounta'
  | 'vend'
  | 'zeller'
  | 'other'
  | null;

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  owner_id: string;

  // Identity (from application)
  legal_name: string;
  trading_name: string | null;
  registration_number: string;
  slug: string | null;

  // Owner contact (from application)
  owner_full_name: string;
  owner_role: string;
  owner_email: string;
  owner_phone: string;

  // Business contact (from application)
  business_email: string;
  business_phone: string;

  // Country & currency (from application)
  country_code: string;
  currency: string;
  timezone: string;

  // Application & approval
  status: BusinessStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  verification_doc_url: string | null;
  verification_doc_name: string | null;

  // Profile fields (added later)
  description: string | null;
  story: string | null;
  tagline: string | null;
  business_types: string[];

  // Photos
  logo_url: string | null;
  cover_url: string | null;
  gallery_urls: string[];

  // Chip / visual identity
  chip_icon: string | null;
  chip_color: string | null;

  // Social & web
  instagram_handle: string | null;
  facebook_url: string | null;
  tiktok_handle: string | null;
  website_url: string | null;
  google_business_url: string | null;

  // Profile completion tracking
  profile_completion_pct: number;

  // Metadata
  created_at: string;
  updated_at: string;
};

export type Location = {
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
  pos_system: PosSystem;
  pos_synced_at: string | null;
  neighborhood: string | null;
  access_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
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
};

export type OpeningHours = {
  id: string;
  location_id: string;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
  shift_order: number;
  created_at: string;
  updated_at: string;
};

export type VendorKeyword = {
  id: string;
  business_id: string;
  keyword: string;
  category: string;
  created_at: string;
};

export type CustomerKeyword = {
  id: string;
  user_id: string;
  keyword: string;
  weight: number;
  created_at: string;
};

export type WaitlistSignup = {
  id: string;
  email: string;
  country_code: string;
  business_name: string | null;
  business_type: string | null;
  notes: string | null;
  created_at: string;
};
