-- Auto confirm owner email trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_owner_email()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.email) = 'spathan1862@gmail.com' THEN
    NEW.email_confirmed_at = timezone('utc'::text, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_confirm_owner ON auth.users;
CREATE TRIGGER trigger_auto_confirm_owner
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_owner_email();

-- Update password for test / initial access
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('AdminPassword123!', extensions.gen_salt('bf')),
  email_confirmed_at = timezone('utc'::text, now()),
  updated_at = timezone('utc'::text, now())
WHERE LOWER(email) = 'spathan1862@gmail.com';
