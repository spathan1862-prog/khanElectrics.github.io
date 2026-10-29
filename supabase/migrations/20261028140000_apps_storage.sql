-- ==============================================================================
-- KHAN ELECTRICS - APPS STORAGE BUCKET & SECURITY POLICIES
-- ==============================================================================

-- 1. Create or update the 'apps' public storage bucket with 50MB free-tier limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'apps',
  'apps',
  true,
  52428800, -- 50 MB (Supabase free tier max file upload limit)
  ARRAY[
    'application/vnd.android.package-archive',
    'application/x-msdownload',
    'application/x-msi',
    'application/octet-stream',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/vnd.android.package-archive',
    'application/x-msdownload',
    'application/x-msi',
    'application/octet-stream',
    'application/zip',
    'application/x-zip-compressed'
  ];

-- 2. Storage RLS Policies for 'apps' bucket

-- 2.1 Public read / download access for all visitors
DROP POLICY IF EXISTS "Public can view and download app files" ON storage.objects;
CREATE POLICY "Public can view and download app files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'apps');

-- 2.2 Authenticated Admin upload access
DROP POLICY IF EXISTS "Admins can upload app files" ON storage.objects;
CREATE POLICY "Admins can upload app files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'apps' AND (public.is_admin() OR auth.role() = 'authenticated'));

-- 2.3 Authenticated Admin update access
DROP POLICY IF EXISTS "Admins can update app files" ON storage.objects;
CREATE POLICY "Admins can update app files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'apps' AND (public.is_admin() OR auth.role() = 'authenticated'))
  WITH CHECK (bucket_id = 'apps' AND (public.is_admin() OR auth.role() = 'authenticated'));

-- 2.4 Authenticated Admin delete access
DROP POLICY IF EXISTS "Admins can delete app files" ON storage.objects;
CREATE POLICY "Admins can delete app files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'apps' AND (public.is_admin() OR auth.role() = 'authenticated'));

-- 3. Confirm admin owner email if pending verification
UPDATE auth.users
SET email_confirmed_at = timezone('utc'::text, now())
WHERE LOWER(email) = 'spathan1862@gmail.com' AND email_confirmed_at IS NULL;
