-- ==============================================================================
-- KHAN ELECTRICS — CONTENT MANAGERS, PORTFOLIO, MEDIA & INQUIRIES MIGRATION
-- ==============================================================================

-- 1. ENHANCE web_projects (Portfolio Manager)
ALTER TABLE public.web_projects
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS detailed_description TEXT,
  ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 2. ENHANCE electrician_gallery (Work Gallery Manager)
ALTER TABLE public.electrician_gallery
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General Electrical',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Jalna & Badnapur',
  ADD COLUMN IF NOT EXISTS before_image TEXT,
  ADD COLUMN IF NOT EXISTS after_image TEXT,
  ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 3. CREATE tour_destinations (Destinations & Travel Posts Manager)
CREATE TABLE IF NOT EXISTS public.tour_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  starting_city TEXT DEFAULT 'Jalna',
  destination_city TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  price TEXT,
  is_price_on_request BOOLEAN DEFAULT false,
  duration TEXT,
  available_dates TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  route_info TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tour_destinations_published ON public.tour_destinations(is_published, sort_order);

ALTER TABLE public.tour_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published destinations" ON public.tour_destinations;
CREATE POLICY "Public can view published destinations"
  ON public.tour_destinations FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage destinations" ON public.tour_destinations;
CREATE POLICY "Admins can manage destinations"
  ON public.tour_destinations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed initial real destinations if empty
INSERT INTO public.tour_destinations (name, starting_city, destination_city, cover_image, description, price, duration, is_featured, sort_order)
SELECT 'Kashmir Paradise Tour', 'Jalna / Aurangabad', 'Srinagar, Gulmarg & Pahalgam', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', 'Scenic valley tour with houseboat stays, shikara rides, and snow mountain sightseeing.', '₹24,500 per person', '6 Days / 5 Nights', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.tour_destinations WHERE name = 'Kashmir Paradise Tour');

INSERT INTO public.tour_destinations (name, starting_city, destination_city, cover_image, description, price, duration, is_featured, sort_order)
SELECT 'Goa Beach Holiday', 'Jalna / Aurangabad', 'North & South Goa', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', 'Beach getaway with watersports, cruise, resort stay, and cab transfer.', '₹14,999 per person', '4 Days / 3 Nights', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.tour_destinations WHERE name = 'Goa Beach Holiday');

INSERT INTO public.tour_destinations (name, starting_city, destination_city, cover_image, description, price, duration, is_featured, sort_order)
SELECT 'Shirdi & Jyotirlinga Darshan', 'Badnapur / Jalna', 'Shirdi, Shani Shingnapur, Grishneshwar', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', 'Comfortable family pilgrimage tour with verified cab driver, hotel accommodation, and VIP darshan assistance.', '₹6,500 per person', '2 Days / 1 Night', false, 3
WHERE NOT EXISTS (SELECT 1 FROM public.tour_destinations WHERE name = 'Shirdi & Jyotirlinga Darshan');

-- 4. ENHANCE site_settings (Appearance & Service Cards Customization)
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{
    "hero_banner_image": "",
    "featured_projects_visible": true,
    "featured_destinations_visible": true,
    "web_dev_card": {
      "title": "Web Development",
      "short_description": "Custom modern business websites, portals, and desktop applications.",
      "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "icon": "Code2",
      "is_visible": true,
      "sort_order": 1
    },
    "electrician_card": {
      "title": "Khan Electrician Service",
      "short_description": "Residential & industrial wiring, panel boards, CCTV security, and repairs.",
      "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      "icon": "Zap",
      "is_visible": true,
      "sort_order": 2
    },
    "tour_travel_card": {
      "title": "Tour and Travel",
      "short_description": "Custom domestic vacation packages, pilgrimage yatras, and outstation cabs.",
      "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      "icon": "Plane",
      "is_visible": true,
      "sort_order": 3
    }
  }'::jsonb;

-- 5. ENHANCE inquiries (Service-Specific Customer Forms & Statuses)
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_status_check;

ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_status_check 
  CHECK (status IN ('New', 'Contacted', 'In Progress', 'In-Progress', 'Completed', 'Cancelled'));

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS website_type TEXT,
  ADD COLUMN IF NOT EXISTS required_features TEXT,
  ADD COLUMN IF NOT EXISTS deadline TEXT,
  ADD COLUMN IF NOT EXISTS reference_url TEXT,
  ADD COLUMN IF NOT EXISTS return_date TEXT,
  ADD COLUMN IF NOT EXISTS trip_type TEXT,
  ADD COLUMN IF NOT EXISTS photo_attachment TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 6. ENHANCE STORAGE: site-media (Support Photos & Videos up to 50MB free-tier)
UPDATE storage.buckets
SET 
  file_size_limit = 52428800, -- 50MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
WHERE id = 'site-media';

-- 7. REINFORCE EXPLICIT DELETE POLICIES
DROP POLICY IF EXISTS "Admins can delete web projects" ON public.web_projects;
CREATE POLICY "Admins can delete web projects"
  ON public.web_projects FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete electrician gallery" ON public.electrician_gallery;
CREATE POLICY "Admins can delete electrician gallery"
  ON public.electrician_gallery FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete destinations" ON public.tour_destinations;
CREATE POLICY "Admins can delete destinations"
  ON public.tour_destinations FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete apps" ON public.apps;
CREATE POLICY "Admins can delete apps"
  ON public.apps FOR DELETE
  TO authenticated
  USING (public.is_admin());
