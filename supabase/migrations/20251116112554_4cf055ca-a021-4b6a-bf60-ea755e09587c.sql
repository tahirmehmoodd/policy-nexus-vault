-- Assign roles to existing users who signed up before the trigger was in place

-- Assign viewer role to pubgmobile2k2k@gmail.com (default role for new users)
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT 
  id,
  'viewer'::app_role,
  id
FROM public.profiles
WHERE email = 'pubgmobile2k2k@gmail.com'
  AND id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT DO NOTHING;