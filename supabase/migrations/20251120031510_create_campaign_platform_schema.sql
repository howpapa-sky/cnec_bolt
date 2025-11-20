/*
  # Campaign Management Platform Schema

  ## Overview
  Complete database schema for a campaign management platform with three user roles:
  - Super Admin (platform management)
  - Brand Admin (company/brand management)
  - Creator Admin (influencer/creator management)

  ## New Tables

  ### 1. profiles
  Extends Supabase auth.users with role and profile information
  - `id` (uuid, FK to auth.users)
  - `role` (enum: super_admin, brand_admin, creator_admin)
  - `full_name` (text)
  - `company_name` (text, nullable - for brands)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. brands
  Brand/company information
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `brand_name` (text)
  - `description` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. categories
  Product categories with hierarchical structure
  - `id` (uuid, PK)
  - `parent_id` (uuid, FK to categories, nullable)
  - `name` (text)
  - `created_at` (timestamptz)

  ### 4. campaigns
  Campaign information
  - `id` (uuid, PK)
  - `brand_id` (uuid, FK to brands)
  - `status` (enum: draft, active, completed, cancelled)
  - `brand_description` (text)
  - `recruitment_start` (date)
  - `recruitment_end` (date)
  - `selection_start` (date)
  - `selection_end` (date)
  - `shipping_date` (date)
  - `content_start` (date)
  - `content_end` (date)
  - `delivery_service` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. products
  Product information for campaigns
  - `id` (uuid, PK)
  - `campaign_id` (uuid, FK to campaigns)
  - `product_name` (text)
  - `product_url` (text)
  - `retail_price` (integer)
  - `category_id` (uuid, FK to categories)
  - `subcategory_id` (uuid, FK to categories)
  - `quantity` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. product_colors
  Color variants for products
  - `id` (uuid, PK)
  - `product_id` (uuid, FK to products)
  - `color_code` (text)
  - `color_name` (text)
  - `thumbnail_image_url` (text)
  - `quantity` (integer)
  - `created_at` (timestamptz)

  ### 7. product_images
  Detailed product images
  - `id` (uuid, PK)
  - `product_id` (uuid, FK to products)
  - `image_url` (text)
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### 8. campaign_pricing
  Pricing structure for campaigns
  - `id` (uuid, PK)
  - `campaign_id` (uuid, FK to campaigns)
  - `base_price` (integer)
  - `allow_higher_tier` (boolean)
  - `higher_tier_price` (integer, nullable)
  - `product_quantity` (integer)
  - `total_budget` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. applications
  Creator applications to campaigns
  - `id` (uuid, PK)
  - `campaign_id` (uuid, FK to campaigns)
  - `creator_id` (uuid, FK to profiles)
  - `status` (enum: pending, approved, rejected)
  - `applied_at` (timestamptz)
  - `reviewed_at` (timestamptz, nullable)

  ## Security
  - RLS enabled on all tables
  - Policies for role-based access control
  - Super admins have full access
  - Brand admins can manage their own campaigns
  - Creator admins can view campaigns and manage applications
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'brand_admin', 'creator_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'creator_admin',
  full_name text NOT NULL,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  status campaign_status DEFAULT 'draft',
  brand_description text DEFAULT '',
  recruitment_start date,
  recruitment_end date,
  selection_start date,
  selection_end date,
  shipping_date date,
  content_start date,
  content_end date,
  delivery_service text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  product_url text NOT NULL,
  retail_price integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  subcategory_id uuid REFERENCES categories(id),
  quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Product colors table
CREATE TABLE IF NOT EXISTS product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color_code text NOT NULL,
  color_name text NOT NULL,
  thumbnail_image_url text NOT NULL,
  quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Campaign pricing table
CREATE TABLE IF NOT EXISTS campaign_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  base_price integer NOT NULL DEFAULT 0,
  allow_higher_tier boolean DEFAULT false,
  higher_tier_price integer,
  product_quantity integer DEFAULT 0,
  total_budget integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_pricing ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Brands policies
CREATE POLICY "Brand admins can view own brands"
  ON brands FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Brand admins can create brands"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Brand admins can update own brands"
  ON brands FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Categories policies
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Campaigns policies
CREATE POLICY "Everyone can view active campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (
    status = 'active' OR
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = campaigns.brand_id
      AND brands.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Brand admins can create campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand admins can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = campaigns.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = campaigns.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Products policies
CREATE POLICY "Users can view campaign products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = products.campaign_id
      AND (
        campaigns.status = 'active' OR
        EXISTS (
          SELECT 1 FROM brands
          WHERE brands.id = campaigns.brand_id
          AND brands.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Brand admins can manage campaign products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = products.campaign_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = products.campaign_id
      AND brands.user_id = auth.uid()
    )
  );

-- Product colors policies
CREATE POLICY "Users can view product colors"
  ON product_colors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      WHERE products.id = product_colors.product_id
      AND campaigns.status = 'active'
    )
  );

CREATE POLICY "Brand admins can manage product colors"
  ON product_colors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE products.id = product_colors.product_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE products.id = product_colors.product_id
      AND brands.user_id = auth.uid()
    )
  );

-- Product images policies
CREATE POLICY "Users can view product images"
  ON product_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      WHERE products.id = product_images.product_id
      AND campaigns.status = 'active'
    )
  );

CREATE POLICY "Brand admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE products.id = product_images.product_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      JOIN campaigns ON campaigns.id = products.campaign_id
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE products.id = product_images.product_id
      AND brands.user_id = auth.uid()
    )
  );

-- Campaign pricing policies
CREATE POLICY "Users can view campaign pricing"
  ON campaign_pricing FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_pricing.campaign_id
      AND campaigns.status = 'active'
    )
  );

CREATE POLICY "Brand admins can manage campaign pricing"
  ON campaign_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = campaign_pricing.campaign_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = campaign_pricing.campaign_id
      AND brands.user_id = auth.uid()
    )
  );

-- Applications policies
CREATE POLICY "Creators can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = applications.campaign_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Brand admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = applications.campaign_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = applications.campaign_id
      AND brands.user_id = auth.uid()
    )
  );

-- Insert sample categories
INSERT INTO categories (name, parent_id) VALUES
  ('뷰티', NULL),
  ('패션', NULL),
  ('라이프스타일', NULL),
  ('식품', NULL),
  ('전자기기', NULL)
ON CONFLICT DO NOTHING;
