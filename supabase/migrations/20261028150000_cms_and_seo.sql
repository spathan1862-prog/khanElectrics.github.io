-- ==============================================================================
-- KHAN ELECTRICS - CMS, MEDIA STORAGE, GITHUB RELEASES & SEO MIGRATION
-- ==============================================================================

-- 1. TABLE: service_pages
-- Stores dynamic content, sections, FAQs, and SEO for the 3 service pages:
-- 'web-development', 'electrician', 'tour-travel'
CREATE TABLE IF NOT EXISTS public.service_pages (
  id TEXT PRIMARY KEY,
  page_name TEXT NOT NULL,
  title TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'FEATURED SERVICE',
  subtitle TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  cta_text TEXT NOT NULL DEFAULT 'Contact Us / Request Quote',
  cta_link TEXT NOT NULL DEFAULT '#inquiry-form',
  hero_image TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  draft_content JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;

-- Service pages RLS:
-- Public can read published pages
DROP POLICY IF EXISTS "Public can view published service pages" ON public.service_pages;
CREATE POLICY "Public can view published service pages"
  ON public.service_pages FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Authorized admins can manage all service pages
DROP POLICY IF EXISTS "Admins can manage service pages" ON public.service_pages;
CREATE POLICY "Admins can manage service pages"
  ON public.service_pages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Trigger for service_pages updated_at
DROP TRIGGER IF EXISTS trigger_service_pages_updated_at ON public.service_pages;
CREATE TRIGGER trigger_service_pages_updated_at
  BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. SEED INITIAL CONTENT FOR THE 3 SERVICE PAGES (Preserves existing public content)
INSERT INTO public.service_pages (
  id, page_name, title, badge, subtitle, hero_description, cta_text, cta_link, hero_image, sections, faqs, seo_title, seo_description, seo_keywords
) VALUES 
(
  'web-development',
  'Web Development',
  'WEB DEVELOPMENT',
  'CYBER & TECH NEON ENVIRONMENT',
  'Modern websites & web applications for your business.',
  'We build high-performance, responsive web portals, e-commerce stores, desktop applications, and custom software tailored to elevate your business presence in Badnapur, Jalna, Aurangabad, and beyond.',
  'Contact Us / Request Quote',
  '#inquiry-form',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  '[
    {"title": "Custom Business Websites", "description": "High converting, mobile-first websites designed specifically for local businesses, shops, and institutions.", "icon": "Layout"},
    {"title": "E-Commerce & Online Stores", "description": "Product catalogs, secure payment gateways, cart flows, and real-time order tracking.", "icon": "ShoppingBag"},
    {"title": "Desktop & Electron Software", "description": "Inventory management, POS, and offline-capable desktop systems like MedicoManager.", "icon": "Monitor"},
    {"title": "SEO & Performance Speed", "description": "Fast load times, schema markup, and on-page optimization for Google search visibility in Jalna.", "icon": "Zap"}
  ]'::jsonb,
  '[
    {"question": "How long does it take to develop a business website?", "answer": "Standard business websites are typically delivered within 5 to 10 days, depending on custom features and revisions."},
    {"question": "Do you provide hosting and custom domain support?", "answer": "Yes, we handle complete setup including domain linking (like khanelectrics.in), fast cloud hosting, SSL certificates, and Google indexing."},
    {"question": "Can I edit my website content after launch?", "answer": "Yes! Through our integrated Admin CMS, you can update text, images, and service items directly without coding."}
  ]'::jsonb,
  'Web Development in Badnapur & Jalna | Modern Websites & Software | KHAN',
  'Professional web development and website design in Badnapur, Jalna, and Aurangabad, Maharashtra. Custom business portals, e-commerce stores, and software.',
  'web development in Badnapur, website development in Jalna Maharashtra, web developer in Jalna, website design Aurangabad, business website development'
),
(
  'electrician',
  'Khan Electrician Service',
  'KHAN ELECTRICIAN SERVICE',
  'INDUSTRIAL AMBER / ELECTRIC GLOW ENVIRONMENT',
  'Trusted, certified electrician & multi-service repairs.',
  'Professional residential, commercial, and industrial electrical solutions across Badnapur, Jalna, and Aurangabad. Expert house wiring, panel installation, motor rewinding, CCTV security, and emergency repairs.',
  'Call Electrician / Request Service',
  '#inquiry-form',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  '[
    {"title": "Complete House Wiring", "description": "Concealed and surface wiring for new constructions, renovation rewiring, and safety circuit breakers.", "icon": "Zap"},
    {"title": "Industrial Panel Wiring", "description": "Distribution panels, 3-phase machinery connections, switchgear assembly, and load balancing.", "icon": "Wrench"},
    {"title": "CCTV & Security Setup", "description": "High-definition camera surveillance, DVR/NVR configuration, and remote mobile viewing.", "icon": "Camera"},
    {"title": "Inverter & Battery Wiring", "description": "Home UPS installation, backup battery setup, and solar-compatible power wiring.", "icon": "BatteryCharging"}
  ]'::jsonb,
  '[
    {"question": "What areas do you serve for electrical work?", "answer": "We serve Badnapur, Jalna City, Ambad, Partur, Aurangabad (Chhatrapati Sambhaji Nagar), and nearby rural districts."},
    {"question": "Do you provide emergency electrical repairs?", "answer": "Yes, we handle urgent short-circuit, tripping, and power outage issues. Contact us directly at +91 7822886909 for quick dispatch."},
    {"question": "Do you do industrial 3-phase machinery wiring?", "answer": "Yes, we have extensive experience with industrial control panels, star-delta starters, and factory power distribution."}
  ]'::jsonb,
  'Electrician in Badnapur & Jalna, Maharashtra | House Wiring & Repairs | KHAN',
  'Certified electrician services in Badnapur, Jalna, and Aurangabad. Expert house wiring, industrial panels, CCTV installation, and electrical repairs.',
  'electrician in Badnapur, electrician in Jalna Maharashtra, electrician services in Aurangabad, house wiring services in Jalna, electrical repair'
),
(
  'tour-travel',
  'Tour and Travel',
  'TOUR & TRAVEL',
  'SCENIC / OUTDOOR EXPLORATION GLOW ENVIRONMENT',
  'Explore new places, create better memories.',
  'Customized domestic travel, pilgrimage tours, airport transfers, and family vacation packages from Jalna, Aurangabad, and Maharashtra to major destinations across India.',
  'Plan Your Trip / Request Quote',
  '#inquiry-form',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  '[
    {"title": "Jalna to Mumbai & Pune Cabs", "description": "Comfortable one-way and round-trip car rentals and bus bookings with verified drivers.", "icon": "Compass"},
    {"title": "Holiday Vacation Packages", "description": "Handcrafted itineraries to Kashmir, Goa, Kerala, Rajasthan, and Himachal Pradesh with hotel bookings.", "icon": "Plane"},
    {"title": "Pilgrimage Yatra Tours", "description": "Shirdi, Jyotirlinga, Tirupati, and Chardham packages designed for families and elderly travelers.", "icon": "MapPin"},
    {"title": "Custom Group & Family Bookings", "description": "Tailored group packages, transparent pricing with no hidden charges, and 24/7 travel support.", "icon": "Users"}
  ]'::jsonb,
  '[
    {"question": "Can I book a one-way trip from Jalna to Mumbai or Pune?", "answer": "Yes, we offer clean, sanitized cabs with professional drivers for one-way drops and return journeys."},
    {"question": "Do you include hotel stays in your vacation packages?", "answer": "Yes, all our holiday packages can be customized to include 3-star/4-star verified hotels, daily breakfast, and local sightseeing cabs."},
    {"question": "How can I get an instant quote for my trip?", "answer": "Submit your dates, destination, and traveler count via our inquiry form or click our WhatsApp button for a quick estimate."}
  ]'::jsonb,
  'Tour and Travel Services in Jalna | Mumbai, Pune, Kashmir Trips | KHAN',
  'Trusted tour and travel agency in Jalna, Maharashtra. Jalna to Mumbai, Pune, and Aurangabad travel, custom holiday vacation packages, and cab booking.',
  'tour and travel services in Jalna, Jalna to Mumbai travel, Jalna to Pune travel, Jalna to Aurangabad travel, holiday tour packages Jalna'
)
ON CONFLICT (id) DO NOTHING;

