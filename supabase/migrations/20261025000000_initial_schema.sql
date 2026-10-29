-- ==============================================================================
-- KHAN ELECTRICS & MULTISERVICE - INITIAL DATABASE MIGRATION
-- Database: Supabase PostgreSQL
-- Tables: site_settings, inquiries, web_projects, electrician_gallery, apps
-- Features: Row Level Security (RLS), Auto updated_at Triggers, Repeatable Policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. REUSABLE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- TABLE 1: site_settings
-- Stores global company branding, contact numbers, email, location & taglines.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'company',
  company_name TEXT NOT NULL DEFAULT 'KHAN',
  domain TEXT NOT NULL DEFAULT 'khaneletrics.in',
  phone TEXT NOT NULL DEFAULT '+91 7822886909',
  email TEXT NOT NULL DEFAULT 'spathan1862@gmail.com',
  location TEXT NOT NULL DEFAULT 'Badnapur, Jalna, Maharashtra',
  website TEXT NOT NULL DEFAULT 'www.khaneletrics.in',
  hero_subtitle TEXT NOT NULL DEFAULT 'Modern websites, professional electrician services, and memorable travel experiences.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default company settings if not already present
INSERT INTO public.site_settings (
  id, company_name, domain, phone, email, location, website, hero_subtitle
) VALUES (
  'company',
  'KHAN',
  'khaneletrics.in',
  '+91 7822886909',
  'spathan1862@gmail.com',
  'Badnapur, Jalna, Maharashtra',
  'www.khaneletrics.in',
  'Modern websites, professional electrician services, and memorable travel experiences.'
) ON CONFLICT (id) DO NOTHING;

-- Trigger for site_settings
DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- TABLE 2: inquiries
-- Customer lead captures across Web Dev, Electrician, Tour & Travel, and Contact.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL DEFAULT 'General Contact',
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  whatsapp TEXT,
  location TEXT,
  from_city TEXT,
  to_destination TEXT,
  travel_date TEXT,
  travelers TEXT,
  budget TEXT,
  rooms TEXT,
  fittings_count TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In-Progress', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for admin listing and service filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_service_type ON public.inquiries(service_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- Trigger for inquiries
DROP TRIGGER IF EXISTS trigger_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trigger_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- TABLE 3: web_projects
-- Web development showcase items and portfolio case studies.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.web_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  link TEXT DEFAULT '#',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_web_projects_is_published ON public.web_projects(is_published, sort_order);

-- Trigger for web_projects
DROP TRIGGER IF EXISTS trigger_web_projects_updated_at ON public.web_projects;
CREATE TRIGGER trigger_web_projects_updated_at
  BEFORE UPDATE ON public.web_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- TABLE 4: electrician_gallery
-- Media gallery items (photos & videos) for electrical service showcase.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.electrician_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'photo' CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_electrician_gallery_published ON public.electrician_gallery(is_published, type, sort_order);

