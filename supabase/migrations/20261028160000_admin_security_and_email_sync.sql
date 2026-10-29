-- Migration: Ensure admin_users is linked to auth.users.id and syncs on email change
-- 1. Link admin_users row to auth.users id
UPDATE public.admin_users a
SET user_id = u.id
FROM auth.users u
WHERE LOWER(a.email) = LOWER(u.email)
  AND (a.user_id IS NULL OR a.user_id != u.id);

-- 2. Update trigger to synchronize public.admin_users whenever an email is changed and verified in auth.users
CREATE OR REPLACE FUNCTION public.handle_admin_auth_user_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If email was updated
  IF (OLD.email IS DISTINCT FROM NEW.email) THEN
    -- Update public.admin_users where user_id matches
    UPDATE public.admin_users
    SET email = LOWER(NEW.email)
    WHERE user_id = NEW.id;

    -- Also update site_settings email if it matched the old admin email
    UPDATE public.site_settings
    SET email = LOWER(NEW.email)
    WHERE LOWER(email) = LOWER(OLD.email);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_admin_auth_user_change ON auth.users;
CREATE TRIGGER trigger_admin_auth_user_change
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_user_change();

-- 3. Ensure public.is_admin() checks both user_id = auth.uid() and email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- Registered in admin_users table (by user_id or email)
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