-- 3. STORAGE BUCKET: site-media
-- For uploading images, portfolio pictures, and service photos (JPG, PNG, WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  5242880, -- 5 MB limit per image (preserves free-tier ₹0 budget)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ];

-- Storage Policies for 'site-media'
DROP POLICY IF EXISTS "Public can view and download site media" ON storage.objects;
CREATE POLICY "Public can view and download site media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "Admins can upload site media" ON storage.objects;
CREATE POLICY "Admins can upload site media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND (public.is_admin() OR auth.role() = 'authenticated'));

DROP POLICY IF EXISTS "Admins can update site media" ON storage.objects;
CREATE POLICY "Admins can update site media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media' AND (public.is_admin() OR auth.role() = 'authenticated'))
  WITH CHECK (bucket_id = 'site-media' AND (public.is_admin() OR auth.role() = 'authenticated'));

DROP POLICY IF EXISTS "Admins can delete site media" ON storage.objects;
CREATE POLICY "Admins can delete site media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media' AND (public.is_admin() OR auth.role() = 'authenticated'));

-- 4. TABLE ENHANCEMENTS: apps (GitHub Releases Support)
ALTER TABLE public.apps 
  ADD COLUMN IF NOT EXISTS release_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS release_notes TEXT,
  ADD COLUMN IF NOT EXISTS github_release_url TEXT;

-- 5. TABLE ENHANCEMENTS: site_settings (WhatsApp & Extended Company Details)
ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '+91 7822886909',
  ADD COLUMN IF NOT EXISTS service_areas TEXT DEFAULT 'Badnapur, Jalna, Aurangabad, Maharashtra',
  ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com/spathan1862-prog';

UPDATE public.site_settings
SET 
  whatsapp = COALESCE(whatsapp, '+91 7822886909'),
  service_areas = COALESCE(service_areas, 'Badnapur, Jalna, Aurangabad, Maharashtra')
WHERE id = 'company';
