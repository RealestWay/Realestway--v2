export type PropertyCategory = 'sale' | 'rent';

export type PropertyType =
  | 'Apartment'
  | 'House'
  | 'Duplex'
  | 'Bungalow'
  | 'Penthouse'
  | 'Studio'
  | 'Terrace'
  | 'Mansion'
  | 'Office Space'
  | 'Shop'
  | 'Warehouse'
  | 'Land';

export interface PropertyFeature {
  tag: string;
  value: number | string | boolean;
}

export interface OtherFee {
  tag: string;
  value: number;
}

export interface Media {
  id: number;
  file_url: string;
  mime_type: string;
  size: number;
  ref_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Agent {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  verified: boolean;
  listingCount: number;
  joinedDate: string;
  whatsapp?: string;
  business_name?: string | null;
  business_metadata?: {
    email?: string;
    number?: string;
    address?: string;
    website?: string[];
    categories?: { id: string; localized_display_name: string }[];
    description?: string;
  } | null;
  verified_at?: string | null;
  claimed_at?: string | null;
  username?: string;
  user?: User;
  consent_given?: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  images: string[];
  agent: Agent;
  agent_profile?: Agent;
  phone: string;
  price: number;
  agencyFee?: number;
  cautionFee?: number;
  legalFee?: number;
  inspectionFee?: number;
  otherFees?: OtherFee[];
  features: PropertyFeature[];
  source: 'platform' | 'whatsapp' | 'scraped';
  status: 'active' | 'available' | 'unavailable' | 'draft';
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  property_category?: string;
  rental_duration?: string | null;
  basic_rent?: number;
  media_urls?: string[];
  owner_phone?: string;
  uuid?: string;
  saved?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  media?: Media[];
  is_saved?: boolean;
  is_liked?: boolean;
  likes_count?: number;
  land_size?: string;
  consent_given?: boolean;
}

export interface SearchFilters {
  query: string;
  city?: string;
  state?: string;
  category?: PropertyCategory;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  avatar?: string;
  isAgent: boolean;
  agentId?: string;
  savedProperties: string[];
  searchHistory: string[];
  googleConnected: boolean;
  phone_verified: boolean;
  phoneVerified?: boolean;
  kyc_status: 'unverified' | 'pending' | 'verified';
  uuid?: string;
  role?: string;
  agent_profile?: any;
  profile_picture?: string;
  created_at?: string;
  is_verified?: boolean;
  email_verified?: boolean;
  phone_number?: string;
}
