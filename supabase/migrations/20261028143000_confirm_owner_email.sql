-- Confirm admin owner email if pending verification
UPDATE auth.users
SET email_confirmed_at = timezone('utc'::text, now())
WHERE LOWER(email) = 'spathan1862@gmail.com' AND email_confirmed_at IS NULL;