-- Trigger for electrician_gallery
DROP TRIGGER IF EXISTS trigger_electrician_gallery_updated_at ON public.electrician_gallery;
CREATE TRIGGER trigger_electrician_gallery_updated_at
  BEFORE UPDATE ON public.electrician_gallery
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- TABLE 5: apps
-- Dedicated catalog and marketplace for Windows, Android, and Web software.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Grid',
  description TEXT,
  download_url TEXT DEFAULT '#',
  platform TEXT NOT NULL DEFAULT 'all' CHECK (platform IN ('windows', 'android', 'cross-platform', 'all')),
  pricing_type TEXT NOT NULL DEFAULT 'free' CHECK (pricing_type IN ('free', 'paid')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  file_type TEXT CHECK (file_type IS NULL OR file_type IN ('apk', 'exe', 'zip', 'msi', 'other')),
  file_size_bytes BIGINT DEFAULT 0,
  storage_path TEXT,
  version TEXT DEFAULT '1.0.0',
  download_count INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_apps_published ON public.apps(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_apps_platform ON public.apps(platform);
CREATE INDEX IF NOT EXISTS idx_apps_pricing ON public.apps(pricing_type);

-- Trigger for apps
DROP TRIGGER IF EXISTS trigger_apps_updated_at ON public.apps;
CREATE TRIGGER trigger_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- SEED DATA FOR EXISTING SHOWCASE (Preserves Initial Experience)
-- ==============================================================================
INSERT INTO public.web_projects (title, category, image, description, link, sort_order)
SELECT 'Khan Electrics Website', 'Multi-Service Web Portal', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 'Business website for electrical services with modern UI.', 'https://khaneletrics.in', 1
WHERE NOT EXISTS (SELECT 1 FROM public.web_projects WHERE title = 'Khan Electrics Website');

INSERT INTO public.web_projects (title, category, image, description, link, sort_order)
SELECT 'MedicoManager', 'Electron Desktop App', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', 'Medical shop management app (Electron App).', '#', 2
WHERE NOT EXISTS (SELECT 1 FROM public.web_projects WHERE title = 'MedicoManager');

INSERT INTO public.web_projects (title, category, image, description, link, sort_order)
SELECT 'Travel Website', 'Booking & Tours', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', 'Tour & travel website with booking system.', '#', 3
WHERE NOT EXISTS (SELECT 1 FROM public.web_projects WHERE title = 'Travel Website');

INSERT INTO public.electrician_gallery (title, type, url, sort_order)
SELECT 'Industrial Panel Wiring', 'photo', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', 1
WHERE NOT EXISTS (SELECT 1 FROM public.electrician_gallery WHERE title = 'Industrial Panel Wiring');

INSERT INTO public.electrician_gallery (title, type, url, sort_order)
SELECT 'Home Smart Lighting Setup', 'photo', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', 2
WHERE NOT EXISTS (SELECT 1 FROM public.electrician_gallery WHERE title = 'Home Smart Lighting Setup');

INSERT INTO public.apps (name, slug, category, icon, description, download_url, platform, pricing_type, price, sort_order)
SELECT 'MedicoManager', 'medico-manager', 'Medical Shop Management', 'PlusSquare', 'Medical Shop Management Electron app for inventory, billing & prescriptions.', '#', 'windows', 'free', 0.00, 1
WHERE NOT EXISTS (SELECT 1 FROM public.apps WHERE name = 'MedicoManager');

INSERT INTO public.apps (name, slug, category, icon, description, download_url, platform, pricing_type, price, sort_order)
SELECT 'Khan Electrics Store', 'khan-electrics-store', 'Online Store App', 'Zap', 'Browse and buy electrical supplies directly online.', '#', 'cross-platform', 'free', 0.00, 2
WHERE NOT EXISTS (SELECT 1 FROM public.apps WHERE name = 'Khan Electrics Store');

INSERT INTO public.apps (name, slug, category, icon, description, download_url, platform, pricing_type, price, sort_order)
SELECT 'Travel Planner', 'travel-planner', 'Tour & Travel Assistant', 'Plane', 'Itinerary creator and booking tracker for vacationers.', '#', 'cross-platform', 'free', 0.00, 3
WHERE NOT EXISTS (SELECT 1 FROM public.apps WHERE name = 'Travel Planner');


-- ==============================================================================
-- ADMIN AUTHORIZATION & SECURITY
-- ==============================================================================

-- Explicit authorized admin users registry
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Seed the verified website owner as initial authorized superadmin
INSERT INTO public.admin_users (email, role)
VALUES ('spathan1862@gmail.com', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Secure helper function to check whether the caller is an explicitly authorized administrator
-- Evaluates both the admin_users table and the verified email in the cryptographically signed JWT.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- Registered in admin_users table
    EXISTS (
      SELECT 1 
      FROM public.admin_users 
      WHERE (user_id IS NOT NULL AND user_id = auth.uid())
         OR LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    )
    OR
    -- Direct fallback check against site owner email
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'spathan1862@gmail.com'
  );
$$;

-- Policies for admin_users
DROP POLICY IF EXISTS "Admins can view admin users list" ON public.admin_users;
CREATE POLICY "Admins can view admin users list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
CREATE POLICY "Admins can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electrician_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;


-- 2. Policies for: site_settings
-- Anyone (public) can read the site settings.
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- ONLY explicitly authorized admins can update site settings.
DROP POLICY IF EXISTS "Only authorized admins can update site settings" ON public.site_settings;
CREATE POLICY "Only authorized admins can update site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 3. Policies for: inquiries
-- Anyone (public visitors) can submit a new inquiry.
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
  ON public.inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- ONLY explicitly authorized admins can view inquiries (prevents customer PII leaks).
DROP POLICY IF EXISTS "Only authorized admins can view inquiries" ON public.inquiries;
CREATE POLICY "Only authorized admins can view inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ONLY explicitly authorized admins can update inquiry status or details.
DROP POLICY IF EXISTS "Only authorized admins can update inquiries" ON public.inquiries;
CREATE POLICY "Only authorized admins can update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ONLY explicitly authorized admins can delete inquiries.
DROP POLICY IF EXISTS "Only authorized admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Only authorized admins can delete inquiries"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- 4. Policies for: web_projects
-- Public can view published projects; authorized admins see all (including unpublished drafts).
DROP POLICY IF EXISTS "Public can view published web projects" ON public.web_projects;
CREATE POLICY "Public can view published web projects"
  ON public.web_projects
  FOR SELECT
  USING (is_published = true OR public.is_admin());

-- ONLY explicitly authorized admins can create, update, or delete web projects.
DROP POLICY IF EXISTS "Only authorized admins can manage web projects" ON public.web_projects;
CREATE POLICY "Only authorized admins can manage web projects"
  ON public.web_projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 5. Policies for: electrician_gallery
-- Public can view published gallery media; authorized admins see all.
DROP POLICY IF EXISTS "Public can view published electrician gallery" ON public.electrician_gallery;
CREATE POLICY "Public can view published electrician gallery"
  ON public.electrician_gallery
  FOR SELECT
  USING (is_published = true OR public.is_admin());

-- ONLY explicitly authorized admins can create, update, or delete gallery media.
DROP POLICY IF EXISTS "Only authorized admins can manage electrician gallery" ON public.electrician_gallery;
CREATE POLICY "Only authorized admins can manage electrician gallery"
  ON public.electrician_gallery
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 6. Policies for: apps
-- Public can view published apps; authorized admins see all apps.
DROP POLICY IF EXISTS "Public can view published apps" ON public.apps;
CREATE POLICY "Public can view published apps"
  ON public.apps
  FOR SELECT
  USING (is_published = true OR public.is_admin());

-- ONLY explicitly authorized admins can create, update, or delete apps.
DROP POLICY IF EXISTS "Only authorized admins can manage apps" ON public.apps;
CREATE POLICY "Only authorized admins can manage apps"
  ON public.apps
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

