import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'super_admin' | 'brand_admin' | 'creator_admin';
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  brand_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  status: CampaignStatus;
  brand_description: string;
  recruitment_start?: string;
  recruitment_end?: string;
  selection_start?: string;
  selection_end?: string;
  shipping_date?: string;
  content_start?: string;
  content_end?: string;
  delivery_service?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  campaign_id: string;
  product_name: string;
  product_url: string;
  retail_price: number;
  category_id?: string;
  subcategory_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductColor {
  id: string;
  product_id: string;
  color_code: string;
  color_name: string;
  thumbnail_image_url: string;
  quantity: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface CampaignPricing {
  id: string;
  campaign_id: string;
  base_price: number;
  allow_higher_tier: boolean;
  higher_tier_price?: number;
  product_quantity: number;
  total_budget: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: ApplicationStatus;
  applied_at: string;
  reviewed_at?: string;
}
