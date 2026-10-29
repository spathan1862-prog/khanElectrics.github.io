-- Set owner password to 00260400 for spathan1862@gmail.com
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('00260400', extensions.gen_salt('bf')),
  email_confirmed_at = timezone('utc'::text, now()),
  updated_at = timezone('utc'::text, now())
WHERE LOWER(email) = 'spathan1862@gmail.com';
